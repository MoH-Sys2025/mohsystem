import { GeoJSON, MapContainer } from "react-leaflet";
import malawiDistricts from "@/supabase/mw.json";
import { useEffect, useMemo, useState } from "react";
import { api } from "@/supabase/Functions.tsx";
import { districts } from "@/supabase/districts.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.tsx";
import {Loader2, Maximize2, Menu, Minimize2, Settings} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { Label } from "@/components/ui/label.tsx";

type DeploymentMapProps = {
    maximized: boolean;
    onToggleMaximize: () => void;
};

type DisplayMode =
    | "Deployments: Deployed"
    | "HCW: All"
    | "HCW: Employed"
    | "HCW: Unemployed"
    | "Deployments: Available";

export function DeploymentMap({ maximized, onToggleMaximize }: DeploymentMapProps) {

    const [activeDeployments, setActiveDeployments] = useState<Record<string, number>>({});
    const [workforceByDistrict, setWorkforceByDistrict] = useState<Record<string, any[]>>({});
    const [displayMode, setDisplayMode] = useState<DisplayMode>("Deployments: Deployed");
    const [isLoading, setIsLoading] = useState(false);
    const [showMarkers, setShowMarkers] = useState(true);
    const [showLegend, setShowLegend] = useState(true);

    /* ---------------------------
       Fetch data
    ---------------------------- */
    useEffect(() => {
        const fetchDeployments = async () => {
            setIsLoading(true);
            const counts = await api.getActiveDeploymentsByDistrict();
            const map = Object.fromEntries(districts.map(d => [d.id, d.name]));
            const result: Record<string, number> = {};

            for (const [id, value] of Object.entries(counts)) {
                if (map[id]) result[map[id]] = value;
            }
            setActiveDeployments(result);
            setIsLoading(false);
        };

        const fetchWorkforce = async () => {
            const personnel = await api.listPersonnel(10000);
            const grouped: Record<string, any[]> = {};

            personnel.forEach(p => {
                const district = p.metadata?.district;
                if (!district) return;
                if (!grouped[district]) grouped[district] = [];
                grouped[district].push(p);
            });

            setWorkforceByDistrict(grouped);
        };

        fetchDeployments();
        fetchWorkforce();
    }, []);

    /* ---------------------------
       Value resolver (CRITICAL)
    ---------------------------- */
    const getDistrictValue = (district: string) => {
        if (displayMode === "Deployments: Deployed") {
            return activeDeployments[district] ?? 0;
        }

        const workers = workforceByDistrict[district] ?? [];

        console.log(workers)
        switch (displayMode) {
            case "HCW: All":
                return workers.length;
            case "HCW: Employed":
                return workers.filter(w => w.employment_status === "Employed").length;
            case "HCW: Unemployed":
                return workers.filter(w => w.employment_status === "Unemployed").length;
            case "Deployments: Available":
                return workers.filter(w =>
                    Array.isArray(w.metadata?.worker_status) &&
                    w.metadata.worker_status.includes("Available")
                ).length;
            default:
                return 0;
        }
    };

    /* ---------------------------
       Color scale
    ---------------------------- */
    const getColor = (value: number) => {
        if (value >= 26) return "#7f1d1d";
        if (value >= 21) return "#b91c1c";
        if (value >= 16) return "#dc2626";
        if (value >= 11) return "#f97316";
        if (value >= 6) return "#facc15";
        if (value >= 1) return "#86efac";
        return "#e5e7eb";
    };

    /* ---------------- MAP BOUNDS (UNCHANGED) ---------------- */
    const bounds: [[number, number], [number, number]] = [
        [-17.2, 32.6],
        [-9.3, 35.9],
    ];

    /* ---------------------------
       GeoJSON style
    ---------------------------- */
    const geoJsonStyle = useMemo(
        () => (feature: any) => {
            const value = getDistrictValue(feature.properties.name);
            return {
                fillColor: getColor(value),
                color: "#1f2937",
                weight: 1,
                fillOpacity: 0.7,
            };
        },
        [displayMode, activeDeployments, workforceByDistrict]
    );

    /* ---------------------------
       Legend
    ---------------------------- */
    const Legend = () => (
        <div className="absolute bottom-2 left-2 bg-white/90 rounded border p-3 text-xs">
            <div className="font-medium mb-2">
                {displayMode}
            </div>
            <div className="space-y-1">
                <LegendItem color="#e5e7eb" label="0" />
                <LegendItem color="#86efac" label="1 – 5" />
                <LegendItem color="#facc15" label="6 – 10" />
                <LegendItem color="#f97316" label="11 – 15" />
                <LegendItem color="#dc2626" label="16 – 20" />
                <LegendItem color="#b91c1c" label="21 – 25" />
                <LegendItem color="#7f1d1d" label="26+" />
            </div>
        </div>
    );

    const LegendItem = ({ color, label }: { color: string; label: string }) => (
        <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded" style={{ backgroundColor: color }} />
            <span>{label}</span>
        </div>
    );

    /* ---------------------------
       Render
    ---------------------------- */
    return (
        <div className="bg-white rounded-xl border p-4">
            <div className="flex justify-between mb-4">
                <h2>HCW Distribution Map</h2>
                <div className="flex flex-row gap-1">
                    <div className="w-full flex flex-row">
                        <Popover>
                            <PopoverTrigger className="ml-auto" asChild>
                                <Button className="h-7 w-7" size="xs" variant="outline"><Menu /></Button>
                            </PopoverTrigger>
                            <PopoverContent align="end" className="flex flex-col justify-start items-center w-full p-1 z-99">
                                <Button className="text-left w-full justify-start font-normal h-7" onClick={() => setDisplayMode("HCW: All")} variant="ghost">HCW: All workers</Button>
                                <Button className="text-left w-full justify-start font-normal h-7" onClick={() => setDisplayMode("HCW: Employed")} variant="ghost">HCW: Employed</Button>
                                <Button className="text-left w-full justify-start font-normal h-7" onClick={() => setDisplayMode("HCW: Unemployed")} variant="ghost">HCW: Unemployed</Button>
                                <Button className="text-left w-full justify-start font-normal h-7" onClick={() => setDisplayMode("Deployments: Available")} variant="ghost">Deployments: Available</Button>
                                <Button className="text-left w-full justify-start font-normal h-7" onClick={() => setDisplayMode("Deployments: Deployed")} variant="ghost">Deployments: Deployed</Button>
                            </PopoverContent>
                        </Popover>
                    </div>
                    <Button size="xs" onClick={onToggleMaximize} variant="outline" className="h-7 w-7">
                        {maximized ? <Minimize2 /> : <Maximize2 />}
                    </Button>
                </div>
            </div>

            <div className="relative h-[800px] mt-4">
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-50">
                        <Loader2 className="animate-spin" />
                    </div>
                )}

                <div className="border h-full w-full rounded-xl p-4">
                    <MapContainer
                        center={[-13.4, 34.3]}
                        style={{ height: "100%", width: "100%", backgroundColor: "white"}}
                        bounds={bounds}
                        maxBounds={bounds}
                        maxBoundsViscosity={1.0}
                        scrollWheelZoom={false}
                        zoom={7}
                        minZoom={7}
                        maxZoom={9}
                        className="w-full h-full"
                    >
                        {!isLoading && (
                            <GeoJSON
                                key={displayMode}   // ensures re-render on display mode change
                                data={malawiDistricts}
                                style={geoJsonStyle}
                                onEachFeature={(feature, layer) => {
                                    const district = feature.properties.name;
                                    const value = getDistrictValue(district);

                                    // Show permanent marker if showMarkers is true
                                    if (showMarkers && value > 0) {
                                        layer.bindTooltip(
                                            `${district}: ${value}`,
                                            {
                                                permanent: true,
                                                direction: "center",
                                                className: "district-tooltip",
                                            }
                                        );
                                    } else {
                                        layer.unbindTooltip();
                                    }

                                    layer.bindPopup(`<strong>${district}</strong><br/>${value}`);
                                }}
                            />
                        )}

                    </MapContainer>
                </div>

                {showLegend && <Legend />}
            </div>
        </div>
    );
}
