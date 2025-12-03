import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { supabase } from "@/supabase/supabase";
import { api } from "@/supabase/Functions";
import { Badge } from "@/components/ui/badge";

/**
 * Deployment form:
 * - Left: deployment fields (no Personnel, no Status)
 * - Right: search + unified filter + personnel table (no contact column)
 * - Multi-select table (select many), Create inserts one deployment per selected person
 */

// ------------------- GLOBAL IN-MEMORY CACHE -------------------
let _cachedPersonnel: any[] | null = null;
let _cachedDistricts: any[] | null = null;
let _cachedFacilities: any[] | null = null;

async function loadCachedPersonnel() {
    if (_cachedPersonnel) return _cachedPersonnel;
    const p = await api.listPersonnel(2000).catch(() => []);
    _cachedPersonnel = p || [];
    return _cachedPersonnel;
}

async function loadCachedDistricts() {
    if (_cachedDistricts) return _cachedDistricts;
    const d = await api.listDistricts(2000).catch(() => []);
    _cachedDistricts = d || [];
    return _cachedDistricts;
}

async function loadCachedFacilities() {
    if (_cachedFacilities) return _cachedFacilities;
    const f = await api.listFacilities(2000).catch(() => []);
    _cachedFacilities = f || [];
    return _cachedFacilities;
}


export default function NewDeploymentForm({ onSuccess }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-1 md:p-4 p-2">
            <div className="lg:col-span-5 md:col-span-6"><LeftForm /></div>
            <div className="lg:col-span-7 md:col-span-6"><RightPersonnelPanel /></div>
        </div>
    );
}

