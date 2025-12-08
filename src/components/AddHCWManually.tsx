import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Button } from "@/components/ui/button.tsx";
import { toast } from "sonner";

import {
    Select,
    SelectContent,
    SelectTrigger,
    SelectValue,
    SelectItem,
} from "@/components/ui/select.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { X } from "lucide-react";
import { api, getAge } from "@/supabase/Functions.tsx";
import { districts } from "@/supabase/districts.tsx";

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
};

interface AddWorkerProps {
    onNavigate: (page: string) => void;
}

export default function AddWorkerManually({ onNavigate }: AddWorkerProps) {
    const [saving, setSaving] = useState(false);
    const [cadres, setCadres] = useState<any[]>([]);

    useEffect(() => {
        async function loadCadres() {
            const data = await api.listCadres();
            setCadres(data);
        }
        loadCadres();
    }, []);

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

    function update(path: string, value: any) {
        setForm((prev) => {
            const clone: any = structuredClone(prev);

            if (path === "date_of_birth") {
                clone.date_of_birth = value;
                clone.metadata.age = getAge(value);
                return clone;
            }

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

    async function handleSubmit() {
        setSaving(true);

        try {
            await api.createPersonnel(form);
            toast.success("Worker Registered Successfully");
            onNavigate("workforce");
        } catch (err) {
            toast.error("Failed to create personnel.");
        }

        setSaving(false);
    }

    /* ------------------ QUALIFICATIONS INPUT ------------------ */
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
                <Label className="text-sm">Qualifications</Label>

                <div className="flex gap-2">
                    <Input
                        className="text-xs h-8"
                        placeholder="Type qualification"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <Button type="button" className="text-xs h-8 px-3" onClick={add}>
                        Add
                    </Button>
                </div>

                <div className="flex flex-wrap gap-2 mt-1">
                    {form.qualifications.map((q) => (
                        <Badge key={q} className="px-2 py-1 text-xs flex items-center gap-1">
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

    /* ------------------ COMPETENCIES ------------------ */
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
                <Label className="text-sm">Competencies</Label>

                <div className="flex gap-2">
                    <Input
                        className="text-xs h-8"
                        placeholder="Type competency"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <Button type="button" className="text-xs h-8 px-3" onClick={add}>
                        Add
                    </Button>
                </div>

                <div className="flex flex-wrap gap-2 mt-1">
                    {form.metadata.competencies.map((c) => (
                        <Badge key={c} className="px-2 py-1 text-xs flex items-center gap-1">
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

    /* ------------------ RENDER ------------------ */
    return (
        <div className="mx-auto p-6 space-y-6 bg-white">

            {/* ------------------ PERSONAL INFO ------------------ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label className="text-sm">First Name</Label>
                    <Input
                        className="text-xs h-8"
                        value={form.first_name}
                        onChange={(e) => update("first_name", e.target.value)}
                    />
                </div>

                <div>
                    <Label className="text-sm">Last Name</Label>
                    <Input
                        className="text-xs h-8"
                        value={form.last_name}
                        onChange={(e) => update("last_name", e.target.value)}
                    />
                </div>

                <div>
                    <Label className="text-sm">Other Names</Label>
                    <Input
                        className="text-xs h-8"
                        value={form.other_names}
                        onChange={(e) => update("other_names", e.target.value)}
                    />
                </div>

                <div className="w-full">
                    <Label className="text-sm w-full">Gender</Label>
                    <Select
                        value={form.gender}
                        onValueChange={(v) => update("gender", v)}
                    >
                        <SelectTrigger className="text-xs h-8 w-full">
                            <SelectValue placeholder="Choose gender" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label className="text-sm">Date of Birth</Label>
                    <Input
                        className="text-xs h-8"
                        type="date"
                        value={form.date_of_birth}
                        onChange={(e) => update("date_of_birth", e.target.value)}
                    />
                </div>

                <div>
                    <Label className="text-sm">District</Label>
                    <Select
                        value={form.current_district_id}
                        onValueChange={(v) => update("current_district_id", v)}
                    >
                        <SelectTrigger className="text-xs h-8 w-full">
                            <SelectValue placeholder="Choose district" />
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

            {/* ------------------ EMPLOYMENT INFO ------------------ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label className="text-sm">Phone</Label>
                    <Input
                        className="text-xs h-8"
                        value={form.phone}
                        onChange={(e) => update("phone", e.target.value)}
                    />
                </div>

                <div>
                    <Label className="text-sm">Email</Label>
                    <Input
                        className="text-xs h-8"
                        value={form.email}
                        onChange={(e) => update("email", e.target.value)}
                    />
                </div>

                <div>
                    <Label className="text-sm">Employment Status</Label>
                    <Input className="text-xs h-8" value="Employed" disabled />
                </div>

                {/*<div>*/}
                {/*    <Label className="text-sm">Hire Date</Label>*/}
                {/*    <Input*/}
                {/*        className="text-xs h-8"*/}
                {/*        type="date"*/}
                {/*        value={form.hire_date}*/}
                {/*        onChange={(e) => update("hire_date", e.target.value)}*/}
                {/*    />*/}
                {/*</div>*/}

                {/*<div>*/}
                {/*    <Label className="text-sm">Exit Date</Label>*/}
                {/*    <Input*/}
                {/*        className="text-xs h-8"*/}
                {/*        type="date"*/}
                {/*        value={form.exit_date}*/}
                {/*        onChange={(e) => update("exit_date", e.target.value)}*/}
                {/*    />*/}
                {/*</div>*/}

                <div>
                    <Label className="text-sm">Cadre</Label>
                    <Select
                        value={form.cadre_id}
                        onValueChange={(v) => update("cadre_id", v)}
                    >
                        <SelectTrigger className="text-xs h-8 w-full">
                            <SelectValue placeholder="Choose cadre" />
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

            {/* ------------------ QUALIFICATIONS + COMPETENCIES ------------------ */}
            <QualificationsInput />
            <CompetencyInput />

            {/* ------------------ SUBMIT ------------------ */}
            <div className="flex justify-end pt-4">
                <Button
                    className="px-6 h-8 text-xs"
                    disabled={saving}
                    onClick={handleSubmit}
                >
                    {saving ? "Saving..." : "Create Worker"}
                </Button>
            </div>
        </div>
    );
}
