import { useState } from 'react';
import { Search, Filter, Download, Plus, MoreVertical } from 'lucide-react';

export function WorkforceRegistry() {
  const [searchTerm, setSearchTerm] = useState('');

  const workers = [
    {
      id: 'HCW-2024-001',
      name: 'Dr. Grace Banda',
      role: 'General Practitioner',
      district: 'Lilongwe',
      status: 'Deployed',
      contact: '+265 991 234 567',
      certifications: 5,
    },
    {
      id: 'HCW-2024-002',
      name: 'Nurse Chisomo Phiri',
      role: 'Registered Nurse',
      district: 'Blantyre',
      status: 'Available',
      contact: '+265 991 345 678',
      certifications: 3,
    },
    {
      id: 'HCW-2024-003',
      name: 'Dr. John Mwale',
      role: 'Infectious Disease Specialist',
      district: 'Mzuzu',
      status: 'Deployed',
      contact: '+265 991 456 789',
      certifications: 8,
    },
    {
      id: 'HCW-2024-004',
      name: 'Nurse Mercy Tembo',
      role: 'Community Health Nurse',
      district: 'Zomba',
      status: 'Available',
      contact: '+265 991 567 890',
      certifications: 4,
    },
    {
      id: 'HCW-2024-005',
      name: 'Dr. Patrick Kachale',
      role: 'Epidemiologist',
      district: 'Lilongwe',
      status: 'On Leave',
      contact: '+265 991 678 901',
      certifications: 6,
    },
  ];

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
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
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
            <button className="px-4 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-50 flex items-center gap-2 transition-colors text-sm">
              <Filter className="w-4 h-4" />
              Filters
            </button>
            <button className="px-4 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-50 flex items-center gap-2 transition-colors text-sm">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 bg-white">
              {workers.map((worker) => (
                <tr key={worker.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-neutral-900">{worker.id}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-sm font-medium">
                        {worker.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-sm font-medium text-neutral-900">{worker.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-neutral-600">{worker.role}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-neutral-600">{worker.district}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-neutral-600">{worker.contact}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-neutral-600">{worker.certifications}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
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
          <p className="text-sm text-neutral-600">Showing 1 to 5 of 2,847 workers</p>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 border border-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors text-sm">
              Previous
            </button>
            <button className="px-3 py-1.5 bg-neutral-900 text-white rounded-lg text-sm">1</button>
            <button className="px-3 py-1.5 border border-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors text-sm">
              2
            </button>
            <button className="px-3 py-1.5 border border-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors text-sm">
              3
            </button>
            <button className="px-3 py-1.5 border border-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors text-sm">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}