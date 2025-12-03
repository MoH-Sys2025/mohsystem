import {Users, UserCheck, AlertTriangle, TrendingUp, Menu, MoreVertical} from 'lucide-react';
import { StatCard } from '../StatCard';
import { ActivityFeed } from '../ActivityFeed';
import { DeploymentMap } from '../DeploymentMap';
import { WorkforceChart } from '../WorkforceChart';
import { AlertsPanel } from '../AlertsPanel';
import {Button} from "@/components/ui/button.tsx";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"

interface DashboardProps {
    onNavigate?: (page: string) => void;
}

export function DashboardHome({onNavigate}: DashboardProps) {
    const createData = [
        {page: "deploy form", name: "Deployments"},
        {page: "add worker", name: "Health Worker"},
        {page: "add facility", name: "Health Facility"},
        {page: "form trainings", name: "Trainings"},
    ]
  return (
    <div className="space-y-8 p-6 px-1 md:p-6">
      {/* Header */}
      <div className="flex flex-row justify-between items-start">
        <div>
            <h1 className="text-neutral-900 mb-2">Dashboard Overview</h1>
            <p className="text-neutral-500">Monitor healthcare workforce and outbreak response across Malawi</p>
        </div>
              <Popover>
                  <PopoverTrigger asChild>
                      <Button variant="default">Create <MoreVertical /></Button>
                  </PopoverTrigger>

                  <PopoverContent className="w-40 mr-2">
                      <div className="space-y-2 flex flex-col w-full justify-start">
                          {createData.map((item) => (
                              <Button key={item.page} onClick={()=>onNavigate(item.page)} variant="ghost" className="text-sm justify-start text-left h-8">{item.name}</Button>
                          ))}

                      </div>
                  </PopoverContent>
              </Popover>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Workforce"
          value="2,847"
          change="+12.5%"
          trend="up"
          icon={Users}
          color="emerald"
        />
        <StatCard
          title="Active Deployments"
          value="156"
          change="+8.3%"
          trend="up"
          icon={UserCheck}
          color="blue"
        />
        <StatCard
          title="Active Outbreaks"
          value="3"
          change="-25%"
          trend="down"
          icon={AlertTriangle}
          color="amber"
        />
        <StatCard
          title="Response Rate"
          value="94.2%"
          change="+5.1%"
          trend="up"
          icon={TrendingUp}
          color="emerald"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Deployment Map */}
        <div className="lg:col-span-2">
            {/*<WorkerCadreDistribution />*/}
          <DeploymentMap />
        </div>

        {/* Alerts */}
        <div>
          <AlertsPanel />
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Workforce Analytics */}
        <WorkforceChart />

        {/* Recent Activity */}
        <ActivityFeed />
      </div>
    </div>
  );
}