import { useEffect, useState } from "react";
import { Bell, Check, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogDescription,
    DialogTitle,
} from "@/components/ui/dialog";
import { api } from "@/supabase/Functions.tsx";

export default function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        async function load() {
            try {
                const data = await api.getNotifications(1000);
                setNotifications(data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    async function markAsRead(id) {
        await api.post(`/notifications/mark-read/${id}`);
        setNotifications(prev =>
            prev.map(n => (n.id === id ? { ...n, is_read: true } : n))
        );
    }

    function openDeleteDialog(id) {
        setSelectedId(id);
        setConfirmOpen(true);
    }

    async function confirmDelete() {
        if (!selectedId) return;

        setDeleteLoading(true);

        try {
            await api.deleteNotification(selectedId);
            setNotifications(prev => prev.filter(n => n.id !== selectedId));
        } catch (e) {
            console.error(e);
        } finally {
            setDeleteLoading(false);
            setConfirmOpen(false);
            setSelectedId(null);
        }
    }

    return (
        <div className="w-full md:p-4 lg:p-12 lg:py-4">
            {/* Header */}
            <div className="py-4 md:pb-6 px-4 flex items-center gap-2 text-xl font-semibold border-b">
                <Bell className="w-5 h-5" />
                Notifications
            </div>

            <ScrollArea className="h-[420px] px-4">
                {loading && (
                    <p className="text-center text-sm text-neutral-500 mt-4">
                        Loading...
                    </p>
                )}

                {!loading && notifications.length === 0 && (
                    <p className="text-center text-sm text-neutral-500 mt-4">
                        No notifications
                    </p>
                )}

                <div className="flex flex-col">
                    {notifications.map((notif, index) => (
                        <div key={notif.id} className="py-3">
                            {/* ROW 1 */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <p className="font-medium text-neutral-800">
                                        {notif.title}
                                    </p>

                                    <Badge
                                        variant={notif.is_read ? "secondary" : "default"}
                                        className="text-xs"
                                    >
                                        {notif.is_read ? "Read" : "Unread"}
                                    </Badge>
                                </div>

                                <div className="flex gap-1">
                                    {!notif.is_read && (
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => markAsRead(notif.id)}
                                        >
                                            <Check className="w-4 h-4 text-green-600" />
                                        </Button>
                                    )}

                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => openDeleteDialog(notif.id)}
                                    >
                                        <Trash2 className="w-4 h-4 text-red-600" />
                                    </Button>
                                </div>
                            </div>

                            {/* ROW 2 */}
                            <p className="text-sm text-neutral-600 mt-1">
                                {notif.message}
                            </p>

                            {index < notifications.length - 1 && (
                                <div className="h-px bg-neutral-200 mt-3" />
                            )}
                        </div>
                    ))}
                </div>
            </ScrollArea>

            {/* Delete confirmation modal */}
            <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Delete Notification?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                        <Button
                            variant="secondary"
                            onClick={() => setConfirmOpen(false)}
                        >
                            Cancel
                        </Button>

                        <Button
                            variant="destructive"
                            onClick={confirmDelete}
                            disabled={deleteLoading}
                        >
                            {deleteLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                "Delete"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
