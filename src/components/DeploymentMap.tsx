import { GeoJSON, MapContainer } from "react-leaflet";
import malawiDistricts from "@/supabase/mw.json";
import {JSX, useEffect, useMemo, useState} from "react";
import { api } from "@/supabase/Functions.tsx";
import { districts } from "@/supabase/districts.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {Loader2, LoaderIcon, Maximize2} from "lucide-react";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {Label} from "@/components/ui/label.tsx";

interface DeployMapProps {
    onNavigate: (page: string) => void;
}
export function DeploymentMap({onNavigate}: DeployMapProps) {
    const [activeDeployments, setActiveDeployments] = useState<Record<string, number>>({});
    const [displayMode, setDisplayMode] = useState<'deployments' | 'workforce'>('deployments');
    const [workforceByDistrict, setWorkforceByDistrict] = useState<Record<string, number>>({});
    const [isLoading, setIsLoading] = useState(false)
    const [showMarkers, setShowMarkers] = useState(true)
    const [showLegend, setShowLegend] = useState(true)

    useEffect(() => {
        const fetchActiveDeployData = async () => {
            setIsLoading(true)
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
            setIsLoading(false)
        };

        const fetchWorkforce = async () => {
            const personnel = await api.listPersonnel(10000); // fetch all personnel
            const districtCounts: Record<string, number> = {};

            personnel.forEach((p: any) => {
                const district = p.metadata?.district;
                if (!district) return;
                districtCounts[district] = (districtCounts[district] ?? 0) + 1;
            });
            setWorkforceByDistrict(districtCounts);
        };

        fetchWorkforce();
        fetchActiveDeployData();
    }, []);

    /* ---------------------------
   🎨 Color scale helper
---------------------------- */
    const getColor = (value: number, mode: 'deployments' | 'workforce') => {
        if (mode === 'deployments') {
            if (value >= 50) return '#7f1d1d';
            if (value >= 41) return '#b91c1c';
            if (value >= 31) return '#dc2626';
            if (value >= 21) return '#f97316';
            if (value >= 11) return '#facc15';
            if (value >= 1)  return '#86efac';
            return '#e5e7eb';
        } else {
            // workforce thresholds
            if (value >= 151) return '#7f1d1d';
            if (value >= 121) return '#b91c1c';
            if (value >= 91)  return '#dc2626';
            if (value >= 61)  return '#f97316';
            if (value >= 31)  return '#facc15';
            if (value >= 1)   return '#86efac';
            return '#e5e7eb';
        }
    };

    /* ---------------------------
       ⚡ Memoized style function
    ---------------------------- */
    const geoJsonStyle = useMemo(
        () => (feature: any) => {
            const name = feature.properties.name;
            const value = displayMode === 'deployments'
                ? activeDeployments[name] ?? 0
                : workforceByDistrict[name] ?? 0;

            return {
                fillColor: getColor(value, displayMode),
                color: '#1f2937',
                weight: 1,
                fillOpacity: 0.7,
            };
        },
        [activeDeployments, workforceByDistrict, displayMode]
    );



    /* ---------------------------
       📊 Legend
    ---------------------------- */
    const Legend = () => (
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg border border-neutral-200 p-3 shadow-sm text-xs">
            <div className="font-medium text-neutral-800 mb-2">
                {displayMode === 'deployments' ? 'Active Deployments' : 'Workforce'}
            </div>

            <div className="space-y-1">
                {displayMode === 'deployments' ? (
                    <>
                        <LegendItem color="#e5e7eb" label="0" />
                        <LegendItem color="#86efac" label="1 – 10" />
                        <LegendItem color="#facc15" label="11 – 20" />
                        <LegendItem color="#f97316" label="21 – 30" />
                        <LegendItem color="#dc2626" label="31 – 40" />
                        <LegendItem color="#b91c1c" label="41 – 50" />
                        <LegendItem color="#7f1d1d" label="50+" />
                    </>
                ) : (
                    <>
                        <LegendItem color="#e5e7eb" label="0" />
                        <LegendItem color="#86efac" label="1 – 30" />
                        <LegendItem color="#facc15" label="31 – 60" />
                        <LegendItem color="#f97316" label="61 – 90" />
                        <LegendItem color="#dc2626" label="91 – 120" />
                        <LegendItem color="#b91c1c" label="121 – 150" />
                        <LegendItem color="#7f1d1d" label="151+" />
                    </>
                )}
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
                    {/*<Button onClick={()=>onNavigate("deployment map")} variant="outline" size="sm" className="cursor-pointer h-8 w-8"><Maximize2 size={13} /></Button>*/}
                </div>
                <p className="text-sm text-neutral-500">
                    Healthcare worker distribution across districts
                </p>
            </div>

            <div className="relative rounded-xl bg-white border border-neutral-200 h-200 overflow-hidden">
                <div className="absolute top-4 right-4 z-40 ">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button size={10} variant="outline" className="text-xs p-1 px-2">Display Options</Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-40" >
                            <div className="flex flex-col justify-start font-normal gap-1">
                                <Button
                                    size="xs" className="font-normal text-left text-[12px] flex justify-start py-1 pl-2"
                                    variant="ghost"
                                    onClick={() => setDisplayMode('deployments')}>
                                    Active Deployments
                                </Button>
                                <Button
                                    size="xs"
                                    className="font-normal text-left text-[12px] flex justify-start py-1 pl-2"
                                    variant="ghost"
                                    onClick={() => setDisplayMode('workforce')}>
                                    Health workers
                                </Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                    <div className="mt-1 flex flex-col justify-start font-normal gap-1">
                        <div className="flex items-center gap-3">
                            <Checkbox onCheckedChange={(value)=>setShowMarkers(value)}  defaultChecked id="markers" />
                            <Label className="font-normal" htmlFor="markers">Show markers</Label>
                        </div>
                        <div className="flex items-center gap-3">
                            <Checkbox  onCheckedChange={(value)=>setShowLegend(value)} defaultChecked id="legend" />
                            <Label className="font-normal" htmlFor="legend">Show legend</Label>
                        </div>
                    </div>
                </div>
                {isLoading ? (
                    /* 🔄 Map-only loader */
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-50">
                        <Loader2 className="animate-spin" />
                    </div>
                ) : (
                    <MapContainer
                        center={[-13.4, 34.3015]}
                        zoom={7}
                        minZoom={7}
                        maxZoom={9}
                        style={{ height: "800px", width: "100%", backgroundColor: "white" }}>

                        <GeoJSON
                            key={JSON.stringify({ activeDeployments, workforceByDistrict, displayMode })}
                            data={malawiDistricts}
                            style={geoJsonStyle}
                            onEachFeature={(feature, layer) => {
                                const districtName = feature.properties.name;
                                const deployments = activeDeployments[districtName] ?? 0;
                                const workforce = workforceByDistrict[districtName] ?? 0;
                                const value = displayMode === 'deployments' ? deployments : workforce;

                                // Only show permanent marker if value > 0
                                if ((value > 0) && showMarkers) {
                                    layer.bindTooltip(
                                        `<div class="district-marker">
                    <div class="district-name">
                        ${districtName}: ${value}
                    </div>
                </div>`,
                                        {
                                            permanent: {showMarkers},
                                            direction: 'center',
                                            className: 'district-tooltip-wrapper',
                                            opacity: 1,
                                        }
                                    );
                                } else {
                                    // Remove any existing tooltip if switching mode to 0
                                    layer.unbindTooltip();
                                }

                                layer.bindPopup(
                                    `<strong>${districtName}</strong><br/>${value} ${
                                        displayMode === 'deployments' ? 'active deployments' : 'Health workers'
                                    }`
                                );

                                layer.on('mouseover', () => layer.setStyle({ weight: 2, fillOpacity: 0.9 }));
                                layer.on('mouseout', () => layer.setStyle({ weight: 1, fillOpacity: 0.7 }));
                            }}
                        />

                    </MapContainer>
                )}

                {showLegend && <Legend />}
            </div>

        </div>
    );
}
