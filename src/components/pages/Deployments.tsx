import {
    Send,
    MapPin,
    Users,
    Calendar,
    MoreVertical,
    User2,
    UserCheck2,
    Users2,
    UserPlus2,
    BookMarked, BookmarkCheck, LoaderIcon
} from 'lucide-react';
import React, {JSX, useEffect, useState} from "react";
import {api} from "@/supabase/Functions.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Popover, PopoverTrigger, PopoverContent} from "@/components/ui/popover.tsx";
import {useSelectedMOHData} from "@/components/DataContext.tsx";
import {toast} from "sonner";

interface DeployProps {
    onNavigate: (page: string) => void;
}

export function Deployments({onNavigate}: DeployProps): JSX.Element {
    const [activeD, setActiveD] = useState<number>(0);
    const [deployedList, setDeployedList] = useState<any[]>([]);
    const [uniqueDeployed, setUniqueDeployedList] = useState<any[]>([]);
    const [deployed, setDeployed] = useState<number>(0);
    const [activeDist, setActiveDist] = useState<number>(0);
    const [activeOutb, setActiveOutbreaks] = useState<number>(0);
    const [activeCounts, setActiveCounts] = useState<number[]>([]);
    const [outbreakInfo, setOutbreakInfo] = useState<any[]>([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    activeDeployments,       // number
                    uniqueDeployments,       // array
                    deploymentsList,         // array
                    deployedDistricts,       // number
                    deploymentCounts,        // array
                    activeOutbreaks,          // number
                    outbreakData
                ] = await Promise.all([
                    api.getActiveDeployments(),
                    api.getUniqueDeployments(),
                    api.listDeployments(10000000),
                    api.getDeployedDistricts(),
                    api.getDeploymentCounts(),
                    api.getActiveOutBreaks(),
                    api.getOutbreakInfo()
                ]);

                setActiveD(activeDeployments);
                setUniqueDeployedList(uniqueDeployments || []);
                setDeployedList(deploymentsList || []);
                setDeployed(deploymentsList?.length || 0);
                setActiveDist(deployedDistricts);
                setActiveOutbreaks(activeOutbreaks);
                setActiveCounts(deploymentCounts);
                setOutbreakInfo(outbreakData);

            } catch (err) {
                toast.error("Failed to load data:");
            }
        };

        fetchData();
    }, []);



    const topTabData = [
        {
            item: "Active Deployments",
            value: activeD
        },{
            item: "Workers Deployed",
            value: deployed
        },{
            item: "Active Districts Covered",
            value: activeDist
        },{
            item: "Active Outbreaks",
            value: activeOutb
        },

    ]

    const outbreakLookup = Object.fromEntries(
        outbreakInfo.map(o => [o.id, o])
    );


  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-neutral-900 mb-2">Deployments</h1>
          <p className="text-neutral-500">Manage healthcare worker deployments and outbreak responses</p>
        </div>
        <Button onClick={()=>onNavigate("deploy form")} className="text-sm cursor-pointer bg-gray-100 border-2 px-3 border-dashed rounded-lg flex items-center gap-2 text-black hover:bg-gray-200">
          <Send className="w-5 h-5" />
          New Deployment
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {topTabData.map((d, i) => (
              <div className="bg-white rounded-xl border border-neutral-200 p-1 px-4 flex flex-row items-center gap-5 ">
                  <p className="text-sm text-neutral-500">{d.item}</p>
                  <p className="text-2xl font-semibold text-neutral-900">{d.value}</p>
              </div>
          ))}
      </div>


      {/* All Deployments */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200">
          <h2 className="text-neutral-900">All Deployments</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Deployment ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Outbreak/Response</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">District</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Workers</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Start Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">End Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 bg-white">
            {(uniqueDeployed || []).map((deploy, index) => {
                const outbreak = outbreakLookup[deploy.outbreak_id]; // get outbreak by outbreak_id

                return (
                    <tr key={deploy.deployment_id} className="hover:bg-neutral-50 transition-colors">
                        <td className="px-6 py-4">
                            <span className="text-sm text-neutral-900">{deploy.deployment_id}</span>
                        </td>
                        <td className="px-6 py-4">
                            <p className="text-sm font-medium text-neutral-900">{outbreak?.disease}</p>
                            <p className="text-xs text-neutral-500">{deploy.deploy_status}</p>
                        </td>
                        <td className="px-6 py-4">
                            <span className="text-sm text-neutral-600">{outbreak?.district || "—"}</span>
                        </td>
                        <td className="px-6 py-4">
                            <span className="text-sm text-neutral-600">{activeCounts[index] || 0}</span>
                        </td>
                        <td className="px-6 py-4">
                            <span className="text-sm text-neutral-600">{deploy.start_date}</span>
                        </td>
                        <td className="px-6 py-4">
                            <span className="text-sm text-neutral-600">{deploy.end_date || "—"}</span>
                        </td>
                        <td className="px-6 py-4">
        <span
            className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                deploy.status === 'Active'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-neutral-100 text-neutral-700'
            }`}
        >
          {deploy.status}
        </span>
                        </td>
                        <td className="px-6 py-4">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <button className="p-1.5 hover:bg-neutral-100 rounded-md">
                                        <MoreVertical className="w-4 h-4 text-neutral-600" />
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent className="p-2 bg-gray-100 border-1 border-gray-200 text-xs w-auto space-y-3">
                                    {(deploy.status !== "Pending") && <p className="flex cursor-pointer flex-row items-center justify-start gap-2"
                                                                         onClick={()=>api.updateDeploymentStatus(deploy.deployment_id, "Pending")}
                                    ><span className="flex"><LoaderIcon size={11} className="text-xs text-gray-600" /></span> Set: Pending</p>}
                                    {(deploy.status !== "Deployed") && <p className="flex cursor-pointer flex-row items-center justify-start gap-2"
                                                                          onClick={()=>api.updateDeploymentStatus(deploy.deployment_id, "Deployed")}
                                    ><span className="flex"><Users2 size={11} className="text-xs text-gray-600" /><BookmarkCheck size={11} className="text-xs text-gray-600" /></span> Set: Deployed</p>}
                                    {(deploy.deploy_status !== "completed") && <p className="flex cursor-pointer flex-row items-center justify-start gap-2"
                                                                                  onClick={()=>api.updateDeploymentStatus(deploy.deployment_id, "completed")}
                                    ><UserCheck2 size={11} className="text-xs text-gray-600" /> Set: Completed</p>}
                                    <p className="flex cursor-pointer flex-row items-center justify-start gap-2" onClick={()=>{

                                    }}><Users2 size={11} className="text-xs text-gray-600" /> View health workers</p>
                                </PopoverContent>
                            </Popover>
                        </td>
                    </tr>
                );
            })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}