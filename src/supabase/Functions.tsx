import {supabase} from "@/supabase/supabase.ts";
import {toast} from "sonner";
import * as XLSX from "xlsx";

import { useEffect, useRef, useState } from "react";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function getAuthHeaders() {
    const session = localStorage.getItem('mors_session');
    if (!session) {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.SUPABASE_KEY}`,
        };
    }

    const { access_token } = JSON.parse(session);
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`,
    };
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

    async createPersonnel(payload: { first_name: string; last_name: string; other_names: string; gender: string; date_of_birth: string; phone: string; email: string; cadre_id: string; current_district_id: string; employment_status: string; hire_date: string; exit_date: string; metadata: { district: string; competencies: never[]; age: string; worker_status: string[]; }; qualifications: never[]; }) {
        const { data, error } = await supabase
            .from("personnel")
            .insert(payload)
            .select("*")
            .single();
        if (error) toast.error("The system failed to create the User")
        return data;
    },

    async updatePersonnel(id: any, updates: any) {
        const { data, error } = await supabase
            .from("personnel")
            .update(updates)
            .eq("id", id)
            .select("*")
            .single();

        if (error) toast.error("There was an error while updating Health workers data");
        return data;
    },
    async getUniqueDeployments() {
        const { data, error } = await supabase
            .from("deployments")
            .select("*")  // get all columns
            .order("deployment_id");

        if (error) {
            toast.error("Error fetching deployments data");
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
                toast.error("Failed to perform this action");
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

                if (error) toast.error("Failed to update Deployments table")


            }

            return { success: true };
        } catch (error) {
            toast.error("Update error");
            return { success: false, error };
        }
    },
    async getOutbreakInfo() {
        // 1. Fetch deployments
        const { data: deploymentsData, error: deploymentsError } = await supabase
            .from("deployments")
            .select("*")
            .order("deployment_id");

        if (deploymentsError) {
            toast.error("Error fetching deployments data");
            return [];
        }

        // 2. Remove duplicates by deployment_id
        const seen = new Set();
        const uniqueDeployments = [];

        deploymentsData.forEach(row => {
            if (!seen.has(row.deployment_id)) {
                seen.add(row.deployment_id);
                uniqueDeployments.push(row);
            }
        });

        // 3. Extract unique outbreak_ids
        const outbreakIds = uniqueDeployments.map(d => d.outbreak_id);

        // 4. Fetch outbreaks (rename variables here)
        const { data: outbreaksData, error: outbreaksError } = await supabase
            .from("outbreaks")
            .select("id, disease, district")
            .in("id", outbreakIds);

        if (outbreaksError) {
            toast.error("Error fetching outbreaks");
            return [];
        }

        // 5. Return outbreaks data
        return outbreaksData;
    },
    async getDeploymentCounts() {
        // 1. get ONLY active rows
        const { data, error } = await supabase
            .from("deployments")
            .select("deployment_id, deploy_status")
            .order("deployment_id");

        if (error) {
            toast.error("Error fetching deployments data")
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

        if (error) toast.error("There was an error while getting active deployments");

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
            toast.error('Error fetching active deployments:');
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

        if (error) toast.error("There was an error while getting active deployed districts");

        const unique = [...new Set(data.map((d) => d.assigned_district_id))].length;

        return unique;
    },
    async getActiveOutBreaks() {
        const { data, error } = await supabase
            .from("deployments")
            .select("outbreak_id", { count: "exact" })
            .eq("deploy_status", "active");

        if (error) toast.error("There was an error while getting active outbreaks");
        const unique = [...new Set(data.map((d) => d.outbreak_id))].length;

        return unique;
    },
    async getPersonnelById(id: any) {
        const { data, error } = await supabase
            .from("personnel")
            .select("*")
            .eq("id", id)
            .single();

        if (error) toast.error("There was an error while getting Health workers data");
        return data;
    },

    async getNotifications(limit = 100) {
        const { data, error } = await supabase
            .from("notifications")
            .select("*")
            .order("id", { ascending: true })
            .limit(limit);
        if (error) toast.error("There was an rror while getting notifications");
        return data;
    },

    async deleteNotification(id) {
        const { error } = await supabase
            .from("notifications")
            .delete()
            .eq("id", id);

        if (error) toast.error("Error deleting notification");
        return true;
    },

    async listPersonnel(limit = 100) {
        const { data, error } = await supabase
            .from("personnel")
            .select("*")
            .order("personnel_identifier", { ascending: true })
            .limit(limit);

        if (error) toast.error("Error fetching data");
        return data;
    },

    async  listPersonnelMetaWorker(limit = 100) {
        const { data, error } = await supabase
            .from("personnel")
            .select("*")
            .filter("metadata->worker_status->>1", "eq", "Available")
            .order("personnel_identifier", { ascending: true })
            .limit(limit);

        if (error) toast.error("Error fetching health workers data");
        return data;
    },

    async listDistricts(limit = 100) {
        const { data, error } = await supabase
            .from("administrative_regions")
            .select("*")
            .order("id", { ascending: true })
            .limit(limit);

        if (error) toast.error("Error fetching districts");
        return data;
    },

    async listCadres(limit = 100) {
        const { data, error } = await supabase
            .from("cadres")
            .select("*")
            .order("id", { ascending: true })
            .limit(limit);

        if (error) toast.error("Error fetching cadres");
        return data;
    },
    async listFacilities(limit = 100) {
        const { data, error } = await supabase
            .from("health_facilities")
            .select("*")
            .order("id", { ascending: true })
            .limit(limit);

        if (error) toast.error("Error fetching Health facilities");
        return data;
    },

    async listDeployments(limit = 2000000) {
        const { data, error } = await supabase
            .from("deployments")
            .select("*")
            .order("id", { ascending: true })
            .limit(limit);
        if (error) toast.error("Error fetching deployments");
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
            toast.error("Error fetching deployments");
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

        if (error) toast.error("Error fetching outbreaks data");
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

        if (error) toast.error("Error fetching cadres");
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

        if (error) toast.error("Error fetching cadres");
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
            .lt("created_at", startOfCurrentMonth.toISOString());

        if (prevError) {
            throw prevError;
        }

        // ------------------------------------
        // Workforce up to now (total)
        // ------------------------------------
        const { count: currentCount, error: currError } = await supabase
            .from("personnel")
            .select("*", { count: "exact", head: true });

        if (currError) {
            throw currError;
        }

        const total = currentCount ?? 0;
        const previous = previousCount ?? 0;
        return {
            total: total,
            change: total - previous,
        };
    }


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

export function formatDate(dateString: string) {
    if (!dateString) return "";

    const date = new Date(dateString);

    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" }); // "Jun"
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
}

export function exportCSV(data: any[], name: string, selectedColumns: string[]) {
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

    const headers = Object.keys(formatted[0] || {});
    const csv = [
        headers.join(","),
        ...formatted.map(row => headers.map(h => `"${row[h]}"`).join(","))
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${name}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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
    doc.addImage("/logo.png", "PNG", 80, 10, 50, 20); // your logo
    doc.setFontSize(18);
    doc.text("MOERS Health Workers Registry", 105, 40, { align: "center" });

    autoTable(doc, {
        startY: 50,
        head: [EXPORT_COLUMNS.filter(c => selectedColumns.includes(c.label)).map(c => c.label)],
        body: formatted.map(row =>
            EXPORT_COLUMNS.filter(c => selectedColumns.includes(c.label)).map(c => row[c.label])
        ),
    });

    doc.save(`${name}.pdf`);
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
