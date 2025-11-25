import { UserPlus, Send, FileCheck, Award } from 'lucide-react';

export function ActivityFeed() {
  const activities = [
    {
      type: 'deployment',
      icon: Send,
      title: 'New Deployment',
      description: '12 healthcare workers deployed to Dedza District',
      time: '15 minutes ago',
      color: 'emerald',
    },
    {
      type: 'registration',
      icon: UserPlus,
      title: 'Worker Registered',
      description: 'Dr. Grace Banda added to workforce registry',
      time: '1 hour ago',
      color: 'blue',
    },
    {
      type: 'certification',
      icon: Award,
      title: 'Training Completed',
      description: '28 workers certified in Emergency Response Protocol',
      time: '3 hours ago',
      color: 'amber',
    },
    {
      type: 'document',
      icon: FileCheck,
      title: 'Document Verified',
      description: 'Medical licenses verified for 15 healthcare workers',
      time: '5 hours ago',
      color: 'neutral',
    },
    {
      type: 'deployment',
      icon: Send,
      title: 'Deployment Complete',
      description: 'Outbreak response team returned from Mangochi',
      time: '1 day ago',
      color: 'emerald',
    },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'emerald':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'blue':
        return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'amber':
        return 'bg-amber-50 text-amber-600 border-amber-100';
      default:
        return 'bg-neutral-100 text-neutral-600 border-neutral-200';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-6">
      <div className="mb-6">
        <h2 className="text-neutral-900 mb-1">Recent Activity</h2>
        <p className="text-sm text-neutral-500">Latest system updates and actions</p>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = activity.icon;
          return (
            <div key={index} className="flex gap-4">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 border ${getColorClasses(activity.color)}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900 mb-1">{activity.title}</p>
                <p className="text-sm text-neutral-600 mb-1">{activity.description}</p>
                <span className="text-xs text-neutral-500">{activity.time}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}