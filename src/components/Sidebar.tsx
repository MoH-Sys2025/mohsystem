import {
    LayoutDashboard,
    Users,
    FileText,
    Boxes,
    Send,
    GraduationCap,
    Award,
    Settings,
    LogOut,
    Bell,
    User,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSession } from "@/contexts/AuthProvider";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { supabase } from "@/supabase/supabase";

interface SidebarProps {
    onLogout: () => void;
}

export function Sidebar({ onLogout }: SidebarProps) {
    const session = useSession();
    const navigate = useNavigate();
    const [logoutDialog, setLogoutDialog] = useState(false);

    const navItems = [
        { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, disabled: false },
        { to: "/dashboard/workforce", label: "Workforce Registry", icon: Users, disabled: false },
        { to: "/dashboard/documents", label: "Documents", icon: FileText, disabled: false },
        { to: "/dashboard/integrations", label: "Integrations", icon: Boxes, disabled: true },
        { to: "/dashboard/deployments", label: "Deployments", icon: Send, disabled: false },
        { to: "/dashboard/trainings", label: "Trainings", icon: GraduationCap, disabled: false },
        { to: "/dashboard/competency", label: "Competency Tracking", icon: Award, disabled: true },
        { to: "/dashboard/notifications", label: "Notifications", icon: Bell, disabled: false },
    ];


    return (
        <div className="fixed left-0 top-0 h-screen w-16 lg:w-64 bg-white border-r border-neutral-200 flex flex-col">
            {/* Logo */}
            <div className="p-2 border-b border-neutral-200 flex items-center gap-3 justify-center lg:justify-start">
                <img src="/logo.png" alt="logo" className="w-10 h-10" />
                <div className="hidden lg:block">
                    <div className="text-neutral-900 font-semibold">MOERS</div>
                    <div className="text-neutral-500 text-sm">Response System</div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="lg:flex-1 lg:p-1 lg:py-1  flex lg:block flex-col justify-center items-center">
                {navItems.map((item) => {
                    const Icon = item.icon;

                    if (item.disabled) {
                        return (
                            <Button
                                key={item.to}
                                disabled
                                variant="ghost"
                                className="lg:w-full flex flex-row items-center my-1 h-9 w-9 lg:h-10 justify-center lg:justify-start border lg:border-none opacity-60"
                            >
          <span className="w-full flex flex-row lg:justify-start justify-center items-center lg:gap-4 h-full">
            <Icon className="w-5 h-5" />
            <span className="hidden lg:inline">{item.label}</span>
          </span>
                            </Button>);}

                    return (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.to === "/dashboard"} // makes only /dashboard active, not /dashboard/anything
                            className="lg:w-full"
                        >
                            {({ isActive }) => (
                                <Button
                                    variant="ghost"
                                    className={[
                                        "lg:w-full flex flex-row items-center my-1 h-9 w-9 lg:h-10 justify-center lg:justify-start border lg:border-none",
                                        "transition-colors",
                                        isActive
                                            ? "bg-neutral-100 text-neutral-900"
                                            : "text-neutral-600 hover:bg-neutral-50",
                                    ].join(" ")}
                                >
            <span className="w-full flex flex-row lg:justify-start justify-center items-center lg:gap-4 h-full">
              <Icon className="w-5 h-5" />
              <span className="hidden lg:inline">{item.label}</span>
            </span>
                                </Button>
                            )}
                        </NavLink>
                    );
                })}
            </nav>


            {/* Bottom Section */}
            <div className="p-3 border-t border-neutral-200 space-y-1">
                <NavLink
                    to="/dashboard/settings"
                    className={({ isActive }) =>
                        `
            flex items-center gap-3 px-3 py-2 rounded-md transition-colors
            ${isActive ? "bg-neutral-100 text-neutral-900" : "text-neutral-600 hover:bg-neutral-50"}
          `
                    }
                >
                    <Settings className="w-5 h-5" />
                    <span className="hidden lg:inline">Settings</span>
                </NavLink>

                {/* User / Logout */}
                <Button
                    variant="ghost"
                    onClick={() => setLogoutDialog(true)}
                    className="w-full flex items-center justify-center gap-3 rounded-full lg:justify-start border-2 lg:border-none bg-neutral-200 lg:bg-white text-neutral-600 hover:bg-neutral-50"
                >
                    <div className="w-8 h-8 lg:bg-neutral-200 rounded-full flex  items-center justify-center">
                        <User className="w-6 h-6 lg:w-4 lg:h-4" />
                    </div>

                    <div className="hidden lg:flex flex-col text-left flex-1">
                        <span className="text-sm text-neutral-900">Administrator</span>
                        <span className="text-xs text-neutral-500">{session?.user.email}</span>
                    </div>

                    <LogOut className="hidden lg:block w-4 h-4" />
                </Button>
            </div>

            {/* Logout Dialog */}
            <AlertDialog open={logoutDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Logout?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to logout?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setLogoutDialog(false)}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={async () => {
                                const { error } = await supabase.auth.signOut();
                                if (!error) {
                                    onLogout();
                                    navigate("/login", { replace: true });
                                }
                            }}
                        >
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
