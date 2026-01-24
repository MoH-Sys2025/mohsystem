// src/components/pages/NewDeploymentForm.tsx
import React, { useEffect, useMemo, useState, createContext, useContext } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { supabase } from "@/supabase/supabase";
import { api } from "@/supabase/Functions";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {showAlert} from "@/components/NotificationsAlerts.tsx";
import {useSession} from "@/contexts/AuthProvider.tsx";
import {ArrowLeft, ChevronDown, Loader, Loader2, MapPin, Search} from "lucide-react";
import {useNavigate} from "react-router-dom";
import {ScrollArea} from "../ui/scroll-area.tsx";
import {InputGroup, InputGroupAddon, InputGroupInput, InputGroupText} from "../ui/input-group.tsx";
import GobackBtn from "../GobackBtn.tsx";

/**
 * Deployment form:
 * - Left: deployment fields (no Personnel, no Status)
 * - Right: search + unified filter + personnel table (no contact column)
 * - Multi-select table (select many), Create inserts one deployment per selected person
 *
 * NOTE: Left form uses shadcn Form + react-hook-form + zod validation (Option A).
 * The RightPersonnelPanel is kept functionally the same as your original.
 */

// ------------------- GLOBAL IN-MEMORY CACHE -------------------
let _cachedPersonnel: any[] | null = null;
let _cachedDistricts: any[] | null = null;
let _cachedFacilities: any[] | null = null;
let _cachedOutbreaks: any[] | null = null;
let _cachedIndex: number | null = null;

async function loadCachedPersonnel() {
    if (_cachedPersonnel) return _cachedPersonnel;
    const p = await api.listPersonnelMetaWorker().catch(() => []);
    _cachedPersonnel = p || [];
    return _cachedPersonnel;
}

async function loadCachedOutbreaks() {
    if (_cachedOutbreaks) return _cachedOutbreaks;
    const d = await api.listOutbreaks(2000).catch(() => []);
    _cachedOutbreaks = d || [];
    return _cachedOutbreaks;
}

async function loadCachedDeployId() {
    const { data, error } = await supabase
        .from("deployment_id_counters")
        .select("last_number")
        .single();

    if (error || !data?.last_number) {
        showAlert({
            title: "Deployment failed",
            description: "Failed loading deployments indexes, defaulting to 0",
            type: "error",
            duration: 7000,
        });
        return [`DEP-${new Date().getFullYear()}-NNN`, 0]; // default fallback
    }

    return [`DEP-${new Date().getFullYear()}-${formatNumber(data.last_number)}`, data.last_number];
}

function formatNumber(num: number) {
    return String(num).padStart(3, "0");
}

