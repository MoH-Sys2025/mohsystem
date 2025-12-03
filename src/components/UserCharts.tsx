import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import {
    Radar,
    RadarChart,
    PolarAngleAxis,
    PolarGrid,
    Legend,
    PolarRadiusAxis, Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid
} from "recharts";

export function PerfomanceBarChart() {

    const performanceData = [
        { name: "Feb", value: 55 },
        { name: "Mar", value: 36 },
        { name: "Apr", value: 80 },
        { name: "Jan", value: 60 },
        { name: "May", value: 90 },
        { name: "Jun", value: 40 },
        { name: "Jul", value: 27 },
        { name: "Aug", value: 71 },
        { name: "Sep", value: 34 },
    ];

    return (
        <Card className="w-full pt-4 shadow-sm rounded-lg">
            <CardHeader>
                <CardTitle className="text-xs">Performance Overview</CardTitle>
            </CardHeader>

            <CardContent className="w-full px-2">

                {/* FIXED HEIGHT */}
                <ResponsiveContainer width="100%" height={100}>
                    <BarChart
                        data={performanceData}
                        margin={{ top: 0, right: 2, bottom: 0, left: 2 }}
                    >
                        <XAxis
                            dataKey="name"
                            hide={true}
                            axisLine={false}
                            tickLine={false}
                            tick={false}
                        />
                        <YAxis
                            hide={true}
                            axisLine={false}
                            tickLine={false}
                            tick={false}
                        />
                        <Tooltip />
                        <Bar
                            dataKey="value"
                            fill="#434342FF"
                            background={{ fill: "#f1f1f3", radius: 40}}
                            radius={[40, 40, 40, 40]}
                        />
                    </BarChart>
                </ResponsiveContainer>

            </CardContent>
        </Card>
    );
}

export function CompetencyRadarChart() {
    /**
     * Expected competencies format:
     * [
     *   { name: "Triage", score: 75 },
     *   { name: "Case Mgmt", score: 60 },
     *   { name: "IPC", score: 90 },
     *   { name: "Leadership", score: 45 },
     *   { name: "Data Use", score: 70 }
     * ]
     */

    const competencies = [
        { name: "Triage", score: 75 },
        { name: "Case Mgmt", score: 60 },
        { name: "IPC", score: 90 },
        { name: "Leadership", score: 45 },
        { name: "Data Use", score: 70 }
    ];

    return (
        <div className="bg-white rounded-lg border border-neutral-200 p-4 h-80 md:h-full">
            <h2 className="text-xs font-semibold text-neutral-900 mb-4">
                Competency Profile
            </h2>

            <div className="w-full gorder">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={competencies}>
                        <PolarGrid stroke="#e5e7eb" />
                        <PolarAngleAxis
                            dataKey="name"
                            tick={{ fill: "#6b7280", fontSize: 12 }}
                        />
                        <PolarRadiusAxis
                            angle={90}
                            domain={[0, 100]}
                            tick={{ fill: "#9ca3af", fontSize: 11 }}
                        />

                        <Radar
                            name="Score"
                            dataKey="score"
                            stroke="#10b981"
                            fill="#10b981"
                            fillOpacity={0.35}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default function TaskCompletionStats() {

    const data = [
        { task: "Patient Assessments", completed: 92 },
        { task: "Reports Submitted", completed: 75 },
        { task: "Trainings Completed", completed: 60 },
        { task: "Field Visits", completed: 84 },
        { task: "Follow-ups", completed: 70 },
    ];

    return (
        <div className="bg-neutral-50 border border-neutral-200 h-80 md:h-full   rounded-lg p-4">
            <h2 className="text-xs font-semibold text-neutral-700 mb-4">
                Task Completion Stats
            </h2>

            <div className="w-full">
                <ResponsiveContainer>
                    <BarChart
                        layout="vertical"
                        data={data}
                        margin={{ left: 20, right: 20 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />

                        <XAxis
                            type="number"
                            domain={[0, 100]}
                            tick={{ fill: "#52525b", fontSize: 12 }}
                        />

                        <YAxis
                            dataKey="task"
                            type="category"
                            tick={{ fill: "#52525b", fontSize: 12 }}
                            width={150}
                        />

                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#fafafa",
                                border: "1px solid #e4e4e7",
                                borderRadius: "8px",
                            }}
                            labelStyle={{ color: "#3f3f46" }}
                            formatter={(value) => [`${value}%`, "Completed"]}
                        />

                        <Bar
                            dataKey="completed"
                            fill="#3f3f46"
                            radius={[6, 6, 6, 6]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}


