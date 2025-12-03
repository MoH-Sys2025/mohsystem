import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import {
    Select,
    SelectContent,
    SelectTrigger,
    SelectValue,
    SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import {api, getAge} from "@/supabase/Functions";
import {districts} from "@/supabase/districts.tsx";

interface AddWorkerProps {
    onNavigate: (page: string) => void;
}

export default function AddHealthyFacility({onNavigate}: AddWorkerProps) {
    const [step, setStep] = useState(0);
    const [saving, setSaving] = useState(false);
    const [cadres, setCadres] = useState([]);

    // Get Cadres
    useEffect(() => {
        async function loadCadres() {
            const data = await api.listCadres();
            setCadres(data);
        }
        loadCadres();
    }, []);


    /* ---------------------------------------------------
       FORM STATE
    --------------------------------------------------- */
    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        other_names: "",
        gender: "",
        date_of_birth: "",
        phone: "",
        email: "",
        cadre_id: "",
        current_district_id: "",
        employment_status: "Employed", // DEFAULT + LOCKED
        hire_date: "",
        exit_date: "",
        metadata: {
            district: "",
            competencies: [],
            age: "",
            worker_status: ["Employed", "Available"], // DEFAULT + LOCKED
        },
        qualifications: [],
    });

    /* ---------------------------------------------------
       UPDATE HELPER
    --------------------------------------------------- */
    function update(path: string, value: string | string[]) {
        setForm((prev) => {
            const clone = structuredClone(prev);
            let ref = clone;

            // Special case: when date_of_birth changes → recalc age
            if (path === "date_of_birth") {
                return {
                    ...prev,
                    date_of_birth: value,
                    metadata: {
                        ...prev.metadata,
                        age: getAge(value),
                    }
                };
            }else if (path === "current_district_id") {
                return {
                    ...prev,
                    current_district_id: value,
                    metadata: {
                        ...prev.metadata,
                        district: districts.find((d) => d.id === value)?.name || "Unknown District",
                    }
                };
            }

            const parts = path.split(".");
            parts.forEach((p, i) => {
                if (i === parts.length - 1) ref[p] = value;
                else ref = ref[p];
            });

            return clone;
        });
    }

    /* ---------------------------------------------------
       SAVE HANDLER
    --------------------------------------------------- */
    async function handleSubmit() {
        setSaving(true);

        try {
            await api.createPersonnel(form);
            toast.success("Created Successfully");
            onNavigate("workforce");
            // alert("Saved successfully!");

        } catch (err) {
            toast.error("Failed to create new personnel, ensure that all fields are filled");
        }

        setSaving(false);
    }

    // Qualifications
    function QualificationsInput() {
        const [input, setInput] = useState("");

        const add = () => {
            if (!input.trim()) return;
            update("qualifications", [...form.qualifications, input.trim()]);
            setInput("");
        };

        const remove = (item) => {
            update(
                "qualifications",
                form.qualifications.filter((q) => q !== item)
            );
        };

        return (
            <div className="space-y-2">
                <Label>Qualifications</Label>

                {/* Input + Add button */}
                <div className="flex gap-2">
                    <Input
                        placeholder="Type a qualification"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className=""
                    />
                    <Button type="button" onClick={add} className="">
                        Add
                    </Button>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-1">
                    {form.qualifications.map((q) => (
                        <Badge
                            key={q}
                            className="px-3 py-1 flex items-center gap-1 rounded-xl"
                        >
                            {q}
                            <X
                                className="h-3 w-3 cursor-pointer"
                                onClick={() => remove(q)}
                            />
                        </Badge>
                    ))}
                </div>
            </div>
        );
    }


    /* ---------------------------------------------------
       COMPETENCIES INPUT (TEXT TAGS)
    --------------------------------------------------- */
    function CompetencyInput() {
        const [input, setInput] = useState("");

        const add = () => {
            if (!input.trim()) return;
            const list = [...form.metadata.competencies, input.trim()];
            update("metadata.competencies", list);
            setInput("");
        };

        const remove = (item) => {
            update(
                "metadata.competencies",
                form.metadata.competencies.filter((c) => c !== item)
            );
        };

        return (
            <div className="space-y-2">
                <Label>Competencies</Label>

                <div className="flex gap-2">
                    <Input
                        placeholder="Type a competency"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <Button type="button" onClick={add}>
                        Add
                    </Button>
                </div>

                <div className="flex gap-2 flex-wrap">
                    {form.metadata.competencies.map((c) => (
                        <Badge key={c} className="px-3 py-1 flex items-center gap-1">
                            {c}
                            <X
                                className="h-3 w-3 cursor-pointer"
                                onClick={() => remove(c)}
                            />
                        </Badge>
                    ))}
                </div>
            </div>
        );
    }


    /* ---------------------------------------------------
       WORKER STATUS — LOCKED TO "Available"
    --------------------------------------------------- */
    function WorkerStatusDisplay() {
        return (
            <div className="space-y-2">
                <Label>Worker Status</Label>
                <Input value="Available" disabled />
            </div>
        );
    }

    /* ---------------------------------------------------
       STEP DEFINITIONS
    --------------------------------------------------- */
    const steps = [
        /* ---------------------------------------------------
           STEP 1 — PERSONAL DETAILS
        --------------------------------------------------- */
        (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label>First Name</Label>
                    <Input
                        value={form.first_name}
                        onChange={(e) => update("first_name", e.target.value)}
                    />
                </div>

                <div>
                    <Label>Last Name</Label>
                    <Input
                        value={form.last_name}
                        onChange={(e) => update("last_name", e.target.value)}
                    />
                </div>

                <div>
                    <Label>Other Names</Label>
                    <Input
                        value={form.other_names}
                        onChange={(e) => update("other_names", e.target.value)}
                    />
                </div>

                <div>
                    <Label>Gender</Label>
                    <Select
                        value={form.gender}
                        onValueChange={(v) => update("gender", v)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label>Date of Birth</Label>
                    <Input
                        type="date"
                        value={form.date_of_birth}
                        onChange={(e) => update("date_of_birth", e.target.value)}
                    />
                </div>
                {/*District*/}
                <div className="md:max-w-full w-30">
                    <Label>District</Label>
                    <Select
                        value={form.current_district_id}
                        onValueChange={(id) => update("current_district_id", id)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select District" />
                        </SelectTrigger>
                        <SelectContent>
                            {districts.map((dist) => (
                                <SelectItem key={dist?.name} value={dist?.id}>
                                    {dist?.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        ),

        /* ---------------------------------------------------
           STEP 2 — CONTACT + EMPLOYMENT
        --------------------------------------------------- */
        (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>
                    <Label>Phone</Label>
                    <Input
                        value={form.phone}
                        onChange={(e) => update("phone", e.target.value)}
                    />
                </div>

                <div>
                    <Label>Email</Label>
                    <Input
                        value={form.email}
                        onChange={(e) => update("email", e.target.value)}
                    />
                </div>

                {/* Employment Locked */}
                <div>
                    <Label>Employment Status</Label>
                    <Input placeholder= "Employed" value={form.employment_status} disabled={true} />
                </div>

                <div>
                    <Label>Hire Date</Label>
                    <Input
                        type="date"
                        value={form.hire_date}
                        onChange={(e) => update("hire_date", e.target.value)}
                    />
                </div>

                <div>
                    <Label>Exit Date</Label>
                    <Input
                        type="date"
                        value={form.exit_date}
                        onChange={(e) => update("exit_date", e.target.value)}
                    />
                </div>
            </div>
        ),

        /* ---------------------------------------------------
           STEP 3 — METADATA
        --------------------------------------------------- */
        (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <WorkerStatusDisplay />
                {/* Qualifications */}
                <QualificationsInput />
                {/*<div><Label>Qualifications</Label>*/}

                {/*    <div className="flex flex-wrap gap-2 mt-2 mb-2">*/}
                {/*        {form.qualifications.map((v) => (*/}
                {/*            <Badge*/}
                {/*                key={v}*/}
                {/*                variant="secondary"*/}
                {/*                className="cursor-pointer"*/}
                {/*                onClick={() =>*/}
                {/*                    update(*/}
                {/*                        "qualifications",*/}
                {/*                        form.qualifications.filter((x) => x !== v)*/}
                {/*                    )*/}
                {/*                }*/}
                {/*            >*/}
                {/*                {v} ×*/}
                {/*            </Badge>*/}
                {/*        ))}*/}
                {/*    </div>*/}

                {/*    <Select*/}
                {/*        onValueChange={(v) =>*/}
                {/*            update("qualifications", [...form.qualifications, v])*/}
                {/*        }*/}
                {/*    >*/}
                {/*        <SelectTrigger>*/}
                {/*            <SelectValue placeholder="Add qualification" />*/}
                {/*        </SelectTrigger>*/}
                {/*        <SelectContent>*/}
                {/*            {qualificationOptions.map((opt) => (*/}
                {/*                <SelectItem key={opt} value={opt}>*/}
                {/*                    {opt}*/}
                {/*                </SelectItem>*/}
                {/*            ))}*/}
                {/*        </SelectContent>*/}
                {/*    </Select>*/}
                {/*</div>*/}
                <CompetencyInput />
                 {/*Role*/}
                <div className="md:max-w-full w-full space-y-2">
                    <Label>Cadre</Label>
                    <Select
                        value={form.cadre_id}
                        onValueChange={(id) => update("cadre_id", id)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Cadre" />
                        </SelectTrigger>
                        <SelectContent>
                            {cadres.map((cadre) => (
                                <SelectItem key={cadre?.id} value={cadre?.id}>
                                    {cadre?.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

            </div>
        ),

        /* ---------------------------------------------------
           STEP 4 — REVIEW
        --------------------------------------------------- */
        (
            <div className="text-center py-10">
                <p className="text-lg font-medium">Review & Submit</p>
                <p className="text-muted-foreground mt-2">
                    Click finish to save this personnel record.
                </p>
            </div>
        ),
    ];

    /* ---------------------------------------------------
       RENDER
    --------------------------------------------------- */
    return (
        <div className="w-full max-w-3xl mx-auto p-6 ">
            <h2 className="text-2xl font-semibold mb-6"></h2>

            <div className="mb-8">{steps[step]}</div>

            <div className="flex justify-between mt-6">
                {step > 0 ? (
                    <Button variant="ghost" onClick={() => setStep(step - 1)}>
                        Back
                    </Button>
                ) : (
                    <div />
                )}

                {step < steps.length - 1 ? (
                    <Button onClick={() => setStep(step + 1)}>Next</Button>
                ) : (
                    <Button disabled={saving} onClick={handleSubmit}>
                        {saving ? "Saving..." : "Finish"}
                    </Button>
                )}
            </div>
        </div>
    );
}
