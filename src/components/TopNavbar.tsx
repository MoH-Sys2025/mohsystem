import { Search, Bell } from "lucide-react";
import { UserProfileHeader } from "@/components/ProfileHeader";
import {Input} from "@/components/ui/input.tsx";

export function TopNavbar() {
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
                <button className="relative p-2 text-neutral-600 hover:bg-neutral-100 rounded-md transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* Divider */}
                <div className="w-px h-6 bg-neutral-200"></div>

                {/* Profile — always visible */}
                <UserProfileHeader name="Admin Person" role="Developer" image={undefined} />
            </div>
        </header>
    );
}
