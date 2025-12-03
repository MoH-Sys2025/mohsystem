import { Badge } from "@/components/ui/badge";
import { Building2, Briefcase } from "lucide-react";
import type { JSX } from "react";

interface DeployProps {
    imgSrc: string;
}

export default function DeploymentSummary({ imgSrc }: DeployProps): JSX.Element {
    const deployments = [
        {
            id: 1,
            site: "Nkhata Bay District Hospital",
            role: "Clinician",
            start: "14 Jan 2025",
            end: "28 Feb 2025",
            status: "Active",
        },
        {
            id: 2,
            site: "Mzuzu Health Centre",
            role: "Nurse Supervisor",
            start: "01 Mar 2025",
            end: "12 May 2025",
            status: "Completed",
        },
        {
            id: 1,
            site: "Monkey Bay District Hospital",
            role: "Clinician",
            start: "14 Jan 2025",
            end: "28 Feb 2025",
            status: "Completed",
        },
        {
            id: 3,
            site: "Chitipa Isolation Unit",
            role: "Outbreak Response Lead",
            start: "01 Jun 2025",
            end: "20 Jul 2025",
            status: "Active",
        },
    ];

    return (
        <div className="flex flex-col gap-4 pl-4 md:pl-2">
            <div className="ml-0 font-semibold">Deployment Summary</div>
            <div className="border-l-1 border-gray-300 md:border-gray-300 space-y-10">
                {deployments.map((d, index) => (
                    <div key={d.id} className="pl-5 rounded-none shadow-none bg-transparent relative pb-3">
                        <div className="w-8 h-8  rounded-full absolute  -left-4 -top-2 p-1">
                            <img src={imgSrc} className="rounded-full"  alt="User" />
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col justify-center gap-1 text-sm font-medium">
                                {(index === 0) ? <div>Mariam Mtwana</div>: ""}
                                <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
                                    <div className="flex flex-row gap-2 items-center">
                                        <Building2 className="w-3 h-3 text-blue-600" />
                                        {d.site}</div>
                                    <Badge className={d.status === "Active"
                                                ? "bg-emerald-300 hover:bg-emerald-300 text-gray-800"
                                                : "bg-gray-200 hover:bg-gray-100 text-gray-800"
                                        }
                                    >
                                        {d.status}
                                    </Badge>
                                </div>
                            </div>

                            <div className="gap-2 flex flex-col md:flex-row">
                                <div className="flex items-center gap-2 text-xs text-neutral-700">
                                    <Briefcase className="w-3 h-3 text-neutral-500" />
                                    {d.role}
                                </div>
                                <div className="flex items-center flex-row text-xs text-neutral-700">
                                    <Badge className="bg-gray-200 text-gray-800 rounded-sm">{d.start}
                                    </Badge>
                                    <div className=" text-gray-400">-------</div>
                                    <span className="bg-gray-200 w-auto border-green-400 text-center text-gray-800 text-xs p-[2px] px-[4px] rounded-sm">{d.end}</span>
                                </div>
                            </div>

                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}