async function insertDeploymentIndex(curIndex: number) {
    await supabase
        .from("deployment_id_counters")
        .update({ last_number: curIndex })
        .eq("id", "a43e7293-48d8-4c88-a18a-c4013ddc92bb");

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

// ------------------- Deployment Context -------------------
type DeploymentContextType = {
    selectedIds: string[];
    setSelectedIds: (ids: string[]) => void;
    refreshKey: number;
    triggerRefresh: () => void;
};

const DeploymentContext = createContext<DeploymentContextType>({
    selectedIds: [],
    setSelectedIds: () => {},
    refreshKey: 0,
    triggerRefresh: () => {},
});

function StepItem({ active, label, index }: { active: boolean; label: string; index: number }) {
    return (
        <div className="flex items-center gap-2">
            <div
                className={`h-7 w-7 rounded-full flex items-center justify-center text-sm font-medium
          ${active ? "bg-purple-600 text-white" : "bg-neutral-200 text-neutral-600"}`}
            >
                {index}
            </div>
            <span className={`text-sm ${active ? "text-purple-600 font-medium" : "text-neutral-500"}`}>
        {label}
      </span>
        </div>
    );
}

export default function NewDeploymentForm({ onSuccess }: { onSuccess?: (data?: any) => void }) {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [refreshKey, setRefreshKey] = useState(0);
    const [step, setStep] = useState<1 | 2>(1);

    const triggerRefresh = () => setRefreshKey((k) => k + 1);

    return (
        <DeploymentContext.Provider value={{ selectedIds, setSelectedIds, refreshKey, triggerRefresh }}>
            <div className="min-h-screen bg-neutral-50 p-6">

                {/* STEP HEADER */}
                <div className="flex items-center gap-6 mb-8">
                    <StepItem active={step === 1} label="Deployment details" index={1} />
                    <div className="h-px w-10 bg-neutral-300" />
                    <StepItem active={step === 2} label="Select personnel" index={2} />
                </div>

                {/* STEP 1 — FULL PAGE */}
                {step === 1 && (
                    <div className=" mx-auto bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-lg font-semibold mb-2">About Deployment</h2>
                        <p className="text-sm text-muted-foreground mb-6">
                            Enter the basic deployment details to proceed further
                        </p>

                        <LeftForm onSuccess={onSuccess} />

                        <div className="mt-6 flex justify-end">
                            <Button onClick={() => setStep(2)}>
                                Continue →
                            </Button>
                        </div>
                    </div>
                )}

                {/* STEP 2 — FULL PAGE */}
                {step === 2 && (
                    <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold">Select Personnel</h2>
                            <Button variant="ghost" onClick={() => setStep(1)}>← Back</Button>
                        </div>

                        <RightPersonnelPanel />

                        {/* FINAL SUBMIT BUTTON */}
                        <div className="mt-6 flex justify-end">
                            <Button
                                form="deployment-form"
                                type="submit"
                                className="px-8"
                            >
                                Create Deployment
                            </Button>
                        </div>
                    </div>
                )}


            </div>
        </DeploymentContext.Provider>
    );
}




/* ----------------------------- LEFT FORM ----------------------------- */

/**
 * Zod schema for left form (validation)
 * - start_date required (as you had previously required it visually)
 * - other fields optional but typed
 */
const leftFormSchema = z.object({
    start_date: z.string().min(1, "Start date is required"),
    end_date: z.string().optional().nullable(),
    assigned_district_id: z.string(),
    assigned_facility_id: z.string().nullable().optional(),
    outbreak_id: z.string(),
    deploy_status: z.string(),
    deployment_id: z.string().nullable().optional(),
    team_lead: z.string().nullable().optional(),
    role_description: z.string().optional().nullable(),
    status: z.enum(["Pending", "Deployed", "Available"]).default("Deployed"),
    notes: z.string().optional().nullable(),
});

type LeftFormValues = z.infer<typeof leftFormSchema>;

function LeftForm({ onSuccess }: { onSuccess?: (data?: any) => void }) {
    const { selectedIds, setSelectedIds, triggerRefresh } = useContext(DeploymentContext);
    const [deploy_id, setDeployId] = useState<any[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [districts, setDistricts] = useState<any[]>([]);
    const [facilities, setFacilities] = useState<any[]>([]);
    const [outbreaks, setOutbreaks] = useState<any[]>([]);
    const session = useSession();
    const navigate = useNavigate();
    const [assignDistrict, setAssignDistrict] = useState<any[]>([]);
    const [personnelList, setPersonnelList] = useState<any[]>([]); // used for team lead only

    useEffect(() => {
        const load = async () => {
            const [p, d, f, o, i] = await Promise.all([
                loadCachedPersonnel(),
                loadCachedDistricts(),
                loadCachedFacilities(),
                loadCachedOutbreaks(),
                loadCachedDeployId(),
            ]);
            setPersonnelList([...p]);
            setDistricts([...d]);
            setFacilities([...f]);
            setOutbreaks([...o]);
            setDeployId([...i])
        };
        setLoading(true)
        load();
        setLoading(false)
    }, []);

    const form = useForm<LeftFormValues>({
        resolver: zodResolver(leftFormSchema),
        defaultValues: {
            start_date: "",
            deployment_id: null,
            end_date: null,
            assigned_district_id: null,
            assigned_facility_id: null,
            outbreak_id: null,
            team_lead: null,
            role_description: "",
            status: "Pending",
            notes: "",
        },
    });
    const selectedDistrictId = form.watch("assigned_district_id");
    const filteredFacilities = useMemo(() => {
        if (!selectedDistrictId) return [];
        return facilities.filter(
            (f) => f.district_id === selectedDistrictId
        );
    }, [facilities, selectedDistrictId]);

    useEffect(() => {
        form.setValue("assigned_facility_id", null);
    }, [selectedDistrictId, form]);

    async function onSubmit(values: LeftFormValues) {
        if (!selectedIds || selectedIds.length === 0) {
            showAlert({
                title: "Error",
                description: "Select at least one health worker from the right table",
                type: "error",
                duration: 5000,
            })
            return;
        }

        setLoading(true);

        // Build payloads preserving original structure: one deployment per selected person
        const payloads = selectedIds.map((personnel_id) => ({
            personnel_id,
            start_date: values.start_date || null,
            end_date: values.end_date || null,
            deployment_id: deploy_id[0] || null,
            deploy_status: values.deploy_status || null,
            assigned_district_id: values.assigned_district_id || null,
            assigned_facility_id: values.assigned_facility_id || null,
            team_lead: values.team_lead || null,
            outbreak_id: values.outbreak_id || null,
            role_description: values.role_description || null,
            status: values.status || "Pending",
            notes: values.notes || null,
        }));

        // Insert deployments
        const { data, error } = await supabase.from("deployments").insert(payloads).select();

        if (error ) {
            console.error(error);
            showAlert({
                title: "Deployment failed",
                description: "Failed to create deployment, please try again.",
                type: "error",
                duration: 7000,
            })
            return;
        }
        console.log(deploy_id[1])
        insertDeploymentIndex(deploy_id[1]+1)
        /* ---------------------------------------------------------
           UPDATE PERSONNEL worker_status[1] = "Pending"
           --------------------------------------------------------- */
        const { error: error2 } = await supabase.rpc("set_multiple_workers_pending", {
            ids: selectedIds,
        });

        setLoading(false);
        if (error2) {
            showAlert({
                title: "Update failed",
                description: "Failed to update personnel.",
                type: "error",
                duration: 7000,
            })
            return
        } else {
            api.sendNotification(
                session.user.id,
                {
                    title: "New Deployments",
                    message: `${data.length} Healthcare ${(data.length == 1) ? "worker was" : "workers were"} deployed to ${assignDistrict} District`,
                    type: "Deployment",
                    metadata: {
                        user: session.user,
                        activity: ""
                    }
                }
            )
            triggerRefresh();
            showAlert({
                title: "Deployment Successful",
                description: "Healthcare workers successfully deployed",
                type: "success",
                duration: 7000,
            })
        }

        setLoading(false);
        showAlert({
            title: "Deployment Successful",
            description: `Created ${data.length} deployment(s). Personnel status updated.`,
            type: "success",
            duration: 7000,
        })
        onSuccess?.(data);

        // Clear right-panel selection via context
        setSelectedIds([]);
        form.reset();
        navigate("/dashboard/deployments");
    }

    return (
        <div className="space-y-6 p-2 bg-white border-1 rounded-lg w-full lg:px-4">
            <h2 className="text-lg font-semibold">New Deployment</h2>
            <Form {...form}>
                <form id="deployment-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    {/* Dates */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="start_date"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Start date *</FormLabel>
                                    <FormControl>
                                        <Input
                                            required
                                            className="w-full"
                                            type="date"
                                            {...field}
                                            value={field.value ?? ""}
                                            onChange={(e) => field.onChange(e.target.value)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="end_date"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>End date</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="w-full"
                                            type="date"
                                            {...field}
                                            value={field.value ?? ""}
                                            onChange={(e) => field.onChange(e.target.value)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Assigned district */}
                    <FormField
                        control={form.control}
                        name="assigned_district_id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Assigned district *</FormLabel>
                                <FormControl>
                                    <Select
                                        value={field.value ?? "none"}
                                        onValueChange={(v) => field.onChange(v === "none" ? null : v)}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select district" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">No district</SelectItem>
                                            {districts.map((d) => (
                                                <SelectItem key={d.id} value={d.id} onClick={()=>setAssignDistrict(d.name)}>
                                                    {d.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Response Status */}
                    <FormField
                        control={form.control}
                        name="outbreak_id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Outbreak response *</FormLabel>
                                <FormControl>
                                    <Select
                                        value={field.value ?? "none"}
                                        onValueChange={(v) => field.onChange(v === "none" ? null : v)}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue className="w-full" placeholder="Select outbreak" />
                                        </SelectTrigger>
                                        <SelectContent className="w-full">
                                            <SelectItem value="none">None</SelectItem>
                                            {outbreaks.map((o) => (
                                                <SelectItem key={o.id} value={o.id}>
                                                    {o.disease ?? o.outbreak_name ?? "—"}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* Outbreak response */}
                    <FormField
                        control={form.control}
                        name="deploy_status"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Response status *</FormLabel>
                                <FormControl>
                                    <Select
                                        value={field.value ?? "none"}
                                        onValueChange={(v) => field.onChange(v === "none" ? null : v)}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue className="w-full" placeholder="Response Status" />
                                        </SelectTrigger>
                                        <SelectContent className="col-span-2 lg:col-span-1">
                                            <SelectItem value="none">None</SelectItem>
                                            {[{id: "Active", value: "active"}, {id:"Completed", value: "completed"}, {
                                                id: "Closed",
                                                value: "closed"
                                            }].map((o) => (
                                                <SelectItem key={o.id} value={o.value}>
                                                    {o.id ? o.id : "—"}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Assigned facility */}
                    <FormField
                        control={form.control}
                        name="assigned_facility_id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Assigned facility</FormLabel>
                                <FormControl>
                                    <Select
                                        disabled={!selectedDistrictId}
                                        value={field.value ?? "none"}
                                        onValueChange={(v) => field.onChange(v === "none" ? null : v)}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select facility" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">No facility</SelectItem>
                                            {filteredFacilities.map((f) => (
                                                <SelectItem key={f.id} value={f.id}>
                                                    {f.facility_name ?? f.name}
                                                </SelectItem>
                                            ))}

                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Team lead */}
                    <FormField
                        control={form.control}
                        name="team_lead"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Team lead</FormLabel>
                                <FormControl>
                                    <Select
                                        value={field.value ?? "__none"}
                                        onValueChange={(v) => field.onChange(v === "__none" ? null : v)}
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
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </form>
            </Form>
        </div>
    );
}

/* ----------------------------- RIGHT PANEL ----------------------------- */
function RightPersonnelPanel() {
    type SortDir = "asc" | "desc" | null;

    const [sortBy, setSortBy] = useState<"name" | "trainings" | "role" | null>(null);
    const [sortDir, setSortDir] = useState<SortDir>(null);

    const { selectedIds, setSelectedIds } = useContext(DeploymentContext);

    const [allPersonnel, setAllPersonnel] = useState<any[]>([]);
    // const [facilities, setFacilities] = useState([]);
    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState("all"); // 'all' | 'status' | 'qualification' | 'district'
    const [filterValue, setFilterValue] = useState("all");
    const [selectedRows, setSelectedRows] = useState(new Set<string>());
    const [selectAll, setSelectAll] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const SORT_FIELDS = {
        name: (p: any) =>
            `${p.first_name ?? ""} ${p.last_name ?? ""}`.toLowerCase(),

        trainings: (p: any) =>
            (p?.trainings || []).join(", ").toLowerCase(),

        role: (p: any) =>
            (p?.role ?? "").toLowerCase(),
    };



    useEffect(() => {
        setIsLoading(true);
        const load = async () => {
            const [p, f] = await Promise.all([
                api.listPersonnelMetaWorker().catch(() => []),
                api.listFacilities(2000).catch(() => []),
            ]);
            setAllPersonnel(p || []);
            // setFacilities(f || []);
        };
        load();
        setIsLoading(false);
    }, []);

    // keep local selectedRows in sync when context selectedIds changes
    useEffect(() => {
        setSelectedRows(new Set(selectedIds || []));
        setSelectAll((_) => {
            const filteredIds = filteredIdsFromAll();
            if (filteredIds.length === 0) return false;
            return filteredIds.every((id) => (selectedIds || []).includes(id));
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedIds, allPersonnel, search, filterType, filterValue]);

    // helper to compute filtered ids quickly for selectAll logic
    const filteredIdsFromAll = () => {
        const q = search?.trim().toLowerCase() || "";
        return (allPersonnel || [])
            .filter((p) => {
                const full = `${p.first_name || ""} ${p.last_name || ""}`.toLowerCase();
                if (q && !full.includes(q)) return false;
                if (!matchesFilter(p)) return false;
                return true;
            })
            .map((p) => p.id);
    };

    // derive dynamic options
    const qualificationOptions = useMemo(() => {
        return Array.from(new Set(allPersonnel.flatMap((p) => p.qualifications || []).map(String))).filter(Boolean);
    }, [allPersonnel]);
    const districtOptions = useMemo(() => {
        return Array.from(new Set(allPersonnel.map((p) => p.metadata?.district || "").filter(Boolean)));
    }, [allPersonnel]);

    // helper safe normalizers
    const normalize = (v: any) => (typeof v === "string" ? v.trim().toLowerCase() : "");
    const matchesFilter = (p: any) => {
        if (!filterType || filterType === "all" || !filterValue || filterValue === "all") return true;
        if (filterType === "status") return normalize(p.metadata?.worker_status[1]) === normalize(filterValue);
        if (filterType === "qualification") return (p.qualifications || []).map(String).map(normalize).includes(normalize(filterValue));
        if (filterType === "district") {
            return normalize(p.metadata?.district) === normalize(filterValue) || p.current_district_id === filterValue;
        }
        return true;
    };

    // filtered list after search + filter
    const filtered = useMemo(() => {
        const q = search?.trim().toLowerCase() || "";

        const base = (allPersonnel || []).filter((p) => {
            const full = `${p.first_name || ""} ${p.last_name || ""}`.toLowerCase();
            if (q && !full.includes(q)) return false;
            if (!matchesFilter(p)) return false;
            return true;
        });

        if (!sortBy || !sortDir) return base;

        return [...base].sort((a, b) => {
            const av = SORT_FIELDS[sortBy](a);
            const bv = SORT_FIELDS[sortBy](b);
            return sortDir === "asc"
                ? av.localeCompare(bv)
                : bv.localeCompare(av);
        });
    }, [allPersonnel, search, filterType, filterValue, sortBy, sortDir]);
    function SortHeader({
                            label,
                            columnKey,
                        }: {
        label: string;
        columnKey: "name" | "trainings" | "role";
    }) {
        return (
            <div className="flex items-center justify-between gap-1">
                <span>{label}</span>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 p-0 text-neutral-500"
                        >
                            <ChevronDown className="h-4 w-4" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-28 p-1 bg-white shadow-md rounded-md">
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-xs"
                            onClick={() => {
                                setSortBy(columnKey);
                                setSortDir("asc");
                            }}
                        >
                            ↑ Ascending
                        </Button>
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-xs"
                            onClick={() => {
                                setSortBy(columnKey);
                                setSortDir("desc");
                            }}
                        >
                            ↓ Descending
                        </Button>
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-xs text-neutral-500"
                            onClick={() => {
                                setSortBy(null);
                                setSortDir(null);
                            }}
                        >
                            Clear
                        </Button>
                    </PopoverContent>
                </Popover>
            </div>
        );
    }


    // selection handlers
    const toggleRow = (id: string) => {
        setSelectedRows((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            setSelectAll(false);
            // update context
            setSelectedIds(Array.from(next));
            return next;
        });
    };

    const toggleSelectAll = () => {
        setSelectAll((s) => {
            const next = !s;
            if (next) {
                const ids = filtered.map((r) => r.id);
                setSelectedRows(new Set(ids));
                setSelectedIds(ids);
            } else {
                setSelectedRows(new Set());
                setSelectedIds([]);
            }
            return next;
        });
    };

    return (
        <div className="p-2 md:p-4 lg:px-5 bg-white w-full border-1 rounded-lg overflow-x-auto h-full">
            {/* Table */}
            <div className="flex items-center justify-between w-full mb-3 gap-2">
                {/*<div className="text-sm mr-auto text-neutral-600 w-full">{filtered.length} results</div>*/}
                {/* Search (full width) */}
                <div className="hidden md:block w-full">
                    <InputGroup className="w-full">
                        <InputGroupInput value={search} onChange={(e) => setSearch(e.target.value)} className="w-full" placeholder="Search..." />
                        <InputGroupAddon>
                            <Search />
                        </InputGroupAddon>
                        <InputGroupAddon align="inline-end">
                            <Select value={filterType} onValueChange={(v) => { setFilterType(v || "all"); setFilterValue("all"); }}>
                                <SelectTrigger className="w-full"><SelectValue placeholder="Filter type" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    <SelectItem value="qualification">Qualification</SelectItem>
                                    <SelectItem value="district">District</SelectItem>
                                </SelectContent>
                            </Select>
                        </InputGroupAddon>

                        <InputGroupAddon align="inline-end" >
                            <Select value={filterValue} onValueChange={(v) => setFilterValue(v || "all")}>
                                <SelectTrigger className="w-full text-xs"><SelectValue placeholder="Filter value" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    {filterType === "qualification" && qualificationOptions.map((q) => <SelectItem key={q} value={q}>{q}</SelectItem>)}
                                    {filterType === "district" && districtOptions.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </InputGroupAddon>

                    </InputGroup>
                </div>
                {/* Unified filter type + value */}


            </div>

            <div className="overflow-x-auto border border-neutral-200 rounded-lg px-0.5 py-2">
                {/* THIS is the scrolling container */}
                <div className="overflow-y-auto max-h-100 min-h-80 scroll-p-2">
                    <Table className="w-full px-2">
                        <TableHeader>
                            <TableRow className="sticky top-0 z-20 bg-white shadow-sm">
                                <TableHead className="w-10 bg-white">
                                    <input
                                        type="checkbox"
                                        checked={selectAll}
                                        onChange={toggleSelectAll}
                                    />
                                </TableHead>

                                <TableHead className="bg-white">
                                    <SortHeader label="Full name" columnKey="name" />
                                </TableHead>

                                <TableHead className="bg-white">
                                    <SortHeader label="Trainings" columnKey="trainings" />
                                </TableHead>

                                <TableHead className="bg-white">
                                    <SortHeader label="Role" columnKey="role" />
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {filtered.map((p) => (
                                <TableRow key={p.id} className="hover:bg-neutral-50">
                                    <TableCell>
                                        {!isLoading ? <input
                                            type="checkbox"
                                            checked={selectedRows.has(p.id)}
                                            onChange={() => toggleRow(p.id)}
                                        /> : <Loader2 className="animate-spin" />}
                                    </TableCell>

                                    <TableCell className="text-xs truncate">
                                        {!isLoading ? `${p.first_name} ${p.last_name}` : <Loader2 className="animate-spin" />}
                                    </TableCell>

                                    <TableCell className="text-xs max-w-40 truncate">
                                        {!isLoading ? `${(p?.trainings || []).join(", ") || "—"}` : <Loader2 className="animate-spin" />}
                                    </TableCell>

                                    <TableCell className="text-xs truncate">
                                        {!isLoading ? `${p?.role || "—"}` : <Loader2 className="animate-spin" />}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

        </div>
    );
}
