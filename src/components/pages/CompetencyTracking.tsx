import { Award, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';

export function CompetencyTracking() {
  const competencyAreas = [
    {
      name: 'Emergency Response',
      certified: 847,
      total: 2847,
      expiringSoon: 23,
      color: 'emerald',
    },
    {
      name: 'Disease Management',
      certified: 1245,
      total: 2847,
      expiringSoon: 45,
      color: 'blue',
    },
    {
      name: 'Patient Care',
      certified: 2134,
      total: 2847,
      expiringSoon: 12,
      color: 'purple',
    },
    {
      name: 'Data & Reporting',
      certified: 1678,
      total: 2847,
      expiringSoon: 67,
      color: 'amber',
    },
  ];

  const workers = [
    {
      name: 'Dr. Grace Banda',
      id: 'HCW-2024-001',
      competencies: [
        { name: 'Emergency Response', level: 'Expert', expires: '2025-06-15' },
        { name: 'Cholera Management', level: 'Advanced', expires: '2025-03-20' },
        { name: 'COVID-19 Protocol', level: 'Expert', expires: '2025-08-10' },
      ],
      score: 94,
    },
    {
      name: 'Nurse Chisomo Phiri',
      id: 'HCW-2024-002',
      competencies: [
        { name: 'Patient Care', level: 'Expert', expires: '2025-05-12' },
        { name: 'Emergency Response', level: 'Intermediate', expires: '2024-12-30' },
        { name: 'Malaria Treatment', level: 'Advanced', expires: '2025-04-18' },
      ],
      score: 88,
    },
    {
      name: 'Dr. John Mwale',
      id: 'HCW-2024-003',
      competencies: [
        { name: 'Disease Investigation', level: 'Expert', expires: '2025-07-22' },
        { name: 'Data Analysis', level: 'Expert', expires: '2025-09-05' },
        { name: 'Team Leadership', level: 'Advanced', expires: '2025-02-14' },
      ],
      score: 96,
    },
  ];

  return (
    <div className="space-y-8 p-2 md:p-6">
      {/* Header */}
      <div>
        <h1 className="text-neutral-900 mb-2">Competency Tracking</h1>
        <p className="text-neutral-500">Monitor skills, certifications, and professional development</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-neutral-200 p-5">
          <p className="text-sm text-neutral-500 mb-1">Total Competencies</p>
          <p className="text-3xl font-semibold text-neutral-900">342</p>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-5">
          <p className="text-sm text-neutral-500 mb-1">Avg. Skill Level</p>
          <p className="text-3xl font-semibold text-neutral-900">Advanced</p>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-5">
          <p className="text-sm text-neutral-500 mb-1">Certifications Expiring</p>
          <p className="text-3xl font-semibold text-neutral-900">147</p>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-5">
          <p className="text-sm text-neutral-500 mb-1">Compliance Rate</p>
          <p className="text-3xl font-semibold text-neutral-900">91.2%</p>
        </div>
      </div>

      {/* Competency Areas */}
      <div>
        <h2 className="text-neutral-900 mb-4">Competency Areas Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {competencyAreas.map((area, index) => {
            const percentage = Math.round((area.certified / area.total) * 100);
            const getColorClasses = () => {
              switch (area.color) {
                case 'emerald':
                  return { bg: 'bg-emerald-50', text: 'text-emerald-600', bar: 'bg-emerald-600', border: 'border-emerald-100' };
                case 'blue':
                  return { bg: 'bg-blue-50', text: 'text-blue-600', bar: 'bg-blue-600', border: 'border-blue-100' };
                case 'purple':
                  return { bg: 'bg-purple-50', text: 'text-purple-600', bar: 'bg-purple-600', border: 'border-purple-100' };
                case 'amber':
                  return { bg: 'bg-amber-50', text: 'text-amber-600', bar: 'bg-amber-600', border: 'border-amber-100' };
                default:
                  return { bg: 'bg-neutral-50', text: 'text-neutral-600', bar: 'bg-neutral-600', border: 'border-neutral-100' };
              }
            };
            const colors = getColorClasses();

            return (
              <div key={index} className="bg-white rounded-xl border border-neutral-200 p-2 md:p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-neutral-900 mb-1">{area.name}</h3>
                    <p className="text-sm text-neutral-500">{area.certified} of {area.total} workers certified</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${colors.bg} ${colors.text} ${colors.border}`}>
                    <Award className="w-6 h-6" />
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-neutral-600">Certification Rate</span>
                    <span className="text-sm font-medium text-neutral-900">{percentage}%</span>
                  </div>
                  <div className="bg-neutral-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${colors.bar}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>

                {area.expiringSoon > 0 && (
                  <div className="flex items-center gap-2 text-sm text-amber-600">
                    <AlertCircle className="w-4 h-4" />
                    <span>{area.expiringSoon} certifications expiring soon</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Performers */}
      <div>
        <h2 className="text-neutral-900 mb-4">Worker Competency Profiles</h2>
        <div className="space-y-4">
          {workers.map((worker, index) => (
            <div key={index} className="bg-white rounded-xl border border-neutral-200 p-2 md:p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-medium">
                    {worker.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="text-neutral-900 mb-1">{worker.name}</h3>
                    <p className="text-sm text-neutral-500">{worker.id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-neutral-500 mb-1">Competency Score</p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-semibold text-neutral-900">{worker.score}%</span>
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {worker.competencies.map((comp, idx) => (
                  <div key={idx} className="border border-neutral-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm font-medium text-neutral-900">{comp.name}</p>
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    </div>
                    <p className="text-sm text-neutral-600 mb-2">{comp.level}</p>
                    <p className="text-xs text-neutral-500">Expires: {comp.expires}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skill Gap Analysis */}
      <div className="bg-white rounded-xl border border-neutral-200 p-2 md:p-6">
        <h2 className="text-neutral-900 mb-4">Skill Gap Analysis</h2>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-neutral-700">Outbreak Investigation</span>
              <span className="text-sm text-neutral-600">45% gap</span>
            </div>
            <div className="bg-neutral-200 rounded-full h-2">
              <div className="bg-red-500 h-2 rounded-full" style={{ width: '45%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-neutral-700">Advanced Data Analysis</span>
              <span className="text-sm text-neutral-600">32% gap</span>
            </div>
            <div className="bg-neutral-200 rounded-full h-2">
              <div className="bg-amber-500 h-2 rounded-full" style={{ width: '32%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-neutral-700">Emergency Triage</span>
              <span className="text-sm text-neutral-600">18% gap</span>
            </div>
            <div className="bg-neutral-200 rounded-full h-2">
              <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '18%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}