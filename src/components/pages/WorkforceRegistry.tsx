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
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
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
    Trash2, User2, FileSpreadsheet, FileText, File, ChevronDown, Users, UserCheck, LoaderIcon, BriefcaseMedical,
    UsersRoundIcon, Truck, CheckCircle, Clock, Briefcase, XCircle, Circle, ArrowLeft
} from "lucide-react";
import {Button} from "@/components/ui/button";
import {
    api,
    EXPORT_COLUMNS,
    exportCSV,
    exportExcel,
    exportPDF,
    exportText,
    useElementSize
} from "@/supabase/Functions.tsx";
import {useSelectedMOHData} from "@/components/DataContext.tsx";
import {Popover} from "@/components/ui/popover.tsx";
import {PopoverContent, PopoverPortal, PopoverTrigger} from "@radix-ui/react-popover";
import {useSession} from "@/contexts/AuthProvider.tsx";
import {toast} from "sonner";
import { useNavigate } from "react-router-dom";
interface WorkforceRegProps {
    onNavigate: (page: string) => void;
}

export function WorkforceRegistry({ onNavigate }: WorkforceRegProps) {
    type SortDir = "asc" | "desc" | null;

    const [selectedWorkerIds, setSelectedWorkerIds] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState<string | null>(null);
    const [sortDir, setSortDir] = useState<SortDir>(null);

    const [deleteHCWDia, setDeleteHCWDia] = useState<boolean>(false);
    const [selectedHCW, setSelectedHCW] = useState({});
    const { ref, size } = useElementSize<HTMLDivElement>();
    const contentWidth = size.width - size.paddingLeft - size.paddingRight;

    const navigate = useNavigate();
    const [workers, setPersonnel] = useState<any[]>([]);
    const [cadres, setCadres] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const session = useSession();
    const [searchTerm, setSearchTerm] = useState("");
    const [filterOpen, setFilterOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
    const [filterValue, setFilterValue] = useState<string | null>(null);

    const [exportDialogOpen, setExportDialogOpen] = useState(false);
    const [exportType, setExportType] = useState<"pdf" | "csv" | "excel" | "txt" | null>(null);
    const [fileName, setFileName] = useState("Healthcare Employees Registry");
    const [selectedColumns, setSelectedColumns] = useState(EXPORT_COLUMNS.map(c => c.label) // default: all columns selected
    );

    const [exportKey, setExportKey] = useState(0);

    const { setSelectedMOHData } = useSelectedMOHData();

    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 100; // 100 rows per page

    const SORT_FIELDS: Record<string, (w: any) => any> = {
        id: (w) => w.personnel_identifier ?? w.personnel_id,
        name: (w) => `${w.first_name ?? ""} ${w.last_name ?? ""}`,
        cadre: (w) => w.cadre_name?.toLowerCase() ?? "",
        role: (w) => w.role ?? "",
        district: (w) => w.metadata?.district ?? "",
        status: (w) => w.metadata?.worker_status?.[1] ?? "",
        certifications: (w) => w.qualifications ?? "",
    };

    const toggleWorkerSelection = (id: string) => {
        setSelectedWorkerIds(prev =>
            prev.includes(id)
                ? prev.filter(wid => wid !== id)
                : [...prev, id]
        );
    };

    const toggleSelectAllWorkers = () => {
        if (pageWorkers.every(w => selectedWorkerIds.includes(w.id)))
        {
            setSelectedWorkerIds([]);
        } else {
            setSelectedWorkerIds(pageWorkers.map(w => w.id));
        }
    };

    const HEADER_TO_SORT_KEY: Record<string, string | null> = {
        "Worker ID": "id",
        "Name": "name",
        "Cadre": "cadre",
        "Role": "role",
        "District": "district",
        "Trainings": null,
        "Competencies": null, // not sortable
        "Status": "status",
        "Certifications": "certifications",
        "Actions": null,       // not sortable
    };

    function getExportRows() {
        if (selectedWorkerIds.length > 0) {
            return sortedWorkers.filter(w =>
                selectedWorkerIds.includes(w.id)
            );
        }

        return sortedWorkers; // respects search + filters + sorting
    }

    function handleExport() {
        if (!exportType) return;

        const rows = getExportRows();

        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const safeName = `${fileName}_${timestamp}`;

        switch (exportType) {
            case "csv":
                exportCSV(rows, safeName, selectedColumns);
                break;
            case "excel":
                exportExcel(rows, safeName, selectedColumns);
                break;
            case "pdf":
                exportPDF(rows, safeName, selectedColumns);
                break;
            case "txt":
                exportText(rows, safeName, selectedColumns);
                break;
        }

        // 🔴 CRITICAL RESET
        setExportType(null);
    }

    async function fetchPersonnel() {
        setLoading(true);
        try {
            const data = await api.listPersonnel(); // batch-fetching version
            const cadresData = Array.isArray(await api.listCadres(1000)) ? await api.listCadres(1000) : [];
            setCadres(cadresData);

            const mappedWorkers = data.map(worker => {
                const cadre = cadresData.find(c => String(c.id) === String(worker.cadre_id));
                return { ...worker, cadre_name: cadre?.name ?? "—" };
            });

            setPersonnel(mappedWorkers);
        } catch (err: any) {
            setError(err?.message ?? String(err));
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchPersonnel();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterValue]);


    const filterOptions = [
    { key: "cadre", label: "Cadre" },
    { key: "role", label: "Role" },
    { key: "district", label: "District" },
    { key: "status", label: "Status" },
    { key: "trainings", label: "Trainings" },
    { key: "certifications", label: "Certifications" },
    { key: "competencies", label: "Competencies" },
    ];

const fieldMap: Record<string, string | null> = {
    cadre: "cadre",
    role: "role",
    district: "metadata.district",
    status: "metadata.worker_status",
    trainings: "trainings",
    certifications: "qualifications",
    competencies: "metadata.competencies",
};

    const normalizeForSearch = (val: any) =>
        val === null || val === undefined
            ? ""
            : typeof val === "object"
                ? JSON.stringify(val)
                : String(val);

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

    const searchedWorkers = workers.filter(worker => {
        const search = searchTerm.toLowerCase().trim();
        if (!search) return true;

        return [
            worker.personnel_identifier,
            worker.personnel_id,
            worker.first_name,
            worker.last_name,
            worker.role,
            worker.cadre_name,
            worker.metadata?.district,
        ]
            .filter(Boolean)
            .some(v => String(v).toLowerCase().includes(search));
    });

    const filteredWorkers = searchedWorkers.filter(worker => {
        if (!selectedFilter || !filterValue) return true;

        const fieldValue = getField(worker, selectedFilter);

        if (Array.isArray(fieldValue)) {
            return fieldValue.map(String).includes(filterValue);
        }

        return String(fieldValue ?? "") === filterValue;
    });


    const sortedWorkers = [...filteredWorkers].sort((a, b) => {
        if (!sortBy || !sortDir) return 0;

        const av = SORT_FIELDS[sortBy]?.(a);
        const bv = SORT_FIELDS[sortBy]?.(b);

        if (av == null) return 1;
        if (bv == null) return -1;

        return sortDir === "asc"
            ? String(av).localeCompare(String(bv))
            : String(bv).localeCompare(String(av));
    });

// then slice for page
    const pageWorkers = sortedWorkers.slice((currentPage - 1) * pageSize, currentPage * pageSize);



    const stats = {
        total: filteredWorkers.length,

        deployed: filteredWorkers.filter(
            w => w.metadata?.worker_status?.includes("Deployed")
        ).length,

        available: filteredWorkers.filter(
            w => w.metadata?.worker_status?.includes("Available")
        ).length,

        unemployed: filteredWorkers.filter(
            w => w.employment_status?.includes("Unemployed")
        ).length,
    };

    stats.pending = stats.total - stats.deployed - stats.available;
    stats.employed = stats.total - stats.unemployed;


if (error)
    return (
        <div className="flex items-center gap-2 text-red-500 p-6">
            <Info /> Error loading table data.
        </div>
    );
    const statsIcons = [
        <Users size={15} />,
        <Truck size={15} />,
        <CheckCircle size={15} />,
        <Clock size={15} />,
        <Briefcase size={15} />,
        <XCircle size={15} />
    ];

    function SortHeader({
                            label,
                            columnKey,
                        }: {
        label: string;
        columnKey: string;
    }) {
        return (
            <div className="flex items-center justify-between gap-1">
                <span>{label}</span>

                <Popover >
                    <PopoverTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 p-0 text-neutral-500"
                        >
                            <ChevronDown
                                className={`h-4 w-4 ${
                                    sortBy === columnKey ? "text-blue-600" : "text-neutral-500"
                                }`}
                            />

                        </Button>
                    </PopoverTrigger>

                    <PopoverContent className="w-32 flex flex-col p-1 bg-white shadow-md rounded-md z-11">
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

return (
    <div ref={ref} className="space-y-8 p-6 px-3">
        <div className="flex flex-col md:flex-row md:items-start lg:items-center justify-between">
            <div>
                <h1 className="text-neutral-900 mb-2">Workforce Registry</h1>
                <p className="text-neutral-500">
                    Manage and monitor healthcare workers across Malawi
                </p>
            </div>
            <Button className="text-sm cursor-pointer bg-gray-100 border-2 px-3 border-dashed rounded-lg" variant="secondary" size="lg" onClick={()=>navigate("/dashboard/workregistry/addworker")}>+ Add Health Worker</Button>
        </div>
        <>
            <div className="grid grid-cols-6 md:grid-cols-6 gap-1 md:hidden">
                {[
                    stats.total,
                    stats.deployed,
                    stats.available,
                    stats.pending,
                    stats.employed,
                    stats.unemployed
                ].map((value, i) => (
                    <div key={i} className="text-sm text-neutral-800 mb-1 flex flex-row items-center px-2 justify-between gap-1 bg-gray-200  cursor-pointer rounded-xl border border-neutral-200 p-2 sm:col-span-2 col-span-3  md:col-span-1 lg:col-span-2">
                        <span className="gap-1 flex flex-row items-center">{statsIcons[i] ?? <Circle size={18} />} {["Total HCW", "Deployed", "Available", "Pending", "Employed", "Unemployed"][i]}</span> <span className="text-black text-md">{[value][0]}</span>
                    </div>
                ))}
            </div>
            <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden relative">
                <div className="md:p-6 p-2 py-3 border-b border-neutral-200 space-y-1">
                    <div className="grid-cols-2 md:grid-cols-6 gap-1 hidden md:grid">
                        {[
                            stats.total,
                            stats.deployed,
                            stats.available,
                            stats.pending,
                            stats.employed,
                            stats.unemployed,
                        ].map((value, i) => (
                            <div key={i} className="bg-gray-100  cursor-pointer rounded-xl border border-neutral-200 p-2 col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-1">
                                <p className="text-sm text-neutral-800 mb-1 flex flex-row items-center justify-between gap-1 mx-2">
                                    <span className="flex flex-row items-center gap-2 justify-start">{statsIcons[i] ?? <Circle size={15} />}{["Total HCW", "Deployed", "Available", "Pending", "Employed", "Unemployed"][i]}</span> <span className="text-black text-md"> {[value][0]}</span>
                                </p>
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-12 gap-1 md:gap-2">
                        <div className="relative sm:col-span-12 md:col-span-6 lg:col-span-7 col-span-12">

                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                            <input type="text"
                                   placeholder="Search by name, ID, or role..."
                                   value={searchTerm}
                                   onChange={(e) => setSearchTerm(e.target.value)}
                                   className="w-full pl-10 pr-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm"
                            />
                        </div>

                        <div className="col-span-12 grid grid-cols-3 md:grid-cols-4 wrap-anywhere flex-wrap flex-row md:col-span-6 lg:col-span-5 justify-start items-center gap-1 lg:gap-2">
                            <Popover open={filterOpen} onOpenChange={setFilterOpen}>
                                <PopoverTrigger className="hidden" asChild>
                                    <Button variant="ghost" className="px-3 flex flex-row gap-2 py-2 border font-normal text-xs items-center rounded-md">
                                        <Filter size={8} className="w-8 h-8" />
                                        Filter
                                    </Button>
                                </PopoverTrigger>

                                <PopoverContent
                                    align="start"
                                    sideOffset={8}
                                    className="w-50 max-h-80 overflow-y-auto p-1 bg-white z-10 shadow-md rounded-md"
                                >
                                    {/* STEP 1: Choose filter */}
                                    {!selectedFilter && (
                                        <div className="space-y-0">
                                            {filterOptions.map((opt) => (
                                                <Button
                                                    key={opt.key}
                                                    variant="ghost"

                                                    onClick={() => setSelectedFilter(opt.key)}
                                                    className="w-full justify-start text-left px-3 font-normal  text-xs rounded-md hover:bg-neutral-100"
                                                >
                                                    {opt.label}
                                                </Button>
                                            ))}
                                        </div>
                                    )}

                                    {/* STEP 2: Choose value */}
                                    {selectedFilter && !filterValue && (
                                        <div className="space-y-1">
                                            <Button
                                                variant="ghost"
                                                onClick={() => setSelectedFilter(null)}
                                                className="text-xs justify-start flex text-neutral-500 underline mb-2"
                                            >
                                                Back
                                            </Button>

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
                                                <Button
                                                    key={String(value)}
                                                    onClick={() => {
                                                        setFilterValue(String(value));
                                                        setFilterOpen(false); // auto close
                                                    }}
                                                    variant="ghost"
                                                    className="w-full flex justify-start text-left px-3 py-2 text-sm rounded-md hover:bg-neutral-100"
                                                >
                                                    {String(value)}
                                                </Button>
                                            ))}
                                        </div>
                                    )}

                                    {/* STEP 3: Selected */}
                                    {selectedFilter && filterValue && (
                                        <div className="flex items-center justify-between">
                                <span className="text-sm text-neutral-700">
                                  {selectedFilter}: <strong>{filterValue}</strong>
                                </span>

                                            <Button
                                                onClick={() => {
                                                    setSelectedFilter(null);
                                                    setFilterValue(null);
                                                }}
                                                variant="ghost"
                                                className="text-xs text-neutral-500 underline "
                                            >
                                                Clear
                                            </Button>
                                        </div>
                                    )}
                                </PopoverContent>
                            </Popover>

                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="justify-start text-left px-3 font-normal text-xs rounded-md hover:bg-neutral-100">
                                        <Download className="w-4 h-4" />
                                        Export
                                    </Button>
                                </PopoverTrigger>

                                <PopoverContent align="start" className="w-40 p-1 pb-2 z-10 bg-white shadow-md rounded-sm">
                                    <Button
                                        onClick={() => {
                                            setExportType("pdf");
                                            setExportDialogOpen(true);
                                        }}
                                        variant="ghost"
                                        className="w-full justify-start text-left px-3 font-normal  text-xs rounded-md hover:bg-neutral-100"
                                    >
                                        <FileText className="w-4 h-4" />
                                        PDF
                                    </Button>

                                    <Button
                                        onClick={() => {
                                            setExportType("csv");
                                            setExportDialogOpen(true);
                                        }}
                                        variant="ghost"
                                        className="w-full justify-start text-left px-3 font-normal  text-xs rounded-md hover:bg-neutral-100"
                                    >
                                        <File className="w-4 h-4" />
                                        CSV
                                    </Button>

                                    <Button
                                        onClick={() => {
                                            setExportType("excel");
                                            setExportDialogOpen(true);
                                        }}
                                        variant="ghost"
                                        className="w-full justify-start text-left px-3 font-normal  text-xs rounded-md hover:bg-neutral-100"
                                    >
                                        <FileSpreadsheet className="w-4 h-4" />
                                        Excel
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            setExportType("txt");
                                            setExportDialogOpen(true);
                                        }}
                                        variant="ghost"
                                        className="w-full justify-start text-left px-3 font-normal  text-xs rounded-md hover:bg-neutral-100"
                                    >
                                        <FileSpreadsheet className="w-4 h-4" />
                                        Text
                                    </Button>
                                </PopoverContent>
                            </Popover>

                            <Button disabled={loading} onClick={
                                ()=> fetchPersonnel()
                            } variant="outline" className=" justify-start md:ml-auto text-left px-3 font-normal text-xs rounded-md hover:bg-neutral-100">
                                <Loader2 className={`w - 2 h-2 ${loading ? 'animate-spin text-red-500' : 'animate-none text-neutral-800'}`} /> Reload
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={(selectedWorkerIds.length <= 0)}
                                onClick={() => setDeleteHCWDia(true)}
                                className={`ml - 2`}
                            >
                                <Trash2 className="w-4 h-4 text-red-600" />
                                ({selectedWorkerIds.length})
                            </Button>
                        </div>

                    </div>

                </div>

                <div className="overflow-x-auto overflow-y-auto max-h-[600px] border border-neutral-200">
                    <div className={`overflow-x-scroll truncate`} style={{maxWidth: size.width-20, width: contentWidth-20 || undefined }}>

                        <Table className="w-full min-w-[800px]">
                            <TableHeader>
                                <TableRow className="z-3">
                                    {[
                                        "Worker ID",
                                        "Name",
                                        "Cadre",
                                        "Role",
                                        "District",
                                        "Trainings",
                                        "Competencies",
                                        "Status",
                                        "Certifications",
                                        "Actions",
                                    ].map((h) => (
                                        <TableHead
                                            key={h}
                                            className={`sticky top-0 text-xs uppercase tracking-wider px-3 py-2 text-left
                                                ${[""].includes(h) ? "hidden md:table-cell" : ""}
                                                ${h === "Actions" ? "sticky right-0 z-2 bg-white shadow-[-4px_0_6px_-4px_rgba(0,0,0,0.15)]" : ""}
                                              `}
                                            style={{ minWidth: h === "Name" ? 100 : 60 }}>
                                            {HEADER_TO_SORT_KEY[h] ? (
                                                <SortHeader label={
                                                    (h === "Worker ID") ? <span className="flex flex-row items-center gap-1"><input
                                                        type="checkbox"
                                                        checked={
                                                            sortedWorkers.length > 0 &&
                                                            selectedWorkerIds.length === sortedWorkers.length
                                                        }
                                                        onChange={toggleSelectAllWorkers}
                                                    /> {h} </span> : h
                                                } columnKey={HEADER_TO_SORT_KEY[h]!} />
                                            ) : (
                                                <span>{h}</span>
                                            )}

                                        </TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {pageWorkers.map(worker => (
                                    <TableRow key={worker.id} className="hover:bg-neutral-50">
                                        <TableCell className="px-3 py-1 text-xs whitespace-nowrap gap-1 flex flex-row items-center">
                                            <Input
                                                type="checkbox"
                                                className="scale-[0.6]"
                                                checked={selectedWorkerIds.includes(worker.id)}
                                                onChange={() => toggleWorkerSelection(worker.id)}
                                            />
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
                                            {worker.cadre_name}
                                        </TableCell>

                                        <TableCell className="px-3 py-1 text-xs">
                                            <div className="max-w-[200px] overflow-x-auto whitespace-nowrap overflow-y-hidden">
                                                {worker.role ?? "—"}</div>
                                        </TableCell>

                                        <TableCell className="px-3 py-1 text-xs">
                                            {worker.metadata.district ?? "—"}
                                        </TableCell>

                                        <TableCell  className="px-3 py-1 text-xs space-x-2 items-center max-w-60 border">
                                            <div className="max-w-[200px] overflow-x-auto whitespace-nowrap overflow-y-hidden">
                                                {Array.isArray(worker.trainings) && worker.trainings.length > 0 ? (
                                                    worker.trainings.map((t, index) => <span className="border-green-300 bg-green-100 border px-1 rounded-sm" key={index}>{t}</span>)
                                                ) : (
                                                    <span>—</span> // fallback if no trainings
                                                )}
                                            </div>
                                        </TableCell>

                                        <TableCell className="px-2 py-1 text-xs">
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
                                        </TableCell>

                                        <TableCell className="px-3 py-1 text-xs">
          <span
              className={` px-2 py-1 inline-flex rounded-full text-xs font-medium ${
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
                                        <TableCell className="px-3 py-1 text-xs">
                                            {worker.qualifications ?? "—"}
                                        </TableCell>

                                        <TableCell className=" sticky right-0 z-10 px-3 py-1 text-xs bg-white shadow-[-4px_0_6px_-4px_rgba(0,0,0,0.1)]">
                                            <Popover>
                                                <PopoverTrigger asChild placement="top">
                                                    <Button variant="outline" className="p-1.5 hover:bg-neutral-100 rounded-md">
                                                        <MoreVertical className="w-4 h-4 text-neutral-600" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="p-2 z-11 mr-26 bg-white shadow-md border border-gray-200 w-35 rounded-sm ml-auto">
                                                    <Button onClick={()=> {setDeleteHCWDia(true); setSelectedHCW(worker)}} variant="ghost" className="font-normal flex cursor-pointer w-full justify-start items-center gap-2">
                                                        <Trash2  className="w-4 h-4 text-red-600" /> Delete
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        className="flex justify-start cursor-pointer items-center gap-2 font-normal"
                                                        onClick={() => {
                                                            setSelectedMOHData(worker);
                                                            navigate("/dashboard/workregistry/profile")
                                                        }}
                                                    >
                                                        <User2 size={11} className="text-xs text-gray-600" /> View
                                                        profile
                                                    </Button>
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
                    <div className="flex justify-between items-center px-6 py-2 bg-white border-t border-neutral-200">
                        <Button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            variant="outline"
                        >
                            Previous
                        </Button>

                        <span>Page {currentPage} of {Math.ceil(filteredWorkers.length / pageSize)}</span>

                        <Button
                            disabled={currentPage === Math.ceil(filteredWorkers.length / pageSize)}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            variant="outline"
                        >
                            Next
                        </Button>
                    </div>

                </div>
            </div>
        </>
        <Dialog key={exportKey} open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        Export {exportType?.toUpperCase()}
                    </DialogTitle>
                </DialogHeader>

                <div className="mt-4 space-y-1">
                    <p className="text-sm font-medium">Select Columns</p>
                    <div className="flex flex-wrap flex-row gap-2 space-y-2">
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
                        variant="outline"
                        onClick={() => {
                            handleExport();
                            setTimeout(() => setExportDialogOpen(false), 200);
                        }}
                    >
                        Download
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        <AlertDialog open={deleteHCWDia}>
            <AlertDialogContent className="md:p-5 p-3 py-2 pt-5 lg:w-4/12 md:w-6/12 w-9/12">
                <AlertDialogHeader className="">
                    <AlertDialogTitle className="text-md">Are you sure you want to Delete ?</AlertDialogTitle>
                    <AlertDialogDescription className="text-sm">
                        Deleting a healthcare worker will remove them from the system and might affect deployments history.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="text-xs px-2" onClick={()=>setDeleteHCWDia(false)}>Cancel</AlertDialogCancel>
                    <AlertDialogAction className="text-xs px-2" onClick={
                        async () => {
                            setLoading(true);

                            const idsToDelete =
                                selectedWorkerIds.length > 0
                                    ? selectedWorkerIds
                                    : selectedHCW?.id
                                        ? [selectedHCW.id]
                                        : [];

                            if (idsToDelete.length === 0) {
                                setLoading(false);
                                return;
                            }

                            const { error } = await api.softDeleteHCWs(idsToDelete);

                            if (error) {
                                toast.error("Error deleting selected Healthcare workers");
                            }
                            await api.sendNotification(
                                session.user.id,
                                {
                                    title: "Healthcare Workers Removed",
                                    message: "Healthcare workers have been deleted.",
                                    type: "success",
                                    metadata: {
                                        user: session.user
                                    }
                                }
                            )
                            setDeleteHCWDia(false);
                            setSelectedWorkerIds([]);

                            const data = Array.isArray(await api.listPersonnel())
                                ? await api.listPersonnel()
                                : [];

                            setPersonnel(data);
                            setLoading(false);
                        }

                    }><Loader2 className={(loading) ? "animate-spin" : "hidden"} /> Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>
);

}
