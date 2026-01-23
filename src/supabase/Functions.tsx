import {supabase} from "@/supabase/supabase.ts";
import {toast} from "sonner";
import * as XLSX from "xlsx";
import { useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface SignUpParams {
    full_name: string;
    email: string;
    phone: string;
    password: string;
    role: string;
    otp: string;
}
// API helper functions
export const api = {

    async signin(email: string, password: string) {
        const response = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        })
        return response;
    },

    async signupWithOtpCheck(params: SignUpParams) {
        const { full_name, email, phone, password, role, otp } = params;

        // STEP 1: Validate OTP (DB does the work)
        const { data: otpRow, error: otpError } = await supabase
            .from("otp_codes")
            .select("id")
            .eq("code", otp)
            .eq("consumed", false)
            .gt("expires_at", new Date().toISOString())
            .single();

        if (otpError || !otpRow) {
            return { error: otpError ?? new Error("Invalid OTP") };
        }

        // STEP 2: Create auth user
        const { data: userData, error: signUpError } =
            await supabase.auth.signUp({
                email,
                password,
            });

        if (signUpError) {
            return { error: signUpError };
        }

        // STEP 3: Insert profile
        const { error: profileError } = await supabase
            .from("profiles")
            .insert([
                {
                    id: userData.user?.id,
                    full_name,
                    email,
                    phone,
                    role,
                },
            ]);

        if (profileError) {
            return { error: profileError };
        }

        // STEP 4: Consume OTP
        await supabase
            .from("otp_codes")
            .update({
                consumed: true,
                updated_at: new Date().toISOString(),
            })
            .eq("id", otpRow.id);

        toast.success("Account created successfully!");
        return { data: userData };
    },

    async getCountPersonnels() {
        const { count, error } = await supabase
            .from("personnel")
            .select("*", { count: "exact", head: true });

        if (error) {
            throw error;
        }

        return count;
    },
    async sendNotification(
        userId: string,
        notifData?: Partial<{
            title: string;
            message: string;
            type: string;
            metadata: Record<string, any>;
        }>
    ) {
        const payload = {
            user_id: userId ,
            title: notifData?.title ?? "Title",
            message: notifData?.message ?? "Message notification",
            type: notifData?.type ?? "Type",
            metadata: notifData?.metadata ?? {},
            is_read: false,
        };

        const { data, error } = await supabase.functions.invoke(
            "send_notification",
            { body: payload }
        );

        if (error) {
            throw error;
        }
        return data;
    },
    async createPersonnel(payload: { first_name: string; last_name: string; other_names: string; gender: string; date_of_birth: string; phone: string; email: string; cadre_id: string; current_district_id: string; employment_status: string; hire_date: string; exit_date: string; metadata: { district: string; competencies: never[]; age: string; worker_status: string[]; }; qualifications: never[]; }) {
        const { data, error } = await supabase
            .from("personnel")
            .insert(payload)
            .select("*")
            .single();
        return data;
    },

    async updatePersonnel(id: any, updates: any) {
        const { data, error } = await supabase
            .from("personnel")
            .update(updates)
            .eq("id", id)
            .select("*")
            .single();

        return data;
    },
    async getUniqueDeployments() {
        const { data, error } = await supabase
            .from("deployments")
            .select("*")  // get all columns
            .order("deployment_id");

        if (error) {
            return [];
        }

        // Remove duplicates by deployment_id
        const seen = new Set();
        const uniqueDeployments = [];

        data.forEach(row => {
            if (!seen.has(row.deployment_id)) {
                seen.add(row.deployment_id);
                uniqueDeployments.push(row);
            }
        });
        return uniqueDeployments;
    },

    async updateDeploymentStatus(deploymentId, status) {
        try {
            // ------------------------------------------------------------------
            // 1. Get all personnel_ids linked to this deployment_id
            // ------------------------------------------------------------------
            const { data: deploymentRows, error: fetchError } = await supabase
                .from("deployments")
                .select("personnel_id")
                .eq("deployment_id", deploymentId);

            if (fetchError) throw fetchError;

            const personnelIds = deploymentRows.map((row) => row.personnel_id);

            // ------------------------------------------------------------------
            // 2. Update all deployments rows (same deployment_id)
            // ------------------------------------------------------------------
            if (!deploymentId || !status) return;

            let updatePayload = {};

            if (status === "completed") {
                updatePayload = { deploy_status: "completed", status: "Deployed" };
            } else {
                updatePayload = { status };
            }

            const { error } = await supabase
                .from("deployments")
                .update(updatePayload)
                .eq("deployment_id", deploymentId);

            if (error) {
                return
            }
            // ------------------------------------------------------------------
            // 3. Update personnel table metadata.worker_status
            // ------------------------------------------------------------------
            if (personnelIds.length > 0) {
                const { error } = await supabase.rpc(
                    "update_worker_status_item2",
                    {
                        p_personnel_ids: personnelIds,
                        p_status: (status === "completed") ? "Available":status, // "Deployed" | "Pending" | "Available"
                    }
                );
            }

            return { success: true };
        } catch (error) {
            return { success: false, error };
        }
    },
    async getOutbreakInfo() {
        // 1️⃣ Fetch ACTIVE deployments only
        const { data: deploymentsData, error: deploymentsError } = await supabase
            .from("deployments")
            .select("deployment_id, outbreak_id")
            .eq("deploy_status", "active");

        if (deploymentsError) {
            return [];
        }

        // 2️⃣ Remove duplicates by deployment_id
        const seen = new Set();
        const uniqueDeployments = [];

        deploymentsData.forEach(row => {
            if (!seen.has(row.deployment_id)) {
                seen.add(row.deployment_id);
                uniqueDeployments.push(row);
            }
        });

        // 3️⃣ Unique outbreak IDs
        const outbreakIds = uniqueDeployments.map(d => d.outbreak_id);

        if (outbreakIds.length === 0) return [];

        // 4️⃣ Fetch ACTIVE outbreaks only
        const { data: outbreaksData, error: outbreaksError } = await supabase
            .from("outbreaks")
            .select("id, disease, district")
            .eq("status", "active")
            .in("id", outbreakIds);

        if (outbreaksError) {
            return [];
        }

        return outbreaksData;
    }
    ,
    async getDeploymentCounts() {
        // 1. get ONLY active rows
        const { data, error } = await supabase
            .from("deployments")
            .select("deployment_id, deploy_status")
            .order("deployment_id");

        if (error) {
            return [];
        }

        // 2. count equal deployment_id
        const counts = {};

        data.forEach(row => {
            const id = row.deployment_id;
            counts[id] = (counts[id] || 0) + 1;
        });

        // 3. return only the values (counts)
        return Object.values(counts);
    },
    async getActiveDeployments() {
        const { data, error } = await supabase
            .from("deployments")
            .select("deployment_id", { count: "exact" })
            .eq("deploy_status", "active");

        const unique = [...new Set(data.map((d) => d.deployment_id))].length;

        return unique;
    },
    async getActiveDeploymentsByDistrict() {
        // Query only active deployments
        const { data, error } = await supabase
            .from('deployments')
            .select('assigned_district_id')
            .eq('deploy_status', 'active');

        if (error) {
            return {};
        }

        // Count active deployments per district
        const counts: Record<string, number> = {};
        data.forEach((row) => {
            const district = row.assigned_district_id;
            counts[district] = (counts[district] || 0) + 1;
        });
        return counts;
    },

    async getDeployedDistricts() {
        const { data, error } = await supabase
            .from("deployments")
            .select("assigned_district_id", { count: "exact" })
            .eq("deploy_status", "active");

        const unique = [...new Set(data.map((d) => d.assigned_district_id))].length;

        return unique;
    },
    async getActiveOutBreaks() {
        const { data, error } = await supabase
            .from("deployments")
            .select("outbreak_id", { count: "exact" })
            .eq("deploy_status", "active");

        const unique = [...new Set(data.map((d) => d.outbreak_id))].length;

        return unique;
    },
    async getPersonnelById(id: any) {
        const { data, error } = await supabase
            .from("personnel")
            .select("*")
            .eq("id", id)
            .eq("system_status", "registered") // <-- filter only registered
            .single();

        return data;
    },

    async getNotifications(limit = 100) {
        const { data, error } = await supabase
            .from("notifications")
            .select("*")
            .order("id", { ascending: true })
            .limit(limit);
        return data;
    },

    async deleteNotification(id) {
        const { error } = await supabase
            .from("notifications")
            .delete()
            .eq("id", id);

        return true;
    },

    async deleteHCW(id: string) {
        const { error } = await supabase
            .from("personnel")
            .update({ system_status: "deleted" }) // mark as deleted
            .eq("id", id);

        if (error) {
            return false;
        }

        return true;
    },

    async listPersonnel() {
        let allData: any[] = [];
        let offset = 0;
        const batchSize = 1000;

        while (true) {
            const { data } = await supabase
                .from("personnel")
                .select("*")
                .eq("system_status", "registered")
                .range(offset, offset + batchSize - 1);

            if (!data || data.length === 0) break;

            allData = [...allData, ...data];
            if (data.length < batchSize) break;

            offset += batchSize;
        }

        return allData;
    },
    async  listPersonnelMetaWorker() {
        let allData: any[] = [];
        let offset = 0;
        const batchSize = 1000;

        while (true) {
            const { data, error } = await supabase
                .from("personnel")
                .select("*")
                .eq("system_status", "registered")
                .filter("metadata->worker_status->>1", "eq", "Available")
                .range(offset, offset + batchSize - 1);

            if (!data || data.length === 0) break;

            allData = [...allData, ...data];
            if (data.length < batchSize) break;

            offset += batchSize;
        }

        return allData;
    },

    async listDistricts(limit = 35) {
        const { data, error } = await supabase
            .from("administrative_regions")
            .select("*")
            .order("id", { ascending: true })
            .limit(limit);

        return data;
    },

    async listCadres(limit = 100) {
        const { data, error } = await supabase
            .from("cadres")
            .select("*")
            .order("id", { ascending: true })
            .limit(limit);

        return data;
    },
    async listFacilities(limit = 10000) {
        const { data, error } = await supabase
            .from("health_facilities")
            .select("*")
            .order("id", { ascending: true })
            .limit(limit);

        return data;
    },

    async listDeployments(limit = 10000) {
        const { data, error } = await supabase
            .from("deployments")
            .select("*")
            .order("id", { ascending: true })
            .limit(limit);
        return data;
    },
    async listDeploymentsEq(equal_data: string, limit = 10000) {
        const { data, error } = await supabase
            .from("deployments")
            .select("*")
            .eq("personnel_id", equal_data)
            .order("created_at", { ascending: true })
            .limit(limit);
        if (error) {
            return []
        }
        return data;
    },
    async listOutbreaks(limit = 200) {
        const { data, error } = await supabase
            .from("outbreaks")
            .select("*")
            .order("id", { ascending: true })
            .limit(limit);

        return data;
    },

    async listCadresEq(cadreId?: string) {
        let query = supabase
            .from("cadres")
            .select("*")
            .order("created_at", { ascending: true });

        if (cadreId) {
            query = query.eq("id", cadreId);
        }

        const { data, error } = await query;

        return data;
    },
    async getCadresIdByName(cadreName?: string) {
        let query = supabase
            .from("cadres")
            .select("*")
            .order("created_at", { ascending: true });

        if (cadreId) {
            query = query.eq("id", cadreName);
        }

        const { data, error } = await query;

        return data;
    },
    async getWorkforceStats() {
        // -----------------------------
        // 🕒 UTC month boundary
        // -----------------------------
        const now = new Date();
        const startOfCurrentMonth = new Date(
            Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)
        );

        // ------------------------------------
        // Workforce before current month
        // ------------------------------------
        const { count: previousCount, error: prevError } = await supabase
            .from("personnel")
            .select("*", { count: "exact", head: true })
            .eq("system_status", "registered") // <-- filter only registered
            .lt("created_at", startOfCurrentMonth.toISOString());

        if (prevError) {
            throw prevError;
        }

        // ------------------------------------
        // Workforce up to now (total)
        // ------------------------------------
        const { count: currentCount, error: currError } = await supabase
            .from("personnel")
            .select("*", { count: "exact", head: true })
            .eq("system_status", "registered"); // <-- filter only registered

        if (currError) {
            throw currError;
        }

        const total = currentCount ?? 0;
        const previous = previousCount ?? 0;
        return {
            total: total,
            change: total - previous,
        };
    },
    async getDeploymentStats() {
        // -----------------------------
        // 🕒 UTC month boundary
        // -----------------------------
        const now = new Date();
        const startOfCurrentMonth = new Date(
            Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)
        );

        // ------------------------------------
        // Active + Deployed BEFORE this month
        // ------------------------------------
        const { count: previousCount, error: prevError } = await supabase
            .from("deployments")
            .select("*", { count: "exact", head: true })
            .eq("status", "Deployed")
            .eq("deploy_status", "active")
            .lt("created_at", startOfCurrentMonth.toISOString());

        if (prevError) throw prevError;

        // ------------------------------------
        // Active + Deployed UP TO now
        // ------------------------------------
        const { count: currentCount, error: currError } = await supabase
            .from("deployments")
            .select("*", { count: "exact", head: true })
            .eq("status", "Deployed")
            .eq("deploy_status", "active");

        if (currError) throw currError;

        const total = currentCount ?? 0;
        const previous = previousCount ?? 0;

        return {
            total,
            change: total - previous,
        };
    },
    async getUser(id: string){
        const result = await supabase
            .from("profiles")
            .select("*")
            .eq("id", id);

        return (result);

    },
    async softDeleteHCWs(workerIds: string[]) {
        return supabase
            .from("personnel")
            .update({ system_status: "deleted" })
            .in("id", workerIds);
    },
    async getActiveOutbreakStats() {
        // -----------------------------
        // 🕒 UTC month boundary
        // -----------------------------
        const now = new Date();
        const startOfCurrentMonth = new Date(
            Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)
        );

        // ------------------------------------
        // Active outbreaks BEFORE this month
        // ------------------------------------
        const { count: previousCount, error: prevError } = await supabase
            .from("outbreaks")
            .select("*", { count: "exact", head: true })
            .eq("status", "active")
            .lt("date_started", startOfCurrentMonth.toISOString());

        if (prevError) throw prevError;

        // ------------------------------------
        // Active outbreaks STARTED this month or earlier
        // ------------------------------------
        const { count: currentCount, error: currError } = await supabase
            .from("outbreaks")
            .select("*", { count: "exact", head: true })
            .eq("status", "active");

        if (currError) throw currError;

        const total = currentCount ?? 0;
        const previous = previousCount ?? 0;

        return {
            total,
            change: total - previous,
        };
    },
    async getResponseStats() {
        // -----------------------------
        // 🕒 UTC month boundary
        // -----------------------------
        const now = new Date();
        const startOfCurrentMonth = new Date(
            Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)
        );

        // ---------- CURRENT ----------
        const { data: activeOutbreaks } = await supabase
            .from("outbreaks")
            .select("id")
            .eq("status", "active");

        const currentTotal = activeOutbreaks?.length ?? 0;

        const { data: currentDeployments } = await supabase
            .from("deployments")
            .select("outbreak_id")
            .eq("deploy_status", "active");

        const currentResponded = new Set(
            currentDeployments?.map(d => d.outbreak_id)
        ).size;

        const currentRate =
            currentTotal === 0
                ? 0
                : Math.round((currentResponded / currentTotal) * 100);

        // ---------- PREVIOUS ----------
        const { data: prevOutbreaks } = await supabase
            .from("outbreaks")
            .select("id")
            .eq("status", "active")
            .lt("created_at", startOfCurrentMonth.toISOString());

        const prevTotal = prevOutbreaks?.length ?? 0;

        const { data: prevDeployments } = await supabase
            .from("deployments")
            .select("outbreak_id")
            .eq("deploy_status", "active")
            .lt("created_at", startOfCurrentMonth.toISOString());

        const prevResponded = new Set(
            prevDeployments?.map(d => d.outbreak_id)
        ).size;

        const previousRate =
            prevTotal === 0
                ? 0
                : Math.round((prevResponded / prevTotal) * 100);

        return {
            rate: currentRate,
            change: currentRate - previousRate
        };
    },
}

