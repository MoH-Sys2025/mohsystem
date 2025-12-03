import { GraduationCap, Calendar, Users, Award, Plus } from 'lucide-react';
import {JSX} from "react";

interface TrainingProps {
    onNavigate: (page: string) => void;
}

export function Trainings({onNavigate}: TrainingProps): JSX.Element {
  const upcomingTrainings = [
    {
      title: 'Emergency Response Protocol',
      date: '2024-12-01',
      duration: '3 days',
      participants: 45,
      location: 'Lilongwe Training Center',
      status: 'Open for Registration',
    },
    {
      title: 'Cholera Case Management',
      date: '2024-12-05',
      duration: '2 days',
      participants: 30,
      location: 'Blantyre District Hospital',
      status: 'Open for Registration',
    },
    {
      title: 'COVID-19 Vaccination Updates',
      date: '2024-12-10',
      duration: '1 day',
      participants: 60,
      location: 'Online',
      status: 'Registration Closing Soon',
    },
  ];

  const completedTrainings = [
    {
      title: 'Outbreak Investigation Basics',
      completedDate: '2024-11-15',
      participants: 52,
      certified: 48,
    },
    {
      title: 'Personal Protective Equipment Use',
      completedDate: '2024-11-10',
      participants: 68,
      certified: 65,
    },
    {
      title: 'Data Collection & Reporting',
      completedDate: '2024-11-05',
      participants: 42,
      certified: 40,
    },
  ];

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-neutral-900 mb-2">Trainings</h1>
          <p className="text-neutral-500">Manage training programs and certifications for healthcare workers</p>
        </div>
        <button onClick={()=>onNavigate("form trainings")} className="px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 flex items-center gap-2 transition-colors shadow-sm">
          <Plus className="w-5 h-5" />
          Create Training
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-neutral-200 p-5">
          <p className="text-sm text-neutral-500 mb-1">Total Trainings</p>
          <p className="text-3xl font-semibold text-neutral-900">127</p>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-5">
          <p className="text-sm text-neutral-500 mb-1">Upcoming</p>
          <p className="text-3xl font-semibold text-neutral-900">8</p>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-5">
          <p className="text-sm text-neutral-500 mb-1">Certified Workers</p>
          <p className="text-3xl font-semibold text-neutral-900">1,847</p>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-5">
          <p className="text-sm text-neutral-500 mb-1">Completion Rate</p>
          <p className="text-3xl font-semibold text-neutral-900">92.5%</p>
        </div>
      </div>

      {/* Training Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-neutral-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h3 className="text-neutral-900 mb-2">Disease-Specific Training</h3>
          <p className="text-sm text-neutral-500 mb-4">Cholera, COVID-19, Malaria, and other outbreak-specific training</p>
          <div className="text-sm font-medium text-emerald-600">42 programs →</div>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-neutral-900 mb-2">Certification Programs</h3>
          <p className="text-sm text-neutral-500 mb-4">Professional certifications and skill development courses</p>
          <div className="text-sm font-medium text-blue-600">28 programs →</div>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-neutral-900 mb-2">Team Coordination</h3>
          <p className="text-sm text-neutral-500 mb-4">Leadership and outbreak response team management</p>
          <div className="text-sm font-medium text-amber-600">18 programs →</div>
        </div>
      </div>

      {/* Upcoming Trainings */}
      <div>
        <h2 className="text-neutral-900 mb-4">Upcoming Trainings</h2>
        <div className="space-y-4">
          {upcomingTrainings.map((training, index) => (
            <div key={index} className="bg-white rounded-xl border border-neutral-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-neutral-900">{training.title}</h3>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      training.status === 'Registration Closing Soon'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {training.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-neutral-400" />
                      <div>
                        <p className="text-xs text-neutral-500">Date</p>
                        <p className="text-sm font-medium text-neutral-900">{training.date}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500">Duration</p>
                      <p className="text-sm font-medium text-neutral-900">{training.duration}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-neutral-400" />
                      <div>
                        <p className="text-xs text-neutral-500">Participants</p>
                        <p className="text-sm font-medium text-neutral-900">{training.participants}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500">Location</p>
                      <p className="text-sm font-medium text-neutral-900">{training.location}</p>
                    </div>
                  </div>
                </div>

                <button className="px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors ml-6 text-sm font-medium">
                  Register
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Completed Trainings */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200">
          <h2 className="text-neutral-900">Recently Completed</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Training Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Completion Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Participants</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Certified</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Success Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 bg-white">
              {completedTrainings.map((training, index) => (
                <tr key={index} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-neutral-900">{training.title}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-neutral-600">{training.completedDate}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-neutral-600">{training.participants}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-neutral-600">{training.certified}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-neutral-200 rounded-full h-2 max-w-24">
                        <div
                          className="bg-emerald-600 h-2 rounded-full"
                          style={{ width: `${(training.certified / training.participants) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-neutral-700">
                        {Math.round((training.certified / training.participants) * 100)}%
                      </span>
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