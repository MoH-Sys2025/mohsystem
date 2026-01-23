import {UserPlus, Send, FileCheck, Award, Trash2} from 'lucide-react';
import {useEffect, useState} from "react";
import {Badge} from "./ui/badge.tsx"
import {getNotificationsForWeek, getTodayDDMMYYYY, getTimeFromISO} from "../supabase/Functions.tsx";
import {ScrollArea, ScrollBar} from "./ui/scroll-area.tsx";


interface ActivityProps {
    className?: string;
}

export function ActivityFeed({className}: ActivityProps) {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [activities, setActivities] = useState<number[]>([]);
    const [days, setDays] = useState(7);
  // const activities = [
  //   {
  //     type: 'certification',
  //     icon: Award,
  //     title: 'Training Completed',
  //     description: '28 workers certified in Emergency Response Protocol',
  //     time: '3 hours ago',
  //     color: 'amber',
  //   },
  //   {
  //     type: 'document',
  //     icon: FileCheck,
  //     title: 'Document Verified',
  //     description: 'Medical licenses verified for 15 healthcare workers',
  //     time: '5 hours ago',
  //     color: 'neutral',
  //   },
  // ];

    useEffect(() => {
        async function load() {
            try {
                const data = await getNotificationsForWeek(days, getTodayDDMMYYYY())
                setNotifications(data || []);
                setActivities(data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);
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
    <div className={`bg - white rounded-xl border border-neutral-200 p-2 md:p-6 ${className}`}>
      <div className="mb-6">
        <h2 className="text-neutral-900 mb-1">Recent Activity</h2>
        <p className="text-sm text-neutral-500">Latest system updates and actions</p>
      </div>

      <div className="space-y-4">
        <ScrollArea className="h-65 max-h-68 rounded-lg scroll-smooth">
            <div className="space-y-3">
                {activities.length > 0 ? activities.map((activity, index) => {
                    let Icon =  Send;
                    if(activity?.type == "Deployment")
                        Icon = Send;
                    else if(activity?.type == "Registration")
                        Icon = UserPlus;
                    else if(activity?.type == "WorkerDeletion")
                        Icon = Trash2;
                    else if(activity?.title == "Healthcare Workers Registration")
                        Icon = UserPlus;

                    return (
                        <div key={index} className="flex gap-4">
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 border amber`}>
                                <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-neutral-900 mb-1">{activity.title}</p>
                                <p className="text-sm text-neutral-600">{activity.message}</p>
                                <span className="text-xs text-neutral-500">{activity?.created_at.split("T")[0]} {getTimeFromISO(activity?.created_at)}</span>
                            </div>
                        </div>
                    );
                }) : <p className="text-sm text-neutral-500">
                    No recent activities are available. Create, deploy and assign trainings to healthcare workers</p>
                }
            </div>
        </ScrollArea>
      </div>
    </div>
  );
}