import {supabase} from "@/supabase/supabase.ts";
import {toast} from "sonner";
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
        console.log([total, total - previous])
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
