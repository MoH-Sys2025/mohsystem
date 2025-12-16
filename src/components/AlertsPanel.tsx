import { AlertTriangle, AlertCircle, Info } from 'lucide-react';

export function AlertsPanel() {
  const alerts = [
    {
      type: 'urgent',
      title: 'Cholera Outbreak - Nsanje',
      description: '15 additional healthcare workers needed',
      time: '2 hours ago',
    },
    {
      type: 'warning',
      title: 'Low Stock Alert',
      description: 'Medical supplies below threshold in Karonga',
      time: '5 hours ago',
    },
    {
      type: 'info',
      title: 'Training Completion',
      description: '34 workers completed COVID-19 protocol training',
      time: '1 day ago',
    },
    {
      type: 'warning',
      title: 'Deployment Gap',
      description: 'Staffing shortage reported in Chitipa district',
      time: '2 days ago',
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-2 md:p-6 h-full">
      <div className="mb-2">
        <h2 className="text-neutral-900 mb-1">Active Alerts</h2>
        <p className="text-sm text-neutral-500">Critical updates and notifications</p>
      </div>

      <div className="space-y-3 md:max-h-70 md:overflow-y-scroll overflow-hidden max-h-full">
        {alerts.map((alert, index) => {
          const getIcon = () => {
            switch (alert.type) {
              case 'urgent':
                return <AlertTriangle className="w-4 h-4" />;
              case 'warning':
                return <AlertCircle className="w-4 h-4" />;
              default:
                return <Info className="w-4 h-4" />;
            }
          };

          const getColorClasses = () => {
            switch (alert.type) {
              case 'urgent':
                return 'bg-red-50 text-red-600 border-red-100';
              case 'warning':
                return 'bg-amber-50 text-amber-600 border-amber-100';
              default:
                return 'bg-blue-50 text-blue-600 border-blue-100';
            }
          };

          return (
            <div
              key={index}
              className="border border-neutral-200  overscroll-y-auto rounded-lg p-2 hover:shadow-sm transition-all cursor-pointer"
            >
              <div className="flex gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${getColorClasses()}`}>
                  {getIcon()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900 mb-1">{alert.title}</p>
                  <p className="text-sm text-neutral-600 mb-1">{alert.description}</p>
                </div>
                  <span className="text-xs text-neutral-500">{alert.time}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}