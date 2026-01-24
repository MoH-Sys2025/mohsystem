import { Sidebar } from "./Sidebar";
import { TopNavbar } from "./TopNavbar";
import { Outlet } from "react-router-dom";

interface DashboardProps {
    onLogout: () => void;
}

export function Dashboard({ onLogout }: DashboardProps) {
    return (
        <div className="min-h-screen flex">
            <Sidebar onLogout={onLogout} />

            <div className="flex-1 pl-16 lg:pl-64">
                <div className="sticky z-10 top-0 right-0">
                    <TopNavbar />
                </div>

                {/* ✅ Nested route pages render here */}
                <Outlet />
            </div>
        </div>
    );
}
