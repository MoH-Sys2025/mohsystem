import { useState } from "react";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "./ui/input-group";
import { Loader2, Search } from "lucide-react";
import { supabase } from "../supabase/supabase";
import { ScrollArea } from "./ui/scroll-area";
import { useSelectedMOHData } from "@/components/DataContext";
import { useNavigate } from "react-router-dom";
import { Users, GraduationCap, FileText } from "lucide-react";

type SearchResult = {
    type: "Personnel" | "Training" | "Document";
    label: string;
    sub: string | null;
    id: string;
    data: any; // full row object
};

export default function SearchAll() {
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [limit_] = useState<number>(10);

    const personnelCount = results.filter(r => r.type === "Personnel").length;
    const trainingCount = results.filter(r => r.type === "Training").length;
    const documentCount = results.filter(r => r.type === "Document").length;

    const navigate = useNavigate();
    const { setSelectedMOHData } = useSelectedMOHData();

    async function handleSearch(value: string) {
        setSearchTerm(value);

        if (value.length < 2) {
            setResults([]);
            return;
        }

        setLoading(true);
        const term = `%${value}%`;

        try {
            const [personnelRes, trainingsRes, docsRes] = await Promise.all([
                supabase
                    .from("personnel")
                    .select("*")
                    .or(
                        `first_name.ilike.${term},last_name.ilike.${term},personnel_identifier.ilike.${term}`
                    )
                    .limit(limit_),

                supabase
                    .from("trainings")
                    .select("*")
                    .ilike("title", term)
                    .limit(limit_),

                supabase
                    .from("attachments")
                    .select("*")
                    .ilike("file_name", term)
                    .limit(limit_),
            ]);

            const merged: SearchResult[] = [
                ...(personnelRes.data ?? []).map((p: any) => ({
                    type: "Personnel",
                    label: `${p.first_name ?? ""} ${p.last_name ?? ""}`.trim(),
                    sub: p.personnel_identifier,
                    id: p.id,
                    data: p, // 👈 full personnel row
                })),

                ...(trainingsRes.data ?? []).map((t: any) => ({
                    type: "Training",
                    label: t.title,
                    sub: t.location,
                    id: t.id,
                    data: t, // 👈 full training row
                })),

                ...(docsRes.data ?? []).map((d: any) => ({
                    type: "Document",
                    label: d.file_name,
                    sub: d.owner_table,
                    id: d.id,
                    data: d, // 👈 full attachment row
                })),
            ];

            setResults(merged);
        } catch (err) {
            throw err;
        } finally {
            setLoading(false);
        }
    }

    function handleSelect(item: SearchResult) {
        console.log("SELECTED FULL ROW:", item.data);

        // save in context (still useful)
        setSelectedMOHData(item.data);

        if (item.type === "Personnel") {
            navigate("/dashboard/workregistry/profile", {
                state: { selected: item.data },
            });
        }

        if (item.type === "Training") {
            navigate("/dashboard/trainings/view", {
                state: { selected: item.data },
            });
        }

        if (item.type === "Document") {
            navigate("/dashboard/documents/view", {
                state: { selected: item.data },
            });
        }

        setResults([]);
        setSearchTerm("");
    }


    return (
        <div className="relative w-full">
            <InputGroup>
                <InputGroupInput
                    placeholder="Search personnel, trainings, documents..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                />

                <InputGroupAddon>
                    {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Search />
                    )}
                </InputGroupAddon>

                <InputGroupAddon align="inline-end">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1 bg-neutral-200 rounded-sm cursor-pointer p-[5px] border-1 border-neutral-200 hover:border-green-400">
                            <Users className="h-4 w-4" />
                            {personnelCount}
                        </div>

                        <div className="flex items-center gap-1 bg-neutral-200 rounded-sm cursor-pointer p-[5px] border-1 border-neutral-200 hover:border-green-400">
                            <GraduationCap className="h-4 w-4" />
                            {trainingCount}
                        </div>

                        <div className="flex items-center gap-1 bg-neutral-200 rounded-sm cursor-pointer p-[5px] border-1 border-neutral-200 hover:border-green-400">
                            <FileText className="h-4 w-4" />
                            {documentCount}
                        </div>
                    </div>
                </InputGroupAddon>

            </InputGroup>

            {results.length > 0 && (
                <div className="absolute z-50 mt-0.5 w-full rounded-md border bg-background shadow-md">
                    <ScrollArea className="max-h-72 truncate py-3">
                        {results.map((item, i) => (
                            <div key={i} onClick={() => handleSelect(item)}
                                className="px-3 py-2 hover:bg-muted cursor-pointer text-sm">
                                <div className="font-medium">{item.label}</div>
                                <div className="text-xs text-muted-foreground">
                                    {item.type} • {item.sub || "—"}
                                </div>
                            </div>
                        ))}
                    </ScrollArea>
                </div>
            )}
        </div>
    );
}
