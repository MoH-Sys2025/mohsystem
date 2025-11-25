import { useState } from 'react';
import { Activity } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-600 rounded-xl mb-4 shadow-sm">
            <Activity className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-neutral-900 mb-2">Malawi Outbreak Response System</h1>
          <p className="text-neutral-500">Healthcare Workforce Management Platform</p>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-8">
          <div className="mb-6">
            <h2 className="text-neutral-900 mb-2">Sign in to your account</h2>
            <p className="text-sm text-neutral-500">Enter your credentials to access the system</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-neutral-300 rounded-lg text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-shadow"
                placeholder="admin@health.gov.mw"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-neutral-300 rounded-lg text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-shadow"
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 border-neutral-300 rounded text-neutral-900 focus:ring-neutral-900"
                />
                <span className="ml-2 text-neutral-700">Remember me</span>
              </label>
              <a href="#" className="text-neutral-900 hover:text-neutral-700 font-medium">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2.5 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 transition-colors shadow-sm"
            >
              Sign in
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-neutral-200">
            <p className="text-sm text-neutral-500 text-center">
              Need help? Contact{' '}
              <a href="mailto:support@health.gov.mw" className="text-neutral-900 hover:text-neutral-700 font-medium">
                support@health.gov.mw
              </a>
            </p>
          </div>
        </div>

        <p className="text-sm text-neutral-500 text-center mt-6">
          Ministry of Health, Malawi · Outbreak Response Division
        </p>
      </div>
    </div>
  );
}