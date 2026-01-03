import {Search, Bell, Badge, Loader2, MessageCircleReply} from "lucide-react";
import { UserProfileHeader } from "@/components/ProfileHeader";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {api, getTimeFromISO} from "@/supabase/Functions.tsx";
import {useEffect, useState} from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog.tsx";
import {toast} from "sonner";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";

export function TopNavbar() {
    const [notifications, setNotifications] = useState([])
    const [count, setCount] = useState(0);
    const [openDialog, setOpenDialog] = useState(false)

    useEffect(() => {
        async function fetchNotifications(){
            const [notificate] = await Promise.all([api.getNotifications(1000)])
            const unread = notificate.filter(n => !n.is_read)
            setNotifications(unread)
            setCount(unread.length)
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
                <Button variant="ghost" onClick={()=>setOpenDialog(true)} className="relative p-2 text-neutral-600 hover:bg-neutral-100 rounded-full transition-colors">
                    <Bell className="w-5 h-5" />
                    <div className="-top-1 absolute right-1 w-5 h-5 border-none bg-green-200  text-green-700 rounded-full text-sm">{count}</div>
                </Button>

                {/* Divider */}
                <div className="w-px h-6 bg-neutral-200"></div>

                {/* Profile — always visible */}
                <UserProfileHeader name="Administrator" role="Developer" image={undefined} />
                <AlertDialog open={openDialog}>
                    <AlertDialogContent className="md:p-5 p-3 pt-5 lg:w-7/12 md:w-8/12 w-11/12">
                        <AlertDialogHeader className="">
                            <AlertDialogTitle className="text-md">MOERS NOTIFICATIONS ?</AlertDialogTitle>
                            <AlertDialogDescription className="text-sm ">
                                Unread notifications.
                                <div className="overflow-y-auto w-full">
                                    <div className="md:max-h-[70vh] max-h-[68vh] flex flex-col justify-start items-center">
                                        {notifications.map((notifs, index)=>(
                                            <Alert key={index} className="border-none">
                                                <MessageCircleReply />
                                                <div className="flex-1 items-center">
                                                    <AlertTitle className="flex items-center gap-2 justify-between font-semibold text-gray-800">
                                                        {notifs.title}
                                                        <span  className="text-xs px-2 py-0.5 flex flex-row items-center gap-3">
                                                        <span className="bg-green-200 border-green-200 border-1 text-green-800 px-2 rounded-sm">Unread  </span> <span className="text-gray-500 text-xs">{getTimeFromISO(notifs.created_at)}</span>
                                                    </span>
                                                    </AlertTitle>

                                                    <AlertDescription className="mt-1">
                                                        {notifs.message}
                                                    </AlertDescription>
                                                </div>
                                            </Alert>
                                        ))}
                                    </div>
                                </div>
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogAction className="text-xs px-2" onClick={()=>setOpenDialog(false)}>Close</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </header>
    );
}
