import React, { useState } from "react";
import { Calendar } from "lucide-react";
import { supabase } from "@/supabase/supabase";

import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";

/* =======================
   MALAWI DISTRICTS
======================= */
const MALAWI_DISTRICTS = [
    "Balaka",
    "Blantyre",
    "Chikwawa",
    "Chiradzulu",
    "Chitipa",
    "Dedza",
    "Dowa",
    "Karonga",
    "Kasungu",
    "Likoma",
    "Lilongwe",
    "Machinga",
    "Mangochi",
    "Mchinji",
    "Mulanje",
    "Mwanza",
    "Mzimba",
    "Neno",
    "Nkhata Bay",
    "Nkhotakota",
    "Nsanje",
    "Ntcheu",
    "Ntchisi",
    "Phalombe",
    "Rumphi",
    "Salima",
    "Thyolo",
    "Zomba",
];

/* =======================
   COMPONENT
======================= */
export default function CreateTrainingWizard({
                                                 onCancel,
                                                 onPublish,
                                             }: {
    onCancel?: () => void;
    onPublish?: (training: any) => void;
}) {
    const [step, setStep] = useState(0);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [form, setForm] = useState({
        title: "",
        training_code: "",
        provider: "",
        start_date: "",
        end_date: "",
        modality: "in_person",
        location: "",
    });

    const steps = ["Details", "Schedule", "Delivery", "Review"];

    function update(key: string, value: any) {
        setForm((s) => ({ ...s, [key]: value }));
    }

    function validForStep(idx: number) {
        switch (idx) {
            case 0:
                return form.title.trim() && form.provider.trim();
            case 1:
                return form.start_date && form.end_date;
            case 2:
                return !!form.modality;
            default:
                return true;
        }
    }

    async function submit() {
        try {
            setSaving(true);
            setError(null);

            const {
                data: { user },
                error: authError,
            } = await supabase.auth.getUser();

            if (authError || !user) {
                throw new Error("User not authenticated");
            }

            const payload = {
                title: form.title,
                training_code: form.training_code || null,
                provider: form.provider,
                provider_id: user.id,
                start_date: form.start_date,
                end_date: form.end_date,
                modality: form.modality,
                location: form.location || null,
            };

            const { data, error } = await supabase
                .from("trainings")
                .insert(payload)
                .select()
                .single();

            if (error) throw error;

            onPublish?.(data);
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to create training");
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="bg-white border p-6 max-w-3xl h-full">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-lg font-semibold">Create Training</h1>
                    <p className="text-sm text-muted-foreground">
                        Create a new training session
                    </p>
                </div>
                <Button variant="outline" size="sm" onClick={onCancel}>
                    Cancel
                </Button>
            </div>

            {/* STEPS */}
            <div className="flex gap-2 mb-6 overflow-x-auto">
                {steps.map((label, i) => (
                    <button
                        key={label}
                        onClick={() => setStep(i)}
                        className={`px-3 py-1 rounded-md text-sm whitespace-nowrap ${
                            step === i
                                ? "bg-emerald-600 text-white"
                                : "bg-muted text-muted-foreground"
                        }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* STEP 0 — DETAILS */}
            {step === 0 && (
                <div className="space-y-4">
                    <label className="block">
                        <span className="text-sm">Title</span>
                        <input
                            className="mt-1 w-full border rounded-md p-2 text-sm"
                            value={form.title}
                            onChange={(e) => update("title", e.target.value)}
                        />
                    </label>

                    <label className="block">
                        <span className="text-sm">Training code (optional)</span>
                        <input
                            className="mt-1 w-full border rounded-md p-2 text-sm"
                            value={form.training_code}
                            onChange={(e) => update("training_code", e.target.value)}
                        />
                    </label>

                    <label className="block">
                        <span className="text-sm">Provider</span>
                        <input
                            className="mt-1 w-full border rounded-md p-2 text-sm"
                            value={form.provider}
                            onChange={(e) => update("provider", e.target.value)}
                        />
                    </label>
                </div>
            )}

            {/* STEP 1 — SCHEDULE */}
            {step === 1 && (
                <div className="space-y-4">
                    <label className="block">
                        <span className="text-sm">Start date</span>
                        <input
                            type="date"
                            className="mt-1 w-full border rounded-md p-2 text-sm"
                            value={form.start_date}
                            onChange={(e) => update("start_date", e.target.value)}
                        />
                    </label>

                    <label className="block">
                        <span className="text-sm">End date</span>
                        <input
                            type="date"
                            className="mt-1 w-full border rounded-md p-2 text-sm"
                            value={form.end_date}
                            onChange={(e) => update("end_date", e.target.value)}
                        />
                    </label>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar size={16} />
                        Used for timelines and reporting
                    </div>
                </div>
            )}

            {/* STEP 2 — DELIVERY */}
            {step === 2 && (
                <div className="space-y-4">
                    <label className="block space-y-1">
                        <span className="text-sm">Modality</span>
                        <Select
                            value={form.modality}
                            onValueChange={(v) => update("modality", v)}
                        >
                            <SelectTrigger className = "w-full">
                                <SelectValue placeholder="Select modality" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="in_person">In person</SelectItem>
                                <SelectItem value="online">Online</SelectItem>
                                <SelectItem value="blended">Blended</SelectItem>
                                <SelectItem value="on_the_job">On the job</SelectItem>
                            </SelectContent>
                        </Select>
                    </label>

                    <label className="block space-y-1">
                        <span className="text-sm">Location (District)</span>
                        <Select
                            value={form.location}
                            onValueChange={(v) => update("location", v)}>
                            <SelectTrigger className = "w-full">
                                <SelectValue placeholder="Select district" />
                            </SelectTrigger>
                            <SelectContent>
                                {MALAWI_DISTRICTS.map((d) => (
                                    <SelectItem key={d} value={d}>
                                        {d}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </label>
                </div>
            )}

            {/* STEP 3 — REVIEW */}
            {step === 3 && (
                <div className="bg-muted/50 p-4 rounded-md text-sm space-y-2">
                    <p><b>Title:</b> {form.title}</p>
                    <p><b>Provider:</b> {form.provider}</p>
                    <p><b>Dates:</b> {form.start_date} → {form.end_date}</p>
                    <p><b>Modality:</b> {form.modality}</p>
                    <p><b>Location:</b> {form.location || "—"}</p>
                </div>
            )}

            {error && (
                <p className="mt-4 text-sm text-red-600">{error}</p>
            )}

            {/* FOOTER */}
            <div className="mt-6 flex justify-between">
                <Button
                    variant="outline"
                    disabled={step === 0}
                    onClick={() => setStep((s) => s - 1)}
                >
                    Back
                </Button>

                {step === steps.length - 1 ? (
                    <Button onClick={submit} disabled={saving}>
                        {saving ? "Saving..." : "Create Training"}
                    </Button>
                ) : (
                    <Button
                        onClick={() => {
                            if (!validForStep(step)) {
                                alert("Please complete required fields");
                                return;
                            }
                            setStep((s) => s + 1);
                        }}
                    >
                        Next
                    </Button>
                )}
            </div>
        </div>
    );
}
