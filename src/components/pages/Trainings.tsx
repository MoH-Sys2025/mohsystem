import { useEffect, useState } from "react";
import { GraduationCap, Calendar, Users, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose, DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/supabase/supabase.ts";

interface TrainingProps {
    onNavigate: (page: string) => void;
    personnelId: string; // current logged-in user
}

type Training = {
    id: string;
    title: string;
    start_date: string;
    end_date: string;
    location: string;
    participantsCount: number;
    registered: boolean;
    certified?: number;
};

type Personnel = {
    id: string;
    first_name: string;
    last_name: string;
};

export function Trainings({ onNavigate, personnelId }: TrainingProps) {
    const [upcoming, setUpcoming] = useState<Training[]>([]);
    const [completed, setCompleted] = useState<Training[]>([]);
    const [personnelList, setPersonnelList] = useState<Personnel[]>([]);
    const [selectedTraining, setSelectedTraining] = useState<Training | null>(null);
    const [selectedPersonnel, setSelectedPersonnel] = useState<Set<string>>(new Set());

    // Fetch trainings
    useEffect(() => {
        const fetchTrainings = async () => {
            const today = new Date().toISOString().split("T")[0];

            // Upcoming trainings
            const { data: upcomingData } = await supabase
                .from("trainings")
                .select(`
          id,
          title,
          start_date,
          end_date,
          location,
          training_participants(id, personnel_id)
        `)
                .gte("start_date", today)
                .order("start_date", { ascending: true });

            const upcomingNormalized: Training[] = (upcomingData || []).map((t: any) => ({
                id: t.id,
                title: t.title,
                start_date: t.start_date,
                end_date: t.end_date,
                location: t.location,
                participantsCount: t.training_participants?.length || 0,
                registered: t.training_participants?.some(
                    (p: any) => String(p.personnel_id).trim().toLowerCase() === String(personnelId).trim().toLowerCase()
                ) || false,
            }));

            setUpcoming(upcomingNormalized);

            // Completed trainings
            const { data: completedData } = await supabase
                .from("trainings")
                .select(`
          id,
          title,
          end_date,
          training_participants(id, personnel_id, attendance_certificate_url)
        `)
                .lte("end_date", today)
                .order("end_date", { ascending: false });

            const completedNormalized: Training[] = (completedData || []).map((t: any) => {
                const participantsCount = t.training_participants?.length || 0;
                const certified = t.training_participants?.filter((p: any) => p.attendance_certificate_url).length || 0;
                return {
                    id: t.id,
                    title: t.title,
                    start_date: "",
                    end_date: t.end_date,
                    location: "",
                    participantsCount,
                    certified,
                    registered: false,
                };
            });

            setCompleted(completedNormalized);
        };

        fetchTrainings();
    }, [personnelId]);

    // Open register modal
    const openRegisterModal = async (training: Training) => {
        setSelectedTraining(training);
        setSelectedPersonnel(new Set());

        // Fetch all personnel
        const { data: allPersonnel } = await supabase
            .from("personnel")
            .select("id, first_name, last_name");

        // Fetch registered personnel for this training
        const { data: registered } = await supabase
            .from("training_participants")
            .select("personnel_id")
            .eq("training_id", training.id);

        const registeredIds = (registered || []).map((r: any) =>
            String(r.personnel_id).trim().toLowerCase()
        );

        // Filter unregistered personnel
        const notRegistered = (allPersonnel || []).filter(
            (p) => !registeredIds.includes(String(p.id).trim().toLowerCase())
        );

        setPersonnelList(notRegistered);
    };

    // Toggle personnel selection
    const togglePersonnelSelection = (id: string) => {
        setSelectedPersonnel((prev) => {
            const copy = new Set(prev);
            if (copy.has(id)) copy.delete(id);
            else copy.add(id);
            return copy;
        });
    };

    // Register selected personnel
    const handleRegisterSelected = async () => {
        if (!selectedTraining || selectedPersonnel.size === 0) return;

        const insertData = Array.from(selectedPersonnel).map((pid) => ({
            training_id: selectedTraining.id,
            personnel_id: pid,
            attended: false,
        }));

        await supabase.from("training_participants").insert(insertData);

        // Update UI participants count
        setUpcoming((prev) =>
            prev.map((t) =>
                t.id === selectedTraining.id
                    ? { ...t, participantsCount: t.participantsCount + insertData.length }
                    : t
            )
        );

        setSelectedTraining(null);
    };

    return (
        <div className="space-y-8 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-neutral-900 mb-2">Trainings</h1>
                    <p className="text-neutral-500">
                        Manage training programs and certifications for healthcare workers
                    </p>
                </div>
                <Button
                    onClick={() => onNavigate("form trainings")}
                    className="text-sm cursor-pointer bg-gray-100 border-2 px-3 border-dashed rounded-lg text-gray hover:bg-gray-200 flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Create Training
                </Button>
            </div>

            {/* Upcoming Trainings */}
            <h2 className="text-neutral-900 mb-4">Upcoming Trainings</h2>
            <div className="space-y-4">
                {upcoming.map((t) => (
                    <div
                        key={t.id}
                        className="bg-white rounded-xl border border-neutral-200 p-6 flex justify-between items-start"
                    >
                        <div className="flex-1">
                            <h3 className="text-neutral-900 mb-2">{t.title}</h3>
                            <div className="flex gap-4 text-sm text-neutral-500">
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" /> {t.start_date}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Users className="w-4 h-4" /> {t.participantsCount} participants
                                </div>
                                <div>{t.location}</div>
                            </div>
                        </div>

                        {/* Register Modal */}
                        <Dialog
                            open={!!selectedTraining && selectedTraining.id === t.id}
                            onOpenChange={(open) => {
                                if (!open) setSelectedTraining(null);
                            }}
                        >
                            <DialogTrigger asChild>
                                <Button
                                    onClick={() => openRegisterModal(t)}
                                    disabled={t.registered}
                                    variant={t.registered ? "outline" : "default"}
                                >
                                    {t.registered ? "Registered" : "Register"}
                                </Button>
                            </DialogTrigger>

                            <DialogContent className="max-w-lg w-10/12 mx-auto p-2 flex flex-col h-[60vh]">
                                <DialogHeader className="px-6 py-2">
                                    <DialogTitle className="text-md">Healthcare Workers</DialogTitle>
                                </DialogHeader>

                                {/* Scrollable area */}
                                <ScrollArea className="flex-1 p-2 rounded-lg  bg-green-50 shadow-sm mx-4 overflow-y-auto">
                                    {personnelList.length === 0 ? (
                                        <p className="text-sm text-neutral-500">
                                            All personnel are already registered.
                                        </p>
                                    ) : (
                                        <ul className="space-y-0">
                                            {personnelList.map((p) => (
                                                <li
                                                    key={p.id}
                                                    className={`text-sm cursor-pointer px-4 py-2 rounded ${
                                                        selectedPersonnel.has(p.id)
                                                            ? "bg-emerald-100 text-green-900"
                                                            : "hover:bg-gray-100 text-green-800"
                                                    }`}
                                                    onClick={() => togglePersonnelSelection(p.id)}
                                                >
                                                    {p.first_name} {p.last_name}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </ScrollArea>

                                {/* Sticky footer */}
                                <DialogFooter className=" bg-white border-t px-6 ">
                                    <Button
                                        onClick={handleRegisterSelected}
                                        disabled={selectedPersonnel.size === 0}
                                        size="sm"
                                        className="text-sm w-full"
                                    >
                                        Register ({selectedPersonnel.size})
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                    </div>
                ))}
            </div>

            {/* Completed Trainings Table */}
            <h2 className="text-neutral-900 mt-8 mb-4">Recently Completed</h2>
            <div className="bg-white rounded-xl border border-neutral-200 overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-neutral-50 border-b border-neutral-200">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                            Training Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                            Completion Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                            Participants
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                            Certified
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                            Success Rate
                        </th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 bg-white">
                    {completed.map((t, idx) => (
                        <tr key={idx} className="hover:bg-neutral-50 transition-colors">
                            <td className="px-6 py-4">{t.title}</td>
                            <td className="px-6 py-4">{t.end_date}</td>
                            <td className="px-6 py-4">{t.participantsCount}</td>
                            <td className="px-6 py-4">{t.certified || 0}</td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 bg-neutral-200 rounded-full h-2 max-w-24">
                                        <div
                                            className="bg-emerald-600 h-2 rounded-full"
                                            style={{
                                                width: `${t.participantsCount ? ((t.certified || 0) / t.participantsCount) * 100 : 0}%`,
                                            }}
                                        />
                                    </div>
                                    <span className="text-sm font-medium text-neutral-700">
                      {t.participantsCount ? Math.round(((t.certified || 0) / t.participantsCount) * 100) : 0}%
                    </span>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
