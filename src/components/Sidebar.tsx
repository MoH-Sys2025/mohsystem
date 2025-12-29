import {
    LayoutDashboard,
    Users,
    FileText,
    Boxes,
    Send,
    GraduationCap,
    Award,
    Settings,
    LogOut, Bell
} from 'lucide-react';
import {Button} from "@/components/ui/button.tsx";

interface SidebarProps {
    currentPage: string;
    onNavigate: (page: string) => void;
    onLogout: () => void;
}

export function Sidebar({ currentPage, onNavigate, onLogout }: SidebarProps) {
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, disabled: false},
        { id: 'workforce', label: 'Workforce Registry', icon: Users, disabled: false },
        { id: 'documents', label: 'Documents', icon: FileText, disabled: false },
        { id: 'integrations', label: 'Integrations', icon: Boxes, disabled: true },
        { id: 'deployments', label: 'Deployments', icon: Send, disabled: false },
        { id: 'trainings', label: 'Trainings', icon: GraduationCap, disabled: false },
        { id: 'competency', label: 'Competency Tracking', icon: Award, disabled: true },
        { id: 'notifications', label: 'Notifications', icon: Bell, disabled: false },
    ];

    return (
        <div
            className="
        fixed left-0 top-0 h-screen bg-white border-r border-neutral-200
        flex flex-col transition-all duration-300
        w-16 lg:w-64
      "
        >
            {/* Logo */}
            <div className="p-2 border-b border-neutral-200 flex justify-center lg:justify-start lg:ml-2 items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                    <img src="/logo.png" alt="logo" />
                </div>

                {/* TEXT SHOWS ONLY ON lg+ */}
                <div className="hidden lg:block">
                    <div className="text-neutral-900">MOERS</div>
                    <div className="text-neutral-500 text-sm">Response System</div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 overflow-y-auto">
                <div className="space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentPage === item.id;
                        return (
                            <Button
                                key={item.id}
                                variant="ghost"
                                disabled={item.disabled}
                                onClick={() => onNavigate(item.id)}
                                className={`
                  w-full flex flex-row justify-start items-center px-3 py-2 rounded-md transition-colors
                  ${isActive ? 'bg-neutral-100 text-neutral-900'
                                    : 'text-neutral-600 '}
                `}
                            >
                                <Icon className="w-5 h-5" />

                                {/* LABEL SHOWN ONLY ON lg+ */}
                                <span className="hidden lg:inline ml-3">{item.label}</span>
                            </Button>
                        );
                    })}
                </div>
            </nav>

            {/* Bottom Section */}
            <div className="p-3 border-t border-neutral-200 space-y-1">
                <button
                    onClick={() => onNavigate('settings')}
                    className={`
            w-full flex items-center px-3 py-2 rounded-md transition-colors
            ${currentPage === 'settings'
                        ? 'bg-neutral-100 text-neutral-900'
                        : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                    }
          `}
                >
                    <Settings className="w-5 h-5" />
                    <span className="hidden lg:inline ml-3">Settings</span>
                </button>

                {/* USER SECTION */}
                <button
                    onClick={onLogout}
                    className="
            w-full flex items-center gap-3 px-3 py-2 rounded-md
            text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-colors
          "
                >
                    <div className="w-8 h-8 bg-neutral-200 rounded-full flex items-center justify-center">
                        <span className="text-neutral-700">AD</span>
                    </div>

                    {/* USER TEXT ONLY ON lg+ */}
                    <div className="hidden lg:flex flex-col flex-1 text-left">
                        <div className="text-neutral-900 text-sm">Admin User</div>
                        <div className="text-neutral-500 text-xs">admin@health.gov.mw</div>
                    </div>

                    {/* Logout icon only on lg+ */}
                    <LogOut className="w-4 h-4 hidden lg:block" />
                </button>
            </div>
        </div>
    );
}


