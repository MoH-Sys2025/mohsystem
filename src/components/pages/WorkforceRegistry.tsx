import { useState } from 'react';
import { Search, Filter, Download, Plus, MoreVertical } from 'lucide-react';

export function WorkforceRegistry() {
    const [searchTerm, setSearchTerm] = useState('');

    const [filterOpen, setFilterOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState(null);
    const [filterValue, setFilterValue] = useState(null);

    const filterOptions = [
        { key: "role", label: "Role" },
        { key: "district", label: "District" },
        { key: "status", label: "Status" },
        { key: "certifications", label: "Certifications" },
        { key: "competencies", label: "Competencies" },
    ];

    const workers = [
        {
            id: "HCW-2024-001",
            name: "Dr. Grace Banda",
            role: "General Practitioner",
            district: "Lilongwe",
            status: "Deployed",
            contact: "+265 991 234 567",
            certifications: 5,
            competencies: ["Diagnosis", "Treatment"]
        },
        {
            id: "HCW-2024-002",
            name: "Nurse Chisomo Phiri",
            role: "Registered Nurse",
            district: "Blantyre",
            status: "Available",
            contact: "+265 991 345 678",
            certifications: 3,
            competencies: ["Patient Care", "Medication Admin"]
        },
        {
            id: "HCW-2024-003",
            name: "Dr. John Mwale",
            role: "Infectious Disease Specialist",
            district: "Mzuzu",
            status: "Deployed",
            contact: "+265 991 456 789",
            certifications: 8,
            competencies: ["Infectious Diseases", "Epidemiology"]
        },
        {
            id: "HCW-2024-004",
            name: "Nurse Mercy Tembo",
            role: "Community Health Nurse",
            district: "Zomba",
            status: "Available",
            contact: "+265 991 567 890",
            certifications: 4,
            competencies: ["Community Health", "Outreach"]
        },
        {
            id: "HCW-2024-005",
            name: "Dr. Patrick Kachale",
            role: "Epidemiologist",
            district: "Lilongwe",
            status: "On Leave",
            contact: "+265 991 678 901",
            certifications: 6,
            competencies: ["Research", "Data Analysis"]
        },

        // ---- NEW WORKERS BELOW ----

        {
            id: "HCW-2024-006",
            name: "Nurse Thandiwe Mvula",
            role: "Midwife",
            district: "Mangochi",
            status: "Available",
            contact: "+265 990 112 233",
            certifications: 4,
            competencies: ["Maternal Care", "Delivery Support"]
        },
        {
            id: "HCW-2024-007",
            name: "Dr. Kelvin Jere",
            role: "Pediatrician",
            district: "Mzimba",
            status: "Deployed",
            contact: "+265 990 223 344",
            certifications: 7,
            competencies: ["Child Health", "Neonatal Care"]
        },
        {
            id: "HCW-2024-008",
            name: "Pharma Linda Maseko",
            role: "Pharmacist",
            district: "Balaka",
            status: "Available",
            contact: "+265 990 445 566",
            certifications: 5,
            competencies: ["Dispensing", "Pharmaceutical Care"]
        },
        {
            id: "HCW-2024-009",
            name: "Dr. Aubrey Nkhoma",
            role: "Surgeon",
            district: "Lilongwe",
            status: "Deployed",
            contact: "+265 990 556 677",
            certifications: 10,
            competencies: ["Surgery", "Emergency Response"]
        },
        {
            id: "HCW-2024-010",
            name: "Nurse Violet Chirwa",
            role: "Registered Nurse",
            district: "Kasungu",
            status: "Available",
            contact: "+265 990 667 788",
            certifications: 3,
            competencies: ["Wound Care", "Vital Sign Monitoring"]
        },
        {
            id: "HCW-2024-011",
            name: "Dr. Dalitso Kamanga",
            role: "Cardiologist",
            district: "Blantyre",
            status: "On Leave",
            contact: "+265 990 778 899",
            certifications: 9,
            competencies: ["Cardiology", "Diagnostics"]
        },
        {
            id: "HCW-2024-012",
            name: "LabTech Esther Moyo",
            role: "Lab Technician",
            district: "Ntchisi",
            status: "Deployed",
            contact: "+265 990 889 900",
            certifications: 4,
            competencies: ["Lab Analysis", "Sample Processing"]
        },
        {
            id: "HCW-2024-013",
            name: "Dr. Mphatso Chiumia",
            role: "Orthopedic Specialist",
            district: "Dedza",
            status: "Available",
            contact: "+265 991 010 203",
            certifications: 7,
            competencies: ["Bone Surgery", "Rehabilitation"]
        },
        {
            id: "HCW-2024-014",
            name: "Nurse Josephine Katundu",
            role: "ICU Nurse",
            district: "Blantyre",
            status: "Deployed",
            contact: "+265 991 020 304",
            certifications: 6,
            competencies: ["Critical Care", "Monitoring"]
        },
        {
            id: "HCW-2024-015",
            name: "Dr. Samson Gondwe",
            role: "Radiologist",
            district: "Lilongwe",
            status: "Available",
            contact: "+265 991 030 405",
            certifications: 8,
            competencies: ["Imaging", "Diagnostics"]
        },
        {
            id: "HCW-2024-016",
            name: "Assistant John Nyasulu",
            role: "Clinical Officer",
            district: "Nkhatabay",
            status: "Available",
            contact: "+265 991 040 506",
            certifications: 5,
            competencies: ["Assessment", "Treatment"]
        },
        {
            id: "HCW-2024-017",
            name: "Dr. Ruth Kalinde",
            role: "Gynecologist",
            district: "Zomba",
            status: "Deployed",
            contact: "+265 991 050 607",
            certifications: 9,
            competencies: ["Reproductive Health", "Surgery"]
        },
        {
            id: "HCW-2024-018",
            name: "Nurse Elijah Mkwanda",
            role: "Community Health Worker",
            district: "Mchinji",
            status: "Available",
            contact: "+265 991 060 708",
            certifications: 2,
            competencies: ["Outreach", "Health Education"]
        },
        {
            id: "HCW-2024-019",
            name: "Dr. Loveness Chakhaza",
            role: "Dermatologist",
            district: "Karonga",
            status: "On Leave",
            contact: "+265 991 070 809",
            certifications: 8,
            competencies: ["Skin Care", "Diagnostics"]
        },
        {
            id: "HCW-2024-020",
            name: "Tech Blessings Manda",
            role: "Radiology Technician",
            district: "Salima",
            status: "Deployed",
            contact: "+265 991 080 910",
            certifications: 4,
            competencies: ["X-Ray", "Ultrasound"]
        },
        {
            id: "HCW-2024-021",
            name: "Dr. Harold Nyoni",
            role: "ENT Specialist",
            district: "Mulanje",
            status: "Available",
            contact: "+265 992 111 222",
            certifications: 7,
            competencies: ["Ear Care", "Surgery"]
        },
        {
            id: "HCW-2024-022",
            name: "Nurse Fatima Mhango",
            role: "Midwife",
            district: "Chikwawa",
            status: "Available",
            contact: "+265 992 222 333",
            certifications: 3,
            competencies: ["Delivery Support", "Maternal Health"]
        },
        {
            id: "HCW-2024-023",
            name: "Dr. Peter Kalima",
            role: "General Surgeon",
            district: "Lilongwe",
            status: "Deployed",
            contact: "+265 992 333 444",
            certifications: 10,
            competencies: ["Surgery", "Emergency Medicine"]
        },
        {
            id: "HCW-2024-024",
            name: "Nurse Miriam Nyambi",
            role: "Registered Nurse",
            district: "Mwanza",
            status: "Available",
            contact: "+265 992 444 555",
            certifications: 4,
            competencies: ["Medication Admin", "IV Therapy"]
        },
        {
            id: "HCW-2024-025",
            name: "Dr. Isaac Chipeta",
            role: "Neurologist",
            district: "Mzuzu",
            status: "On Leave",
            contact: "+265 992 555 666",
            certifications: 9,
            competencies: ["Neurology", "Diagnostics"]
        },
        {
            id: "HCW-2024-026",
            name: "LabTech Alice Mtambo",
            role: "Lab Scientist",
            district: "Ntcheu",
            status: "Deployed",
            contact: "+265 992 666 777",
            certifications: 6,
            competencies: ["Testing", "Lab Management"]
        },
        {
            id: "HCW-2024-027",
            name: "Dr. Naomi Chirambo",
            role: "Psychiatrist",
            district: "Likoma",
            status: "Available",
            contact: "+265 992 777 888",
            certifications: 8,
            competencies: ["Mental Health", "Counselling"]
        },
        {
            id: "HCW-2024-028",
            name: "Assistant Kelvin Luwani",
            role: "Clinical Officer",
            district: "Mzimba",
            status: "Deployed",
            contact: "+265 992 888 999",
            certifications: 4,
            competencies: ["Minor Procedures", "Assessment"]
        },
        {
            id: "HCW-2024-029",
            name: "Nurse Rebecca Chikuse",
            role: "ICU Nurse",
            district: "Blantyre",
            status: "Available",
            contact: "+265 992 999 000",
            certifications: 5,
            competencies: ["Critical Care", "Monitoring"]
        },
        {
            id: "HCW-2024-030",
            name: "Dr. Elias Mwandira",
            role: "Public Health Specialist",
            district: "Lilongwe",
            status: "Deployed",
            contact: "+265 993 101 202",
            certifications: 7,
            competencies: ["Health Policy", "Disease Surveillance"]
        }
    ];

    const filteredWorkers = workers
        .filter((worker) => {
            // Search filter
            const searchMatch = Object.values(worker)
                .join(" ")
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

            if (!selectedFilter || !filterValue) return searchMatch;

            // Column-specific filter
            let workerValue = worker[selectedFilter];

            // Competencies (array)
            if (Array.isArray(workerValue)) {
                return (
                    searchMatch &&
                    workerValue.some((c) =>
                        c.toLowerCase().includes(filterValue.toLowerCase())
                    )
                );
            }

            // Regular columns
            return (
                searchMatch &&
                String(workerValue).toLowerCase() === filterValue.toLowerCase()
            );
        });

    // 🔍 Filtered workers based on search term
    // const filteredWorkers = workers.filter((worker) =>
    //     Object.values(worker)
    //         .join(' ')
    //         .toLowerCase()
    //         .includes(searchTerm.toLowerCase())
    // );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-neutral-900 mb-2">Workforce Registry</h1>
                    <p className="text-neutral-500">Manage and monitor healthcare workers across Malawi</p>
                </div>
                <button className="px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 flex items-center gap-2 transition-colors shadow-sm">
                    <Plus className="w-5 h-5" />
                    Add Worker
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl border border-neutral-200 p-5">
                    <p className="text-sm text-neutral-500 mb-1">Total Workers</p>
                    <p className="text-3xl font-semibold text-neutral-900">2,847</p>
                </div>
                <div className="bg-white rounded-xl border border-neutral-200 p-5">
                    <p className="text-sm text-neutral-500 mb-1">Currently Deployed</p>
                    <p className="text-3xl font-semibold text-neutral-900">156</p>
                </div>
                <div className="bg-white rounded-xl border border-neutral-200 p-5">
                    <p className="text-sm text-neutral-500 mb-1">Available</p>
                    <p className="text-3xl font-semibold text-neutral-900">2,634</p>
                </div>
                <div className="bg-white rounded-xl border border-neutral-200 p-5">
                    <p className="text-sm text-neutral-500 mb-1">On Leave</p>
                    <p className="text-3xl font-semibold text-neutral-900">57</p>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden relative">
                {/* Filters and Search */}
                <div className="p-6 border-b border-neutral-200">
                    <div className="flex gap-3">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                            <input
                                type="text"
                                placeholder="Search by name, ID, or role..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                            />
                        </div>
                        <button
                            onClick={() => setFilterOpen(!filterOpen)}
                            className="px-4 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-50 flex items-center gap-2 transition-colors text-sm"
                        >
                            <Filter className="w-4 h-4" />
                            Filters
                        </button>

                        <button className="px-4 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-50 flex items-center gap-2 transition-colors text-sm">
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                    </div>
                    {filterOpen && (
                        <div className="mt-3 bg-white border border-neutral-200 absolute right-0 overflow-y-scroll lg:max-h-100 rounded-lg p-4 shadow-sm w-64">
                            {!selectedFilter && (
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-neutral-500 mb-2">Filter by:</p>
                                    {filterOptions.map((opt) => (
                                        <button
                                            key={opt.key}
                                            onClick={() => setSelectedFilter(opt.key)}
                                            className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-neutral-100"
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {selectedFilter && !filterValue && (
                                <div className="space-y-1">
                                    <button
                                        onClick={() => setSelectedFilter(null)}
                                        className="text-xs text-neutral-500 underline mb-2"
                                    >
                                        Back
                                    </button>

                                    {Array.from(
                                        new Set(
                                            workers
                                                .flatMap((w) =>
                                                    Array.isArray(w[selectedFilter])
                                                        ? w[selectedFilter]
                                                        : [w[selectedFilter]]
                                                )
                                                .filter(Boolean)
                                        )
                                    ).map((value) => (
                                        <button
                                            key={value}
                                            onClick={() => setFilterValue(value)}
                                            className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-neutral-100"
                                        >
                                            {value}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {selectedFilter && filterValue && (
                                <div className="flex items-center justify-between">
        <span className="text-sm text-neutral-700">
          {filterOptions.find((o) => o.key === selectedFilter)?.label ?? ''}:
:{" "}
            <strong>{filterValue}</strong>
        </span>
                                    <button
                                        onClick={() => {
                                            setSelectedFilter(null);
                                            setFilterValue(null);
                                        }}
                                        className="text-xs text-neutral-500 underline"
                                    >
                                        Clear
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-neutral-50 border-b border-neutral-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Worker ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">District</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Contact</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Certifications</th>

                            {/* NEW COLUMN */}
                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                Competencies
                            </th>

                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200 bg-white">
                        {filteredWorkers.map((worker) => (
                            <tr key={worker.id} className="hover:bg-neutral-50 transition-colors">
                                <td className="px-4 py-1 text-xs whitespace-nowrap">{worker.id}</td>

                                <td className="px-4 py-1 text-xs whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-sm font-medium">
                                            {worker.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <span className="text-sm font-medium text-neutral-900">{worker.name}</span>
                                    </div>
                                </td>

                                <td className="px-4 py-1 text-xs whitespace-nowrap">{worker.role}</td>
                                <td className="px-4 py-1 text-xs whitespace-nowrap">{worker.district}</td>
                                <td className="px-4 py-1 text-xs whitespace-nowrap">{worker.contact}</td>

                                <td className="px-4 py-1 text-xs whitespace-nowrap">
                    <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                            worker.status === 'Deployed'
                                ? 'bg-emerald-100 text-emerald-700'
                                : worker.status === 'Available'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-neutral-100 text-neutral-700'
                        }`}
                    >
                      {worker.status}
                    </span>
                                </td>

                                <td className="px-4 py-1 text-xs whitespace-nowrap">{worker.certifications}</td>

                                {/* NEW COLUMN DISPLAY */}
                                <td className="px-4 py-1 text-xs whitespace-nowrap">
                                    <div className="flex flex-wrap gap-1">
                                        {worker.competencies.map((c, index) => (
                                            <span
                                                key={index}
                                                className="px-2 py-1 bg-neutral-100 text-neutral-700 rounded-md text-xs"
                                            >
                          {c}
                        </span>
                                        ))}
                                    </div>
                                </td>

                                <td className="px-4 py-1 text-xs whitespace-nowrap">
                                    <button className="p-1.5 hover:bg-neutral-100 rounded-md transition-colors">
                                        <MoreVertical className="w-4 h-4 text-neutral-600" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-200 bg-white">
                    <p className="text-sm text-neutral-600">Showing {filteredWorkers.length} of 2,847 workers</p>
                </div>
            </div>
        </div>
    );
}
