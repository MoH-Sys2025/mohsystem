import { useState } from 'react';
import { Sidebar } from './Sidebar.tsx';
import { TopNavbar } from './TopNavbar.tsx';
import { DashboardHome } from '@/components/pages/DashboardHome.tsx';
import { WorkforceRegistry } from '@/components/pages/WorkforceRegistry.tsx';
import { Documents } from '@/components/pages/Documents.tsx';
import { Integrations } from '@/components/pages/Integrations.tsx';
import { Deployments } from '@/components/pages/Deployments.tsx';
import { Trainings } from '@/components/pages/Trainings.tsx';
import { CompetencyTracking } from '@/components/pages/CompetencyTracking.tsx';
import { Settings } from '@/components/pages/Settings.tsx';
import HealthWorkerProfile from "@/components/pages/Profile.tsx";
import CreateTrainingWizard from "@/components/pages/CreateTrainingForm.tsx";
import NewDeploymentForm from "@/components/pages/DeploymentForm.tsx";
import Notifications from "@/components/pages/Notifications.tsx";
import {AddWorker} from "@/components/pages/AddHCW.tsx";
import AddHealthyFacility from "@/components/pages/AddHealthFacility.tsx";
import OutbreakForm from "@/components/pages/OutbreakForm.tsx";
import {DeploymentMap} from "@/components/DeploymentMap.tsx";
interface DashboardProps {
  onLogout: () => void;
}

export function Dashboard({ onLogout }: DashboardProps) {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardHome onNavigate={setCurrentPage} />;
        case 'deploy form':
            return <NewDeploymentForm onSuccess={undefined} />;
      case 'workforce':
        return <WorkforceRegistry onNavigate={setCurrentPage}  />;
        case 'deployment map':
            return <DeploymentMap />;
      case 'documents':
        return <Documents />;
      case 'integrations':
        return <Integrations />;
        case 'add facility':
            return <AddHealthyFacility onNavigate={setCurrentPage} />;
        case 'add worker':
            return <AddWorker onNavigate={setCurrentPage} />;
        case 'notifications':
            return <Notifications />;
      case 'deployments':
        return <Deployments onNavigate={setCurrentPage} />;
      case 'trainings':
        return <Trainings onNavigate={setCurrentPage} />;
        case 'create outbreak':
            return <OutbreakForm onSuccess={undefined} />;
      case 'competency':
        return <CompetencyTracking />;
      case 'settings':
        return <Settings />;
      case 'worker profile':
        return <HealthWorkerProfile onNavigate={setCurrentPage} />;
        case 'form trainings':
            return <CreateTrainingWizard onCancel={()=>setCurrentPage('trainings')} onPublish={undefined} />;
      default:
        return <DashboardHome />;
    }
  };

  return (
      <div className="min-h-screen bg-neutral-50 flex">

          {/* Sidebar (fixed) */}
          <Sidebar
              currentPage={currentPage}
              onNavigate={setCurrentPage}
              onLogout={onLogout}
          />

          {/* Main Content with left padding */}
          <div className="flex-1 pl-16 lg:pl-64">
              <TopNavbar />
              {renderPage()}
          </div>

      </div>

  );
}
