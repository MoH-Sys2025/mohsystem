import {useEffect, useState} from 'react';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';
import {Toaster} from "sonner";
import {SelectedMOHDataProvider} from "@/components/DataContext.tsx";
import {AuthProvider, useSession} from "@/contexts/AuthProvider.tsx";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const session = useSession();

  if(session != undefined) {
      setIsLoggedIn(true)
      setIsLoggedIn(true);
  }
  else if (!isLoggedIn) {
    return <LoginPage onLogin={() => {
        setIsLoggedIn(true)
    }} />;
  }

  return (
      <AuthProvider>
          <SelectedMOHDataProvider>
              <Toaster richColors position={'top-center'}  />
              <Dashboard onLogout={() => setIsLoggedIn(false)} />

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
