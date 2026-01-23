import {Users, UserCheck, AlertTriangle, TrendingUp, Menu, MoreVertical, Icon} from 'lucide-react';
import { StatCard } from '../StatCard';
import { ActivityFeed } from '../ActivityFeed';
import { DeploymentMap } from '../DeploymentMap';
import { WorkforceChart } from '../WorkforceChart';
import { AlertsPanel } from '../AlertsPanel';
import {Button} from "@/components/ui/button.tsx";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import {useEffect, useState} from "react";
import {useSelectedMOHData} from "@/components/DataContext.tsx";
import {api} from "@/supabase/Functions.tsx";
import {StartCard2} from "@/components/StartCard2.tsx";
import {AlertPopup} from "@/components/NotificationsAlerts.tsx";

interface DashboardProps {
    onNavigate?: (page: string) => void;
}

export function DashboardHome({onNavigate}: DashboardProps) {
    const [workforce, setWorkforce] = useState([])
    const [workforceStat, setWorkforceStat] = useState({total:0, change:0});
    const [deployments, setDeployments] = useState([])
    const [activeDeploy, setDeploymentsCount] = useState<number>(0);
    const [deploymentStats, setDeploymentStats] = useState({ total: 0, change: 0 });
    const [activeOutbreaks, setOutbreaksCount] = useState<number>(0);
    const [outbreakStats, setOutbreakStats] = useState({ total: 0, change: 0 });
    const [responseRate, setResponseRate] = useState(0);
    const [responseStats, setResponseStats] = useState({ rate: 0, change: 0 });
    const [isMapMaximized, setIsMapMaximized] = useState(false);
    const[allCount, setCount] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            const [allHCW, workfoceStatsData, deploymentStatsRes, outbreakStatsData, data2, activeDeploy, activeOutbreaks, respondedOutbreaks,  responseStatsRes] = await Promise.all([
                api.getCountPersonnels(),
                api.getWorkforceStats(),
                api.getDeploymentStats(),
                api.getActiveOutbreakStats(),
                api.listDeployments(10000),
                api.getActiveDeployments(),
                api.getActiveOutBreaks(),
                api.getOutbreakInfo(),
                api.getResponseStats(),
            ])
            setWorkforce(allHCW)
            setWorkforceStat(workfoceStatsData)
            setDeploymentStats(deploymentStatsRes);
            setOutbreaksCount(activeOutbreaks)
            setDeploymentsCount(activeDeploy)
            setOutbreakStats(outbreakStatsData);
            setDeployments(data2)
            setResponseStats(responseStatsRes);
            setResponseRate(outbreakStatsData.total === 0
                ? 0
                : Math.round(
                    (respondedOutbreaks.length / outbreakStatsData.total) * 100
                ));
        };

        fetchData();
    }, []);

    const createData = [
        {page: "deploy form", name: "Deployments"},
        {page: "add worker", name: "Health Worker"},
        {page: "add facility", name: "Health Facility"},
        {page: "form trainings", name: "Trainings"},
        {page: "create outbreak", name: "Add outbreak"},
    ]

    const starts = [
        {title:"Total Health workers", icon: Users, change: workforceStat.total-workforceStat.change, value: workforce},
        {title:"Active Deployments", icon: UserCheck, change: deploymentStats.change, value: activeDeploy },
        {title:"Active Outbreaks", icon: AlertTriangle, change: outbreakStats.change, value: outbreakStats.total},
        {title:"Response Rate", icon: TrendingUp, change: `${responseStats.rate}%`, value: `${responseRate}%`},
    ]
  return (
    <div className="space-y-1 p-6 px-1 md:p-4">
      {/* Header */}
      <div className="flex md:flex-row flex-col gap-2 justify-between items-start mb-4">
        <div>
            <h1 className="text-neutral-900 mb-2">Dashboard Overview</h1>
            <p className="text-neutral-500">Monitor healthcare workforce and outbreak response across Malawi</p>
        </div>
              <Popover>
                  <PopoverTrigger asChild>
                      <Button className="text-sm md:w-auto flex flex-row justify-between cursor-pointer bg-gray-100 border-2 hover:bg-gray-200 border-dashed rounded-lg text-black">Create <MoreVertical /></Button>
                  </PopoverTrigger>

                  <PopoverContent align="end" className="w-full">
                      <div className="flex flex-col w-full justify-start">
                          {createData.map((item) => (
                              <Button key={item.page} onClick={()=>onNavigate(item.page)} variant="ghost" className="text-sm justify-start text-left h-8 font-normal">{item.name}</Button>
                          ))}

                      </div>
                  </PopoverContent>
              </Popover>
      </div>

      {/* Stats Grid */}
      <div className={`grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-1 md:gap-1 lg:gap-1 ${isMapMaximized ? 'hidden' : 'block'}`}>

          {starts.map((item, index) => (
              <StartCard2 key={index} title={item.title} value={item.value} change={item.change} icon={item.icon} classData="" />
          ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-1">
        {/* Deployment Map */}
        <div className={`lg:col-span-2 ${isMapMaximized ? 'lg:col-span-5':'lg:col-span-2'}`}>
            {/*<WorkerCadreDistribution />*/}
          <DeploymentMap  maximized={isMapMaximized} onToggleMaximize={() => setIsMapMaximized(prev => !prev)} />
        </div>

          <div className={`grid md:grid-cols-2 lg:grid-cols-2 lg:col-span-3 gap-1 ${isMapMaximized ? 'hidden' : 'block'}`}>
              <div className="col-span-2" >
                  {/* Workforce Analytics */}
                  <WorkforceChart />
              </div>
              <div className="col-span-2" >
                  <ActivityFeed className={isMapMaximized ? 'hidden' : 'block'} />
                  {/*<AlertsPanel />*/}
              </div>
          </div>
      </div>
    </div>
  );
}