import {Search, Bell, Badge} from "lucide-react";
import { UserProfileHeader } from "@/components/ProfileHeader";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {api} from "@/supabase/Functions.tsx";
import {useEffect, useState} from "react";

export function TopNavbar() {
    const [notifications, setNotifications] = useState(0)
    const [count, setCount] = useState(0);

    useEffect(() => {
        async function fetchNotifications(){
            const notificate = await api.getNotifications(1000)
            setNotifications(notificate)
            setCount(notificate.length)
        }

        fetchNotifications()
    }, []);
    return (
        <header className="bg-white border-b border-neutral-200 px-4 md:px-6 h-16 flex items-center justify-between">

            {/* LEFT — SEARCH BAR */}
            <div className="flex-1 max-w-full md:max-w-xl">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <Input
                        type="text"
                        placeholder="Search healthcare workers, documents, deployments..."
                        className=" w-full pl-10 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-md text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                </div>
            </div>

            {/* RIGHT — NOTIFICATIONS + PROFILE */}
            <div className="flex items-center gap-3 ml-3 flex-shrink-0">

                {/* Notification */}
                <Button variant="ghost" className="relative p-2 text-neutral-600 hover:bg-neutral-100 rounded-full transition-colors">
                    <Bell className="w-5 h-5" />
                    <div className="-top-1 absolute right-1 w-5 h-5 border-none bg-green-200  text-green-700 rounded-full text-sm">{count}</div>
                </Button>

                {/* Divider */}
                <div className="w-px h-6 bg-neutral-200"></div>

                {/* Profile — always visible */}
                <UserProfileHeader name="Administrator" role="Developer" image={undefined} />
            </div>
        </header>
    );
}
