import { GeoJSON, MapContainer } from "react-leaflet";
import malawiDistricts from "@/supabase/mw.json";
import { JSX, useEffect, useMemo, useState } from "react";
import { api } from "@/supabase/Functions.tsx";
import { districts } from "@/supabase/districts.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.tsx";
import { Loader2, Maximize2, Minimize2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { Label } from "@/components/ui/label.tsx";

type DeploymentMapProps = {
    maximized: boolean;
    onToggleMaximize: () => void;
};

export function DeploymentMap({ maximized, onToggleMaximize }: DeploymentMapProps) {
    const [activeDeployments, setActiveDeployments] = useState<Record<string, number>>({});
    const [workforceByDistrict, setWorkforceByDistrict] = useState<Record<string, any[]>>({});
    const [displayMode, setDisplayMode] = useState<'deployments' | 'workforce'>('deployments');
    const [workforceFilter, setWorkforceFilter] = useState<'all' | 'Employed' | 'Unemployed' | 'Available'>('all');
    const [isLoading, setIsLoading] = useState(false);
    const [showMarkers, setShowMarkers] = useState(true);
    const [showLegend, setShowLegend] = useState(true);

    // Fetch data
    useEffect(() => {
        const fetchActiveDeployData = async () => {
            setIsLoading(true);
            const counts = await api.getActiveDeploymentsByDistrict();
            const districtIdToName = Object.fromEntries(districts.map(d => [d.id, d.name]));
            const activeDeploymentsByName: Record<string, number> = {};
            for (const [id, value] of Object.entries(counts)) {
                const name = districtIdToName[id];
                if (name) activeDeploymentsByName[name] = value;
            }
            setActiveDeployments(activeDeploymentsByName);
            setIsLoading(false);
        };

        const fetchWorkforce = async () => {
            const personnel = await api.listPersonnel(10000);
            const districtCounts: Record<string, any[]> = {};
            personnel.forEach((p: any) => {
                const district = p.metadata?.district;
                if (!district) return;
                if (!districtCounts[district]) districtCounts[district] = [];
                districtCounts[district].push(p);
            });
            setWorkforceByDistrict(districtCounts);
        };

        fetchActiveDeployData();
        fetchWorkforce();
    }, []);

    // Color scale helper
    const getColor = (value: number, mode: 'deployments' | 'workforce') => {
        if (mode === 'deployments') {
            if (value >= 50) return '#7f1d1d';
            if (value >= 41) return '#b91c1c';
            if (value >= 31) return '#dc2626';
            if (value >= 21) return '#f97316';
            if (value >= 11) return '#facc15';
            if (value >= 1) return '#86efac';
            return '#e5e7eb';
        } else {
            if (value >= 151) return '#7f1d1d';
            if (value >= 121) return '#b91c1c';
            if (value >= 91) return '#dc2626';
            if (value >= 61) return '#f97316';
            if (value >= 31) return '#facc15';
            if (value >= 1) return '#86efac';
            return '#e5e7eb';
        }
    };

    // Memoized GeoJSON style
    const geoJsonStyle = useMemo(() => (feature: any) => {
        const name = feature.properties.name;
        const value = getDistrictValue(name);
        return {
            fillColor: getColor(value, displayMode),
            color: '#1f2937',
            weight: 1,
            fillOpacity: 0.7,
        };
    }, [activeDeployments, workforceByDistrict, displayMode, workforceFilter]);

    // Helper to get the value per district based on current display mode & filter
    const getDistrictValue = (districtName: string) => {
        if (displayMode === 'deployments') return activeDeployments[districtName] ?? 0;

        const personnelList = workforceByDistrict[districtName] ?? [];
        switch (workforceFilter) {
            case 'all':
                return personnelList.length;
            case 'Employed':
                return personnelList.filter(p => p.employment_status === 'Employed').length;
            case 'Unemployed':
                return personnelList.filter(p => p.employment_status === 'Unemployed').length;
            case 'Available':
                return personnelList.filter(p => !p.employment_status || p.employment_status === 'Available').length;
            default:
                return 0;
        }
    };

    // Legend component
    const Legend = () => (
        <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm rounded-sm border border-neutral-200 p-3 shadow-sm text-xs">
            <div className="font-medium text-neutral-800 mb-2">
                {displayMode === 'deployments' ? 'Active Deployments' : `Workforce (${workforceFilter})`}
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
            <span className="w-4 h-4 rounded" style={{ backgroundColor: color }} />
            <span>{label}</span>
        </div>
    );

    const mapDisplayOptions = [
        { dataType: "All health workers", mode: 'workforce', filter: 'all' },
        { dataType: "Employed workers", mode: 'workforce', filter: 'Employed' },
        { dataType: "Unemployed workers", mode: 'workforce', filter: 'Unemployed' },
        { dataType: "Available workers", mode: 'workforce', filter: 'Available' },
        { dataType: "Active deployments", mode: 'deployments', filter: 'all' },
    ];

    return (
        <div className="bg-white rounded-xl border border-neutral-200 p-2 xs:px-3 sm:px-4 md:p-6 md:px-4">
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h2 className="text-neutral-900 mb-1">HCW Distribution Map</h2>
                    <p className="text-sm text-neutral-500">
                        Healthcare worker distribution across districts
                    </p>
                </div>
                <Button onClick={onToggleMaximize} variant="outline" className="cursor-pointer h-6 w-6">
                    {!maximized ? <Maximize2 scale={0.5} /> : <Minimize2 scale={0.5} />}
                </Button>
            </div>

            {/* Display Options & Legend toggles */}
            <div className="mb-4 flex gap-4 flex-wrap">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button size="sm" variant="outline">Display Options</Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-60">
                        <div className="flex flex-col gap-1">
                            {mapDisplayOptions.map(opt => (
                                <Button
                                    key={opt.dataType}
                                    size="xs"
                                    variant="ghost"
                                    className="justify-start"
                                    onClick={() => {
                                        setDisplayMode(opt.mode as 'deployments' | 'workforce');
                                        setWorkforceFilter(opt.filter as any);
                                    }}
                                >
                                    {opt.dataType}
                                </Button>
                            ))}
                        </div>
                    </PopoverContent>
                </Popover>

                <div className="flex items-center gap-2">
                    <Checkbox checked={showMarkers} onCheckedChange={setShowMarkers} />
                    <Label>Show Markers</Label>
                </div>
                <div className="flex items-center gap-2">
                    <Checkbox checked={showLegend} onCheckedChange={setShowLegend} />
                    <Label>Show Legend</Label>
                </div>
            </div>

            {/* Map */}
            <div className="relative h-[800px] border rounded-xl overflow-hidden">
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-50">
                        <Loader2 className="animate-spin" />
                    </div>
                )}

                <MapContainer
                    bounds={[
                        [-17.2, 32.6],
                        [-9.3, 35.9],
                    ]}
                    maxBounds={[
                        [-17.2, 32.6],
                        [-9.3, 35.9],
                    ]}
                    maxBoundsViscosity={1.0}
                    scrollWheelZoom
                    center={[-13.4, 34.3015]}
                    zoom={7}
                    minZoom={7}
                    maxZoom={9}
                    className="w-full h-full"
                    style={{ backgroundColor: 'white' }}
                >
                    <GeoJSON
                        data={malawiDistricts}
                        style={geoJsonStyle}
                        onEachFeature={(feature, layer) => {
                            const districtName = feature.properties.name;
                            const value = getDistrictValue(districtName);

                            layer.unbindTooltip();
                            if (value > 0 && showMarkers) {
                                layer.bindTooltip(
                                    `<div class="district-marker"><div class="district-name">${districtName}: ${value}</div></div>`,
                                    { permanent: true, direction: 'center', className: 'district-tooltip-wrapper', opacity: 1 }
                                );
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

                {showLegend && <Legend />}
            </div>
        </div>
    );
}
