import React, { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { ChevronDown } from "lucide-react";

import { supabase } from "@/supabase/supabase";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";

type ChartData = {
    month: string;
    deployed: number;
    available: number;
};

export function WorkforceChart() {
    const months = [
        "Jan","Feb","Mar","Apr","May","Jun",
        "Jul","Aug","Sep","Oct","Nov","Dec"
    ];

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonthIndex = today.getMonth();

    const [year, setYear] = useState<number>(currentYear);
    const [years, setYears] = useState<number[]>([]);
    const [data, setData] = useState<ChartData[]>([]);
    const [loading, setLoading] = useState(false);

    type PanelState = {
        visible: boolean;
        monthIndex: number;
        type: "available" | "deployed";
        loading: boolean;
        personnel: any[];
    };

    const [panel, setPanel] = useState<PanelState>({
        visible: true,
        monthIndex: currentMonthIndex,
        type: "available",
        loading: true,
        personnel: [],
    });

    async function fetchAllRows<T>(
        table: string,
        buildQuery: (q: any) => any,
        pageSize = 1000
    ): Promise<T[]> {
        let page = 0;
        let all: T[] = [];

        while (true) {
            const from = page * pageSize;
            const to = from + pageSize - 1;

            const query = buildQuery(
                supabase
                    .from(table)
                    .select("*")
                    .range(from, to) // ✅ range AFTER select (v1)
            );

            const { data, error } = await query;

            if (error) throw error;
            if (!data || data.length === 0) break;

            all = all.concat(data);
            if (data.length < pageSize) break;

            page++;
        }

        return all;
    }


    /* ---------------- Fetch available years ---------------- */
    useEffect(() => {
        const fetchYears = async () => {
            try {
                const deployments = await fetchAllRows<{ created_at: string }>(
                    "deployments",
                    q => q.select("created_at")
                );

                const uniqueYears = Array.from(
                    new Set(deployments.map(d => new Date(d.created_at).getFullYear()))
                ).sort((a, b) => b - a);

                if (uniqueYears.length) {
                    setYears(uniqueYears);
                    setYear(uniqueYears[0]); // latest year
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchYears();
    }, []);


    /* ---------------- Fetch chart data ---------------- */
    useEffect(() => {
        if (!year) return;

        const fetchData = async () => {
            setLoading(true);

            try {
                const personnel = await fetchAllRows<{ created_at: string }>(
                    "personnel",
                    q => q
                        .select("created_at")
                        .lte("created_at", `${year}-12-31`)
                );

                const deployments = await fetchAllRows<{ created_at: string }>(
                    "deployments",
                    q => q
                        .select("created_at")
                        .eq("status", "Deployed")
                        .gte("created_at", `${year}-01-01`)
                        .lte("created_at", `${year}-12-31`)
                );

                const deployedPerMonth = Array(12).fill(0);
                deployments.forEach(dep => {
                    deployedPerMonth[new Date(dep.created_at).getMonth()]++;
                });

                const isCurrentYear = year === currentYear;
                const lastMonthIndex = isCurrentYear ? currentMonthIndex : 11;

                const chartData: ChartData[] = months
                    .slice(0, lastMonthIndex + 1)
                    .map((month, idx) => {
                        const endOfMonth = new Date(year, idx + 1, 0, 23, 59, 59);
                        const personnelUpToMonth = personnel.filter(
                            p => new Date(p.created_at) <= endOfMonth
                        ).length;

                        return {
                            month,
                            deployed: deployedPerMonth[idx],
                            available: Math.max(personnelUpToMonth - deployedPerMonth[idx], 0),
                        };
                    });

                setData(chartData);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };


        fetchData();
    }, [year]);

    /* ---------------- Fetch available personnel ---------------- */
    const fetchAvailablePersonnel = async (monthIndex: number) => {
        const start = new Date(year, monthIndex, 1);
        const end = new Date(year, monthIndex + 1, 0, 23, 59, 59);

        const personnel = await fetchAllRows<any>(
            "personnel",
            q => q
                .select("id, first_name, last_name, created_at")
                .lte("created_at", end.toISOString())
        );


        const deployed = await fetchAllRows<any>(
            "deployments",
            q => q
                .select("personnel_id")
                .eq("status", "Deployed")
                .gte("created_at", start.toISOString())
                .lte("created_at", end.toISOString())
        );
        const deployedIds = new Set(deployed?.map(d => d.personnel_id));
        const available = personnel?.filter(p => !deployedIds.has(p.id)) ?? [];

        setPanel(prev => ({
            ...prev,
            loading: false,
            personnel: available,
        }));
    };

    /* ---------------- Fetch deployed personnel ---------------- */
    const fetchDeployedPersonnel = async (monthIndex: number) => {
        const start = new Date(year, monthIndex, 1);
        const end = new Date(year, monthIndex + 1, 0, 23, 59, 59);

        // 1️⃣ Get personnel_ids
        const { data: deployments, error: depError } = await supabase
            .from("deployments")
            .select("personnel_id")
            .eq("status", "Deployed")
            .gte("created_at", start.toISOString())
            .lte("created_at", end.toISOString());

        if (depError) {
            console.error(depError);
            setPanel(prev => ({ ...prev, loading: false }));
            return;
        }

        const personnelIds = deployments?.map(d => d.personnel_id) ?? [];

        if (personnelIds.length === 0) {
            setPanel(prev => ({ ...prev, loading: false, personnel: [] }));
            return;
        }

        // 2️⃣ Fetch personnel info
        const { data: personnel, error: perError } = await supabase
            .from("personnel")
            .select("id, first_name, last_name")
            .in("id", personnelIds);

        if (perError) {
            console.error(perError);
            setPanel(prev => ({ ...prev, loading: false }));
            return;
        }

        setPanel(prev => ({
            ...prev,
            loading: false,
            personnel: personnel ?? [],
        }));
    };

    /* ---------------- Initial fetch for current month ---------------- */
    useEffect(() => {
        if (!year) return;

        setPanel(prev => ({ ...prev, loading: true }));
        fetchAvailablePersonnel(panel.monthIndex);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [year]);

    /* ---------------- Bar click handler ---------------- */
    const handleBarClick = (monthIndex: number) => {
        setPanel(prev => ({
            ...prev,
            monthIndex,
            loading: true,
            type: "available",
        }));
        fetchAvailablePersonnel(monthIndex);
    };

    /* ---------------- Panel toggle ---------------- */
    const togglePanelType = () => {
        const newType = panel.type === "available" ? "deployed" : "available";
        setPanel(prev => ({ ...prev, type: newType, loading: true }));

        if (newType === "available") fetchAvailablePersonnel(panel.monthIndex);
        else fetchDeployedPersonnel(panel.monthIndex);
    };

    return (
        <div className="rounded-xl bg-white border border-neutral-200 p-1 md:p-4 h-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-neutral-900 mb-1">
                        Workforce Deployment Trends
                    </h2>
                    <p className="text-sm text-neutral-500">
                        Monthly deployment vs availability statistics
                    </p>
                </div>

                {/* Year selector */}
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="flex items-center gap-2">
                            {year}
                            <ChevronDown className="h-4 w-4" />
                        </Button>
                    </PopoverTrigger>

                    <PopoverContent align="end" className="w-28 p-1">
                        {years.map(y => (
                            <button
                                key={y}
                                onClick={() => setYear(y)}
                                className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-neutral-100
                  ${y === year ? "bg-neutral-100 font-medium" : ""}
                `}
                            >
                                {y}
                            </button>
                        ))}
                    </PopoverContent>
                </Popover>
            </div>

            {/* Chart with sticky panel */}
            <div className="md:h-80">
                <div className="flex flex-col md:grid md:grid-cols-[280px_1fr] gap-4 h-full">
                    {/* Panel */}
                    {panel.visible && (
                        <div className="md:relative w-full">
                            <div className="rounded-xl border bg-white p-4 shadow-sm
                        md:sticky md:top-6">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 gap-2">
                                    <div>
                                        <h3 className="font-medium text-sm">
                                            {panel.type === "deployed" ? "Deployed Personnel" : "Available Personnel"}
                                        </h3>
                                        <p className="text-xs text-neutral-500">
                                            {months[panel.monthIndex]} {year}, {panel.personnel.length} HCW
                                        </p>
                                    </div>

                                    <button
                                        onClick={togglePanelType}
                                        className="text-xs text-blue-500 hover:text-blue-700"
                                    >
                                        Switch to {panel.type === "available" ? "Deployed" : "Available"}
                                    </button>
                                </div>

                                {panel.loading ? (
                                    <p className="text-sm text-neutral-500">Loading…</p>
                                ) : panel.personnel.length === 0 ? (
                                    <p className="text-sm text-neutral-500">No personnel found</p>
                                ) : (
                                    <ul className="space-y-2 max-h-72 overflow-auto">
                                        {panel.personnel.map((p) => (
                                            <li key={p.id} className="text-sm border-b pb-1 last:border-b-0">
                                                {p.first_name} {p.last_name}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Chart */}
                    <div className="h-80 md:h-full w-full">
                        {loading ? (
                            <div className="flex items-center justify-center h-full text-sm text-neutral-500">
                                Loading chart…
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart className="p-0 right-5 md:mr-0" data={data} barCategoryGap="14%" barGap={2}
                                          margin={{ top: 0, right: 2, bottom: 0, left: 0 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                                    <YAxis tickLine={false} axisLine={false} fontSize={12} />
                                    <Tooltip wrapperClassName="rounded-lg" />
                                    <Bar
                                        dataKey="deployed"
                                        radius={[40, 40, 40, 40]}
                                        isAnimationActive={false}
                                        onClick={(data, index) => handleBarClick(index)}
                                        fill="#047857"
                                    />
                                    <Bar
                                        dataKey="available"
                                        radius={[40, 40, 40, 40]}
                                        isAnimationActive={false}
                                        onClick={(data, index) => handleBarClick(index)}
                                        fill="#6ee7b7"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>
            </div>



            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-neutral-200">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-emerald-500" />
                    <span className="text-sm text-neutral-600">Deployed</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-emerald-200" />
                    <span className="text-sm text-neutral-600">Available</span>
                </div>
            </div>
        </div>
    );
}

