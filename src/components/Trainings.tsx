import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, ChevronDown, ChevronUp, FileBadge, Filter, BadgeCheck, CircleX } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// ICON MAPPER FOR TRAINING TYPES
const getTrainingIcon = (title) => {
    if (title.toLowerCase().includes("cholera")) return "💧";
    if (title.toLowerCase().includes("ipc")) return "🧤";
    if (title.toLowerCase().includes("vaccin")) return "💉";
    if (title.toLowerCase().includes("polio")) return "🧬";
    return "📘";
};

export function TrainingSection() {
    const trainingsData = [
        {
            title: "Cholera Case Management",
            provider: "MoH & WHO",
            date: "2024-08-12",
            accredited: true,
            certificate: true,
        },
        {
            title: "Emergency IPC Training",
            provider: "PHIM",
            date: "2024-04-03",
            accredited: true,
            certificate: true,
        },
        {
            title: "Polio Vaccination Response",
            provider: "UNICEF",
            date: "2023-01-20",
            accredited: false,
            certificate: false,
        },
        {
            title: "Outbreak Surveillance Skills",
            provider: "AFENET",
            date: "2022-11-14",
            accredited: true,
            certificate: true,
        },
        {
            title: "Epidemiology Basics",
            provider: "MoH",
            date: "2021-06-02",
            accredited: false,
            certificate: false,
        },
    ];

    // STATES
    const [expanded, setExpanded] = useState(false);
    const [filterYear, setFilterYear] = useState("all");
    const [filterProvider, setFilterProvider] = useState("all");
    const [filterAccredited, setFilterAccredited] = useState("all");
    const [sort, setSort] = useState("newest");

    const years = ["all", ...new Set(trainingsData.map(t => t.date.split("-")[0]))];
    const providers = ["all", ...new Set(trainingsData.map(t => t.provider))];

    // FILTER + SORT PIPELINE
    let trainings = [...trainingsData];

    if (filterYear !== "all")
        trainings = trainings.filter(t => t.date.startsWith(filterYear));

    if (filterProvider !== "all")
        trainings = trainings.filter(t => t.provider === filterProvider);

    if (filterAccredited !== "all")
        trainings = trainings.filter(t => t.accredited === (filterAccredited === "true"));

    if (sort === "newest") {
        trainings.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sort === "oldest") {
        trainings.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    const visibleTrainings = expanded ? trainings : trainings.slice(0, 3);

    // PROGRESS CALCULATION
    const requiredTrainings = 10; // You can change this later (configurable)
    const progressPercent = (trainingsData.length / requiredTrainings) * 100;

    return (
        <Card className="border bg-white rounded-lg">
            <CardContent className="space-y-4 p-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium flex items-center gap-2">
                        <GraduationCap size={18} />
                        Trainings
                    </h2>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-2 text-xs">
                    <select
                        className="px-2 py-1 border rounded text-xs"
                        value={filterYear}
                        onChange={(e) => setFilterYear(e.target.value)}
                    >
                        {years.map((yr, i) => (
                            <option key={i} value={yr}>{yr === "all" ? "All Years" : yr}</option>
                        ))}
                    </select>

                    <select
                        className="px-2 py-1 border rounded text-xs"
                        value={filterProvider}
                        onChange={(e) => setFilterProvider(e.target.value)}
                    >
                        {providers.map((p, i) => (
                            <option key={i} value={p}>{p === "all" ? "All Providers" : p}</option>
                        ))}
                    </select>

                    <select
                        className="px-2 py-1 border rounded text-xs"
                        value={filterAccredited}
                        onChange={(e) => setFilterAccredited(e.target.value)}
                    >
                        <option value="all">All</option>
                        <option value="true">Accredited</option>
                        <option value="false">Not Accredited</option>
                    </select>

                    <select
                        className="px-2 py-1 border rounded text-xs"
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                    >
                        <option value="newest">Sort: Newest</option>
                        <option value="oldest">Sort: Oldest</option>
                    </select>
                </div>

                {/* Summary Row */}
                <div className="flex gap-3 flex-wrap text-xs text-neutral-600">
                    <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                        Completed: {trainingsData.length}
                    </div>
                    <div className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                        Accredited: {trainingsData.filter(t => t.accredited).length}
                    </div>
                    <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full">
                        Required: {requiredTrainings}
                    </div>
                </div>

                {/* Progress Bar */}
                <div>
                    <p className="text-xs text-neutral-600 mb-1">Training Progress</p>
                    <Progress value={progressPercent} className="h-2" />
                </div>

                <Separator />

                {/* TRAINING TIMELINE LIST */}
                <ul className="space-y-4 text-sm">
                    {visibleTrainings.map((t, index) => (
                        <li key={index} className="border-l-2 border-neutral-300 pl-4 relative">

                            {/* timeline bullet */}
                            <div className="absolute -left-[5px] top-1 w-2 h-2 bg-blue-500 rounded-full"></div>

                            {/* Title Row */}
                            <div className="flex items-center justify-between">
                <span className="font-medium flex items-center gap-2">
                  <span>{getTrainingIcon(t.title)}</span>
                    {t.title}
                </span>

                                {/* Certificate Icon */}
                                {t.certificate && (
                                    <FileBadge size={16} className="text-blue-500 cursor-pointer" />
                                )}
                            </div>

                            {/* Provider + Date */}
                            <p className="text-xs text-neutral-600 mt-1">
                                {t.provider} • {t.date}
                            </p>

                            {/* Accreditation Badge */}
                            <div className="mt-1">
                                {t.accredited ? (
                                    <span className="px-2 py-0.5 text-[10px] bg-green-100 text-green-700 rounded-full flex w-fit items-center gap-1">
                    <BadgeCheck size={10} /> Accredited
                  </span>
                                ) : (
                                    <span className="px-2 py-0.5 text-[10px] bg-red-100 text-red-700 rounded-full flex w-fit items-center gap-1">
                    <CircleX size={10} /> Not Accredited
                  </span>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>

                {/* SHOW MORE / LESS BUTTON */}
                {trainings.length > 3 && (
                    <button
                        className="text-blue-600 text-xs flex items-center gap-1"
                        onClick={() => setExpanded(!expanded)}
                    >
                        {expanded ? <>Show Less <ChevronUp size={14} /></> : <>Show More <ChevronDown size={14} /></>}
                    </button>
                )}

            </CardContent>
        </Card>
    );
}
