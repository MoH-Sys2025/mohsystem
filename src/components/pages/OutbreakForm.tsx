// src/components/pages/OutbreakForm.tsx
import React, { useState } from "react";
import { supabase } from "@/supabase/supabase";
import {
    Select,
    SelectTrigger,
    SelectItem,
    SelectContent,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

type OutbreakFormState = {
    outbreak_name: string;
    disease: string;
    district: string;
    facility: string;
    date_started: string;
    date_ended: string;
    suspected_cases: number | "";
    confirmed_cases: number | "";
    deaths: number | "";
    status: "active" | "contained" | "closed";
};

export default function OutbreakForm({ onSuccess }: { onSuccess?: () => void }) {
    const [formData, setFormData] = useState<OutbreakFormState>({
        outbreak_name: "",
        disease: "",
        district: "",
        facility: "",
        date_started: "",
        date_ended: "",
        suspected_cases: 0,
        confirmed_cases: 0,
        deaths: 0,
        status: "active",
    });

    const [loading, setLoading] = useState(false);

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        const { name, value, type } = e.target as HTMLInputElement;

        if (type === "number") {
            setFormData((prev) => ({
                ...prev,
                [name]: value === "" ? "" : Number(value),
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        const payload = {
            outbreak_name: formData.outbreak_name || null,
            disease: formData.disease || null,
            district: formData.district || null,
            facility: formData.facility || null,
            date_started: formData.date_started || null,
            date_ended: formData.date_ended || null,
            suspected_cases:
                formData.suspected_cases === "" ? 0 : formData.suspected_cases,
            confirmed_cases:
                formData.confirmed_cases === "" ? 0 : formData.confirmed_cases,
            deaths: formData.deaths === "" ? 0 : formData.deaths,
            status: formData.status,
        };

        const { error } = await supabase.from("outbreaks").insert([payload]);
        setLoading(false);

        if (error) {
            alert("Failed: " + error.message);
            return;
        }

        alert("Outbreak saved!");
        onSuccess?.();
    }

    return (
        <Card className=" mx-auto shadow-none border-none md:p-4">
            <CardHeader>
                <CardTitle className="text-lg font-semibold">Add New Outbreak</CardTitle>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Outbreak Name */}
                    <div className="space-y-1">
                        <Label>Outbreak Name</Label>
                        <Input
                            name="outbreak_name"
                            value={formData.outbreak_name}
                            onChange={handleChange}
                            placeholder="e.g. Cholera Outbreak"
                        />
                    </div>

                    {/* Disease */}
                    <div className="space-y-1">
                        <Label>Disease</Label>
                        <Input
                            name="disease"
                            value={formData.disease}
                            onChange={handleChange}
                            placeholder="Cholera, Measles..."
                        />
                    </div>

                    {/* District */}
                    <div className="space-y-1">
                        <Label>District</Label>
                        <Input
                            name="district"
                            value={formData.district}
                            onChange={handleChange}
                            placeholder="Lilongwe, Blantyre..."
                        />
                    </div>

                    {/* Facility */}
                    <div className="space-y-1">
                        <Label>Facility (optional)</Label>
                        <Input
                            name="facility"
                            value={formData.facility}
                            onChange={handleChange}
                            placeholder="Bwaila Hospital"
                        />
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label>Date Started</Label>
                            <Input
                                type="date"
                                name="date_started"
                                value={formData.date_started}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-1">
                            <Label>Date Ended</Label>
                            <Input
                                type="date"
                                name="date_ended"
                                value={formData.date_ended}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Numbers */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                            <Label>Suspected Cases</Label>
                            <Input
                                type="number"
                                name="suspected_cases"
                                value={formData.suspected_cases}
                                onChange={handleChange}
                                min={0}
                            />
                        </div>

                        <div className="space-y-1">
                            <Label>Confirmed Cases</Label>
                            <Input
                                type="number"
                                name="confirmed_cases"
                                value={formData.confirmed_cases}
                                onChange={handleChange}
                                min={0}
                            />
                        </div>

                        <div className="space-y-1">
                            <Label>Deaths</Label>
                            <Input
                                type="number"
                                name="deaths"
                                value={formData.deaths}
                                onChange={handleChange}
                                min={0}
                            />
                        </div>
                    </div>

                    {/* Status */}
                    <div className="space-y-1">
                        <Label>Status</Label>
                        <Select
                            onValueChange={(v) =>
                                setFormData((prev) => ({ ...prev, status: v as any }))
                            }
                            value={formData.status}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="contained">Contained</SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Submit Button */}
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Saving..." : "Save Outbreak"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
