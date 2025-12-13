import { Badge } from "@/components/ui/badge";
import {Building2, Briefcase, Calendar1Icon} from "lucide-react";
import { type JSX, useEffect, useState } from "react";
import { api } from "@/supabase/Functions.tsx";
import {toast} from "sonner";
import {districts} from "@/supabase/districts.tsx";
import {Calendar} from "@/components/ui/calendar.tsx";

interface DeployProps {
    imgSrc: string;
    worker: any;
}

export default function DeploymentSummary({ imgSrc, worker }: DeployProps): JSX.Element {
    const [deployments, set_deploy_data] = useState<any[]>([]); // initialize as empty array

    useEffect(() => {
        if (!worker?.id) return; // guard for missing worker

        let isMounted = true;
        const fetchDeployments = async () => {
            try {
                const data = await api.listDeploymentsEq(worker.id, 10000);
                if (isMounted) set_deploy_data(data);
                console.log(worker, data)
            } catch (err) {
                toast.error("Failed to fetch deployments:", err);
            }
        };

        fetchDeployments();

        return () => { isMounted = false };
    }, [worker]); // just depend on worker object


    return (
        <div className="flex flex-col gap-4 pl-4 md:pl-2">
            <div className="ml-0 font-semibold">Deployment Summary</div>
            <div className="border-l-1 border-gray-300 md:border-gray-300 space-y-10">
                {deployments && deployments.length > 0 ? (
                    deployments.map((d, index) => {
                        const district = d.assigned_district_id
                            ? districts.find(dist => dist.id === d.assigned_district_id)
                            : null;

                        return (
                            <div key={d.id} className="pl-5 rounded-none shadow-none bg-transparent relative">
                                <div className="w-8 h-8 rounded-full absolute -left-4 -top-1 px-2 p-1">
                                    <img src={imgSrc} className="rounded-full w-5 h-5" alt="User" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <div className="flex flex-col justify-center gap-1 text-sm font-medium">
                                        {index === 0 && (
                                            <div>
                                                {worker.first_name} {worker.last_name}{" "}
                                                <span className="ml-1 text-[10px] border px-1 rounded-sm text-green-700">
                  {worker.metadata.worker_status[1]}
                </span>
                                            </div>
                                        )}
                                        <div className="flex flex-row items-center gap-2">
                                            <div className="flex flex-row gap-2 items-center">
                                                <Building2 className="w-3 h-3 text-blue-600" />
                                                {district?.name || "Loading district..."}
                                            </div>
                                            <Badge
                                                className={
                                                    d.deploy_status === "Deployed"
                                                        ? "bg-emerald-300 hover:bg-emerald-300 text-gray-800 text-[10px] border px-1 rounded-full"
                                                        : "bg-gray-200 hover:bg-gray-100 text-gray-800 text-[10px] border px-1 rounded-full"
                                                }
                                            >
                                                {d.deploy_status === "completed" ? d.deploy_status : d.status}
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="gap-2 flex flex-col">
                                        <div className="flex items-center gap-2 text-xs text-neutral-700">
                                            <Briefcase className="w-3 h-3 text-neutral-500" />
                                            {worker.role}: <span>{d.deployment_id}</span>
                                        </div>
                                        <div className="flex flex-row items-center gap-2 text-xs text-neutral-700">
                                            <Calendar1Icon className="w-3 h-3 text-neutral-500" />
                                            {d.start_date && (
                                                <div className="text-[10px] text-gray-800 rounded-full">{d.start_date}</div>
                                            )}

                                            {d.start_date && d.end_date && <div className="text-gray-400 mx-1">---</div>}

                                            {d.end_date && (
                                                <div className="text-[10px] text-gray-800 rounded-full">{d.end_date}</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-sm text-gray-500 italic">
                        The user has not been deployed yet.
                    </div>
                )}


            </div>
        </div>
    );
}
