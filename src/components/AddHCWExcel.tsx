import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import {ArrowRight, ArrowLeft, Download, Trash2, Search, Users, UserCheck2, Loader2} from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { competencyList } from "@/supabase/competencieslist";
import {api, useElementSize} from "@/supabase/Functions.tsx";
import { toast } from "sonner";
import { supabase } from "@/supabase/supabase.ts";

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog.tsx";
import {Input} from "@/components/ui/input.tsx";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,} from "@/components/ui/table";
import {useSession} from "@/contexts/AuthProvider.tsx";
import {useNavigate} from "react-router-dom";

export default function ExcelUploader() {
    const [rows, setRows] = useState([]);
    const [opendeleteDialog, setOpenDeleteDialog] = useState(false);
    const [uploaded, setUploaded] = useState(false);
    const [step, setStep] = useState(1);
    const [competencies, setCompetencies] = useState({});
    const session = useSession();
    const { ref, size } = useElementSize<HTMLDivElement>();
    const contentWidth = size.width - size.paddingLeft - size.paddingRight;

    const navigate = useNavigate();
    const [districts, setDistricts] = useState([]);
    const [facilities, setFacilities] = useState([]);
    const [cadres, setCadres] = useState([]);

    const [selectedFacility, setSelectedFacility] = useState({});

    // search + filters
    const [searchTerm, setSearchTerm] = useState("");
    const [columnFilters, setColumnFilters] = useState({});
    const [selectedRows, setSelectedRows] = useState<number[]>([]);

    const [isLoading, setIsLoading] = useState(false);

    const toggleRowSelection = (rowIndex: number) => {
        setSelectedRows((prev) =>
            prev.includes(rowIndex)
                ? prev.filter((i) => i !== rowIndex)
                : [...prev, rowIndex]
        );
    };

    const toggleSelectAll = () => {
        if (selectedRows.length === filteredRows.length) {
            setSelectedRows([]);
        } else {
            const indexes = filteredRows.map((_, i) => rows.indexOf(filteredRows[i]));
            setSelectedRows(indexes);
        }
    };

    const deleteSelectedRows = () => {
        if (selectedRows.length === 0) {
            toast.error("No rows selected");
            return;
        }

        setRows((prev) => prev.filter((_, i) => !selectedRows.includes(i)));
        setSelectedRows([]);
        toast.success(`${selectedRows[selectedRows.length-1]} Selected rows deleted`);

    };

    // ------------------------------------------------------------
    // LOAD LOOKUPS
    // ------------------------------------------------------------
    useEffect(() => {

        const loadLookups = async () => {
            const { data: d } = await supabase
                .from("administrative_regions")
                .select("id, name");

            const { data: f } = await supabase
                .from("health_facilities")
                .select("id, facility_name, district_id");

            const { data: c } = await supabase
                .from("cadres")
                .select("id, name");
            setDistricts(d || []);
            setFacilities(f || []);
            setCadres(c || []);
        };

        loadLookups();
    }, []);

    // ------------------------------------------------------------
    // HELPERS
    // ------------------------------------------------------------
    const getDistrictIdByName = (name) => {
        if (!name) return null;
        return (
            districts.find(
                (x) =>
                    x.name?.trim().toLowerCase() === name?.trim().toLowerCase()
            )?.id || null
        );
    };

    // ------------------------------------------------------------
// HELPERS
// ------------------------------------------------------------

    const normalizeTrainings = (value: any): string[] => {
        if (!value) return [];

        if (Array.isArray(value)) return value;

        return String(value)
            // split on comma(s), semicolon(s), or pipe(s)
            .split(/,+|;+|\|+/)
            .map((t) => t.trim())
            .filter(Boolean);
    };
    const safeArray = (value: any): string[] => {
        if (!value) return [];
        if (Array.isArray(value)) return value;
        return normalizeTrainings(value);
    };

    const getFacilitiesByDistrictName = (districtName) => {
        const district_id = getDistrictIdByName(districtName);
        if (!district_id) return [];
        return facilities.filter((f) => f.district_id === district_id);
    };

    const getCadreId = (name) =>
        cadres.find(
            (x) => x.name?.toLowerCase() === name?.toLowerCase()
        )?.id || null;

    const updateRow = (index, field, value) => {
        setRows((prev) => {
            const up = [...prev];
            up[index][field] = value;
            return up;
        });
    };

    // ------------------------------------------------------------
    // SUBMIT PERSONNEL
    // ------------------------------------------------------------
    const submitPersonnel = async () => {
        try {
            // Build the array of personnel records
            const payload = rows.map((row, index) => {
                const district_id = getDistrictIdByName(row.district);
                const cadre_id = row.cadre_id || getCadreId(row.cadre); // resolve cadre_id if not already present
                return {
                    first_name: row.first_name,
                    last_name: row.last_name,
                    email: row.email,
                    phone: row.phone,
                    other_names: row.other_names,
                    gender: row.gender,
                    role: row.position,
                    qualifications: [row.qualification],
                    cadre_id, // send the resolved cadre_id
                    current_facility_id: row.current_facility_id,
                    current_district_id: district_id,
                    employment_status: row.employment_status,
                    ihrmis_sync: false,
                    dhis2_sync: false,
                    metadata: {
                        age: row.age,
                        district: row.district,
                        facility_name: row.facility_name,
                        competencies: competencies[index],
                        worker_status: [row.employment_status, "Available"]
                    },
                    trainings: safeArray(row.trainings) || [],
                };
            });


            // Insert into personnel Table
            setIsLoading(true);
            const { error } = await supabase
                .from("personnel")
                .insert(payload);
            if (error) {
                toast.error("⚠️ Upload failed, Check some fields are not properly set");
                return;
            }

            toast.success("✅ Personnel successfully uploaded!");
            await api.sendNotification(
                session.user.id,
                {
                    title: "Healthcare Workers Registration",
                    message: rows.length + " have successfully been registered",
                    type: "Registration",
                    metadata: {
                        email: session.user.email
                    }
                }
            )
        } catch (err) {
            toast.error("⚠️ Unexpected error occurred.");
        }
        setIsLoading(false);
    };

    // ------------------------------------------------------------
    // TOGGLE COMPETENCY
    // ------------------------------------------------------------
    const toggleCompetency = (index, value) => {
        setCompetencies((prev) => {
            const current = prev[index] || [];
            if (current.includes(value)) {
                return { ...prev, [index]: current.filter((c) => c !== value) };
            } else {
                return { ...prev, [index]: [...current, value] };
            }
        });
    };

    // ------------------------------------------------------------
    // FILE UPLOAD (replace previous file on new upload)
    // ------------------------------------------------------------
    const handleFileUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // CLEAR previous file data
        setRows([]);
        setUploaded(false);
        setCompetencies({});
        setSelectedFacility({});
        setSearchTerm("");
        setColumnFilters({});

        const reader = new FileReader();
        reader.onload = (evt) => {
            const data = new Uint8Array(evt.target.result);
            const workbook = XLSX.read(data, { type: "array" });

            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            const headings = json[0] || [];
            const dataRows = json.slice(2);

            const normalized = dataRows
                .map((row) => {
                    let obj = {};
                    headings.forEach((h, i) => {
                        const key = (h || "").toString().trim();
                        if (!key) return;

                        if (key.toLowerCase() === "trainings") {
                            obj.trainings = normalizeTrainings(row[i]);
                            return;
                        }

                        if (key === "phone") {
                            obj[key] = row[i] ? row[i] : "";
                        } else {
                            obj[key] = row[i] ?? "";
                        }
                    });

                    return obj;
                })
                .filter((row) =>
                    // remove rows where all values are empty
                    Object.values(row).some(
                        (v) =>
                            v !== "" &&
                            v !== null &&
                            v !== undefined &&
                            String(v).trim() !== ""
                    )
                );

            setRows(normalized);
            setRows(
                normalized.map((r) => ({
                    ...r,
                    trainings: safeArray(r.trainings),
                }))
            );

            setUploaded(true);
        };

        reader.readAsArrayBuffer(file);

        // reset file input value so selecting same file again still triggers change
        e.target.value = "";
    };

    const applyFacilityToAll = (facility) => {
        // update visual selection
        const allSelected = {};
        rows.forEach((_, i) => {
            allSelected[i] = facility;
        });
        setSelectedFacility(allSelected);

        // update row data
        setRows((prev) =>
            prev.map((row) => ({
                ...row,
                current_facility_id: facility.id,
                facility_name: facility.facility_name,
            }))
        );

        toast.success(`Facility "${facility.facility_name}" applied to all rows`);
    };


    // ------------------------------------------------------------
    // FACILITY SELECTOR COMPONENT
    // ------------------------------------------------------------
    const FacilitySelector = ({ index }) => {
        const [open, setOpen] = useState(false);

        /**
         * Determine district safely:
         * - If index is null → GLOBAL selector
         * - If index is a number → ROW selector
         *
         * We derive district from the FIRST row for global,
         * assuming all rows are from the same district.
         */
        const districtName =
            index === null
                ? rows[0]?.district
                : rows[index]?.district;

        const facilityOptions = getFacilitiesByDistrictName(districtName);

        // Button label
        const label =
            index === null
                ? "Select Facility for ALL"
                : selectedFacility[index]?.facility_name || "Select Facility";

        return (
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        size="xs"
                        variant="outline"
                        className="text-[11px] p-1 px-2"
                    >
                        {label}
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="w-60 max-h-64 overflow-y-auto p-2">
                    <Command>
                        <CommandInput placeholder="Search facility..." />
                        <CommandEmpty>No facilities found.</CommandEmpty>

                        <CommandGroup>
                            {facilityOptions.map((f) => (
                                <CommandItem
                                    key={f.id}
                                    value={f.facility_name} // 👈 REQUIRED (prevents revert)
                                    onSelect={() => {
                                        if (index === null) {
                                            // 🌍 APPLY TO ALL
                                            applyFacilityToAll(f);
                                        } else {
                                            // 📄 APPLY TO SINGLE ROW
                                            setSelectedFacility((prev) => ({
                                                ...prev,
                                                [index]: f,
                                            }));

                                            updateRow(index, "current_facility_id", f.id);
                                            updateRow(index, "facility_name", f.facility_name);
                                        }

                                        setOpen(false); // 👈 CRITICAL: prevents auto reselect
                                    }}
                                >
                                    {f.facility_name}

                                    {index === null && (
                                        <span className="ml-auto text-xs text-blue-600">
                                        Apply to all
                                    </span>
                                    )}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </Command>
                </PopoverContent>
            </Popover>
        );
    };



    // ------------------------------------------------------------
    // FILTERED ROWS (apply search + column filters)
    // ------------------------------------------------------------
    const filteredRows = rows
        .filter((row) => {
            if (!searchTerm || searchTerm.trim() === "") return true;
            const term = searchTerm.toLowerCase();
            return Object.values(row).some((v) =>
                String(v || "").toLowerCase().includes(term)
            );
        })
        .filter((row) =>
            Object.entries(columnFilters).every(([col, val]) => {
                if (!val || String(val).trim() === "") return true;
                return String(row[col] || "").toLowerCase().includes(String(val).toLowerCase());
            })
        );

    // ------------------------------------------------------------
    // RENDER
    // ------------------------------------------------------------
    return (
        <div ref={ref}  className="p-2">
            {step === 1 && (
                <div>
                    <div className={`transition-all duration-500 ${uploaded ? "flex justify-start" : "flex justify-center items-center h-[60vh]"}`}>
                        {!uploaded && <div className="p-2 flex flex-col md:flex-row gap-2 items-center justify-center">
                            <Button size="sm" className="p-1 bg-neutral-700 rounded-full " onClick={()=>{navigate(-1)}}><ArrowLeft className="text-white" /> Go back</Button>
                            {/* Upload Button */}
                            <Button
                                asChild
                                variant="secondary"
                                className="border-2 border-dashed border-gray-400"
                                size="sm">
                                <label htmlFor="excel-file" className="cursor-pointer">Choose Excel File</label>
                            </Button>

                            {/* Download Template */}
                            <Button asChild variant="secondary" className="border-2 py-1 border-dashed" size="sm">
                                <a href="/personnel_template.xlsx" download className="flex items-center gap-2">
                                    <Download className="w-4 h-4" />
                                    Download Template
                                </a>
                            </Button>

                            <Input
                                id="excel-file"
                                type="file"
                                accept=".xlsx,.xls"
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                        </div>}
                    </div>

                    {uploaded && (
                        <div>
                            <div className="flex flex-row items-center justify-between">
                                <Button size="sm" className="p-1 bg-neutral-700 rounded-md " onClick={()=>{navigate(-1)}}><ArrowLeft className="text-white" /> Go back</Button>
                                <Button
                                    onClick={() => setStep(2)}
                                    className="flex ml-auto items-center gap-2"
                                    size="sm"
                                >
                                    Proceed
                                    <ArrowRight />
                                </Button>
                            </div>
                            <div className="mt-6 border rounded-md">
                                {/* Search Input */}
                                <div className="flex items-center rounded-md px-2 gap-1 rounded-b-none bg-gray-200 pl-3 p-1">
                                    <Search size={18} className="font-extrabold text-xl text-gray-600" />
                                    <Input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Search: Firstname, Lastname"
                                        className="outline-none text-sm ml-2 py-4 font-semibold bg-white"
                                    />
                                    <div className="flex items-center gap-1 justify-start">
                                        <Button size="sm" variant="outline" className="text-sm flex flex-row items-center gap-1 p-2 text-gray-500 font-semibold">
                                            <Users size={15} />{rows.length}
                                        </Button>
                                        <Button size="sm" variant="outline" className="flex flex-row items-center gap-1 text-sm p-2 text-gray-500 font-semibold">
                                            <UserCheck2 size={15} /> {selectedRows.length}
                                        </Button>
                                        <Button
                                            aria-disabled={(selectedRows.length === 0)? true : false}
                                            size="xs" className={`w - 6 h-6 rounded-sm`}
                                            variant="outline"
                                            onClick={()=> setOpenDeleteDialog(true)}
                                            disabled={selectedRows.length === 0}
                                        >
                                            <Trash2 size={12} className={(selectedRows.length === 0) ? 'text-gray-500':'text-red-600'} />
                                        </Button>
                                    </div>
                                </div>
                                {rows.length === 0 ? (
                                    <div className="p-4 text-sm text-gray-600">No rows found in the uploaded file.</div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <div className={`overflow-x-scroll`} style={{maxWidth: size.width-20, width: contentWidth || undefined }}>
                                            <Table className="w-full text-xs">
                                                <TableCaption className="py-2 pb-4">Uploaded personnel (Step 1)</TableCaption>

                                                <TableHeader className="bg-gray-100">
                                                    <TableRow>
                                                        <TableHead className="border w-10 flex flex-row items-center justify-center">
                                                            <Checkbox
                                                                className="not-checked:border-gray-400 not-checked:border-2 checked:border-gray-400 checked:border-2"
                                                                checked={
                                                                    filteredRows.length > 0 &&
                                                                    selectedRows.length === filteredRows.length
                                                                }
                                                                onCheckedChange={toggleSelectAll}
                                                            />
                                                        </TableHead>
                                                        {Object.keys(rows[0] || {})
                                                            .filter((col) => col !== "trainings")
                                                            .map((col) => (
                                                                <TableHead key={col} className="border p-2 text-left relative">
                                                                <div className="flex items-center justify-between">
                                                                    <span className="capitalize">{col}</span>

                                                                    {/* Filter chevron */}
                                                                    <Popover>
                                                                        <PopoverTrigger asChild>
                                                                            <Button className="text-gray-500 hover:text-black hidden text-xs ml-2">
                                                                                ▼
                                                                            </Button>
                                                                        </PopoverTrigger>

                                                                        <PopoverContent className="w-48 p-2 text-sm">
                                                                            <p className="font-semibold mb-1">{col} Filter</p>
                                                                            <input
                                                                                type="text"
                                                                                className="border rounded px-2 py-1 w-full text-xs"
                                                                                placeholder={`Filter ${col}`}
                                                                                value={columnFilters[col] || ""}
                                                                                onChange={(e) => {
                                                                                    const val = e.target.value;
                                                                                    setColumnFilters((prev) => ({
                                                                                        ...prev,
                                                                                        [col]: val,
                                                                                    }));
                                                                                }}
                                                                            />
                                                                            <div className="flex gap-2 mt-2">
                                                                                <Button
                                                                                    size="sm"
                                                                                    variant="outline"
                                                                                    onClick={() => {
                                                                                        // clear this column filter
                                                                                        setColumnFilters((prev) => {
                                                                                            const copy = { ...prev };
                                                                                            delete copy[col];
                                                                                            return copy;
                                                                                        });
                                                                                    }}
                                                                                >
                                                                                    Clear
                                                                                </Button>

                                                                                <Button
                                                                                    size="sm"
                                                                                    onClick={() => {
                                                                                        // close popover by doing nothing (popover will close automatically on outside click)
                                                                                    }}
                                                                                >
                                                                                    OK
                                                                                </Button>
                                                                            </div>
                                                                        </PopoverContent>
                                                                    </Popover>
                                                                </div>
                                                            </TableHead>
                                                        ))}
                                                    </TableRow>
                                                </TableHeader>

                                                <TableBody>
                                                {filteredRows.map((r, idx) => {
                                                    const originalIndex = rows.indexOf(r);

                                                    return (
                                                        <TableRow key={originalIndex} className="odd:bg-gray-50">
                                                            <TableCell className="">
                                                                <Checkbox
                                                                    checked={selectedRows.includes(originalIndex)}
                                                                    onCheckedChange={() => toggleRowSelection(originalIndex)}
                                                                    className="not-checked:border-gray-400 not-checked:border-2 checked:border-gray-400 checked:border-2"
                                                                />
                                                            </TableCell>

                                                            {Object.keys(r).map((key) => (
                                                                <TableCell key={key} className="border p-2">
                                                                    {r[key]}
                                                                </TableCell>
                                                            ))}
                                                        </TableRow>
                                                    );
                                                })}

                                                </TableBody>
                                            </Table>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Button
                                onClick={() => setStep(2)}
                                className="mt-4 flex ml-auto items-center gap-2"
                                size="sm"
                            >
                                Proceed
                                <ArrowRight />
                            </Button>
                        </div>
                    )}
                </div>
            )}

            {step === 2 && (
                <div ref={ref} className="mt-4 overflow-hidden">
                    <h2 className="text-lg font-semibold mb-4">Assign Facilities, Competencies and trainings</h2>

                    <div className="overflow-x-auto overflow-y-auto max-h-[600px] border border-neutral-200 rounded-md">
                        <div className={`overflow-x-scroll`} style={{maxWidth: size.width-20, width: contentWidth || undefined }}>
                            <Table className="w-full">
                                <TableCaption className="py-2 pb-4">Uploaded personnel (Step 2)</TableCaption>
                                <TableHeader className="">
                                    <TableRow className="bg-gray-100 top-0 z-10">
                                        <TableHead className="border p-2 w-50">Full Name</TableHead>
                                        <TableHead className="border p-2 w-80">Position</TableHead>
                                        <TableHead className="border p-2">Trainings</TableHead>

                                        <TableHead className="border p-2">
                                            Facility <FacilitySelector index={null} />
                                        </TableHead>
                                        <TableHead className="border p-2">Competencies</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {rows.map((person, index) => {
                                        const values = Object.values(person);
                                        const firstName = values[0] || "";
                                        const lastName = values[1] || "";
                                        const position = values[7] || "";

                                        return (
                                            <TableRow key={index} className="odd:bg-gray-50">
                                                <TableCell className="border p-2">
                                                    {`${firstName} ${lastName}`.trim()}
                                                </TableCell>

                                                <TableCell className="border p-2">{position || "N/A"}</TableCell>

                                                <TableCell className="border p-2">
                                                    <div className="flex flex-wrap gap-1">
                                                        {safeArray(person.trainings).length > 0 ? (
                                                            safeArray(person.trainings).map((t, i) => (
                                                                <Badge key={i} variant="outline">{t}</Badge>
                                                            ))
                                                        ) : (
                                                            <span className="text-xs text-gray-400">None</span>
                                                        )}
                                                    </div>
                                                </TableCell>

                                                <TableCell className="border p-2">
                                                    <FacilitySelector index={index} />
                                                </TableCell>


                                                <TableCell className="border p-2">
                                                    <div className="flex flex-wrap gap-2 mb-2">
                                                        {(competencies[index] || []).map((c, i) => (
                                                            <Badge key={i} variant="secondary">
                                                                {c}
                                                            </Badge>
                                                        ))}
                                                    </div>

                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button size="xs" className="text-[11px] p-1 px-2" variant="outline">
                                                                Select Competencies
                                                            </Button>
                                                        </PopoverTrigger>

                                                        <PopoverContent className="w-56 p-3 space-y-2 max-h-80 overflow-y-auto">
                                                            {Object.entries(competencyList).map(([categoryKey, items]) => {
                                                                if (Array.isArray(items)) {
                                                                    return (
                                                                        <div key={categoryKey}>
                                                                            <p className="font-semibold text-xs text-gray-600 mb-1">
                                                                                {categoryKey.replace(/_/g, " ")}
                                                                            </p>

                                                                            {items.map((comp) => (
                                                                                <label key={comp} className="flex items-center gap-2 text-sm ml-2 mb-1">
                                                                                    <Checkbox
                                                                                        className="not-checked:border-gray-400 not-checked:border-2 checked:border-gray-400 checked:border-2"
                                                                                        checked={(competencies[index] || []).includes(comp)}
                                                                                        onCheckedChange={() => toggleCompetency(index, comp)}
                                                                                    />
                                                                                    {comp}
                                                                                </label>
                                                                            ))}

                                                                            <hr className="my-2" />
                                                                        </div>
                                                                    );
                                                                }

                                                                return (
                                                                    <div key={categoryKey}>
                                                                        <p className="font-semibold text-xs text-gray-600 mb-1">
                                                                            {categoryKey.replace(/_/g, " ")}
                                                                        </p>

                                                                        {Object.entries(items).map(([disease, diseaseComps]) => (
                                                                            <div key={disease} className="mb-2">
                                                                                <p className="text-xs font-medium ml-1">
                                                                                    {disease.replace(/_/g, " ")}
                                                                                </p>

                                                                                {diseaseComps.map((comp) => (
                                                                                    <label key={comp} className="flex items-center gap-2 text-sm ml-3 mb-1">
                                                                                        <Checkbox
                                                                                            className="not-checked:border-gray-400 not-checked:border-2 checked:border-gray-400 checked:border-2"
                                                                                            checked={(competencies[index] || []).includes(comp)}
                                                                                            onCheckedChange={() => toggleCompetency(index, comp)}
                                                                                        />
                                                                                        {comp}
                                                                                    </label>
                                                                                ))}
                                                                            </div>
                                                                        ))}

                                                                        <hr className="my-2" />
                                                                    </div>
                                                                );
                                                            })}
                                                        </PopoverContent>
                                                    </Popover>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                                <TableFooter className="bg-gray-200">
                                    <TableRow>
                                        <TableCell colSpan={3}>Total</TableCell>
                                        <TableCell className="text-left pl-4">{rows.length}</TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </div>
                    </div>

                    <div className="flex justify-between mt-4">
                        <Button variant="secondary" onClick={() => setStep(1)} className="flex items-center gap-2">
                            <ArrowLeft /> Go Back
                        </Button>

                        <Button variant="default" onClick={() => submitPersonnel()} className="flex items-center gap-2">
                            {isLoading && <Loader2/>}Submit
                        </Button>
                    </div>
                </div>
            )}
            <AlertDialog  open={opendeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to Delete ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Deleting a healthcare worker will remove them from the system and might affect deployments history.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={()=> setOpenDeleteDialog(false)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={()=> {deleteSelectedRows(); setOpenDeleteDialog(false)}}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
