import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Boxes, 
  Send, 
  GraduationCap, 
  Award,
  Settings,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function Sidebar({ currentPage, onNavigate, onLogout }: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'workforce', label: 'Workforce Registry', icon: Users },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'integrations', label: 'Integrations', icon: Boxes },
    { id: 'deployments', label: 'Deployments', icon: Send },
    { id: 'trainings', label: 'Trainings', icon: GraduationCap },
    { id: 'competency', label: 'Competency Tracking', icon: Award },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-neutral-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-neutral-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center">
              <img src="src/assets/logo.png" alt="logo" />
          </div>
          <div>
            <div className="text-neutral-900">MORS</div>
            <div className="text-neutral-500">Health System</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 overflow-y-auto">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  isActive
                    ? 'bg-neutral-100 text-neutral-900'
                    : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="p-3 border-t border-neutral-200 space-y-1">
        <button
          onClick={() => onNavigate('settings')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
            currentPage === 'settings'
              ? 'bg-neutral-100 text-neutral-900'
              : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
          }`}
        >
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </button>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
        >
          <div className="w-8 h-8 bg-neutral-200 rounded-full flex items-center justify-center">
            <span className="text-neutral-700">AD</span>
          </div>
          <div className="flex-1 text-left">
            <div className="text-neutral-900">Admin User</div>
            <div className="text-neutral-500">admin@health.gov.mw</div>
          </div>
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
