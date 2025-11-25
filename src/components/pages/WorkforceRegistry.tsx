import { useState } from 'react';
import { Search, Filter, Download, Plus, MoreVertical } from 'lucide-react';
import React from "react";
import {workers} from "@/workers.tsx";

export function WorkforceRegistry() {
    type Worker = {
        id: string;
        name: string;
        role: string;
        district: string;
        status: string;
        contact: string;
        certifications: number;
        competencies: string[];
    };

    const [searchTerm, setSearchTerm] = useState('');
    const [filterOpen, setFilterOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState<string | null>(null as string | null);
    const [filterValue, setFilterValue] = useState<string | null>(null);

    const filterOptions = [
        { key: "role", label: "Role" },
        { key: "district", label: "District" },
        { key: "status", label: "Status" },
        { key: "certifications", label: "Certifications" },
        { key: "competencies", label: "Competencies" },
    ];

    const filteredWorkers = workers.filter((worker) => {
        const searchMatch = Object.values(worker)
            .join(" ")
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        if (!selectedFilter || !filterValue) return searchMatch;

        const workerValue = worker[selectedFilter as keyof Worker];

        if (Array.isArray(workerValue)) {
            return (
                searchMatch &&
                workerValue.some((c) =>
                    c.toLowerCase().includes(String(filterValue).toLowerCase())
                )
            );
        }

        return (
            searchMatch &&
            String(workerValue).toLowerCase() === String(filterValue).toLowerCase()
        );
    });

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

            {/* Filters */}
            <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden relative">
                <div className="p-6 border-b border-neutral-200">
                    <div className="flex gap-3">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                            <input
                                type="text"
                                placeholder="Search by name, ID, or role..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm"
                            />
                        </div>

                        {/* Filter Button */}
                        <button
                            onClick={() => setFilterOpen(!filterOpen)}
                            className="px-4 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-50 flex items-center gap-2 text-sm"
                        >
                            <Filter className="w-4 h-4" />
                            Filters
                        </button>

                        {/* Export */}
                        <button className="px-4 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-50 flex items-center gap-2 text-sm">
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                    </div>

                    {/* Filter Dropdown */}
                    {filterOpen && (
                        <div className="mt-3 bg-white border border-neutral-200 absolute right-0 max-h-80 overflow-y-scroll rounded-lg p-4 shadow-sm w-64">

                            {/* Step 1: Choose Column */}
                            {!selectedFilter && (
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-neutral-500 mb-2">Filter by:</p>
                                    {filterOptions.map((opt) => (
                                        <React.Fragment key={opt.key}>
                                            <button
                                                onClick={() => setSelectedFilter(opt.key)}
                                                className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-neutral-100"
                                            >
                                                {opt.label}
                                            </button>
                                        </React.Fragment>
                                    ))}

                                </div>
                            )}

                            {/* Step 2: Choose Filter Value */}
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
                                                    Array.isArray(w[selectedFilter as keyof Worker])
                                                        ? w[selectedFilter as keyof Worker]
                                                        : [w[selectedFilter as keyof Worker]]
                                                )
                                                .filter(Boolean)
                                        )
                                    ).map((value) => (
                                        <button
                                            key={Array.isArray(value) ? value.join("-") : String(value)}
                                            onClick={() => setFilterValue(String(value))}
                                            className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-neutral-100"
                                        >
                                            {value}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Step 3: Show active filter */}
                            {selectedFilter && filterValue && (
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-neutral-700">
                                        {filterOptions.find((o) => o.key === selectedFilter)?.label ?? ''}:{' '}
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

                {/* Table */}
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
                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Competencies</th>
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
                    <p className="text-sm text-neutral-600">
                        Showing {filteredWorkers.length} of 2,847 workers
                    </p>
                </div>
            </div>
        </div>
    );
}