export function getAge(dob: string) {
    if (!dob) return null; // prevent crashes

    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    // If birthday has not happened yet this year → subtract 1
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
    }

    return age;
}
export function getTimeFromISO(timestamp: string): string {
    if (!timestamp) return "";

    return new Date(timestamp).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
}

export function formatDate(dateString: string) {
    if (!dateString) return "";

    const date = new Date(dateString);

    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" }); // "Jun"
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
}
export const EXPORT_COLUMNS = [
    {
        key: "personnel_identifier",
        label: "Worker ID",
        getValue: (w: any) =>
            w.personnel_identifier ?? w.personnel_id ?? "—",
    },
    {
        key: "name",
        label: "Name",
        getValue: (w: any) =>
            `${w.first_name ?? ""} ${w.last_name ?? ""}`.trim(),
    },
    {
        key: "cadre",
        label: "Cadre",
        getValue: (w: any, index: number) =>
            w.cadre_name?.toLowerCase() ?? "—",
    },
    {
        key: "role",
        label: "Role",
        getValue: (w: any, index: number) =>
            w.role ?? "—",
    },
    {
        key: "district",
        label: "District",
        getValue: (w: any) =>
            w.metadata?.district ?? "—",
    },
    {
        key: "status",
        label: "Status",
        getValue: (w: any) =>
            w.metadata?.worker_status?.[1] ?? "—",
    },
    {
        key: "trainings",
        label: "Trainings",
        getValue: (w: any) =>
            Array.isArray(w.trainings)
                ? w.trainings
                : [],
    },
    {
        key: "certifications",
        label: "Certifications",
        getValue: (w: any) =>
            w.qualifications ?? "—",
    },
    {
        key: "competencies",
        label: "Competencies",
        getValue: (w: any) =>
            Array.isArray(w.metadata?.competencies)
                ? w.metadata.competencies.join(", ")
                : "—",
    },
];

