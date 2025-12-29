import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {Building2, Briefcase, Calendar1Icon, DotIcon} from "lucide-react";
import { type JSX, useEffect, useState } from "react";
import { api } from "@/supabase/Functions.tsx";
import { toast } from "sonner";
import { districts } from "@/supabase/districts.tsx";

interface DeployProps {
    imgSrc: string;
    worker: any;
}

export default function DeploymentSummary({ imgSrc, worker }: DeployProps): JSX.Element {
    // ✅ Always call hooks first
    const [deployments, setDeployments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!worker?.id) {
            setDeployments([]);
            setLoading(false);
            return;
        }

        let isMounted = true;

        const fetchDeployments = async () => {
            try {
                const data = await api.listDeploymentsEq(worker.id, 10000);
                if (isMounted) setDeployments(data);
            } catch (err) {
                toast.error("Failed to fetch deployments:", err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchDeployments();

        return () => { isMounted = false; };
    }, [worker]);

    // ✅ Conditional render only in JSX
    if (!worker) return <div>Loading worker information...</div>;

    return (
        <Card className="shadow-none h-full">
            <CardHeader>
                <CardTitle>Deployment Summary</CardTitle>
                <CardDescription>
                    Overview of {worker.first_name} {worker.last_name}'s deployments
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 overflow-y-auto">
                <div className="max-h-full h-full">
                    {loading ? (
                        <div className="text-sm italic">Loading deployments...</div>
                    ) : deployments.length > 0 ? (
                        deployments.map((d, index) => {
                            const district = d.assigned_district_id
                                ? districts.find((dist) => dist.id === d.assigned_district_id)
                                : null;

                            return (
                                <div key={d.id} className={`flex relative pl-2 pt-3 pb-5 ${(index < deployments.length-1) ? 'border-dashed border-b-2':''}`}>
                                    {/* Avatar */}
                                    <div className="absolute left-0 hidden">
                                        <img
                                            src={imgSrc}
                                            alt="User"
                                            className="rounded-full w-8 h-8 border border-gray-200"
                                        />
                                    </div>

                                    <div className="flex-1 flex flex-col gap-1">
                                        {/* Worker name + status */}
                                        {index === 0 && (
                                            <div className="flex items-center gap-2 font-semibold text-sm">
                                                {worker.first_name} {worker.last_name}
                                                <Badge variant="secondary" className="text-[9px] px-2 py-0.5 rounded-full">
                                                    {worker.metadata.worker_status[1]}
                                                </Badge>
                                            </div>
                                        )}

                                        {/* Deployment info */}
                                        <div className="flex flex-wrap items-center gap-2 text-sm">
                                            <div className="flex flex-row gap-2 md:gap-3 justify-start items-center">
                                                <div className="flex items-center gap-1">
                                                    <Building2 className="w-3 h-3" />
                                                    {district?.name || "Loading district..."}
                                                </div>
                                                {/* Deployment dates */}
                                                <div className="flex flex-row items-center text-xs">
                                                    <Calendar1Icon className="w-3 h-3 mr-1" />
                                                    {d.start_date && (
                                                        <span className="rounded-full text-[10px]">
                        {d.start_date}
                      </span>
                                                    )}

                                                    {d.start_date && d.end_date && <span className=""><DotIcon /></span>}

                                                    {d.end_date && (
                                                        <span className="rounded-full text-[10px]">
                        {d.end_date}
                      </span>
                                                    )}
                                                </div>
                                            </div>

                                            <Badge variant="outline" className="text-[9px] rounded-full">
                                                {d.deploy_status === "completed" ? d.deploy_status : d.status}
                                            </Badge>
                                        </div>

                                        {/* Role & deployment ID */}
                                        <div className="flex items-center gap-2 text-xs mt-1">
                                            <Briefcase className="w-3 h-3" />
                                            {worker.role}: <span className="font-medium">{d.deployment_id}</span>
                                        </div>

                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-sm italic">
                            The user has not been deployed yet.
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
