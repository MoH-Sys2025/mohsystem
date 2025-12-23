import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

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
    Trash2, User2, FileSpreadsheet, FileText, File
} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {districts} from "@/supabase/districts"
import {api, EXPORT_COLUMNS, exportCSV, exportExcel, exportPDF, exportText} from "@/supabase/Functions.tsx";
import {useSelectedMOHData} from "@/components/DataContext.tsx";
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
    const [available, setAvailable] = useState<number>(0);
    const [unemployed, setUnimployed] = useState<number>(0);
    const [deployed, setDeployed] = useState<number>(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterOpen, setFilterOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
    const [filterValue, setFilterValue] = useState<string | null>(null);

    const [exportDialogOpen, setExportDialogOpen] = useState(false);
    const [exportType, setExportType] = useState<"pdf" | "csv" | "excel" | "txt" | null>(null);
    const [fileName, setFileName] = useState("workforce_registry");
    const [selectedColumns, setSelectedColumns] = useState(
        EXPORT_COLUMNS.map(c => c.label) // default: all columns selected
    );

    const { setSelectedMOHData } = useSelectedMOHData();

    function handleExport() {
        if (!exportType) return;

        const safeName = fileName
            .trim()
            .replace(/[^\w\-]+/g, "_")
            .toLowerCase();

        switch (exportType) {
            case "csv":
                exportCSV(filteredWorkers, safeName, selectedColumns); // pass filename
                break;
            case "excel":
                exportExcel(filteredWorkers, safeName, selectedColumns);
                break;
            case "pdf":
                exportPDF(filteredWorkers, safeName, selectedColumns);
                break;
            case "txt":
                exportText(filteredWorkers, safeName, selectedColumns);
                break;
        }
    }


    useEffect(() => {
    async function fetchPersonnel() {
        try {
            const data = await api.listPersonnel(1000);
            const cadresData = await api.listCadres(1000);

            setPersonnel(Array.isArray(data) ? data : []);
            setCadres(Array.isArray(cadresData) ? cadresData : []);
            const totalAvailable = data.filter(
                item => item.metadata?.worker_status?.includes("Available")
            ).length;

            const totalDeployed = data.filter(
                item => item.metadata?.worker_status?.includes("Deployed")
            ).length;

            const totalUnemployed = data.filter(
                item => item.employment_status.includes("Unemployed")
            ).length;

            setAvailable(totalAvailable);
            setDeployed(totalDeployed);
            setUnimployed(totalUnemployed);
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
    role: "role",
    district: "metadata.district",
    status: "metadata.worker_status",
    certifications: "qualifications",
    competencies: "metadata.competencies",
};

    function getField(worker: any, key: string | null) {
        if (!key) return null;
        const path = fieldMap[key];
        if (!path) return null;

        const value = path.split(".").reduce((obj: any, p: string) => obj?.[p], worker);

        // ✅ If worker_status array → return meaningful value
        if (key === "status" && Array.isArray(value)) {
            return value[1] ?? value[0]; // uses "Deployed", "Available", etc
        }

        return value;
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
function percentage(perValue, value1, value2) {
    return (perValue*100/(value1+value2));
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
        <div className="flex flex-col md:flex-row md:items-start lg:items-center justify-between">
            <div>
                <h1 className="text-neutral-900 mb-2">Workforce Registry</h1>
                <p className="text-neutral-500">
                    Manage and monitor healthcare workers across Malawi
                </p>
            </div>
            <Button className="text-sm cursor-pointer bg-gray-100 border-2 px-3 border-dashed rounded-lg" variant="secondary" size="lg" onClick={()=>onNavigate('add worker')}>+ Add Health Worker</Button>
        </div>

        {!loading && (
            <>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-2 md:hidden">
                    {[workers.length, deployed, available, workers.length-deployed-available, workers.length-unemployed, unemployed].map((value, i) => (
                        <div key={i} className="bg-white  cursor-pointer rounded-xl border border-neutral-200 p-2 col-span-1  md:col-span-1">
                            <p className="text-sm text-neutral-500 mb-1 flex flex-row items-center px-2 justify-between gap-4">
                                {["Total Workers", "Deployed", "Available", "Pending", "Employed", "Unemployed"][i]} : <span className="text-black text-lg">{[value][0]}</span>
                            </p>
                        </div>
                    ))}
                </div>
                <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden relative">
                    <div className="p-6 py-3 border-b border-neutral-200 space-y-2">
                        <div className="grid-cols-2 md:grid-cols-6 gap-2 hidden md:grid">
                            {[workers.length, deployed, available, workers.length-deployed-available, workers.length-unemployed, unemployed].map((value, i) => (
                                <div key={i} className="bg-white  cursor-pointer rounded-xl border border-neutral-200 p-2 col-span-1  md:col-span-2 lg:col-span-1">
                                    <p className="text-sm text-neutral-500 mb-1 flex flex-row items-center px-2 justify-between gap-4">
                                        {["Total Workers", "Deployed", "Available", "Pending", "Employed", "Unemployed"][i]} : <span className="text-black text-lg">{[value][0]}</span>
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-12 gap-2 md:gap-1">
                            <div className="relative md:col-span-9 col-span-12">

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
                                className="px-4 py-2 bg-white border border-neutral-200 col-span-7 md:col-span-1 text-neutral-700 rounded-lg hover:bg-neutral-50 flex items-center gap-2 text-sm">
                                <Filter className="w-4 h-4" />
                                Filters
                            </button>

                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="col-span-3 md:col-span-1 flex items-center gap-2"
                                    >
                                        <Download className="w-4 h-4" />
                                        Export
                                    </Button>
                                </PopoverTrigger>

                                <PopoverContent
                                    align="end"
                                    className="w-40 p-2 z-20"
                                >
                                    <button
                                        onClick={() => {
                                            setExportType("pdf");
                                            setExportDialogOpen(true);
                                        }}
                                        className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md hover:bg-neutral-100"
                                    >
                                        <FileText className="w-4 h-4" />
                                        PDF
                                    </button>

                                    <button
                                        onClick={() => {
                                            setExportType("csv");
                                            setExportDialogOpen(true);
                                        }}
                                        className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md hover:bg-neutral-100"
                                    >
                                        <File className="w-4 h-4" />
                                        CSV
                                    </button>

                                    <button
                                        onClick={() => {
                                            setExportType("excel");
                                            setExportDialogOpen(true);
                                        }}
                                        className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md hover:bg-neutral-100"
                                    >
                                        <FileSpreadsheet className="w-4 h-4" />
                                        Excel
                                    </button>
                                    <button
                                        onClick={() => {
                                            setExportType("txt");
                                            setExportDialogOpen(true);
                                        }}
                                        className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md hover:bg-neutral-100"
                                    >
                                        <FileSpreadsheet className="w-4 h-4" />
                                        Text
                                    </button>
                                </PopoverContent>
                            </Popover>

                            <Button onClick={async ()=>{
                                setLoading(true)
                                const data = Array.isArray(await api.listPersonnel(1000)) ? await api.listPersonnel(1000) : [];
                                setPersonnel(data);
                                setLoading(false)
                            }} variant="ghost" className=" w-10 ml-auto  bg-white border col-span-1 border-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-50 text-xs">
                                <Loader2 className="w-2 h-2" />
                            </Button>
                        </div>

                        {filterOpen && (
                            <div className="mt-3 bg-white border border-neutral-200 z-99 top-25 absolute right-0 max-h-80 overflow-y-scroll rounded-lg p-4 shadow-sm w-64">

                                {!selectedFilter && (
                                    <div className="space-y-1">
                                        {filterOptions.map((opt) => (
                                            <button
                                                key={opt.key}
                                                onClick={() => setSelectedFilter(opt.key)}
                                                className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-neutral-100">
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

                    <div className="overflow-x-auto">
                        <div className={`min-w-[700px]`}>
                            <Table className="w-full">
                                <TableHeader>
                                    <TableRow>
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
                                            <TableHead
                                                key={h}
                                                className={`text-xs uppercase tracking-wider px-3 py-2 text-left
            ${["Certifications"].includes(h) ? "hidden md:table-cell" : ""}
            ${h === "Actions" ? "sticky right-0 top-0 bg-neutral-50 z-30" : ""}
          `}
                                                style={{ minWidth: h === "Name" ? 100 : 60 }}
                                            >
                                                {h}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {filteredWorkers.map((worker, index) => (
                                        <TableRow key={worker.id} className="hover:bg-neutral-50">
                                            <TableCell className="px-3 py-1 text-xs whitespace-nowrap">
                                                {worker.personnel_identifier ?? worker.personnel_id ?? "—"}
                                            </TableCell>

                                            <TableCell className="px-3 py-1 text-xs">
                                                <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-neutral-900">
              {worker.first_name} {worker.last_name}
            </span>
                                                </div>
                                            </TableCell>

                                            <TableCell className="px-3 py-1 text-xs">
                                                {cadres[index]?.name ?? "—"}
                                            </TableCell>

                                            <TableCell className="px-3 py-1 text-xs">
                                                {worker.metadata.district ?? "—"}
                                            </TableCell>

                                            <TableCell className="px-3 py-1 text-xs">
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
                                            </TableCell>

                                            <TableCell className="hidden md:table-cell px-3 py-1 text-xs">
                                                {worker.qualifications ?? "—"}
                                            </TableCell>

                                            <TableCell className="px-2 py-1 text-xs">
                                                <div className="flex flex-wrap gap-1 max-h-6 max-w-[220px] overflow-y-scroll">
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
                                            </TableCell>

                                            <TableCell className="px-3 py-1 text-xs sticky right-0 bg-white z-10 shadow-[-4px_0_6px_-4px_rgba(0,0,0,0.1)]">
                                                <Popover>
                                                    <PopoverTrigger asChild placement="top">
                                                        <button className="p-1.5 hover:bg-neutral-100 rounded-md">
                                                            <MoreVertical className="w-4 h-4 text-neutral-600" />
                                                        </button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="p-2 bg-white shadow-sm border border-gray-200 space-y-2 w-50 ml-auto z-20">
                                                        <p className="flex cursor-pointer items-center gap-2">
                                                            <Trash2 size={11} className="text-xs text-red-600" /> Delete
                                                        </p>
                                                        <p
                                                            className="flex cursor-pointer items-center gap-2"
                                                            onClick={() => {
                                                                setSelectedMOHData(worker);
                                                                onNavigate("worker profile");
                                                            }}
                                                        >
                                                            <User2 size={11} className="text-xs text-gray-600" /> View
                                                            profile
                                                        </p>
                                                    </PopoverContent>
                                                </Popover>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
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
        <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        Export {exportType?.toUpperCase()}
                    </DialogTitle>
                </DialogHeader>

                <div className="mt-4 space-y-1">
                    <p className="text-sm font-medium">Select Columns</p>
                    {EXPORT_COLUMNS.map(c => (
                        <label key={c.label} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={selectedColumns.includes(c.label)}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setSelectedColumns(prev => [...prev, c.label]);
                                    } else {
                                        setSelectedColumns(prev => prev.filter(l => l !== c.label));
                                    }
                                }}
                            />
                            <span className="text-sm">{c.label}</span>
                        </label>
                    ))}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">File name</label>
                    <Input
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                        placeholder="Enter file name"
                    />
                    <p className="text-xs text-neutral-500">
                        Extension will be added automatically
                    </p>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setExportDialogOpen(false)}>
                        Cancel
                    </Button>

                    <Button
                        disabled={!fileName.trim()}
                        onClick={() => {
                            handleExport(); // 🔹 Make sure this function receives the current filename
                            setExportDialogOpen(false);
                        }}
                    >
                        Download
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>




    </div>
);

}
