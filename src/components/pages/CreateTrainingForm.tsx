import React, { useState, useRef } from "react";
import { Plus, Calendar, Users } from "lucide-react";

// CreateTrainingWizard.jsx
// Single-file responsive step-by-step wizard for creating a training.
// - TailwindCSS for styling
// - Mobile first, responsive layout
// - Steps: Details -> Schedule -> Trainers -> Participants -> Certification -> Resources -> Review

export default function CreateTrainingWizard({ onCancel, onPublish }) {
    const [step, setStep] = useState(0);
    const [saving, setSaving] = useState(false);

    // Form state (kept simple and serializable)
    const [form, setForm] = useState({
        title: "",
        category: "Disease-Specific",
        description: "",
        mode: "Physical",
        venue: "",
        onlineLink: "",
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
        duration: "",
        trainers: [
            { name: "", email: "" },
        ],
        targetCadres: [],
        requiredCompetencies: "",
        maxParticipants: "",
        autoApprove: false,
        registrationOpen: "",
        registrationClose: "",
        provideCertification: true,
        passingScore: 70,
        requireAttendancePercent: 75,
        materials: [] as File[],
    });

    const fileRef = useRef<HTMLInputElement | null>(null);

    const steps = [
        "Details",
        "Schedule",
        "Trainers",
        "Participants",
        "Certification",
        "Resources",
        "Review",
    ];

    function update(k: string, v: any) {
        setForm((s) => ({ ...s, [k]: v }));
    }

    function addTrainer() {
        setForm((s) => ({ ...s, trainers: [...s.trainers, { name: "", email: "" }] }));
    }

    function removeTrainer(i: number) {
        setForm((s) => ({ ...s, trainers: s.trainers.filter((_, idx) => idx !== i) }));
    }

    function updateTrainer(i: number, key: string, val: string) {
        setForm((s) => ({
            ...s,
            trainers: s.trainers.map((t, idx) => (idx === i ? { ...t, [key]: val } : t)),
        }));
    }

    function addFiles(files: FileList | null) {
        if (!files) return;
        const arr = Array.from(files);
        setForm((s) => ({ ...s, materials: [...s.materials, ...arr] }));
    }

    function removeFile(i: number) {
        setForm((s) => ({ ...s, materials: s.materials.filter((_, idx) => idx !== i) }));
    }

    function validForStep(idx: number) {
        // basic validation per-step
        switch (idx) {
            case 0:
                return form.title.trim().length > 3;
            case 1:
                return !!form.startDate && !!form.endDate;
            case 2:
                return form.trainers.length > 0 && form.trainers.every(t => t.name || t.email);
            case 3:
                return !!form.maxParticipants;
            default:
                return true;
        }
    }

    async function saveDraft() {
        setSaving(true);
        // simulate save
        await new Promise((r) => setTimeout(r, 700));
        setSaving(false);
        alert("Draft saved (simulation)");
    }

    async function publish() {
        setSaving(true);
        // simulate publish
        await new Promise((r) => setTimeout(r, 900));
        setSaving(false);
        alert("Training published (simulation)");
        onPublish?.();
    }

    return (
        <div className="max-w-full overflow-x-hidden">
            <div className="bg-white rounded-xl border border-neutral-200 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                        <h1 className="text-lg md:text-xl font-semibold">Create Training</h1>
                        <p className="text-sm text-neutral-500">Use the wizard to create a new training program</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={saveDraft}
                            className="px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-md hover:bg-neutral-100"
                        >
                            Save draft
                        </button>
                        <button
                            onClick={() => onCancel?.()}
                            className="px-3 py-2 text-sm bg-white border border-neutral-200 rounded-md hover:bg-neutral-50"
                        >
                            Cancel
                        </button>
                    </div>
                </div>

                {/* Progress / Steps */}
                <div className="mt-4">
                    <div className="flex items-center gap-2 md:gap-4 overflow-x-auto pb-2">
                        {steps.map((s, i) => (
                            <button
                                key={s}
                                onClick={() => setStep(i)}
                                className={`flex-shrink-0 px-3 py-1 rounded-md text-sm font-medium whitespace-nowrap ${
                                    i === step ? "bg-emerald-600 text-white" : "bg-neutral-100 text-neutral-700"
                                }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>

                    <div className="w-full h-2 bg-neutral-100 rounded-full mt-3">
                        <div
                            className="h-2 bg-emerald-600 rounded-full"
                            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Step content */}
                <div className="mt-6">
                    {/* STEP 0 - DETAILS */}
                    {step === 0 && (
                        <div className="space-y-4">
                            <label className="block">
                                <span className="text-sm text-neutral-600">Title</span>
                                <input
                                    className="mt-1 w-full rounded-md border border-neutral-200 p-2 text-sm"
                                    placeholder="E.g. Cholera Case Management"
                                    value={form.title}
                                    onChange={(e) => update("title", e.target.value)}
                                />
                            </label>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <label>
                                    <span className="text-sm text-neutral-600">Category</span>
                                    <select
                                        value={form.category}
                                        onChange={(e) => update("category", e.target.value)}
                                        className="mt-1 w-full rounded-md border border-neutral-200 p-2 text-sm"
                                    >
                                        <option>Disease-Specific</option>
                                        <option>Certification Program</option>
                                        <option>Team Coordination</option>
                                        <option>Outbreak Response</option>
                                        <option>Custom</option>
                                    </select>
                                </label>

                                <label>
                                    <span className="text-sm text-neutral-600">Mode</span>
                                    <select
                                        value={form.mode}
                                        onChange={(e) => update("mode", e.target.value)}
                                        className="mt-1 w-full rounded-md border border-neutral-200 p-2 text-sm"
                                    >
                                        <option>Physical</option>
                                        <option>Online</option>
                                        <option>Hybrid</option>
                                    </select>
                                </label>
                            </div>

                            <label>
                                <span className="text-sm text-neutral-600">Description</span>
                                <textarea
                                    rows={4}
                                    value={form.description}
                                    onChange={(e) => update("description", e.target.value)}
                                    className="mt-1 w-full rounded-md border border-neutral-200 p-2 text-sm"
                                />
                            </label>

                            {/* conditional venue / link */}
                            {form.mode !== "Online" && (
                                <label>
                                    <span className="text-sm text-neutral-600">Venue</span>
                                    <input
                                        value={form.venue}
                                        onChange={(e) => update("venue", e.target.value)}
                                        className="mt-1 w-full rounded-md border border-neutral-200 p-2 text-sm"
                                        placeholder="E.g. Lilongwe Training Center"
                                    />
                                </label>
                            )}

                            {(form.mode === "Online" || form.mode === "Hybrid") && (
                                <label>
                                    <span className="text-sm text-neutral-600">Online link</span>
                                    <input
                                        value={form.onlineLink}
                                        onChange={(e) => update("onlineLink", e.target.value)}
                                        className="mt-1 w-full rounded-md border border-neutral-200 p-2 text-sm"
                                        placeholder="https://zoom.us/..."
                                    />
                                </label>
                            )}
                        </div>
                    )}

                    {/* STEP 1 - SCHEDULE */}
                    {step === 1 && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <label>
                                    <span className="text-sm text-neutral-600">Start date</span>
                                    <input
                                        type="date"
                                        value={form.startDate}
                                        onChange={(e) => update("startDate", e.target.value)}
                                        className="mt-1 w-full rounded-md border border-neutral-200 p-2 text-sm"
                                    />
                                </label>

                                <label>
                                    <span className="text-sm text-neutral-600">End date</span>
                                    <input
                                        type="date"
                                        value={form.endDate}
                                        onChange={(e) => update("endDate", e.target.value)}
                                        className="mt-1 w-full rounded-md border border-neutral-200 p-2 text-sm"
                                    />
                                </label>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <label>
                                    <span className="text-sm text-neutral-600">Start time (optional)</span>
                                    <input
                                        type="time"
                                        value={form.startTime}
                                        onChange={(e) => update("startTime", e.target.value)}
                                        className="mt-1 w-full rounded-md border border-neutral-200 p-2 text-sm"
                                    />
                                </label>

                                <label>
                                    <span className="text-sm text-neutral-600">End time (optional)</span>
                                    <input
                                        type="time"
                                        value={form.endTime}
                                        onChange={(e) => update("endTime", e.target.value)}
                                        className="mt-1 w-full rounded-md border border-neutral-200 p-2 text-sm"
                                    />
                                </label>
                            </div>

                            <label>
                                <span className="text-sm text-neutral-600">Estimated duration</span>
                                <input
                                    placeholder="e.g. 3 days"
                                    value={form.duration}
                                    onChange={(e) => update("duration", e.target.value)}
                                    className="mt-1 w-full rounded-md border border-neutral-200 p-2 text-sm"
                                />
                            </label>

                            <div className="flex gap-3 items-center">
                                <Calendar className="w-5 h-5 text-neutral-400" />
                                <div className="text-sm text-neutral-600">Dates will be used to open/close registration</div>
                            </div>
                        </div>
                    )}

                    {/* STEP 2 - TRAINERS */}
                    {step === 2 && (
                        <div className="space-y-4">
                            {form.trainers.map((t, i) => (
                                <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                                    <label className="md:col-span-1">
                                        <span className="text-sm text-neutral-600">Trainer name</span>
                                        <input
                                            value={t.name}
                                            onChange={(e) => updateTrainer(i, "name", e.target.value)}
                                            className="mt-1 w-full rounded-md border border-neutral-200 p-2 text-sm"
                                            placeholder="Full name"
                                        />
                                    </label>

                                    <label className="md:col-span-1">
                                        <span className="text-sm text-neutral-600">Email</span>
                                        <input
                                            value={t.email}
                                            onChange={(e) => updateTrainer(i, "email", e.target.value)}
                                            className="mt-1 w-full rounded-md border border-neutral-200 p-2 text-sm"
                                            placeholder="trainer@example.org"
                                        />
                                    </label>

                                    <div className="flex gap-2 md:col-span-1">
                                        <button
                                            onClick={() => removeTrainer(i)}
                                            className="px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-md text-sm"
                                        >
                                            Remove
                                        </button>
                                        {i === form.trainers.length - 1 && (
                                            <button
                                                onClick={addTrainer}
                                                className="px-3 py-2 bg-emerald-600 text-white rounded-md text-sm flex items-center gap-2"
                                            >
                                                <Plus className="w-4 h-4" />
                                                Add
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* STEP 3 - PARTICIPANTS */}
                    {step === 3 && (
                        <div className="space-y-4">
                            <label>
                                <span className="text-sm text-neutral-600">Target cadres (comma separated)</span>
                                <input
                                    placeholder="E.g. Nurse, Clinician, Lab Technician"
                                    value={form.targetCadres.join(", ")}
                                    onChange={(e) => update("targetCadres", e.target.value.split(",").map(s => s.trim()))}
                                    className="mt-1 w-full rounded-md border border-neutral-200 p-2 text-sm"
                                />
                            </label>

                            <label>
                                <span className="text-sm text-neutral-600">Required competencies (comma separated)</span>
                                <input
                                    placeholder="E.g. IPC, Case Management"
                                    value={form.requiredCompetencies}
                                    onChange={(e) => update("requiredCompetencies", e.target.value)}
                                    className="mt-1 w-full rounded-md border border-neutral-200 p-2 text-sm"
                                />
                            </label>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <label>
                                    <span className="text-sm text-neutral-600">Max participants</span>
                                    <input
                                        type="number"
                                        value={form.maxParticipants}
                                        onChange={(e) => update("maxParticipants", e.target.value)}
                                        className="mt-1 w-full rounded-md border border-neutral-200 p-2 text-sm"
                                    />
                                </label>

                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={form.autoApprove}
                                        onChange={(e) => update("autoApprove", e.target.checked)}
                                        className="w-4 h-4"
                                    />
                                    <span className="text-sm text-neutral-600">Auto-approve registrations</span>
                                </label>
                            </div>
                        </div>
                    )}

                    {/* STEP 4 - CERTIFICATION */}
                    {step === 4 && (
                        <div className="space-y-4">
                            <label className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={form.provideCertification}
                                    onChange={(e) => update("provideCertification", e.target.checked)}
                                    className="w-4 h-4"
                                />
                                <span className="text-sm text-neutral-700">Provide certification upon completion</span>
                            </label>

                            {form.provideCertification && (
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <label>
                                        <span className="text-sm text-neutral-600">Passing score (%)</span>
                                        <input
                                            type="number"
                                            value={form.passingScore}
                                            onChange={(e) => update("passingScore", Number(e.target.value))}
                                            className="mt-1 w-full rounded-md border border-neutral-200 p-2 text-sm"
                                        />
                                    </label>

                                    <label>
                                        <span className="text-sm text-neutral-600">Require attendance (%)</span>
                                        <input
                                            type="number"
                                            value={form.requireAttendancePercent}
                                            onChange={(e) => update("requireAttendancePercent", Number(e.target.value))}
                                            className="mt-1 w-full rounded-md border border-neutral-200 p-2 text-sm"
                                        />
                                    </label>

                                    <label>
                                        <span className="text-sm text-neutral-600">Notes (optional)</span>
                                        <input
                                            value={form.passingScore}
                                            onChange={(e) => update("passingScore", Number(e.target.value))}
                                            className="mt-1 w-full rounded-md border border-neutral-200 p-2 text-sm"
                                        />
                                    </label>
                                </div>
                            )}
                        </div>
                    )}

                    {/* STEP 5 - RESOURCES */}
                    {step === 5 && (
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-neutral-600">Upload materials</label>
                                <div className="mt-2 flex flex-col sm:flex-row gap-3 items-start">
                                    <input
                                        ref={fileRef}
                                        type="file"
                                        multiple
                                        onChange={(e) => addFiles(e.target.files)}
                                        className="text-sm"
                                    />

                                    <div className="flex-1">
                                        {form.materials.length === 0 ? (
                                            <p className="text-sm text-neutral-500">No files uploaded</p>
                                        ) : (
                                            <ul className="space-y-2">
                                                {form.materials.map((f, i) => (
                                                    <li key={i} className="flex items-center justify-between gap-4 bg-neutral-50 p-2 rounded-md">
                                                        <div className="text-sm text-neutral-800">{f.name}</div>
                                                        <div className="flex items-center gap-2">
                                                            <button onClick={() => removeFile(i)} className="text-sm text-red-600">Remove</button>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <label>
                                <span className="text-sm text-neutral-600">Attach agenda / notes (optional)</span>
                                <textarea className="mt-1 w-full rounded-md border border-neutral-200 p-2 text-sm" rows={3} />
                            </label>
                        </div>
                    )}

                    {/* STEP 6 - REVIEW */}
                    {step === 6 && (
                        <div className="space-y-4">
                            <h3 className="text-base font-medium">Review</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-neutral-50 p-3 rounded-md">
                                    <p className="text-sm text-neutral-500">Title</p>
                                    <p className="font-medium">{form.title || "—"}</p>

                                    <p className="mt-2 text-sm text-neutral-500">Category</p>
                                    <p className="font-medium">{form.category}</p>

                                    <p className="mt-2 text-sm text-neutral-500">Mode</p>
                                    <p className="font-medium">{form.mode}</p>
                                </div>

                                <div className="bg-neutral-50 p-3 rounded-md">
                                    <p className="text-sm text-neutral-500">Schedule</p>
                                    <p className="font-medium">{form.startDate} → {form.endDate}</p>

                                    <p className="mt-2 text-sm text-neutral-500">Venue / Link</p>
                                    <p className="font-medium">{form.venue || form.onlineLink || "—"}</p>
                                </div>
                            </div>

                            <div className="bg-neutral-50 p-3 rounded-md">
                                <p className="text-sm text-neutral-500">Trainers</p>
                                <ul className="mt-2 space-y-2">
                                    {form.trainers.map((t, i) => (
                                        <li key={i} className="text-sm">{t.name} {t.email ? `· ${t.email}` : ""}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-neutral-50 p-3 rounded-md">
                                <p className="text-sm text-neutral-500">Participants & Certification</p>
                                <p className="font-medium">Max: {form.maxParticipants || "—"} · Cert: {form.provideCertification ? "Yes" : "No"}</p>
                            </div>

                            <div className="bg-neutral-50 p-3 rounded-md">
                                <p className="text-sm text-neutral-500">Materials</p>
                                <ul className="mt-2 space-y-1">
                                    {form.materials.length === 0 ? <li className="text-sm text-neutral-500">No files</li> : form.materials.map((m, i) => <li key={i} className="text-sm">{m.name}</li>)}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-2 justify-between">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setStep((s) => Math.max(0, s - 1))}
                            disabled={step === 0}
                            className="px-4 py-2 rounded-md border border-neutral-200 bg-white text-sm disabled:opacity-50"
                        >
                            Back
                        </button>

                        <button
                            onClick={() => {
                                if (!validForStep(step)) return alert("Please complete required fields on this step.");
                                setStep((s) => Math.min(steps.length - 1, s + 1));
                            }}
                            className="px-4 py-2 rounded-md bg-emerald-600 text-white text-sm"
                        >
                            Next
                        </button>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={saveDraft}
                            className="px-4 py-2 rounded-md border border-neutral-200 bg-white text-sm"
                        >
                            Save draft
                        </button>

                        {step === steps.length - 1 ? (
                            <button
                                onClick={publish}
                                disabled={saving}
                                className="px-4 py-2 rounded-md bg-emerald-600 text-white text-sm"
                            >
                                {saving ? "Publishing..." : "Publish"}
                            </button>
                        ) : (
                            <button
                                onClick={() => setStep(steps.length - 1)}
                                className="px-4 py-2 rounded-md bg-neutral-50 border border-neutral-200 text-sm"
                            >
                                Jump to review
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
