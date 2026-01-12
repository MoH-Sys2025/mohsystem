import { useEffect, useState } from "react";
import { LoginPage } from "./components/LoginPage.tsx";
import { Dashboard } from "./components/Dashboard.tsx";
import { Toaster } from "sonner";
import { SelectedMOHDataProvider } from "./components/DataContext.tsx";
import { AuthProvider, useSession} from "./contexts/AuthProvider.tsx";
import NotificationListener from "@/components/NotificationListener.tsx";
import { CreateAccountPage} from "@/components/pages/CreateAccountPage.tsx";

export default function App() {
    const session = useSession();

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [authPage, setAuthPage] = useState<"login" | "signup">("login");

    /* ✅ Sync login state with Supabase session */
    useEffect(() => {
        if (session) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
            setAuthPage("login");
        }
    }, [session]);

    /* 🔐 AUTH SCREENS */
    if (!isLoggedIn) {
        if (authPage === "signup") {
            return (
                <CreateAccountPage
                    onBackToLogin={() => setAuthPage("login")}
                />
            );
        }

        return (
            <LoginPage
                onLogin={() => setIsLoggedIn(true)}
                onCreateAccount={() => setAuthPage("signup")}
            />
        );
    }

    /* 🧠 MAIN APP */
    return (
        <AuthProvider>
            <SelectedMOHDataProvider>
                <Toaster richColors position="top-center" />
                <NotificationListener />

                <Dashboard
                    onLogout={() => {
                        setIsLoggedIn(false);
                        setAuthPage("login");
                    }}
                />

                {/* breakpoint helper */}
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