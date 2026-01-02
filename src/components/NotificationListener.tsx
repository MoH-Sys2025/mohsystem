import { useEffect, useRef } from "react";
import { supabase } from "@/supabase/supabase.ts";
import { showAlert} from "@/components/NotificationsAlerts.tsx"; // adjust path

export default function NotificationListener() {
    const channelRef = useRef<any>(null);

    useEffect(() => {
        // Prevent duplicate subscriptions
        if (channelRef.current) return;

        const channel = supabase
            .channel("notifications:all", {
                config: { private: true },
            })
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "notifications",
                },
                (payload) => {
                    const notification = payload.new;

                    // 🔔 THIS is the important part
                    showAlert({
                        title: notification.title,
                        description: notification.message,
                        type: notification.type ?? "info",
                        duration: 5000, // 5 seconds
                    });
                }
            )
            .subscribe((status) => {
                console.log("Notifications channel status:", status);
            });

        channelRef.current = channel;

        return () => {
            if (channelRef.current) {
                supabase.removeChannel(channelRef.current);
                channelRef.current = null;
            }
        };
    }, []);

    return null;
}
