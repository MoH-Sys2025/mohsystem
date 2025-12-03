import { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';
import {Toaster} from "sonner";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
      <>
          <Toaster richColors position={'top-center'}  />
          <Dashboard onLogout={() => setIsLoggedIn(false)} />
      </>
  );
}
