import { Send, MapPin, Users, Calendar, MoreVertical } from 'lucide-react';

export function Deployments() {
  const deployments = [
    {
      id: 'DEP-2024-045',
      outbreak: 'Cholera Outbreak',
      district: 'Nsanje',
      workers: 15,
      startDate: '2024-11-20',
      endDate: '2024-12-20',
      status: 'Active',
      priority: 'high',
    },
    {
      id: 'DEP-2024-044',
      outbreak: 'Malaria Response',
      district: 'Karonga',
      workers: 22,
      startDate: '2024-11-15',
      endDate: '2024-12-15',
      status: 'Active',
      priority: 'medium',
    },
    {
      id: 'DEP-2024-043',
      outbreak: 'COVID-19 Vaccination',
      district: 'Lilongwe',
      workers: 45,
      startDate: '2024-11-10',
      endDate: '2024-11-30',
      status: 'Active',
      priority: 'low',
    },
    {
      id: 'DEP-2024-042',
      outbreak: 'Measles Outbreak',
      district: 'Blantyre',
      workers: 18,
      startDate: '2024-11-05',
      endDate: '2024-11-25',
      status: 'Completed',
      priority: 'medium',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-neutral-900 mb-2">Deployments</h1>
          <p className="text-neutral-500">Manage healthcare worker deployments and outbreak responses</p>
        </div>
        <button className="px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 flex items-center gap-2 transition-colors shadow-sm">
          <Send className="w-5 h-5" />
          New Deployment
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-neutral-200 p-5">
          <p className="text-sm text-neutral-500 mb-1">Active Deployments</p>
          <p className="text-3xl font-semibold text-neutral-900">156</p>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-5">
          <p className="text-sm text-neutral-500 mb-1">Workers Deployed</p>
          <p className="text-3xl font-semibold text-neutral-900">847</p>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-5">
          <p className="text-sm text-neutral-500 mb-1">Districts Covered</p>
          <p className="text-3xl font-semibold text-neutral-900">18</p>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-5">
          <p className="text-sm text-neutral-500 mb-1">Avg. Duration</p>
          <p className="text-3xl font-semibold text-neutral-900">28 days</p>
        </div>
      </div>

      {/* Priority Deployments */}
      <div>
        <h2 className="text-neutral-900 mb-4">High Priority Deployments</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-red-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">High Priority</span>
                  <span className="text-sm text-neutral-500">DEP-2024-045</span>
                </div>
                <h3 className="text-neutral-900 mb-1">Cholera Outbreak - Nsanje</h3>
                <p className="text-sm text-neutral-500">Emergency response deployment</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-neutral-400" />
                <div>
                  <p className="text-xs text-neutral-500">Workers</p>
                  <p className="text-sm font-medium text-neutral-900">15</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-neutral-400" />
                <div>
                  <p className="text-xs text-neutral-500">Duration</p>
                  <p className="text-sm font-medium text-neutral-900">30 days</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
              <span className="text-sm font-medium text-emerald-600">Active</span>
              <button className="px-4 py-2 bg-neutral-100 text-neutral-900 rounded-lg hover:bg-neutral-200 transition-colors text-sm font-medium">
                View Details
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <div className="w-full h-64 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl border border-neutral-200 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-neutral-400 mx-auto mb-2" />
                <p className="text-neutral-900 mb-1">Deployment Map</p>
                <p className="text-sm text-neutral-500">Geographic distribution</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* All Deployments */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200">
          <h2 className="text-neutral-900">All Deployments</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Deployment ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Outbreak/Response</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">District</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Workers</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Start Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">End Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 bg-white">
              {deployments.map((deployment) => (
                <tr key={deployment.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-sm text-neutral-900">{deployment.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-neutral-900">{deployment.outbreak}</p>
                    <p className="text-xs text-neutral-500">
                      {deployment.priority === 'high' && (
                        <span className="text-red-600">High Priority</span>
                      )}
                      {deployment.priority === 'medium' && (
                        <span className="text-amber-600">Medium Priority</span>
                      )}
                      {deployment.priority === 'low' && (
                        <span className="text-blue-600">Low Priority</span>
                      )}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-neutral-600">{deployment.district}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-neutral-600">{deployment.workers}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-neutral-600">{deployment.startDate}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-neutral-600">{deployment.endDate}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                        deployment.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-neutral-100 text-neutral-700'
                      }`}
                    >
                      {deployment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="p-1.5 hover:bg-neutral-100 rounded-md transition-colors">
                      <MoreVertical className="w-4 h-4 text-neutral-600" />
                    </button>
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