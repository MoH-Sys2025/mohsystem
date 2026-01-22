import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { LoginPage } from "@/components/LoginPage";
import { CreateAccountPage } from "@/components/pages/CreateAccountPage";
import { DashboardHome } from "@/components/pages/DashboardHome";
import { WorkforceRegistry } from "@/components/pages/WorkforceRegistry";
import { Documents } from "@/components/pages/Documents";
import { Trainings } from "@/components/pages/Trainings";
import { Deployments } from "@/components/pages/Deployments";
import { Settings } from "@/components/pages/Settings";
import Notifications from "@/components/pages/Notifications";
import { useSession } from "@/contexts/AuthProvider";
import { Dashboard } from "../components/Dashboard.tsx";
import HealthWorkerProfile from "../components/pages/Profile.tsx";
import ExcelUploader from "../components/AddHCWExcel.tsx";
import NewDeploymentForm from "../components/pages/DeploymentForm.tsx";

function ProtectedRoute({ children }: { children: JSX.Element }) {
    const session = useSession();

    if (session === undefined) return null;
    if (!session) return <Navigate to="/login" replace />;
    return children;
}

export default function AppRoutes() {
    const navigate = useNavigate(); // ✅ ADD THIS

    return (
        <Routes>
            {/* Public */}
            <Route
                path="/login"
                element={
                    <LoginPage
                        onLogin={() => navigate("/dashboard")}   // ✅ go to dashboard
                        onCreateAccount={() => navigate("/signup")}
                    />
                }
            />
            <Route path="/signup" element={<CreateAccountPage onBackToLogin={() => navigate("/login")} />} />

            {/* Protected Dashboard */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard onLogout={() => {}} />
                    </ProtectedRoute>
                }
            >
                <Route index element={<DashboardHome />} />
                <Route path="workforce" element={<WorkforceRegistry />} />
                <Route path="documents" element={<Documents />} />
                <Route path="/dashboard/workregistry/profile" element={<HealthWorkerProfile />} />
                <Route path="/dashboard/workregistry/addworker" element={<ExcelUploader />} />
                <Route path="trainings" element={<Trainings />} />
                <Route path="/dashboard/deployments/newdeployments" element={<NewDeploymentForm />} />
                <Route path="deployments" element={<Deployments />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="settings" element={<Settings />} />
            </Route>

            {/* Fallback */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
}
