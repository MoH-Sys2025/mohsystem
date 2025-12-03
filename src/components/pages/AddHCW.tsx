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
import { api, getAge } from "@/supabase/Functions";
import { districts } from "@/supabase/districts.tsx";

/* ---------------------------------------------------
   TYPES
--------------------------------------------------- */

type FormType = {
    first_name: string;
    last_name: string;
    other_names: string;
    gender: string;
    date_of_birth: string;
    phone: string;
    email: string;
    cadre_id: string;
    current_district_id: string;
    employment_status: string;
    hire_date: string;
    exit_date: string;
    metadata: {
        district: string;
        competencies: string[];
        age: string | number | null;
        worker_status: string[];
        [key: string]: any;
    };
    qualifications: string[];
    [key: string]: any;
};

interface AddWorkerProps {
    onNavigate: (page: string) => void;
}

export default function AddWorkerWizard({ onNavigate }: AddWorkerProps) {
    const [step, setStep] = useState(0);
    const [saving, setSaving] = useState(false);
    const [cadres, setCadres] = useState<any[]>([]);

    /* ---------------------------------------------------
       LOAD CADRES
    --------------------------------------------------- */
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
    const [form, setForm] = useState<FormType>({
        first_name: "",
        last_name: "",
        other_names: "",
        gender: "",
        date_of_birth: "",
        phone: "",
        email: "",
        cadre_id: "",
        current_district_id: "",
        employment_status: "Employed",
        hire_date: "",
        exit_date: "",
        metadata: {
            district: "",
            competencies: [],
            age: "",
            worker_status: ["Employed", "Available"],
        },
        qualifications: [],
    });

    /* ---------------------------------------------------
       UPDATE HELPER
    --------------------------------------------------- */
    function update(path: string, value: any) {
        setForm((prev) => {
            const clone: any = structuredClone(prev);

            // If date_of_birth, also update age
            if (path === "date_of_birth") {
                clone.date_of_birth = value;
                clone.metadata.age = getAge(value);
                return clone;
            }

            // If district changes, update district name
            if (path === "current_district_id") {
                clone.current_district_id = value;
                clone.metadata.district =
                    districts.find((d) => d.id === value)?.name || "Unknown District";
                return clone;
            }

            const parts = path.split(".");
            let ref = clone;

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
        } catch (err) {
            toast.error("Failed to create new personnel. Ensure all fields are filled.");
        }

        setSaving(false);
    }

    /* ---------------------------------------------------
       QUALIFICATIONS INPUT
    --------------------------------------------------- */
    function QualificationsInput() {
        const [input, setInput] = useState("");

        const add = () => {
            if (!input.trim()) return;
            update("qualifications", [...form.qualifications, input.trim()]);
            setInput("");
        };

        const remove = (item: string) => {
            update(
                "qualifications",
                form.qualifications.filter((q) => q !== item)
            );
        };

        return (
            <div className="space-y-2">
                <Label>Qualifications</Label>

                <div className="flex gap-2">
                    <Input
                        placeholder="Type a qualification"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <Button type="button" onClick={add}>
                        Add
                    </Button>
                </div>

                <div className="flex flex-wrap gap-2 mt-1">
                    {form.qualifications.map((q) => (
                        <Badge key={q} className="px-3 py-1 flex items-center gap-1">
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
       COMPETENCIES INPUT
    --------------------------------------------------- */
    function CompetencyInput() {
        const [input, setInput] = useState("");

        const add = () => {
            if (!input.trim()) return;
            update("metadata.competencies", [
                ...form.metadata.competencies,
                input.trim(),
            ]);
            setInput("");
        };

        const remove = (item: string) => {
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

                <div className="flex flex-wrap gap-2">
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

    function WorkerStatusDisplay() {
        return (
            <div className="space-y-2">
                <Label>Worker Status</Label>
                <Input value="Available" disabled />
            </div>
        );
    }

    /* ---------------------------------------------------
       STEP UI
    --------------------------------------------------- */

    const steps = [
        /* STEP 1 – Personal */
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

                <div>
                    <Label>District</Label>
                    <Select
                        value={form.current_district_id}
                        onValueChange={(v) => update("current_district_id", v)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select District" />
                        </SelectTrigger>
                        <SelectContent>
                            {districts.map((d) => (
                                <SelectItem key={d.id} value={d.id}>
                                    {d.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        ),

        /* STEP 2 – Employment */
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

                <div>
                    <Label>Employment Status</Label>
                    <Input value="Employed" disabled />
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

        /* STEP 3 – Metadata */
        (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <WorkerStatusDisplay />
                <QualificationsInput />
                <CompetencyInput />

                <div className="w-full space-y-2">
                    <Label>Cadre</Label>
                    <Select
                        value={form.cadre_id}
                        onValueChange={(v) => update("cadre_id", v)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Cadre" />
                        </SelectTrigger>
                        <SelectContent>
                            {cadres.map((c) => (
                                <SelectItem key={c.id} value={c.id}>
                                    {c.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        ),

        /* STEP 4 – Review */
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
        <div className="w-full max-w-3xl mx-auto p-6">
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
