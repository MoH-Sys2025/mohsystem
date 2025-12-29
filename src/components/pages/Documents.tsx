import { FileText, Upload, Download, Eye, MoreVertical } from 'lucide-react';
import {Button} from "@/components/ui/button.tsx";

interface DocumentsProps {
    onNavigate?: (page: string) => void;
}
export function Documents({onNavigate}: DocumentsProps) {
  const documents = [
    {
      name: 'Cholera Response Protocol 2024',
      type: 'Protocol',
      uploadedBy: 'Dr. Grace Banda',
      date: '2024-11-20',
      size: '2.4 MB',
      status: 'Active',
    },
    {
      name: 'Healthcare Worker Deployment Guidelines',
      type: 'Guidelines',
      uploadedBy: 'Admin User',
      date: '2024-11-18',
      size: '1.8 MB',
      status: 'Active',
    },
    {
      name: 'COVID-19 Training Materials',
      type: 'Training',
      uploadedBy: 'Nurse Chisomo Phiri',
      date: '2024-11-15',
      size: '5.2 MB',
      status: 'Active',
    },
    {
      name: 'Emergency Response Procedures',
      type: 'Protocol',
      uploadedBy: 'Dr. John Mwale',
      date: '2024-11-10',
      size: '3.1 MB',
      status: 'Active',
    },
    {
      name: 'Medical Supplies Inventory Report',
      type: 'Report',
      uploadedBy: 'Admin User',
      date: '2024-11-05',
      size: '890 KB',
      status: 'Archived',
    },
  ];

  return (
    <div className="space-y-8 py-6 px-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-neutral-900 mb-2">Documents</h1>
          <p className="text-neutral-500">Manage protocols, guidelines, and training materials</p>
        </div>
        <Button className="text-sm cursor-pointer bg-gray-100 border-2 px-3 border-dashed rounded-lg text-gray hover:bg-gray-200 flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Upload Document
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-neutral-200 p-5">
          <p className="text-sm text-neutral-500 mb-1">Total Documents</p>
          <p className="text-3xl font-semibold text-neutral-900">342</p>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-5">
          <p className="text-sm text-neutral-500 mb-1">Active Protocols</p>
          <p className="text-3xl font-semibold text-neutral-900">48</p>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-5">
          <p className="text-sm text-neutral-500 mb-1">Training Materials</p>
          <p className="text-3xl font-semibold text-neutral-900">127</p>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-5">
          <p className="text-sm text-neutral-500 mb-1">Recent Uploads</p>
          <p className="text-3xl font-semibold text-neutral-900">12</p>
        </div>
      </div>

      {/* Document Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-neutral-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-neutral-900 mb-2">Protocols & Guidelines</h3>
          <p className="text-sm text-neutral-500 mb-4">Official response protocols and operational guidelines</p>
          <div className="text-sm font-medium text-blue-600">48 documents →</div>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-neutral-900 mb-2">Training Materials</h3>
          <p className="text-sm text-neutral-500 mb-4">Educational resources and certification documents</p>
          <div className="text-sm font-medium text-emerald-600">127 documents →</div>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-neutral-900 mb-2">Reports & Analytics</h3>
          <p className="text-sm text-neutral-500 mb-4">Deployment reports and performance analytics</p>
          <div className="text-sm font-medium text-amber-600">167 documents →</div>
        </div>
      </div>

      {/* Recent Documents */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200">
          <h2 className="text-neutral-900">Recent Documents</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Document Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Uploaded By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Size</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 bg-white">
              {documents.map((doc, index) => (
                <tr key={index} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-neutral-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-4 h-4 text-neutral-600" />
                      </div>
                      <span className="text-sm font-medium text-neutral-900">{doc.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-neutral-600">{doc.type}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-neutral-600">{doc.uploadedBy}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-neutral-600">{doc.date}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-neutral-600">{doc.size}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                        doc.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-neutral-100 text-neutral-700'
                      }`}
                    >
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 hover:bg-neutral-100 rounded-md transition-colors">
                        <Eye className="w-4 h-4 text-neutral-600" />
                      </button>
                      <button className="p-1.5 hover:bg-neutral-100 rounded-md transition-colors">
                        <Download className="w-4 h-4 text-neutral-600" />
                      </button>
                      <button className="p-1.5 hover:bg-neutral-100 rounded-md transition-colors">
                        <MoreVertical className="w-4 h-4 text-neutral-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}