import { Send, MapPin, Users, Calendar, MoreVertical } from 'lucide-react';
import React, {JSX, useEffect, useState} from "react";
import {api} from "@/supabase/Functions.tsx";
import {Button} from "@/components/ui/button.tsx";

interface DeployProps {
    onNavigate: (page: string) => void;
}

export function Deployments({onNavigate}: DeployProps): JSX.Element {
    const [activeD, setActiveD] = useState<number>();
    const [deployedList, setDeployedList] = useState<DeploymentType[]>([]);
    const [uniqueDeployed, setUniqueDeployedList] = useState<DeploymentType[]>([]);
    const [deployed, setDeployed] = useState<number>();
    const [activeDist, setActiveDist] = useState<number>();
    const [activeOutb, setActiveOutbreaks] = useState<number>();
    const [activeCounts, setActiveCounts] = useState<[]>();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // run all API calls in parallel
                const [
                    activeDeployments,
                    deploymentsList,
                    deployedDistricts,
                    activeOutbreaks,
                    deploymentCounts,
                    uniqueDeployed
                ] = await Promise.all([
                    api.getActiveDeployments(),
                    api.getUniqueDeployments(),
                    api.listDeployments(10000000),
                    api.getDeployedDistricts(),
                    api.getActiveOutBreaks(),
                    api.getDeploymentCounts()
                ]);

                setActiveD(activeDeployments);
                setDeployedList(deploymentsList || []);
                setUniqueDeployedList(uniqueDeployed || []);
                setDeployed(deploymentsList?.length || 0);
                setActiveDist(deployedDistricts);
                setActiveOutbreaks(activeOutbreaks);
                setActiveCounts(deploymentCounts);
            } catch (err) {
                console.error("Failed to load data:", err);
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

      {/* Priority Deployments */}
      <div>
        <h2 className="text-neutral-900 mb-4">High Priority Deployments</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-red-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">High Priority</span>
                  <span className="text-sm text-neutral-500">DEP-2024-045</span>
                </div>
                <h3 className="text-neutral-900 mb-1">Cholera Outbreak - Nsanje</h3>
                <p className="text-sm text-neutral-500">Emergency response deployment</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-neutral-400" />
                <div>
                  <p className="text-xs text-neutral-500">Workers</p>
                  <p className="text-sm font-medium text-neutral-900">15</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-neutral-400" />
                <div>
                  <p className="text-xs text-neutral-500">Duration</p>
                  <p className="text-sm font-medium text-neutral-900">30 days</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
              <span className="text-sm font-medium text-emerald-600">Active</span>
              <button className="px-4 py-2 bg-neutral-100 text-neutral-900 rounded-lg hover:bg-neutral-200 transition-colors text-sm font-medium">
                View Details
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <div className="w-full h-64 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl border border-neutral-200 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-neutral-400 mx-auto mb-2" />
                <p className="text-neutral-900 mb-1">Deployment Map</p>
                <p className="text-sm text-neutral-500">Geographic distribution</p>
              </div>
            </div>
          </div>
        </div>
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
              {(uniqueDeployed || []).map((deploy, index) => (
                <tr key={deploy.deployment_id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-sm text-neutral-900">{deploy.deployment_id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-neutral-900">{deploy.outbreak_id}</p>
                    <p className="text-xs text-neutral-500">{deploy.deployed_status}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-neutral-600">{deploy.district_id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-neutral-600">{activeCounts[index]}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-neutral-600">{deploy.start_date}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-neutral-600">{deploy.end_date ? deploy.end_date: "—"}</span>
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
                    <button className="p-1.5 hover:bg-neutral-100 rounded-md transition-colors">
                      <MoreVertical className="w-4 h-4 text-neutral-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}