/* ----------------------------- LEFT FORM ----------------------------- */
function LeftForm() {
    const [loading, setLoading] = useState(false);
    const [districts, setDistricts] = useState([]);
    const [facilities, setFacilities] = useState([]);
    const [personnelList, setPersonnelList] = useState([]); // used for team lead only

    const [form, setForm] = useState({
        // personnel_id removed from left by request
        start_date: "",
        end_date: "",
        assigned_district_id: null,
        assigned_facility_id: null,
        team_lead: null,
        role_description: "",
        status: "planned",
        notes: "",
    });

    useEffect(() => {
        const load = async () => {
            const [p, d, f] = await Promise.all([
                loadCachedPersonnel(),
                loadCachedDistricts(),
                loadCachedFacilities()
            ]);

            setPersonnelList([...p]);
            setDistricts([...d]);
            setFacilities([...f]);
        };
        load();
    }, []);


    const updateField = (k, v) =>
        setForm((prev) => ({ ...prev, [k]: v === "__none" ? null : v }));

    // When submitting: create one deployment row per selected personnel (Right panel manages selection via custom event)
    // To avoid global state, we'll listen to a custom event dispatched by the Right panel (see below).
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    useEffect(() => {
        const handler = (e) => {
            // custom event detail contains selectedIds array
            if (e?.detail?.type === "deployment-selected-ids") {
                setSelectedIds(Array.isArray(e.detail.ids) ? e.detail.ids : []);
            }
        };
        window.addEventListener("deployment:selected", handler);
        return () => window.removeEventListener("deployment:selected", handler);
    }, []);

    const submit = async () => {
        if (selectedIds.length === 0) {
            alert("Select at least one health worker from the right table.");
            return;
        }

        setLoading(true);

        // Insert one deployment row per selected person
        const payloads = selectedIds.map((personnel_id) => ({
            personnel_id,
            start_date: form.start_date || null,
            end_date: form.end_date || null,
            assigned_district_id: form.assigned_district_id || null,
            assigned_facility_id: form.assigned_facility_id || null,
            team_lead: form.team_lead || null,
            role_description: form.role_description || null,
            status: form.status || "planned",
            notes: form.notes || null,
        }));

        const { data, error } = await supabase.from("deployments").insert(payloads).select();
        setLoading(false);

        if (error) {
            console.error(error);
            alert("Failed to create deployments: " + error.message);
            return;
        }

        alert(`Created ${data.length} deployment(s).`);
        onSuccess?.(data);
        // clear selection by emitting an event to Right panel
        window.dispatchEvent(new CustomEvent("deployment:clear-selection"));
    };

    return (
        <div className="space-y-6 p-2 bg-white rounded-xl shadow-sm w-full">
            <h2 className="text-xl font-semibold">New Deployment</h2>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Start date</Label>
                    <Input
                        className="w-full"
                        type="date"
                        value={form.start_date}
                        onChange={(e) => updateField("start_date", e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label>End date</Label>
                    <Input
                        className="w-full"
                        type="date"
                        value={form.end_date}
                        onChange={(e) => updateField("end_date", e.target.value)}
                    />
                </div>
            </div>

            {/* Assigned district */}
            <div className="space-y-2">
                <Label>Assigned district</Label>
                <Select
                    value={form.assigned_district_id ?? "none"}
                    onValueChange={(v) => updateField("assigned_district_id", v === "none" ? null : v)}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select district" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="none">No district</SelectItem>
                        {districts.map((d) => (
                            <SelectItem key={d.id} value={d.id}>
                                {d.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Assigned facility */}
            <div className="space-y-2">
                <Label>Assigned facility</Label>
                <Select
                    value={form.assigned_facility_id ?? "none"}
                    onValueChange={(v) => updateField("assigned_facility_id", v === "none" ? null : v)}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select facility" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="none">No facility</SelectItem>
                        {facilities.map((f) => (
                            <SelectItem key={f.id} value={f.id}>
                                {f.facility_name ?? f.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Team lead */}
            <div className="space-y-2">
                <Label>Team lead (optional)</Label>
                <Select
                    value={form.team_lead ?? "__none"}
                    onValueChange={(v) => updateField("team_lead", v === "__none" ? null : v)}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select team lead" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="__none">No lead</SelectItem>
                        {personnelList.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                                {p.first_name} {p.last_name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Role description */}
            <div className="space-y-2">
                <Label>Role description</Label>
                <Textarea
                    className="w-full"
                    value={form.role_description}
                    onChange={(e) => updateField("role_description", e.target.value)}
                />
            </div>

            {/* Notes */}
            <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                    className="w-full"
                    value={form.notes}
                    onChange={(e) => updateField("notes", e.target.value)}
                />
            </div>

            <div className="flex gap-2">
                <Button className="w-full" disabled={loading} onClick={submit}>
                    {loading ? "Saving..." : "Create Deployment"}
                </Button>
            </div>
        </div>
    );
}

/* ----------------------------- RIGHT PANEL ----------------------------- */
function RightPersonnelPanel() {
    const [allPersonnel, setAllPersonnel] = useState([]);
    const [facilities, setFacilities] = useState([]);
    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState("all"); // 'all' | 'status' | 'qualification' | 'district'
    const [filterValue, setFilterValue] = useState("all");
    const [selectedRows, setSelectedRows] = useState(new Set());
    const [selectAll, setSelectAll] = useState(false);

    useEffect(() => {
        const load = async () => {
            const [p, f] = await Promise.all([
                api.listPersonnel(2000).catch(() => []),
                api.listFacilities(2000).catch(() => []),
            ]);
            setAllPersonnel(p || []);
            setFacilities(f || []);
        };
        load();

        // listen for clear selection event from left form
        const clearHandler = () => {
            setSelectedRows(new Set());
            setSelectAll(false);
            // notify left form selection cleared
            window.dispatchEvent(new CustomEvent("deployment:selected", { detail: { type: "deployment-selected-ids", ids: [] } }));
        };
        window.addEventListener("deployment:clear-selection", clearHandler);
        return () => window.removeEventListener("deployment:clear-selection", clearHandler);
    }, []);

    // derive dynamic options
    const statusOptions = useMemo(() => {
        return Array.from(new Set(allPersonnel.map((p) => (p.metadata?.worker_status[1] || "").toString()).filter(Boolean)));
    }, [allPersonnel]);
    const qualificationOptions = useMemo(() => {
        return Array.from(new Set(allPersonnel.flatMap((p) => p.qualifications || []).map(String))).filter(Boolean);
    }, [allPersonnel]);
    const districtOptions = useMemo(() => {
        return Array.from(new Set(allPersonnel.map((p) => p.metadata?.district || "").filter(Boolean)));
    }, [allPersonnel]);

    // helper safe normalizers
    const normalize = (v) => (typeof v === "string" ? v.trim().toLowerCase() : "");
    const matchesFilter = (p) => {
        if (!filterType || filterType === "all" || !filterValue || filterValue === "all") return true;
        if (filterType === "status") return normalize(p.metadata?.worker_status[1]) === normalize(filterValue);
        if (filterType === "qualification") return (p.qualifications || []).map(String).map(normalize).includes(normalize(filterValue));
        if (filterType === "district") {
            // compare name or id if needed; here we compare district name stored in metadata
            return normalize(p.metadata?.district) === normalize(filterValue) || (p.current_district_id === filterValue);
        }
        return true;
    };

    // filtered list after search + filter
    const filtered = useMemo(() => {
        const q = search?.trim().toLowerCase() || "";
        return (allPersonnel || []).filter((p) => {
            const full = `${p.first_name || ""} ${p.last_name || ""}`.toLowerCase();
            if (q && !full.includes(q)) return false;
            if (!matchesFilter(p)) return false;
            return true;
        });
    }, [allPersonnel, search, filterType, filterValue]);

    // selection handlers
    const toggleRow = (id) => {
        setSelectedRows((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            setSelectAll(false);
            // notify left form of selected ids
            window.dispatchEvent(new CustomEvent("deployment:selected", { detail: { type: "deployment-selected-ids", ids: Array.from(next) } }));
            return next;
        });
    };

    const toggleSelectAll = () => {
        setSelectAll((s) => {
            const next = !s;
            if (next) {
                const ids = filtered.map((r) => r.id);
                setSelectedRows(new Set(ids));
                window.dispatchEvent(new CustomEvent("deployment:selected", { detail: { type: "deployment-selected-ids", ids } }));
            } else {
                setSelectedRows(new Set());
                window.dispatchEvent(new CustomEvent("deployment:selected", { detail: { type: "deployment-selected-ids", ids: [] } }));
            }
            return next;
        });
    };

    // helper facility name
    const getFacilityName = (id) => {
        const f = facilities.find((x) => x.id === id);
        return f?.facility_name || f?.name || "—";
    };

    return (
        <div className="p-2 bg-white rounded-xl shadow-sm">
            {/* Search (full width) */}
            <div className="mb-3">
                <Input placeholder="Search by full name..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full" />
            </div>

            {/* Unified filter type + value */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                <Select value={filterType} onValueChange={(v) => { setFilterType(v || "all"); setFilterValue("all"); }}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Filter type" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="status">Worker Status</SelectItem>
                        <SelectItem value="qualification">Qualification</SelectItem>
                        <SelectItem value="district">District</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={filterValue} onValueChange={(v) => setFilterValue(v || "all")}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Filter value" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        {filterType === "status" && statusOptions.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        {filterType === "qualification" && qualificationOptions.map((q) => <SelectItem key={q} value={q}>{q}</SelectItem>)}
                        {filterType === "district" && districtOptions.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>

            {/* Table */}
            <div className="flex items-center justify-between mb-3">
                <div className="text-sm text-neutral-600">{filtered.length} results</div>
                <div className="flex items-center gap-3">
                    <label className="text-sm flex items-center gap-2">
                        <input type="checkbox" checked={selectAll} onChange={toggleSelectAll} />
                        <span className="text-xs">Select all</span>
                    </label>
                </div>
            </div>

            <div className="border rounded-xl overflow-auto max-h-[60vh]">
                <table className="w-full text-xs">
                    <thead className="bg-neutral-100 text-xs font-semibold">
                    <tr>
                        <th className="p-2 text-left"></th>
                        <th className="p-2 text-left">Full name</th>
                        <th className="p-2 text-left">Status</th>
                        <th className="p-2 text-left">Qualifications</th>
                        <th className="p-2 text-left">Competencies</th>
                    </tr>
                    </thead>

                    <tbody>
                    {filtered.map((p) => {
                        const status = p.metadata?.worker_status[1] ?? "—";
                        const qualifications = Array.isArray(p.qualifications) ? p.qualifications : [];
                        const competencies = Array.isArray(p.metadata?.competencies) ? p.metadata.competencies : [];
                        return (
                            <tr key={p.id} className="border-t hover:bg-neutral-50">
                                <td className="p-2">
                                    <input type="checkbox" checked={selectedRows.has(p.id)} onChange={() => toggleRow(p.id)} />
                                </td>
                                <td className="p-2">{`${p.first_name ?? ""} ${p.last_name ?? ""}`.trim() || "—"}</td>
                                <td className="p-2"><Badge>{status}</Badge></td>
                                <td className="p-2">{qualifications.length > 0 ? qualifications.join(", ") : "—"}</td>
                                <td className="p-2">{competencies.length > 0 ? competencies.join(", ") : "—"}</td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
