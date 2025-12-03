import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";

const COLORS = [
    "#6B7280",
    "#4B5563",
    "#9CA3AF",
    "#374151",
    "#D1D5DB",
    "#1F2937",
];

export default function WorkerCadreDistribution() {
    const data = [
        { cadre: "Nurse", count: 120 },
        { cadre: "Midwife", count: 85 },
        { cadre: "Clinician", count: 60 },
        { cadre: "Lab Technician", count: 30 },
        { cadre: "Pharmacy Tech", count: 45 },
        { cadre: "HEW", count: 150 },
    ];

    return (
        <Card className="w-full bg-neutral-50">
            <CardHeader>
                <CardTitle className="text-neutral-800">
                    Worker Distribution by Cadre
                </CardTitle>
            </CardHeader>

            <CardContent>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            layout="vertical"
                            margin={{ top: 10, right: 30, left: 40, bottom: 10 }}
                        >
                            <XAxis
                                type="number"
                                hide={true}
                                axisLine={false}
                                tickLine={false}
                                tick={false}
                            />
                            <YAxis
                                dataKey="cadre" type="category" width={120}
                                hide={true}
                                axisLine={false}
                                tickLine={false}
                                tick={false}
                            />

                            {/*<XAxis type="number" />*/}
                            {/*<YAxis dataKey="cadre" type="category" width={120} />*/}
                            <Tooltip />

                            <Bar dataKey="count"
                                 radius={[40, 40, 40, 40]}
                                 fill="#434342FF"
                                 background={{radius: 40}}
                            >
                                {data.map((_, index) => (
                                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
