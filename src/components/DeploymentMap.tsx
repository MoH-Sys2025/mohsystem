import { GeoJSON, MapContainer } from "react-leaflet";
import malawiDistricts from "@/supabase/mw.json";
import {JSX, useEffect, useMemo, useState} from "react";
import { api } from "@/supabase/Functions.tsx";
import { districts } from "@/supabase/districts.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Maximize2} from "lucide-react";

interface DeployMapProps {
    onNavigate: (page: string) => void;
}
export function DeploymentMap({onNavigate}: DeployMapProps) {
    const [activeDeployments, setActiveDeployments] = useState<Record<string, number>>({});

    useEffect(() => {
        const fetchActiveDeployData = async () => {
            const counts = await api.getActiveDeploymentsByDistrict();

            const districtIdToName = Object.fromEntries(
                districts.map(d => [d.id, d.name])
            );

            const activeDeploymentsByName: Record<string, number> = {};

            for (const [id, value] of Object.entries(counts)) {
                const name = districtIdToName[id];
                if (name) {
                    activeDeploymentsByName[name] = value;
                }
            }

            setActiveDeployments(activeDeploymentsByName);
        };

        fetchActiveDeployData();
    }, []);

    /* ---------------------------
       🎨 Color scale helper
    ---------------------------- */
    const getColor = (value: number) => {
        if (value >= 50) return "#7f1d1d";   // dark red
        if (value >= 41) return "#b91c1c";   // red
        if (value >= 31) return "#dc2626";   // light red
        if (value >= 21) return "#f97316";   // orange
        if (value >= 11) return "#facc15";   // yellow
        if (value >= 1)  return "#86efac";   // light green
        return "#e5e7eb";                    // 0 (gray)
    };


    /* ---------------------------
       ⚡ Memoized style function
    ---------------------------- */
    const geoJsonStyle = useMemo(
        () => (feature: any) => {
            const name = feature.properties.name;
            const deployments = activeDeployments[name] ?? 0;

            return {
                fillColor: getColor(deployments),
                color: "#1f2937",
                weight: 1,
                fillOpacity: 0.7,
            };
        },
        [activeDeployments]
    );

    /* ---------------------------
       📊 Legend
    ---------------------------- */
    const Legend = () => (
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg border border-neutral-200 p-3 shadow-sm text-xs">
            <div className="font-medium text-neutral-800 mb-2">
                Active Deployments
            </div>

            <div className="space-y-1">
                <LegendItem color="#e5e7eb" label="0" />
                <LegendItem color="#86efac" label="1 – 10" />
                <LegendItem color="#facc15" label="11 – 20" />
                <LegendItem color="#f97316" label="21 – 30" />
                <LegendItem color="#dc2626" label="31 – 40" />
                <LegendItem color="#b91c1c" label="41 – 50" />
                <LegendItem color="#7f1d1d" label="50+" />
            </div>
        </div>
    );

    const LegendItem = ({ color, label }: { color: string; label: string }) => (
        <div className="flex items-center gap-2">
    <span
        className="w-4 h-4 rounded"
        style={{ backgroundColor: color }}
    />
            <span>{label}</span>
        </div>
    );


    return (
        <div className="bg-white rounded-xl border border-neutral-200 p-2 md:p-6">
            <div className="mb-6">
                <div className="flex justify-between">
                    <h2 className="text-neutral-900 mb-1">Active Deployment Map</h2>
                    <Button onClick={()=>onNavigate("deployment map")} variant="outline" size="sm" className="cursor-pointer h-8 w-8"><Maximize2 size={13} /></Button>
                </div>
                <p className="text-sm text-neutral-500">
                    Healthcare worker distribution across districts
                </p>
            </div>

            <div className="relative  rounded-xl bg-white border border-neutral-200 h-200 overflow-hidden">
                <MapContainer
                    center={[-13.4, 34.3015]}
                    zoom={7}
                    minZoom={7}
                    maxZoom={9}
                    style={{ height: "800px", width: "100%", backgroundColor: "white" }}
                >
                    <GeoJSON
                        key={JSON.stringify(activeDeployments)}
                        data={malawiDistricts}
                        style={geoJsonStyle}
                        onEachFeature={(feature, layer) => {
                            const districtName = feature.properties.name;
                            const deployments = activeDeployments[districtName] ?? 0;

                            // ✅ Permanent marker ONLY if deployments > 0
                            if (deployments > 0) {
                                layer.bindTooltip(
                                    `<div class="district-marker">
                <div class="district-name">${districtName} ${deployments}</div>
             </div>`,
                                    {
                                        permanent: true,
                                        direction: "center",
                                        className: "district-tooltip-wrapper",
                                        opacity: 1,
                                    }
                                );
                            }

                            // Popup for all districts
                            layer.bindPopup(
                                `<strong>${districtName}</strong><br/>${deployments} active deployments`
                            );

                            // Hover effect
                            layer.on("mouseover", () => {
                                layer.setStyle({ weight: 2, fillOpacity: 0.9 });
                            });

                            layer.on("mouseout", () => {
                                layer.setStyle({ weight: 1, fillOpacity: 0.7 });
                            });
                        }}

                    />
                </MapContainer>

                <Legend />
            </div>
        </div>
    );
}
