import { useEffect, useState, useMemo } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
    GraduationCap,
    ChevronDown,
    ChevronUp,
    FileBadge,
    CircleCheck,
    CircleX,
} from "lucide-react";

import { supabase} from "@/supabase/supabase.ts";

/* ICON MAPPER */
const getTrainingIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes("cholera")) return "💧";
    if (t.includes("ipc")) return "🧤";
    if (t.includes("vaccin")) return "💉";
    if (t.includes("polio")) return "🧬";
    return "📘";
};

type TrainingRow = {
    id: string;
    title: string;
    provider: string;
    institution?: string;
    start_date: string;
    end_date?: string;
    attended: boolean;
    attendance_certificate_url: string | null;
    score: number | null;
    modality?: string;
};

export function TrainingSection({ personnelId }: { personnelId: string }) {
    const [rows, setRows] = useState<TrainingRow[]>([]);
    const [expanded, setExpanded] = useState(false);

    const [filterYear, setFilterYear] = useState("all");
    const [filterProvider, setFilterProvider] = useState("all");
    const [sort, setSort] = useState("newest");

    /* FETCH ALL DATA FROM SUPABASE */
    useEffect(() => {
        const fetchTrainings = async () => {
            const { data, error } = await supabase
                .from("training_participants")
                .select(`
          attended,
          attendance_certificate_url,
          score,
          completion_date,
          trainings (
            id,
            title,
            provider,
            provider_id,
            start_date,
            end_date,
            modality,
            training_institutions!inner (
              name
            )
          )
        `)
                .eq("personnel_id", personnelId);

            if (!error && data) {
                const normalized = data.map(tp => ({
                    id: tp.trainings.id,
                    title: tp.trainings.title,
                    provider: tp.trainings.provider,
                    institution: tp.trainings.training_institutions?.name ?? undefined,
                    start_date: tp.trainings.start_date,
                    end_date: tp.trainings.end_date,
                    modality: tp.trainings.modality,
                    attended: tp.attended,
                    attendance_certificate_url: tp.attendance_certificate_url,
                    score: tp.score,
                }));
                setRows(normalized);
            }
        };

        fetchTrainings();
    }, [personnelId]);

    /* DERIVE FILTER OPTIONS FROM DB DATA */
    const years = useMemo(() => {
        const uniqueYears = new Set(rows.map(r => r.start_date?.slice(0, 4)));
        return ["all", ...Array.from(uniqueYears)];
    }, [rows]);

    const providers = useMemo(() => {
        const uniqueProviders = new Set(rows.map(r => r.provider ?? r.institution ?? "Unknown"));
        return ["all", ...Array.from(uniqueProviders)];
    }, [rows]);

    /* FILTER + SORT */
    const filtered = useMemo(() => {
        let data = [...rows];

        if (filterYear !== "all")
            data = data.filter(r => r.start_date.startsWith(filterYear));

        if (filterProvider !== "all")
            data = data.filter(
                r => (r.provider ?? r.institution ?? "Unknown") === filterProvider
            );

        data.sort((a, b) =>
            sort === "newest"
                ? new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
                : new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
        );

        return data;
    }, [rows, filterYear, filterProvider, sort]);

    const visible = expanded ? filtered : filtered.slice(0, 3);

    /* PROGRESS */
    const completedCount = rows.filter(r => r.attended).length;
    const progressPercent = rows.length ? (completedCount / rows.length) * 100 : 0;

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                    <GraduationCap size={18} /> Trainings
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* FILTERS */}
                <div className="flex flex-wrap gap-2">
                    <Select value={filterYear} onValueChange={setFilterYear}>
                        <SelectTrigger className="w-[130px]">
                            <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                            {years.map(y => (
                                <SelectItem key={y} value={y}>
                                    {y === "all" ? "All years" : y}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={filterProvider} onValueChange={setFilterProvider}>
                        <SelectTrigger className="w-[160px]">
                            <SelectValue placeholder="Provider" />
                        </SelectTrigger>
                        <SelectContent>
                            {providers.map(p => (
                                <SelectItem key={p} value={p}>
                                    {p === "all" ? "All providers" : p}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={sort} onValueChange={setSort}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Sort" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Newest first</SelectItem>
                            <SelectItem value="oldest">Oldest first</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* SUMMARY */}
                <div className="flex gap-2 text-xs flex-wrap">
                    <Badge variant="secondary">Completed {completedCount}</Badge>
                    <Badge variant="outline">Total {rows.length}</Badge>
                </div>

                {/* PROGRESS */}
                <div>
                    <p className="text-xs text-muted-foreground mb-1">
                        Completion progress
                    </p>
                    <Progress value={progressPercent} className="h-2" />
                </div>

                <Separator />

                {/* TRAINING LIST */}
                <ul className="space-y-4 text-sm">
                    {visible.map((t, i) => (
                        <li key={i} className="border-l-2 pl-4 relative">
                            <span className="absolute -left-[6px] top-2 w-3 h-3 bg-primary rounded-full" />

                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-medium flex items-center gap-2">
                                        {getTrainingIcon(t.title)} {t.title}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {t.provider ?? t.institution} • {t.start_date}
                                    </p>
                                </div>

                                {t.attendance_certificate_url && (
                                    <FileBadge
                                        size={16}
                                        className="text-primary cursor-pointer"
                                        onClick={() =>
                                            window.open(t.attendance_certificate_url, "_blank")
                                        }
                                    />
                                )}
                            </div>

                            <div className="mt-1">
                                {t.attended ? (
                                    <Badge className="gap-1">
                                        <CircleCheck size={12} /> Attended
                                    </Badge>
                                ) : (
                                    <Badge variant="destructive" className="gap-1">
                                        <CircleX size={12} /> Not attended
                                    </Badge>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>

                {/* SHOW MORE */}
                {filtered.length > 3 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setExpanded(!expanded)}
                    >
                        {expanded ? (
                            <>
                                Show less <ChevronUp size={14} />
                            </>
                        ) : (
                            <>
                                Show more <ChevronDown size={14} />
                            </>
                        )}
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}
