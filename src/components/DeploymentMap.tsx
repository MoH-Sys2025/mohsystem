import { MapPin } from 'lucide-react';

export function DeploymentMap() {
  const deployments = [
    { district: 'Lilongwe', workers: 45, status: 'active', lat: 35, lng: 40 },
    { district: 'Blantyre', workers: 38, status: 'active', lat: 65, lng: 60 },
    { district: 'Mzuzu', workers: 22, status: 'monitoring', lat: 45, lng: 20 },
    { district: 'Zomba', workers: 18, status: 'active', lat: 70, lng: 45 },
    { district: 'Mangochi', workers: 15, status: 'monitoring', lat: 75, lng: 70 },
  ];

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-6">
      <div className="mb-6">
        <h2 className="text-neutral-900 mb-1">Active Deployment Map</h2>
        <p className="text-sm text-neutral-500">Healthcare worker distribution across districts</p>
      </div>

      <div className="relative bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl border border-neutral-200 h-96 overflow-hidden">
        
        {/* Map Markers */}
        {deployments.map((deployment, index) => (
          <div
            key={index}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
            style={{ top: `${deployment.lat}%`, left: `${deployment.lng}%` }}
          >
            <div className={`w-4 h-4 rounded-full ${
              deployment.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'
            } ring-4 ring-white shadow-lg animate-pulse`}></div>
            
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="bg-neutral-900 text-white px-3 py-2 rounded-lg shadow-lg whitespace-nowrap text-sm">
                <div className="font-medium">{deployment.district}</div>
                <div className="text-neutral-300 text-xs">{deployment.workers} workers deployed</div>
                <div className={`text-xs ${
                  deployment.status === 'active' ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {deployment.status}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg border border-neutral-200 p-3 shadow-sm">
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="text-neutral-700">Active Response</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span className="text-neutral-700">Monitoring</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}