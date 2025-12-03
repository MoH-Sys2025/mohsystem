import { Boxes, Settings } from 'lucide-react';

export function Integrations() {
  const integrations = [
    {
      name: 'DHIS2',
      description: 'District Health Information Software 3 - National health data platform',
      status: 'connected',
      lastSync: '2 hours ago',
      logo: 'bg-blue-500',
    },
    {
      name: 'OpenMRS',
      description: 'Open Medical Record System for patient data management',
      status: 'connected',
      lastSync: '5 hours ago',
      logo: 'bg-emerald-500',
    },
    {
      name: 'iHRIS',
      description: 'Integrated Human Resource Information System',
      status: 'connected',
      lastSync: '1 day ago',
      logo: 'bg-purple-500',
    },
    {
      name: 'WHO AFRO',
      description: 'WHO African Regional Office outbreak reporting system',
      status: 'pending',
      lastSync: 'Not synced',
      logo: 'bg-amber-500',
    },
  ];

  const availableIntegrations = [
    {
      name: 'eLMIS',
      description: 'Electronic Logistics Management Information System',
      logo: 'bg-orange-500',
    },
    {
      name: 'RapidPro',
      description: 'SMS and messaging platform for health communication',
      logo: 'bg-cyan-500',
    },
    {
      name: 'CommCare',
      description: 'Mobile data collection and case management',
      logo: 'bg-pink-500',
    },
  ];

  return (
    <div className="space-y-8 p-2 md:p-6">
      {/* Header */}
      <div>
        <h1 className="text-neutral-900 mb-2">Integrations</h1>
        <p className="text-neutral-500">Connect with health information systems and data platforms</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-neutral-200 p-5">
          <p className="text-sm text-neutral-500 mb-1">Active Connections</p>
          <p className="text-3xl font-semibold text-neutral-900">3</p>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-5">
          <p className="text-sm text-neutral-500 mb-1">Pending Setup</p>
          <p className="text-3xl font-semibold text-neutral-900">1</p>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-5">
          <p className="text-sm text-neutral-500 mb-1">Data Synced Today</p>
          <p className="text-3xl font-semibold text-neutral-900">1,247 records</p>
        </div>
      </div>

      {/* Connected Integrations */}
      <div>
        <h2 className="text-neutral-900 mb-4">Connected Systems</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {integrations.map((integration, index) => (
            <div key={index} className="bg-white rounded-xl border border-neutral-200 p-2 md:p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-12 h-12 ${integration.logo} rounded-xl flex items-center justify-center text-white flex-shrink-0`}>
                  <Boxes className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-neutral-900 mb-1">{integration.name}</h3>
                  <p className="text-sm text-neutral-500">{integration.description}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
                <div className="flex items-center gap-2 text-sm">
                  {integration.status === 'connected' ? (
                    <>
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span className="text-neutral-700">Connected</span>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                      <span className="text-neutral-700">Pending</span>
                    </>
                  )}
                </div>
                <div className="text-sm text-neutral-500">Last sync: {integration.lastSync}</div>
                <button className="p-1.5 hover:bg-neutral-100 rounded-md transition-colors">
                  <Settings className="w-4 h-4 text-neutral-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Available Integrations */}
      <div>
        <h2 className="text-neutral-900 mb-4">Available Integrations</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {availableIntegrations.map((integration, index) => (
            <div key={index} className="bg-white rounded-xl border border-neutral-200 p-2 md:p-6 hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 ${integration.logo} rounded-xl flex items-center justify-center text-white mb-4`}>
                <Boxes className="w-6 h-6" />
              </div>
              <h3 className="text-neutral-900 mb-2">{integration.name}</h3>
              <p className="text-sm text-neutral-500 mb-4">{integration.description}</p>
              <button className="w-full px-4 py-2 bg-neutral-100 text-neutral-900 rounded-lg hover:bg-neutral-200 transition-colors text-sm font-medium">
                Connect
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}