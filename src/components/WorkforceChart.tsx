import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { supabase } from "@/supabase/supabase.ts"; // adjust path if needed

export function WorkforceChart() {
    const [data, setData] = useState<{ month: string, deployed: number, available: number }[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            // 1️⃣ Fetch all personnel
            const { data: personnelData, error: personnelError } = await supabase
                .from("personnel")
                .select("id, created_at");

            if (personnelError) return console.error(personnelError);

            const totalWorkers = personnelData?.length ?? 0;

            // 2️⃣ Fetch active deployments
            const { data: deploymentsData, error: deploymentsError } = await supabase
                .from("deployments")
                .select("deployment_id, created_at")
                .eq("status", "Deployed");

            if (deploymentsError) return console.error(deploymentsError);

            // 3️⃣ Build monthly counts
            const months = [
                "Jan","Feb","Mar","Apr","May","Jun",
                "Jul","Aug","Sep","Oct","Nov","Dec"
            ];

            const deployedPerMonth: number[] = Array(12).fill(0);

            deploymentsData?.forEach(dep => {
                const date = new Date(dep.created_at);
                const month = date.getUTCMonth(); // 0–11
                deployedPerMonth[month] += 1;
            });

            const chartData = months.map((month, idx) => ({
                month,
                deployed: deployedPerMonth[idx],
                available: Math.max(totalWorkers - deployedPerMonth[idx], 0),
            }));

            setData(chartData);
        };

        fetchData();
    }, []);

    return (
        <div className="rounded-xl bg-white border border-neutral-200 p-2 md:p-6 h-full">
            <div className="mb-6">
                <h2 className="text-neutral-900 mb-1">Workforce Deployment Trends</h2>
                <p className="text-sm text-neutral-500">Monthly deployment vs availability statistics</p>
            </div>

            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }} barCategoryGap="14%" barGap={2}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
                        <XAxis dataKey="month" stroke="#a3a3a3" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#a3a3a3" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#ffffff',
                                border: '1px solid #e5e5e5',
                                borderRadius: '8px',
                                fontSize: '12px',
                            }}
                        />
                        <Bar dataKey="deployed" fill="#10b981" radius={[40, 40, 40, 40]} isAnimationActive={false} />
                        <Bar dataKey="available" fill="#acf6cc" radius={[40, 40, 40, 40]} isAnimationActive={false} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-neutral-200">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-emerald-500"></div>
                    <span className="text-sm text-neutral-600">Deployed</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-neutral-300"></div>
                    <span className="text-sm text-neutral-600">Available</span>
                </div>
            </div>
        </div>
    );
}
