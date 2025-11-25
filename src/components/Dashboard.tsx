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

interface DashboardProps {
  onLogout: () => void;
}

export function Dashboard({ onLogout }: DashboardProps) {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardHome />;
      case 'workforce':
        return <WorkforceRegistry />;
      case 'documents':
        return <Documents />;
      case 'integrations':
        return <Integrations />;
      case 'deployments':
        return <Deployments />;
      case 'trainings':
        return <Trainings />;
      case 'competency':
        return <CompetencyTracking />;
      case 'settings':
        return <Settings />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} onLogout={onLogout} />
      <div className="pl-64">
        <TopNavbar />
        <main className="p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
