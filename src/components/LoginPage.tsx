import { useState } from 'react';
import {Input} from "@/components/ui/input.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Loader2, Lock, Mail} from "lucide-react";
import {api} from "@/supabase/Functions.tsx";
import {toast} from "sonner";

interface LoginPageProps {
    onLogin: () => void;
    onCreateAccount: () => void;
}

export function LoginPage({ onLogin, onCreateAccount }: LoginPageProps) {
  const [email, setEmail] = useState('developer00@gmail.com');
  const [password, setPassword] = useState('0123456');
  const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data, error } = await api.signin(
                "developer00@gmail.com",
                "0123456"
            );

            if (error) {
                toast.error("Invalid login credentials");
                return;
            }

            toast.success("Login Successful");
            onLogin();

        } catch (err) {
            toast.error("Something went wrong");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-14 rounded-xl mb-3">
            <img src="/logo.png" alt="logo" />
          </div>
          <h1 className="text-neutral-900 mb-1 font-bold text-lg">Malawi Outbreak and Emergency Response System</h1>
          <p className="text-neutral-500">Healthcare Workforce Management Platform</p>
        </div>

        <div className="bg-white rounded-xl border-2  border-neutral-200 p-5 pt-5">
          <div className="mb-4">
            <h2 className="text-neutral-900 mb-1">Sign in to your account</h2>
            <p className="text-sm text-neutral-500">Enter your credentials to access the system</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-2">
              <div>
                  <Label
                      htmlFor="email"
                      className="block text-sm font-medium text-neutral-700 mb-2"
                  >
                      Email
                  </Label>

                  <div className="relative">
                      <Mail className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />

                      <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="admin@health.gov.mw"
                          required
                          className="pl-10"
                      />
                  </div>
              </div>

              <div>
                  <Label
                      htmlFor="password"
                      className="block text-sm font-medium text-neutral-700 mb-2"
                  >
                      Password
                  </Label>

                  <div className="relative">
                      <Lock className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />

                      <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          required
                          className="pl-10"
                      />
                  </div>
              </div>


              <div className="flex items-center justify-between text-sm mt-5">
              <Label className="flex items-center">
                <Input
                  type="checkbox"
                  className="w-4 h-4 border-neutral-300 rounded text-neutral-900 focus:ring-neutral-900" />
                <span className="ml-2 text-neutral-700 font-semibold">Remember me</span>
              </Label>
              <a href="#" className="text-neutral-900 hover:text-neutral-700 font-semibold">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full mt-3 px-4 py-2.5bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 transition-colors shadow-sm">
                <Loader2 className={`w-6 h-6 text-blue-500 ${(loading) ? 'animate-spin':'hidden'}`} />
                Sign in
            </Button>
          </form>

          <div className="mt-3 pt-3 border-t border-neutral-200">
            {/*<p className="text-sm text-neutral-500 text-center">*/}
            {/*  Need help? Contact{' '}*/}
            {/*  <a href="mailto:charlesbita@health.gov.mw" className="text-neutral-900 hover:text-neutral-700 font-medium">*/}
            {/*    support@health.gov.mw*/}
            {/*  </a>*/}
            {/*</p>*/}
              <div className="text-center">
                  <p className="text-sm text-neutral-500">
                      Don’t have an account?{" "}
                      <Button variant="ghost" size="sm"
                          type="button"
                          onClick={onCreateAccount}
                          className="text-neutral-900 font-semibold hover:underline">
                          Create account
                      </Button>
                  </p>
              </div>
          </div>
        </div>

          <p className="text-sm text-neutral-500 text-center mt-2">
          Ministry of Health, Malawi · Outbreak Response Division
        </p>
      </div>
    </div>
  );
}