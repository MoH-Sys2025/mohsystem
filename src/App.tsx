import { useEffect, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom"; // ✅ Keep this
import { LoginPage } from "./components/LoginPage.tsx";
import { Toaster } from "sonner";
import { SelectedMOHDataProvider } from "./components/DataContext.tsx";
import { AuthProvider, useSession } from "./contexts/AuthProvider.tsx";
import NotificationListener from "@/components/NotificationListener.tsx";
import { CreateAccountPage } from "@/components/pages/CreateAccountPage.tsx";
import AppRoutes from "./routes/routes.tsx";

export default function App() {
    const session = useSession();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [authPage, setAuthPage] = useState<"login" | "signup">("login");

    useEffect(() => {
        if (session) setIsLoggedIn(true);
        else {
            setIsLoggedIn(false);
            setAuthPage("login");
        }
    }, [session]);

    return (
        <AuthProvider>
            <SelectedMOHDataProvider>
                <Toaster richColors position="top-center" />
                <NotificationListener />
                <Router>
                    <AppRoutes />
                </Router>

                <div className="fixed bottom-2 right-2 z-50 rounded bg-black px-3 py-1 text-white text-xs">
                    <span className="sm:hidden">xs</span>
                    <span className="hidden sm:block md:hidden">sm</span>
                    <span className="hidden md:block lg:hidden">md</span>
                    <span className="hidden lg:block xl:hidden">lg</span>
                    <span className="hidden xl:block 2xl:hidden">xl</span>
                    <span className="hidden 2xl:block">2xl</span>
                </div>
            </SelectedMOHDataProvider>
        </AuthProvider>
    );
}
