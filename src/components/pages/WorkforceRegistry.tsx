import { useEffect, useState } from "react";
import {
    Search,
    Filter,
    Download,
    MoreVertical,
    Loader2,
    Info,
    LoaderPinwheel,
    Link as LinkIcon,
    Unlink,
    Trash2, User2
} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {districts} from "@/supabase/districts"
import { api } from "@/supabase/Functions.tsx";
import {useSelectedWorker} from "@/components/DataContext.tsx";
import {Popover} from "@/components/ui/popover.tsx";
import {PopoverContent, PopoverPortal, PopoverTrigger} from "@radix-ui/react-popover";
import {PaginationNext} from "@/components/ui/pagination.tsx";

interface WorkforceRegProps {
    onNavigate: (page: string) => void;
}

export function WorkforceRegistry({ onNavigate }: WorkforceRegProps) {
    const [workers, setPersonnel] = useState<any[]>([]);
    const [cadres, setCadres] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

const [searchTerm, setSearchTerm] = useState("");
const [filterOpen, setFilterOpen] = useState(false);
const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
const [filterValue, setFilterValue] = useState<string | null>(null);

const { setSelectedWorker } = useSelectedWorker();

useEffect(() => {
    async function fetchPersonnel() {
        try {
            const data = await api.listPersonnel(1000);
            const cadresData = await api.listCadres(1000);

            setPersonnel(Array.isArray(data) ? data : []);
            setCadres(Array.isArray(cadresData) ? cadresData : []);
        } catch (err: any) {
            setError(err?.message ?? String(err));
        } finally {
            setLoading(false);
        }
    }

    fetchPersonnel();
}, []);

const filterOptions = [
    { key: "role", label: "Role" },
    { key: "district", label: "District" },
    { key: "status", label: "Status" },
    { key: "certifications", label: "Certifications" },
    { key: "competencies", label: "Competencies" },
];

const fieldMap: Record<string, string | null> = {
    role: "cadres.name",
    district: "current_district_id",
    status: "metadata.worker_status[1]",
    certifications: "qualifications",
    competencies: "metadata.competencies",
};

function getField(worker: any, key: string | null) {
    if (!key) return null;
    const path = fieldMap[key];
    if (!path) return null;
    return path.split(".").reduce((obj: any, p: string) => obj?.[p], worker);
}

const normalizeForSearch = (val: any) =>
    val === null || val === undefined
        ? ""
        : typeof val === "object"
            ? JSON.stringify(val)
            : String(val);

const filteredWorkers = workers.filter((worker) => {
    const hay = Object.values(worker).map(normalizeForSearch).join(" ").toLowerCase();
    const searchMatch = hay.includes(searchTerm.toLowerCase());

    if (!selectedFilter || !filterValue) return searchMatch;

    const workerValue = getField(worker, selectedFilter);

    if (Array.isArray(workerValue)) {
        return (
            searchMatch &&
            workerValue.some((c: any) =>
                String(c).toLowerCase().includes(filterValue.toLowerCase())
            )
        );
    }

    return (
        searchMatch &&
        String(workerValue ?? "")
            .toLowerCase()
            .includes(filterValue.toLowerCase())
    );
});

if (error)
    return (
        <div className="flex items-center gap-2 text-red-500 p-6">
            <Info /> Error loading table data.
        </div>
    );

const formatInitials = (worker: any) => {
    const names = [
        ...(worker.first_name ? String(worker.first_name).split(/\s+/) : []),
        ...(worker.last_name ? String(worker.last_name).split(/\s+/) : []),
    ];
    const initials = names.map((n: string) => n[0]).filter(Boolean).join(" ");
    return `${initials}`.trim();
};

return (
    <div className="space-y-8 p-6 px-3">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-neutral-900 mb-2">Workforce Registry</h1>
                <p className="text-neutral-500">
                    Manage and monitor healthcare workers across Malawi
                </p>
            </div>
            <Button onClick={()=>onNavigate('add worker')}>Add Health Worker</Button>
        </div>

        {!loading && (
            <>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {["2,847", "156", "2,634", "57"].map((value, i) => (
                        <div key={i} className="bg-white rounded-xl border border-neutral-200 p-5">
                            <p className="text-sm text-neutral-500 mb-1">
                                {["Total Workers", "Deployed", "Available", "On Leave"][i]}
                            </p>
                            <p className="text-3xl font-semibold text-neutral-900">{value}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden relative">
                    <div className="p-6 border-b border-neutral-200">
                        <div className="flex gap-3">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name, ID, or role..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm"
                                />
                            </div>

                            <button
                                onClick={() => setFilterOpen(!filterOpen)}
                                className="px-4 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-50 flex items-center gap-2 text-sm"
                            >
                                <Filter className="w-4 h-4" />
                                Filters
                            </button>

                            <button className="px-4 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-50 flex items-center gap-2 text-sm">
                                <Download className="w-4 h-4" />
                                Export
                            </button>
                            <Button onClick={async ()=>{
                                setLoading(true)
                                const data = Array.isArray(await api.listPersonnel(1000)) ? await api.listPersonnel(1000) : [];
                                setPersonnel(data);
                                setLoading(false)
                            }} variant="ghost" className="px-4 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-50 flex items-center gap-2 text-sm">
                                <LoaderPinwheel className="w-4 h-4" />
                            </Button>
                        </div>

                        {filterOpen && (
                            <div className="mt-3 bg-white border border-neutral-200 absolute right-0 max-h-80 overflow-y-scroll rounded-lg p-4 shadow-sm w-64 z-30">

                                {!selectedFilter && (
                                    <div className="space-y-1">
                                        {filterOptions.map((opt) => (
                                            <button
                                                key={opt.key}
                                                onClick={() => setSelectedFilter(opt.key)}
                                                className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-neutral-100"
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {selectedFilter && !filterValue && (
                                    <div className="space-y-1">
                                        <button
                                            onClick={() => setSelectedFilter(null)}
                                            className="text-xs text-neutral-500 underline mb-2"
                                        >
                                            Back
                                        </button>

                                        {Array.from(
                                            new Set(
                                                workers
                                                    .flatMap((w) => {
                                                        const val = getField(w, selectedFilter);
                                                        return Array.isArray(val) ? val : [val];
                                                    })
                                                    .filter(Boolean)
                                            )
                                        ).map((value) => (
                                            <button
                                                key={String(value)}
                                                onClick={() => {
                                                    setFilterValue(String(value));
                                                    setFilterOpen(false); // Auto-close on selection
                                                }}
                                                className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-neutral-100"
                                            >
                                                {String(value)}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {selectedFilter && filterValue && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-neutral-700">
                                            {selectedFilter}: <strong>{filterValue}</strong>
                                        </span>
                                        <button
                                            onClick={() => {
                                                setSelectedFilter(null);
                                                setFilterValue(null);
                                            }}
                                            className="text-xs text-neutral-500 underline"
                                        >
                                            Clear
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="overflow-x-auto w-100 md:w-270 overflow-y-scroll flex flex-col">
                        <table className="overflow-x-scroll">
                            <thead className="bg-neutral-50 border-b border-neutral-200">
                            <tr>
                                {[
                                    "Worker ID",
                                    "Name",
                                    "Role",
                                    "District",
                                    "Status",
                                    "Certifications",
                                    "Competencies",
                                    "Actions",
                                ].map((h) => (
                                    <th
                                        key={h}
                                        className="px-3 py-2 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
                                        style={{ minWidth: h === "Name" ? 180 : 80 }}
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                            </thead>

                            <tbody className="divide-y divide-neutral-200 bg-white">
                            {filteredWorkers.map((worker, index) => (
                                <tr  key={worker.id} className="hover:bg-neutral-50">

                                    <td className="px-3 py-1 text-xs whitespace-nowrap">
                                        {worker.personnel_identifier ?? worker.personnel_id ?? "—"}
                                    </td>

                                    <td className="px-3 py-1 text-xs whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xs font-medium">
                                                {formatInitials(worker)}
                                            </div>
                                            <span className="text-sm font-medium text-neutral-900">
                                                {worker.first_name} {worker.last_name}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="px-3 py-1 text-xs whitespace-nowrap">
                                        {cadres[index]?.name ?? "—"}
                                    </td>

                                    <td className="px-3 py-1 text-xs whitespace-nowrap">
                                        {worker.metadata.district ?? "—"}
                                    </td>

                                    <td className="px-3 py-1 text-xs whitespace-nowrap">
                                        <span
                                            className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
        worker.metadata?.worker_status[1] === "Deployed"
            ? "bg-emerald-100 text-emerald-700"
            : worker.metadata?.worker_status[1] === "Available"
                ? "bg-blue-100 text-blue-700"
                : worker.metadata?.worker_status[1] === "On Leave"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-neutral-100 text-neutral-700"
    }`}
                                        >
                                            {worker.metadata.worker_status[1] ?? "—"}
                                        </span>
                                    </td>

                                    <td className="px-3 py-1 text-xs whitespace-nowrap">
                                        {worker.qualifications ?? "—"}
                                    </td>

                                    <td className="px-2 py-1 text-xs whitespace-nowrap">
                                        <div className="flex flex-wrap gap-1 max-h-6 overflow-y-scroll">
                                            {Array.isArray(worker.metadata?.competencies) &&
                                                worker.metadata.competencies.map((c: string, i: number) => (
                                                    <span
                                                        key={i}
                                                        className="px-2 py-1 bg-neutral-100 text-neutral-700 rounded-md text-xs"
                                                    >
                                                        {c}
                                                    </span>
                                                ))}
                                        </div>
                                    </td>

                                    <td className="px-3 py-1 text-xs whitespace-nowrap">
                                        <Popover>
                                            <PopoverTrigger asChild placement="top">
                                                <button className="p-1.5 hover:bg-neutral-100 rounded-md">
                                                    <MoreVertical className="w-4 h-4 text-neutral-600" />
                                                </button>
                                            </PopoverTrigger>
                                            <PopoverContent className="p-2 bg-gray-100 border-1 border-gray-200 space-y-2">
                                                <p className="flex cursor-pointer flex-row items-center justify-start gap-2"><Trash2 size={11} className="text-xs text-red-600" /> Delete</p>
                                                <p className="flex cursor-pointer flex-row items-center justify-start gap-2" onClick={()=>{
                                                    setSelectedWorker(worker); onNavigate("worker profile");
                                                }}><User2 size={11} className="text-xs text-gray-600" /> View profile</p>
                                            </PopoverContent>
                                        </Popover>
                                    </td>

                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-neutral-200">
                        <p className="text-sm text-neutral-600">
                            Showing {filteredWorkers.length} of {workers.length} workers
                        </p>
                    </div>
                </div>
            </>
        )}
        {loading && <div className="h-full mt-40 w-full flex justify-center items-center"><Loader2 className="animate-spin ease-linear" /></div>}
    </div>
);

}
