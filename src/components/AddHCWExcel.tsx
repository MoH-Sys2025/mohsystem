import { Button } from "@/components/ui/button";
import {useEffect, useState} from "react";
import * as XLSX from "xlsx";
import { ArrowRight, ArrowLeft, Download } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {competencyList} from "@/supabase/competencieslist"
import {api} from "@/supabase/Functions.tsx";
import {toast} from "sonner";
export default function ExcelUploader() {
    const [rows, setRows] = useState([]);
    const [personnels, setPersonnels] = useState({});
    const [uploaded, setUploaded] = useState(false);
    const [step, setStep] = useState(1);
    const [competencies, setCompetencies] = useState({});


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

    // const submitPersonnel = ()=>{
    //     rows.map((row, index) => {
    //         setPersonnels({
    //             "first_name": row.first_name,
    //             "last_name": row.last_name,
    //             "email": row.email,
    //             "phone": row.phone,
    //             "other_names": row.other_names,
    //             "gender": row.gender,
    //             "cadre_id": cadre,
    //             "current_facility_id": row.current_facility,
    //             "current_district_id": row.current_district,
    //             "employement_status": row.employement_status,
    //             "ihrmis_systems": false,
    //             "dhis2_systems": false,
    //             "metadata": {
    //                 "age": row.age,
    //                 "district": row.district,
    //                 "competencies": competencies[index],
    //                 "worker_status": [row.employment_status, "Available"]
    //
    //             }
    //         })
    //     })
    // }
    const handleFileUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            const data = new Uint8Array(evt.target.result);
            const workbook = XLSX.read(data, { type: "array" });

            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            const headings = json[0];
            const dataRows = json.slice(2);

            const normalized = dataRows.map((row) => {
                let obj = {};
                headings.forEach((h, i) => {
                    obj[h] = row[i] ?? "";
                });
                return obj;
            });

            setRows(normalized);
            setUploaded(true);
        };

        reader.readAsArrayBuffer(file);
    };

    return (
        <div className="p-6">

            {/* ------------------------------ STEP 1 ------------------------------ */}
            {step === 1 && (
                <>
                    <div
                        className={`transition-all duration-500 ${
                            uploaded
                                ? "flex justify-start"
                                : "flex justify-center items-center h-[60vh]"
                        }`}
                    >
                        <div className="p-2 flex flex-row gap-2 items-center justify-center">

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

                            <Button asChild variant="secondary" size="sm">
                                <a
                                    href="/personnel_format.xlsx"
                                    download
                                    className="flex items-center gap-2"
                                >
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
                        <>
                            <div className="mt-6 overflow-auto border rounded-md">
                                <table className="w-full text-xs">
                                    <thead className="bg-gray-100">
                                    <tr>
                                        {Object.keys(rows[0] || {}).map((col) => (
                                            <th key={col} className="border p-2 text-left">
                                                {col}
                                            </th>
                                        ))}
                                    </tr>
                                    </thead>

                                    <tbody>
                                    {rows.map((r, idx) => (
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
                            </div>

                            <Button
                                onClick={() => setStep(2)}
                                className="mt-4 flex items-center gap-2"
                                size="sm"
                            >
                                Proceed
                                <ArrowRight />
                            </Button>
                        </>
                    )}
                </>
            )}

            {/* ------------------------------ STEP 2 ------------------------------ */}
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

                                                <td className="border p-2">
                                                    {position || "N/A"}
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
                                                                // If items is an array (normal category)
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

                                                                // Otherwise items is an object -> Disease_Specific with subcategories
                                                                return (
                                                                    <div key={categoryKey}>
                                                                        <p className="font-semibold text-xs text-gray-600 mb-1">
                                                                            {categoryKey.replace(/_/g, " ")}
                                                                        </p>

                                                                        {Object.entries(items).map(([disease, diseaseComps]) => (
                                                                            <div key={disease} className="mb-2">
                                                                                <p className="text-xs font-medium ml-1">{disease.replace(/_/g, " ")}</p>
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
                        <Button
                            variant="secondary"
                            onClick={() => setStep(1)}
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft /> Go Back
                        </Button>

                        <Button
                            variant="default"
                            onClick={()=>toast.success("We will continue from here !!")}
                            className="flex items-center gap-2"
                        >
                            Submit
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
