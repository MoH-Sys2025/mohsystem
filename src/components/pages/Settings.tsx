import { Bell, Lock, User, Database, Globe, Shield } from 'lucide-react';

export function Settings() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-neutral-900 mb-2">Settings</h1>
        <p className="text-neutral-500">Configure system preferences and account settings</p>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Settings */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
            <User className="w-6 h-6" />
          </div>
          <h3 className="text-neutral-900 mb-2">Profile Settings</h3>
          <p className="text-sm text-neutral-500 mb-4">Manage your account information and preferences</p>
          <div className="text-sm font-medium text-blue-600">Edit Profile →</div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
            <Bell className="w-6 h-6" />
          </div>
          <h3 className="text-neutral-900 mb-2">Notifications</h3>
          <p className="text-sm text-neutral-500 mb-4">Configure alert preferences and notification settings</p>
          <div className="text-sm font-medium text-emerald-600">Manage Alerts →</div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-neutral-900 mb-2">Security</h3>
          <p className="text-sm text-neutral-500 mb-4">Password, authentication, and security settings</p>
          <div className="text-sm font-medium text-red-600">Security Settings →</div>
        </div>
      </div>

      {/* General Settings */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h2 className="text-neutral-900 mb-6">General Settings</h2>
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-6 border-b border-neutral-200">
            <div>
              <p className="text-sm font-medium text-neutral-900 mb-1">System Language</p>
              <p className="text-sm text-neutral-500">Choose your preferred language</p>
            </div>
            <select className="px-4 py-2 border border-neutral-200 rounded-lg text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent bg-white">
              <option>English</option>
              <option>Chichewa</option>
            </select>
          </div>

          <div className="flex items-center justify-between pb-6 border-b border-neutral-200">
            <div>
              <p className="text-sm font-medium text-neutral-900 mb-1">Time Zone</p>
              <p className="text-sm text-neutral-500">Set your local time zone</p>
            </div>
            <select className="px-4 py-2 border border-neutral-200 rounded-lg text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent bg-white">
              <option>CAT (Central Africa Time)</option>
              <option>GMT</option>
              <option>UTC</option>
            </select>
          </div>

          <div className="flex items-center justify-between pb-6 border-b border-neutral-200">
            <div>
              <p className="text-sm font-medium text-neutral-900 mb-1">Email Notifications</p>
              <p className="text-sm text-neutral-500">Receive email updates for important events</p>
            </div>
            <label className="relative inline-block w-12 h-6">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-12 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neutral-900"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-900 mb-1">Auto-save Forms</p>
              <p className="text-sm text-neutral-500">Automatically save form progress</p>
            </div>
            <label className="relative inline-block w-12 h-6">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-12 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neutral-900"></div>
            </label>
          </div>
        </div>
      </div>

      {/* System Information */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h2 className="text-neutral-900 mb-6">System Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-neutral-500 mb-1">Version</p>
            <p className="text-sm font-medium text-neutral-900">MORS v2.4.1</p>
          </div>
          <div>
            <p className="text-sm text-neutral-500 mb-1">Last Updated</p>
            <p className="text-sm font-medium text-neutral-900">November 20, 2024</p>
          </div>
          <div>
            <p className="text-sm text-neutral-500 mb-1">Database Status</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-sm font-medium text-neutral-900">Connected</span>
            </div>
          </div>
          <div>
            <p className="text-sm text-neutral-500 mb-1">API Status</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-sm font-medium text-neutral-900">Operational</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}