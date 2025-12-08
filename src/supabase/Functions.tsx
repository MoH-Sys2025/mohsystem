import {supabase} from "@/supabase/supabase.ts";
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
        console.log(payload)
        if (error) throw error;
        return data;
    },

    async updatePersonnel(id: any, updates: any) {
        const { data, error } = await supabase
            .from("personnel")
            .update(updates)
            .eq("id", id)
            .select("*")
            .single();

        if (error) throw error;
        return data;
    },

    async getPersonnelById(id: any) {
        const { data, error } = await supabase
            .from("personnel")
            .select("*")
            .eq("id", id)
            .single();

        if (error) throw error;
        return data;
    },

    async getNotifications(limit = 100) {
        const { data, error } = await supabase
            .from("notifications")
            .select("*")
            .order("id", { ascending: true })
            .limit(limit);
        if (error) throw error;
        return data;
    },

    async deleteNotification(id) {
        const { error } = await supabase
            .from("notifications")
            .delete()
            .eq("id", id);

        if (error) throw error;
        return true;
    },

    async listPersonnel(limit = 100) {
        const { data, error } = await supabase
            .from("personnel")
            .select("*")
            .order("personnel_identifier", { ascending: true })
            .limit(limit);

        if (error) throw error;
        return data;
    },

    async  listPersonnelMetaWorker(limit = 100) {
        const { data, error } = await supabase
            .from("personnel")
            .select("*")
            .filter("metadata->worker_status->>1", "eq", "Available")
            .order("personnel_identifier", { ascending: true })
            .limit(limit);

        if (error) throw error;
        return data;
    },

    async listDistricts(limit = 100) {
        const { data, error } = await supabase
            .from("administrative_regions")
            .select("*")
            .order("id", { ascending: true })
            .limit(limit);

        if (error) throw error;
        return data;
    },

    async listCadres(limit = 100) {
        const { data, error } = await supabase
            .from("cadres")
            .select("*")
            .order("id", { ascending: true })
            .limit(limit);

        if (error) throw error;
        return data;
    },
    async listFacilities(limit = 100) {
        const { data, error } = await supabase
            .from("health_facilities")
            .select("*")
            .order("id", { ascending: true })
            .limit(limit);

        if (error) throw error;
        return data;
    },

    async listDeployments(limit = 200) {
        const { data, error } = await supabase
            .from("deployments")
            .select("*")
            .order("id", { ascending: true })
            .limit(limit);

        if (error) throw error;
        return data;
    },

    async listOutbreaks(limit = 200) {
        const { data, error } = await supabase
            .from("outbreaks")
            .select("*")
            .order("id", { ascending: true })
            .limit(limit);

        if (error) throw error;
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

        if (error) throw error;
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

        if (error) throw error;
        return data;
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
