import { useEffect, useState } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { Search } from "lucide-react";

import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group";

import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";
import { Check, Loader2 } from "lucide-react";
import { Kbd } from "@/components/ui/kbd"
import {
    Calendar,
    Users,
    Plus,
    UserPlus,
    CheckCircle,
    Pencil,
    Trash2,
    Download, LocateIcon, MapPin, GraduationCap, User,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/supabase/supabase";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Checkbox } from "../ui/checkbox";
import {Label} from "../ui/label.tsx";
import {toast} from "sonner";
import {ScrollBar} from "../ui/scroll-area.tsx";
import {Scrollbar} from "@radix-ui/react-scroll-area";

/* ===================== TYPES ===================== */
interface TrainingProps {
    onNavigate: (page: string) => void;
    personnelId: string;
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
    email?: string;
    phone?: string;
    district?: string;
};

type TrainingParticipant = {
    id: string;
    first_name: string;
    last_name: string;
    personnel_id: string;
    district: string;
    status: string; // e.g. registered | attended | certified | absent
};

type SearchProps = {
    value: string;
    onChange: (value: string) => void;
    statuses: string[];
    onStatusAdd: (status: string) => void;
    onStatusRemove: (status: string) => void;

    availableDistricts: string[];
    selectedDistricts: string[];
    onDistrictAdd: (district: string) => void;
    onDistrictRemove: (district: string) => void;
};

function ParticipantSearch({
                               value,
                               onChange,
                               statuses,
                               onStatusAdd,
                               onStatusRemove,
                               availableDistricts,   // ✅ ADD THIS
                               selectedDistricts,
                               onDistrictAdd,
                               onDistrictRemove,
                           }: {
    value: string;
    onChange: (value: string) => void;
    statuses: string[];
    onStatusAdd: (status: string) => void;
    onStatusRemove: (status: string) => void;
    availableDistricts: string[];   // ✅ ADD THIS
    selectedDistricts: string[];
    onDistrictAdd: (district: string) => void;
    onDistrictRemove: (district: string) => void;
}) {
    const STATUS_OPTIONS = ["registered", "attended", "completed", "absent", "cancelled"];

    return (
        <div className="py-1 space-y-1">
            {/* Search row */}
            <InputGroup className="w-full">
                <InputGroupInput
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Search by name or district..."
                    className="text-sm"
                />

                <InputGroupAddon>
                    <Search className="w-4 h-4 text-neutral-500" />
                </InputGroupAddon>

                {/* District Dropdown */}
                <InputGroupAddon align="inline-end">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="xs" className="px-2 py-1 text-xs bg-green-100">
                                District
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                            {availableDistricts.map((district) => (
                                <DropdownMenuItem
                                    key={district}
                                    disabled={selectedDistricts.includes(district)}
                                    onClick={() => onDistrictAdd(district)}
                                    className="capitalize"
                                >
                                    {district}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>

                    </DropdownMenu>
                </InputGroupAddon>

                {/* Status Dropdown */}
                <InputGroupAddon align="inline-end">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="xs" className="px-2 text-xs py-1 bg-green-100">
                                Status
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                            {STATUS_OPTIONS.map((status) => (
                                <DropdownMenuItem
                                    key={status}
                                    disabled={statuses.includes(status)}
                                    onClick={() => onStatusAdd(status)}
                                    className="capitalize"
                                >
                                    {status}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </InputGroupAddon>
            </InputGroup>

            {/* Selected districts & statuses */}
            <div className="flex flex-wrap gap-1 bg-gray-50 p-2 py-1 rounded-sm">
                {selectedDistricts.map((district) => (
                    <span
                        key={district}
                        className="flex items-center font-semibold text-green-800 gap-1 px-2 py-0.5 text-xs rounded-md border bg-green-200 capitalize"
                    >
      {district}
                        <button
                            onClick={() => onDistrictRemove(district)}
                            className="text-neutral-500 hover:text-red-600"
                        >
        ✕
      </button>
    </span>
                ))}

                {statuses.map((status) => (
                    <span
                        key={status}
                        className="flex items-center font-semibold gap-1 px-2 py-0.5 text-xs rounded-md border bg-neutral-200 capitalize">
                        {status}
                        <button
                            onClick={() => onStatusRemove(status)}
                            className="text-neutral-500 hover:text-red-600"
                        >
                            ✕
                        </button>
                    </span>
                ))}
            </div>
        </div>
    );
}


/* ===================== COMPONENT ===================== */
export function Trainings({ onNavigate, personnelId }: TrainingProps) {
    const [searchText, setSearchText] = useState("");
    const [statusFilters, setStatusFilters] = useState<string[]>([]);

    const [upcoming, setUpcoming] = useState<Training[]>([]);
    const [completed, setCompleted] = useState<Training[]>([]);
    const [activeTraining, setActiveTraining] = useState<Training | null>(null);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [pendingStatus, setPendingStatus] = useState<string | null>(null);
    const [pendingPersonnelId, setPendingPersonnelId] = useState<string | null>(null);
    const [pendingPersonnelId2, setPendingPersonnelId2] = useState<string | null>(null);

    const [participants, setParticipants] = useState<TrainingParticipant[]>([]);
    const [participantsLoading, setParticipantsLoading] = useState(false);

    const [loading, setLoading] = useState<boolean>(false);
    // Left panel (register personnel)
    const [registerDistrictFilters, setRegisterDistrictFilters] = useState<string[]>([]);

    const addRegisterDistrictFilter = (district: string) => {
        setRegisterDistrictFilters((prev) => [...prev, district]);
    };
    const removeRegisterDistrictFilter = (district: string) => {
        setRegisterDistrictFilters((prev) => prev.filter((d) => d !== district));
    };

    const [selectedTraining, setSelectedTraining] = useState<Training | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [personnelList, setPersonnelList] = useState<Personnel[]>([]);

    const [districtFilters, setDistrictFilters] = useState<string[]>([]);

    const addDistrictFilter = (district: string) => {
        setDistrictFilters((prev) => [...prev, district]);
    };

    const removeDistrictFilter = (district: string) => {
        setDistrictFilters((prev) => prev.filter((d) => d !== district));
    };

    const addStatusFilter = (status: string) => {
        setStatusFilters((prev) => [...prev, status]);
    };

    const [registerSearch, setRegisterSearch] = useState("");

    const removeStatusFilter = (status: string) => {
        setStatusFilters((prev) => prev.filter((s) => s !== status));
    };

    const [selectedPersonnel, setSelectedPersonnel] = useState<Set<string>>(
        new Set()
    );

    const SYSTEM_TITLE = "Malawi Outbreak and Emergency Response System";
    const SYSTEM_SUBTITLE = "Healthcare Workforce Management Platform";

    /* ===================== DATA LOAD ===================== */
    useEffect(() => {
        fetchTrainings();
    }, [personnelId]);

    const confirmStatusUpdate = async () => {
        if (!activeTraining || !pendingPersonnelId || !pendingStatus) return;

        // Optimistic UI
        setParticipants((prev) =>
            prev.map((p) =>
                p.id === pendingPersonnelId ? { ...p, status: pendingStatus } : p
            )
        );

        setIsLoading(true);
        const { error } = await supabase
            .from("training_participants")
            .update({ attended: true, status: pendingStatus })
            .eq("id", pendingPersonnelId); // use row id

        if(error) {
            throw error;
        }

        const { data: row, error: fetchErr } = await supabase
            .from('personnel')
            .select('trainings')
            .eq('id', pendingPersonnelId2)
            .eq('system_status', 'registered')
            .single()

        if(fetchErr) throw fetchErr

        const updated = [...(row.trainings || []), activeTraining.title]

        if (pendingStatus === "completed" || pendingStatus === "attended") {
            const { data, error1 } = await supabase
                .from('personnel')
                .update({ trainings: updated })
                .eq('id', pendingPersonnelId2)

            if (error1)
                throw error1
        }

        setIsLoading(false);

        if (error) toast.error("Failed to update status:");

        setConfirmOpen(false);
        setPendingStatus(null);
        setPendingPersonnelId(null);
    };


    const fetchTrainings = async () => {
        const today = new Date().toISOString().split("T")[0];

        const { data: upcomingData, error } = await supabase
            .from("trainings")
            .select(`
            id,
            title,
            start_date,
            end_date,
            location,
            training_participants(personnel_id)`)
            .order("start_date");

        setUpcoming(
            (upcomingData || []).map((t: any) => ({
                id: t.id,
                title: t.title,
                start_date: t.start_date,
                end_date: t.end_date,
                location: t.location,
                participantsCount: t.training_participants?.length || 0,
                registered: t.training_participants?.some(
                    (p: any) =>
                        String(p.personnel_id).toLowerCase() ===
                        String(personnelId).toLowerCase()
                ),
            }))
        );

        const { data: completedData } = await supabase
            .from("trainings")
            .select(`
            id,
            title,
            end_date,
            training_participants(attendance_certificate_url)
          `)
            .lte("end_date", today)
            .order("end_date", { ascending: false });

        setCompleted(
            (completedData || []).map((t: any) => ({
                id: t.id,
                title: t.title,
                start_date: "",
                end_date: t.end_date,
                location: "",
                participantsCount: t.training_participants?.length || 0,
                certified:
                    t.training_participants?.filter(
                        (p: any) => p.attendance_certificate_url
                    ).length || 0,
                registered: false,
            }))
        );
    };

    const filteredParticipants = participants.filter((p) => {
        const q = searchText.toLowerCase();

        const matchesText =
            !q ||
            `${p.first_name} ${p.last_name}`.toLowerCase().includes(q) ||
            p.district?.toLowerCase().includes(q);

        const matchesStatus =
            statusFilters.length === 0 || statusFilters.includes(p.status);

        const matchesDistrict =
            districtFilters.length === 0 || districtFilters.includes(p.district);

        return matchesText && matchesStatus && matchesDistrict;
    });

    const fetchExportData = async (training: Training) => {
        const { data, error } = await supabase
            .from("training_participants")
            .select(`personnel (last_name, first_name, email, phone, metadata)
      `)
            .eq("training_id", training.id);

        if (error || !data) return [];

        return data.map((r: any) => r.personnel).filter(Boolean);
    };

    // Filter personnel by selected districts only
    const filteredPersonnel = personnelList.filter((p) => {
        const fullName = `${p.first_name} ${p.last_name}`.toLowerCase();

        const matchesName =
            registerSearch.trim() === "" ||
            fullName.includes(registerSearch.toLowerCase());

        const matchesDistrict =
            registerDistrictFilters.length === 0 ||
            registerDistrictFilters.includes(p.metadata.district);

        return matchesName && matchesDistrict;
    });

    /* ===================== PARTICIPANTS ===================== */
    const loadParticipants = async (training: Training) => {
        setActiveTraining(training);
        setParticipants([]);
        setParticipantsLoading(true);

        const { data } = await supabase
            .from("training_participants")
            .select(`
                id,
                status,
                personnel_id,
                personnel (
                  id,
                  first_name,
                  last_name,
                  metadata
                )
              `)
            .eq("training_id", training.id);
        setParticipants(
            (data || [])
                .filter((p: any) => p.personnel)
                .map((p: any) => ({
                    id: p.id,
                    personnel_id: p.personnel_id,
                    first_name: p.personnel.first_name,
                    last_name: p.personnel.last_name,
                    status: p.status,
                    district: p.personnel.metadata?.district ?? "—",
                }))
                .sort((a, b) =>
                    a.first_name.localeCompare(b.first_name) ||
                    a.last_name.localeCompare(b.last_name)
                )
        );


        setParticipantsLoading(false);
    };

    /* ===================== REGISTER ===================== */
    const openRegisterModal = async (training: Training) => {
        setSelectedTraining(training);
        setSelectedPersonnel(new Set());

        const { data: allPersonnel } = await supabase
            .from("personnel")
            .select("id, first_name, last_name, metadata")
            .eq("system_status", "registered");

        const { data: registered } = await supabase
            .from("training_participants")
            .select("personnel_id")
            .eq("training_id", training.id);

        const registeredIds = new Set(
            (registered || []).map((r: any) => String(r.personnel_id).toLowerCase())
        );
        setPersonnelList(
            (allPersonnel || [])
                .filter(
                    (p) => !registeredIds.has(String(p.id).toLowerCase())
                )
                .sort((a, b) =>
                    a.first_name.localeCompare(b.first_name) ||
                    a.last_name.localeCompare(b.last_name)
                )
        );

    };

    const togglePersonnelSelection = (id: string) => {
        setSelectedPersonnel((prev) => {
            const copy = new Set(prev);
            copy.has(id) ? copy.delete(id) : copy.add(id);
            return copy;
        });
    };

    const handleRegisterSelected = async () => {
        if (!selectedTraining || selectedPersonnel.size === 0) return;

        const rows = Array.from(selectedPersonnel).map((pid) => ({
            training_id: selectedTraining.id,
            personnel_id: pid,
            attended: false,
        }));

        setLoading(true);
        await supabase.from("training_participants").insert(rows);
        setSelectedTraining(null);
        fetchTrainings();
        setLoading(false);
    };

    /* ===================== EXPORT FUNCTIONS ===================== */
    const downloadBlob = (content: string, filename: string, type: string) => {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();

        URL.revokeObjectURL(url);
    };

    const exportCSV = async (training: Training) => {
        const participants = await fetchExportData(training);
        if (!participants.length) return;

        const SYSTEM_TITLE = "Malawi Outbreak and Emergency Response System";
        const SYSTEM_SUBTITLE = "Healthcare Workforce Management Platform";

        // CSV lines
        const csvLines = [
            `"${SYSTEM_TITLE}"`,            // Title (first row, mimics bold)
            `"${SYSTEM_SUBTITLE}"`,         // Subtitle
            "",                             // Empty row for spacing
            `"Full Name","Email","Phone","Training Title","Start Date","End Date","Location"`, // Header
            ...participants.map(
                (p) =>
                    `"${p.last_name} ${p.first_name}","${p.email}","${p.phone}","${training.title}","${training.start_date}","${training.end_date}","${training.location}"`
            ),
        ];

        const csv = csvLines.join("\n");

        downloadBlob(csv, `${training.title}.csv`, "text/csv");
    };

    const exportTXT = async (training: Training) => {
        const participants = await fetchExportData(training);
        if (!participants.length) return;

        const center = (text: string, width = 70) =>
            text.padStart((width + text.length) / 2).padEnd(width);

        const text = `
${center(SYSTEM_TITLE)}
${center(SYSTEM_SUBTITLE)}

Training Details
----------------
Title: ${training.title}
Start Date: ${training.start_date}
End Date: ${training.end_date}
Location: ${training.location}

Participants
------------
${participants
            .map(
                (p, i) =>
                    `${i + 1}. ${p.last_name} ${p.first_name} | ${p.email} | ${p.phone}`
            )
            .join("\n")}
`;

        downloadBlob(text, `${training.title}.txt`, "text/plain");
    };

    const exportPDF = async (training: Training) => {
        const participants = await fetchExportData(training);
        if (!participants.length) return;

        const doc = new jsPDF();
        doc.addImage("/logo.png", "PNG", 90, 10, 25, 25);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text(SYSTEM_TITLE, 105, 50, { align: "center" });

        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.text(SYSTEM_SUBTITLE, 105, 58, { align: "center" });

        doc.setFontSize(10);
        doc.text(`Training: ${training.title}`, 14, 72);
        doc.text(`Dates: ${training.start_date} – ${training.end_date}`, 14, 79);
        doc.text(`Location: ${training.location}`, 14, 86);

        autoTable(doc, {
            startY: 95,
            head: [["Full Name", "Email", "Phone"]],
            body: participants.map((p) => [
                `${p.last_name} ${p.first_name}`,
                p.email,
                p.phone,
            ]),
        });

        doc.save(`${training.title}.pdf`);
    };

    const exportXLSX = async (training: Training) => {
        const participants = await fetchExportData(training);
        if (!participants.length) return;

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("Participants");

        // Add main title
        sheet.mergeCells("A1:G1");
        const titleCell = sheet.getCell("A1");
        titleCell.value = "Malawi Outbreak and Emergency Response System";
        titleCell.font = { bold: true, size: 14 };
        titleCell.alignment = { horizontal: "center" };

        // Add subtitle
        sheet.mergeCells("A2:G2");
        const subtitleCell = sheet.getCell("A2");
        subtitleCell.value = "Healthcare Workforce Management Platform";
        subtitleCell.font = { bold: false, size: 12 };
        subtitleCell.alignment = { horizontal: "center" };

        // Add empty row
        sheet.addRow([]);

        // Add table headers
        const headers = ["Full Name", "Email", "Phone", "Training Title", "Start Date", "End Date", "Location"];
        const headerRow = sheet.addRow(headers);
        headerRow.font = { bold: true };

        // Add participant data
        const dataRows = participants.map((p) => [
            `${p.last_name} ${p.first_name}`,
            p.email,
            p.phone,
            training.title,
            training.start_date,
            training.end_date,
            training.location,
        ]);

        dataRows.forEach((row) => sheet.addRow(row));

        // Adjust column widths based on participant data only (skip title and header)
        sheet.columns.forEach((col, index) => {
            let maxLength = 10; // minimum width
            col.eachCell({ includeEmpty: true }, (cell, rowNumber) => {
                // Skip title rows (1,2), empty row (3), header (4)
                if (rowNumber <= 4) return;
                const cellValue = cell.value ? String(cell.value) : "";
                if (cellValue.length > maxLength) maxLength = cellValue.length;
            });
            col.width = maxLength + 2; // add padding
        });

        // Export file
        const bufferOut = await workbook.xlsx.writeBuffer();
        saveAs(
            new Blob([bufferOut], { type: "application/octet-stream" }),
            `${training.title}.xlsx`
        );
    };

    /* ===================== RENDER ===================== */
    return (
        <div className="space-y-8 p-2 md:p-6 p py-2">
            {/*/!* HEADER *!/*/}
            {/*<div className="flex justify-between">*/}
            {/*    <div className="w-full">*/}
            {/*        <div className="flex flex-row justify-between items-center py-6 md:py-2 w-full">*/}
            {/*            <h1 className="text-lg font-semibold">Trainings</h1>*/}
            {/*            <Button onClick={() => onNavigate("form trainings")} variant="outline" className="text-sm cursor-pointer bg-gray-100 border-2 px-3 border-dashed rounded-lg flex items-center gap-2 text-black hover:bg-gray-200">*/}
            {/*                <Plus className="w-4 h-4" />*/}
            {/*                Create Training*/}
            {/*            </Button>*/}
            {/*        </div>*/}
            {/*        <p className="text-sm text-neutral-500">*/}
            {/*            Manage training programs and certifications*/}
            {/*        </p>*/}
            {/*    </div>*/}
            {/*</div>*/}

            {/* TRAININGS */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_480px] gap-2 h-[520px]">
                {/* LEFT PANEL */}
                <div className="bg-white border rounded-xl flex flex-col">
                    {/* REGISTER USERS */}
                    {!!selectedTraining && (
                        <div className="sticky rounded-lg h-[520px]">
                            <div className="border p-4 pb-2 h-full flex flex-col gap-1 w-full">
                                <div className="text-sm font-semibold flex flex-row justify-between items-center">
                                    Register Users for {selectedTraining?.title}
                                    <span className="gap-2 flex flex-row justify-between items-center">
                                        {/*<Users size={12} /> {selectedPersonnel.size}*/}
                                    </span>
                                </div>

                                {/* District Filter */}
                                <div className="py-1 space-y-1">
                                    <InputGroup className="w-full">
                                        {/* Name Search */}
                                        <InputGroupAddon>
                                            <Search className="w-4 h-4 text-neutral-500" />
                                        </InputGroupAddon>

                                        <InputGroupInput
                                            placeholder="Search by name..."
                                            value={registerSearch}
                                            onChange={(e) => setRegisterSearch(e.target.value)}
                                            className="text-sm"
                                        />

                                        {/* District Dropdown */}
                                        <InputGroupAddon align="inline-end ml-auto">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="xs"
                                                        className="px-2 py-1 text-xs mr-2 bg-green-100"
                                                    >
                                                        District
                                                    </Button>
                                                </DropdownMenuTrigger>

                                                <DropdownMenuContent align="end">
                                                    {[...new Set(personnelList.map((p) => p.metadata.district))]
                                                        .filter(Boolean)
                                                        .map((district) => (
                                                            <DropdownMenuItem
                                                                key={district}
                                                                disabled={registerDistrictFilters.includes(district)}
                                                                onClick={() => addRegisterDistrictFilter(district)}
                                                                className="capitalize"
                                                            >
                                                                {district}
                                                            </DropdownMenuItem>
                                                        ))}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </InputGroupAddon>
                                    </InputGroup>

                                    {/* Selected District Badges */}
                                    <div className="flex flex-wrap gap-1 bg-gray-50 p-2 py-1 rounded-sm">
                                        {registerDistrictFilters.map((district) => (
                                            <span
                                                key={district}
                                                className="flex items-center font-semibold text-green-800 gap-1 px-2 py-0.5 text-xs rounded-md border bg-green-200 capitalize"
                                            >
        {district}
                                                <button
                                                    onClick={() => removeRegisterDistrictFilter(district)}
                                                    className="text-neutral-500 hover:text-red-600"
                                                >
          ✕
        </button>
      </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Select All */}
                                <div className="flex items-center gap-2 py-1 px-2">
                                    <Checkbox
                                        checked={
                                            selectedPersonnel.size === filteredPersonnel.length &&
                                            filteredPersonnel.length > 0
                                        }
                                        onCheckedChange={(checked) => {
                                            if (checked) {
                                                setSelectedPersonnel(
                                                    new Set(filteredPersonnel.map((p) => p.id))
                                                );
                                            } else {
                                                setSelectedPersonnel(new Set());
                                            }
                                        }}
                                    />
                                    <span className="text-sm font-medium">Select All</span>
                                </div>

                                {/* Personnel List */}
                                <ScrollArea className="h-[300px] py-1 rounded-lg">
                                    <ul className="space-y-1">
                                        {filteredPersonnel.map((p) => (
                                            <li key={p.id} className="flex items-center justify-between px-2 py-0.5 rounded">
                                                <div className="flex items-center gap-4">
                                                    <Checkbox
                                                        checked={selectedPersonnel.has(p.id)}
                                                        onCheckedChange={() => togglePersonnelSelection(p.id)}
                                                    />
                                                    <div className="flex items-center gap-2 w-full">
                                                        <User size={12} />
                                                        <Label className="font-normal">
                                                            {p.first_name} {p.last_name}
                                                        </Label>
                                                        <span className="text-xs ml-auto bg-green-200 text-green-800 font-semibold p-1 py-0.5 rounded-sm">
                                                        {p?.metadata.district}
                                                      </span>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </ScrollArea>

                                {/* Actions */}
                                <div className="mt-1 flex justify-end gap-2">
                                    <Button
                                        onClick={() => setSelectedTraining(null)}
                                        className="text-xs px-2 h-7" variant="outline">
                                        Cancel
                                    </Button>
                                    <Button
                                        disabled={selectedPersonnel.size === 0}
                                        size="xs"
                                        variant="outline"
                                        className="text-xs px-2 h-7"
                                        onClick={() => {handleRegisterSelected(); setSelectedTraining(null);}}>
                                        Register <span className={`flex flex-row gap-1 py-0.5 px-2 bg-gray-200 rounded-sm ${(selectedPersonnel.size > 0) ? 'text-green-600':''}`}><Users size={13} className={`text - sm `}  /> {selectedPersonnel.size}</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {!selectedTraining && <div>
                        <div
                            className=" py-3 px-2 md:px-5 border-b font-medium text-sm flex flex-row justify-between">Trainings
                            <span className="flex flex-row items-center gap-1"><GraduationCap
                                size={13}/>{upcoming.length}</span></div>
                        <ScrollArea className="flex-1 h-full max-h-[440px]">
                            <div className="p-2 md:p-4 space-y-3">
                                {upcoming.map((t) => (
                                    <div
                                        key={t.id}
                                        onClick={() => {
                                            loadParticipants(t)
                                        }}
                                        className={`group border rounded-lg p-4 md:py-2 cursor-pointer transition ${
                                            activeTraining?.id === t.id ? "border-emerald-500 bg-emerald-50" : "hover:bg-neutral-50"
                                        }`}
                                    >
                                        <div className="flex flex-col md:flex-row justify-between gap-1">
                                            <h3 className="text-sm font-medium">{t.title}</h3>

                                            <div
                                                className="flex gap-3 md:gap-2 md:opacity-0 md:group-hover:opacity-100 py-2 md:py-0">
                                                {!t.registered ? (
                                                    <UserPlus size={13}
                                                              className=" hover:text-emerald-600"
                                                              onClick={(e) => {
                                                                  e.stopPropagation();
                                                                  openRegisterModal(t);
                                                              }}/>
                                                ) : (<CheckCircle size={13} className="text-emerald-600"/>)}

                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Download size={13}
                                                                  className="hover:text-indigo-600"
                                                                  onClick={(e) => e.stopPropagation()}
                                                        />
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => exportCSV(t)}>Export
                                                            CSV</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => exportXLSX(t)}>Export Excel
                                                            (.xlsx)</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => exportPDF(t)}>Export
                                                            PDF</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => exportTXT(t)}>Export
                                                            Text</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>

                                        <div className="mt-2 flex gap-4 text-xs text-neutral-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3"/>
                        {t.start_date}
                    </span>
                                            <span className="flex items-center gap-1">
                      <Users className="w-3 h-3"/>
                                                {t.participantsCount}
                    </span>
                                            <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3"/>
                                                {t.location}
                    </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>}
                </div>

                {/* RIGHT PANEL */}
                <div className="bg-white border rounded-xl flex flex-col h-[520px]">
                    {/* Header with training info */}
                    <div className="px-4 py-3 pb-0 border-b flex flex-col gap-1">
                        {!activeTraining ? (
                            <p className="text-neutral-500 text-sm mb-2 ">Select a training</p>
                        ) : (
                            <>
                                {/* Top row: title left, participants + icons right */}
                                <div className="flex justify-between items-center">
                                    <div className="font-semibold text-sm">{activeTraining.title}</div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1 text-sm text-neutral-600">
                                            <Users size={12} />
                                            <span>{participants.length}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-row justify-between items-center">
                                    {/* Dates with icon */}
                                    <div className="flex items-center gap-2 text-xs text-neutral-500">
                                        <Calendar className="w-3 h-3" />
                                        <span>{activeTraining.start_date} – {activeTraining.end_date}</span>
                                    </div>
                                    {/* Location with icon */}
                                    <div className="flex items-center gap-2 text-xs text-neutral-500">
                                        <MapPin className="w-3 h-3" />
                                        <span>{activeTraining.location}</span>
                                    </div>
                                </div>
                                <div className="">
                                    <ParticipantSearch
                                        value={searchText}
                                        onChange={setSearchText}
                                        statuses={statusFilters}
                                        onStatusAdd={addStatusFilter}
                                        onStatusRemove={removeStatusFilter}
                                        availableDistricts={[...new Set(participants.map(p => p.district))]}
                                        selectedDistricts={districtFilters}
                                        onDistrictAdd={addDistrictFilter}
                                        onDistrictRemove={removeDistrictFilter}
                                    />

                                </div>
                            </>
                        )}
                    </div>

                    {/* Scrollable participant list */}
                    <ScrollArea className="flex-1 px-4 h-full max-h-[370px] py-2">
                        {!activeTraining ? (
                            <div className="h-70 w-full flex justify-center items-center">
                                <Loader2 size={14} className="animate-spin" />
                            </div>
                        ) : participantsLoading ? (
                            <p className="text-sm text-neutral-500">Loading…</p>
                        ) : participants.length === 0 ? (
                            <p className="text-sm text-neutral-500">No participants</p>
                        ) : (
                            <ul className="space-y-2">
                                {filteredParticipants.map((p) => (
                                    <li
                                        key={p.id}
                                        className="flex items-center justify-between text-sm rounded-md px-2 py-1"
                                    >
                                        <div className="flex items-center gap-2">
                                            <User size={12} />
                                            <span>{p.first_name} {p.last_name} <span className="text-xs bg-green-200 text-green-800 font-semibold p-1 py-0.5 rounded-sm">{p.district}</span></span>
                                        </div>

                                        <>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button size="xs"
                                                            disabled = {(p.status !== "registered")}
                                                        className={`text-xs px-2 py-0.5 rounded-md hover:bg-white capitalize border cursor-pointer
                                                                ${p.status === "completed" && "bg-emerald-100 text-emerald-700"}
                                                                ${p.status === "attended" && "bg-blue-100 text-blue-700"}
                                                                ${p.status === "registered" && "bg-yellow-100 text-yellow-700"}
                                                                ${p.status === "absent" && "bg-red-100 text-red-700"}
                                                                ${p.status === "cancelled" && "bg-red-100 text-red-700"}
                                                            `}
                                                         >
                                                        {p.status}
                                                    </Button>
                                                </PopoverTrigger>

                                                <PopoverContent className="w-40 p-1">
                                                    {[
                                                        "registered",
                                                        "attended",
                                                        "completed",
                                                        "absent",
                                                        "cancelled",
                                                    ].map((status) => (
                                                        <Button
                                                            disabled={((p.status === "registered") && (status === "registered"))}
                                                            key={status}
                                                            size = "xs"
                                                            variant="ghost"
                                                            onClick={() => {
                                                                setPendingStatus(status);
                                                                setPendingPersonnelId(p.id);
                                                                setPendingPersonnelId2(p.personnel_id)
                                                                setConfirmOpen(true);
                                                            }}
                                                            className="w-full font-normal flex items-center justify-between px-2 py-1.5 text-sm rounded hover:bg-neutral-100 capitalize"
                                                        >
                                                            {status}
                                                            {p.status === status && (
                                                                <Check className="w-4 h-4 text-emerald-600" />
                                                            )}
                                                        </Button>
                                                    ))}
                                                </PopoverContent>
                                            </Popover>

                                            {/* CONFIRMATION DIALOG */}
                                            <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Confirm Status Change</DialogTitle>
                                                    </DialogHeader>

                                                    <p className="text-sm text-neutral-600">
                                                        Change status to{" "}
                                                        <span className="font-semibold capitalize">
                                                    {pendingStatus}
                                                </span>
                                                        ?
                                                    </p>

                                                    <DialogFooter>
                                                        <DialogClose asChild>
                                                            <Button variant="outline">Cancel</Button>
                                                        </DialogClose>
                                                        <Button disabled={isLoading} onClick={()=>confirmStatusUpdate()}>
                                                            {isLoading && <Loader2 className="animate-spin"/>}Confirm
                                                        </Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>

                                        </>

                                    </li>
                                ))}
                            </ul>

                        )}
                    </ScrollArea>
                </div>

            </div>
        </div>
    );
}

