import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { ArrowRight, ArrowLeft, Download } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { competencyList } from "@/supabase/competencieslist";
import { api } from "@/supabase/Functions.tsx";
import { toast } from "sonner";
import { supabase } from "@/supabase/supabase.ts";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";

export default function ExcelUploader() {
    const [rows, setRows] = useState([]);
    const [personnels, setPersonnels] = useState([]);
    const [uploaded, setUploaded] = useState(false);
    const [step, setStep] = useState(1);
    const [competencies, setCompetencies] = useState({});

    const [districts, setDistricts] = useState([]);
    const [facilities, setFacilities] = useState([]);
    const [cadres, setCadres] = useState([]);

    const [selectedFacility, setSelectedFacility] = useState({});

    // search + filters
    const [searchTerm, setSearchTerm] = useState("");
    const [columnFilters, setColumnFilters] = useState({});

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
                const district_id = getDistrictIdByName(row.district);  // administrative_regions lookup

                return {
                    first_name: row.first_name,
                    last_name: row.last_name,
                    email: row.email,
                    phone: row.phone,
                    other_names: row.other_names,
                    gender: row.gender,
                    role: row.position,
                    qualifications: [row.qualification],
                    cadre_id: row.cadre_id,
                    current_facility_id: row.current_facility_id,   // selected from popover
                    current_district_id: district_id,              // resolved from district name

                    employment_status: row.employment_status,

                    ihrmis_sync: false,
                    dhis2_sync: false,

                    metadata: {
                        age: row.age,
                        district: row.district,
                        facility_name: row.facility_name,
                        competencies: competencies[index],
                        worker_status: [row.employment_status, "Available"]
                    }
                };
            });

            // Insert into personnel table
            const { error } = await supabase
                .from("personnel")
                .insert(payload);
            if (error) {
                console.error(error);
                toast.error("⚠️ Upload failed, Check some fields are not properly set");
                return;
            }

            toast.success("✅ Personnel successfully uploaded!");

        } catch (err) {
            console.error(err);
            toast.error("⚠️ Unexpected error occurred.");
        }
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
                        // make heading keys safe (trim)
                        const key = (h || "").toString().trim();
                        if (!key) return;
                        if (key === "phone") {
                            obj[key] = row[i] ? "+265" + row[i] : "";
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
            setUploaded(true);
        };

        reader.readAsArrayBuffer(file);

        // reset file input value so selecting same file again still triggers change
        e.target.value = "";
    };

    // ------------------------------------------------------------
    // FACILITY SELECTOR COMPONENT
    // ------------------------------------------------------------
    const FacilitySelector = ({ index }) => {
        const districtName = rows[index]?.district;
        const facilityOptions = getFacilitiesByDistrictName(districtName);

        return (
            <Popover>
                <PopoverTrigger asChild>
                    <Button size="xs" variant="outline" className="text-[11px] p-1 px-2">
                        {selectedFacility[index]?.facility_name || "Select Facility"}
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
                                    onSelect={() => {
                                        setSelectedFacility((prev) => ({
                                            ...prev,
                                            [index]: f,
                                        }));

                                        // also update the row's facility id if needed
                                        // updateRow(index, "current_facility_id", f.id);
                                    }}
                                >
                                    {f.facility_name}
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
        <div className="p-6">
            {step === 1 && (
                <div>
                    <div
                        className={`transition-all duration-500 ${uploaded ? "flex justify-start" : "flex justify-center items-center h-[60vh]"}`}
                    >
                        <div className="p-2 flex flex-row gap-2 items-center justify-center">

                            {/* Upload Button */}
                            <Button
                                asChild
                                variant="secondary"
                                className="border-2 border-dashed border-gray-400"
                                size="sm"
                            >
                                <label htmlFor="excel-file" className="cursor-pointer">
                                    Choose Excel File
                                </label>
                            </Button>

                            {/* Download Template */}
                            <Button asChild variant="secondary" size="sm">
                                <a href="/personnel_format.xlsx" download className="flex items-center gap-2">
                                    <Download className="w-4 h-4" />
                                    Download Template
                                </a>
                            </Button>

                            <input
                                id="excel-file"
                                type="file"
                                accept=".xlsx,.xls"
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                        </div>
                    </div>

                    {uploaded && (
                        <div>
                            <div className="mt-6 overflow-auto border rounded-md">
                                {/* Search Input */}
                                <div className="flex items-center border rounded-md px-2 bg-white">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 text-gray-500"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 6.65a7.5 7.5 0 010 10.6z"
                                        />
                                    </svg>
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Search..."
                                        className="outline-none text-sm ml-2 py-1"
                                    />
                                </div>
                                {rows.length === 0 ? (
                                    <div className="p-4 text-sm text-gray-600">No rows found in the uploaded file.</div>
                                ) : (
                                    <table className="w-full text-xs">
                                        <thead className="bg-gray-100">
                                        <tr>
                                            {Object.keys(rows[0] || {}).map((col) => (
                                                <th key={col} className="border p-2 text-left relative">
                                                    <div className="flex items-center justify-between">
                                                        <span className="capitalize">{col}</span>

                                                        {/* Filter chevron */}
                                                        <Popover>
                                                            <PopoverTrigger asChild>
                                                                <button className="text-gray-500 hover:text-black hidden text-xs ml-2">
                                                                    ▼
                                                                </button>
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
                                                </th>
                                            ))}
                                        </tr>
                                        </thead>

                                        <tbody>
                                        {filteredRows.map((r, idx) => (
                                            <tr key={idx} className="odd:bg-gray-50">
                                                {Object.keys(r).map((key) => (
                                                    <td key={key} className="border p-2">
                                                        {r[key]}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
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
                <div className="mt-4">
                    <h2 className="text-lg font-semibold mb-4">Assign Competencies</h2>

                    <div className="w-full overflow-x-auto overflow-y-auto">
                        <div className="border rounded-md overflow-hidden">
                            <div className="max-h-[60vh] overflow-y-auto">
                                <table className="min-w-full text-sm table-auto">
                                    <thead className="bg-gray-100 sticky top-0 z-10">
                                    <tr>
                                        <th className="border p-2 w-50">Full Name</th>
                                        <th className="border p-2 w-80">Position</th>
                                        <th className="border p-2">Facility</th>
                                        <th className="border p-2">Competencies</th>
                                    </tr>
                                    </thead>

                                    <tbody>
                                    {rows.map((person, index) => {
                                        const values = Object.values(person);
                                        const firstName = values[0] || "";
                                        const lastName = values[1] || "";
                                        const position = values[7] || "";

                                        return (
                                            <tr key={index} className="odd:bg-gray-50">
                                                <td className="border p-2">
                                                    {`${firstName} ${lastName}`.trim()}
                                                </td>

                                                <td className="border p-2">{position || "N/A"}</td>

                                                <td className="border p-2">
                                                    <FacilitySelector index={index} />
                                                </td>

                                                <td className="border p-2">
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
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between mt-4">
                        <Button variant="secondary" onClick={() => setStep(1)} className="flex items-center gap-2">
                            <ArrowLeft /> Go Back
                        </Button>

                        <Button variant="default" onClick={() => submitPersonnel()} className="flex items-center gap-2">
                            Submit
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