export function exportCSV(
    data: any[],
    name: string,
    selectedColumns: string[]
) {
    // Only export columns the user selected
    const activeColumns = EXPORT_COLUMNS.filter(c =>
        selectedColumns.includes(c.label)
    );

    // Escape CSV values safely
    const escapeCSV = (value: any) => {
        if (value === null || value === undefined) return "";

        let str = String(value);

        // Escape quotes
        str = str.replace(/"/g, '""');

        // Wrap in quotes if needed
        if (/[",\n]/.test(str)) {
            str = `"${str}"`;
        }

        return str;
    };

    // Build header row
    const header = activeColumns
        .map(c => escapeCSV(c.label))
        .join(",");

    // Build data rows
    const rows = data.map((w, i) =>
        activeColumns
            .map(c => {
                let value = c.getValue(w, i);

                // ✅ Convert arrays (e.g. trainings) to CSV-safe string
                if (Array.isArray(value)) {
                    value = value.join(", ");
                }

                return escapeCSV(value ?? "");
            })
            .join(",")
    );

    // Combine CSV content
    const csvContent = [header, ...rows].join("\n");

    // Download file
    const blob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${name}.csv`;
    link.click();

    URL.revokeObjectURL(url);
}

function normalizeWorkerForExport(worker: any) {
    return {
        personnel_identifier:
            worker.personnel_identifier ?? worker.personnel_id ?? "—",

        name: `${worker.first_name ?? ""} ${worker.last_name ?? ""}`.trim(),

        cadre_name: worker.cadre_name ?? "—",
        role: worker.role ?? "—",
        district: worker.metadata?.district ?? "—",

        trainings: Array.isArray(worker.trainings)
            ? worker.trainings
            : [],

        competencies: Array.isArray(worker.metadata?.competencies)
            ? worker.metadata.competencies.join(", ")
            : "—",

        status: Array.isArray(worker.metadata?.worker_status)
            ? worker.metadata.worker_status[1]
            : "—",

        qualifications: worker.qualifications ?? "—",
    };
}

export function exportExcel(data: any[], name: string, selectedColumns: string[]) {
    const formatted = data.map((w, i) => {
        const row: any = {};
        EXPORT_COLUMNS.forEach(c => {
            if (!selectedColumns.includes(c.label)) return; // skip unselected columns

            let value = c.getValue(w, i);
            if (Array.isArray(value)) value = value.join(", ");
            row[c.label] = value ?? "";
        });
        return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(formatted);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Workforce");
    XLSX.writeFile(workbook, `${name}.xlsx`);
}

export function exportPDF(data: any[], name: string, selectedColumns: string[]) {
    const formatted = data.map((w, i) => {
        const row: any = {};
        EXPORT_COLUMNS.forEach(c => {
            if (!selectedColumns.includes(c.label)) return;

            let value = c.getValue(w, i);
            if (Array.isArray(value)) value = value.join(", ");
            row[c.label] = value ?? "";
        });
        return row;
    });

    const doc = new jsPDF();
    const imgProps = doc.getImageProperties("/logo.png");
    const imgWidth = 20;
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.addImage("/logo.png", "PNG",  (pageWidth - imgWidth) / 2, 10, imgWidth, imgHeight);

    doc.setFontSize(14);
    doc.text("MALAWI OUTBREAK AND EMERGENCY RESPONSE", 105, 42, { align: "center" });
    doc.setFontSize(12);
    doc.text("Healthcare Employees' Registry", 105, 49, { align: "center"});

    autoTable(doc, {
        startY: 58,
        head: [
            EXPORT_COLUMNS
                .filter(c => selectedColumns.includes(c.label))
                .map(c => c.label)
        ],
        body: formatted.map(row =>
            EXPORT_COLUMNS
                .filter(c => selectedColumns.includes(c.label))
                .map(c => row[c.label])
        ),
    });

// --- Footer text ---
    const marginLeft = 14;
    const marginBottom = 14;
    const pageHeight = doc.internal.pageSize.getHeight();

    const generatedText = `Generated on: ${new Date().toLocaleString()}`;

    doc.setFontSize(9);
    doc.text(
        generatedText,
        marginLeft,
        pageHeight - marginBottom
    );


    doc.save(`${name}.pdf`);
}

function pad(value: string, width: number) {
    return value.padEnd(width, " ");
}

function centerText(text: string, width: number) {
    if (text.length >= width) return text;
    const leftPadding = Math.floor((width - text.length) / 2);
    return " ".repeat(leftPadding) + text;
}

export function exportText(
    data: any[],
    name: string,
    selectedColumns: string[]
) {
    const activeColumns = EXPORT_COLUMNS.filter(c =>
        selectedColumns.includes(c.label)
    );

    // Step 1: Build raw table (strings only)
    const table = [
        activeColumns.map(c => c.label),
        ...data.map((w, i) =>
            activeColumns.map(c => {
                let value = c.getValue(w, i);
                if (Array.isArray(value)) value = value.join(", ");
                return String(value ?? "");
            })
        ),
    ];

    // Step 2: Calculate max width for each column
    const colWidths = activeColumns.map((_, colIndex) =>
        Math.max(...table.map(row => row[colIndex].length)) + 2
    );

    // Step 3: Format rows with padding
    const formatted = table.map(row =>
        row
            .map((cell, i) => pad(cell, colWidths[i]))
            .join("│")
    );

    // Separator
    const separator = colWidths
        .map(w => "─".repeat(w))
        .join("┼");

    // 👉 FULL table width (important for centering)
    const tableWidth = formatted[0].length;

    // Title + meta
    const title = name.toUpperCase();
    const generatedOn = `Generated on: ${new Date().toLocaleString()}`;

    const content = [
        centerText(title, tableWidth),
        centerText(generatedOn, tableWidth),
        "",
        formatted[0],     // header
        separator,
        ...formatted.slice(1),
    ].join("\n");

    // Step 4: Download
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${name}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}

// hooks/useElementSize.ts

type Size = {
    width: number;
    height: number;
    paddingTop: number;
    paddingRight: number;
    paddingBottom: number;
    paddingLeft: number;
};

export function useElementSize<T extends HTMLElement>() {
    const ref = useRef<T | null>(null);
    const [size, setSize] = useState<Size>({
        width: 0,
        height: 0,
        paddingTop: 0,
        paddingRight: 0,
        paddingBottom: 0,
        paddingLeft: 0,
    });

    useEffect(() => {
        if (!ref.current) return;

        const element = ref.current;

        const updateSize = () => {
            const rect = element.getBoundingClientRect();
            const style = getComputedStyle(element);

            setSize({
                width: rect.width,
                height: rect.height,
                paddingTop: parseFloat(style.paddingTop),
                paddingRight: parseFloat(style.paddingRight),
                paddingBottom: parseFloat(style.paddingBottom),
                paddingLeft: parseFloat(style.paddingLeft),
            });
        };

        updateSize(); // initial size

        const observer = new ResizeObserver(updateSize);
        observer.observe(element);

        return () => observer.disconnect();
    }, []);

    return { ref, size };
}

export async function getAuthHeaders() {
    const { data } = await supabase.auth.getSession();

    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
            data.session?.access_token ??
            import.meta.env.VITE_SUPABASE_ANON_KEY
        }`,
    };
}

function parseDateToUTC(dateStr, isEnd = false) {
    const [day, month, year] = dateStr.split("-").map(Number);

    const date = new Date(Date.UTC(year, month - 1, day));

    if (isEnd) {
        date.setUTCHours(23, 59, 59, 999);
    } else {
        date.setUTCHours(0, 0, 0, 0);
    }

    return date;
}

export async function getNotificationsForWeek(
    numberOfDays,
    endDateStr // "dd-mm-yyyy"
) {
    // Parse end date
    const endDate = parseDateToUTC(endDateStr, true);

    // Calculate start date
    const startDate = new Date(endDate);
    startDate.setUTCDate(startDate.getUTCDate() - numberOfDays);
    startDate.setUTCHours(0, 0, 0, 0);

    const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .gte("created_at", startDate.toISOString())
        .lte("created_at", endDate.toISOString());

    if (error) {
        throw error;
    }

    console.log(data)
    return data;
}

export function getTodayDDMMYYYY() {
    const now = new Date();

    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();

    return `${day}-${month}-${year}`;
}