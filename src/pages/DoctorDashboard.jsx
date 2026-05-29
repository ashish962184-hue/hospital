import { useState, useEffect } from 'react';
import { Calendar, Clock, FileText, CheckCircle, Search, Video } from 'lucide-react';

export default function DoctorDashboard() {
  const [stats, setStats] = useState({
    todayAppointments: 12,
    pendingReports: 4,
    completedAppointments: 5,
    appointments: [
      { id: '101', patientName: 'John Doe', time: '09:00 AM', status: 'COMPLETED', type: 'Checkup', gender: 'M', age: 45 },
      { id: '102', patientName: 'Jane Smith', time: '10:30 AM', status: 'SCHEDULED', type: 'Follow up', gender: 'F', age: 32 },
      { id: '103', patientName: 'Michael Brown', time: '11:15 AM', status: 'SCHEDULED', type: 'Consultation', gender: 'M', age: 58 },
      { id: '104', patientName: 'Emily Davis', time: '02:00 PM', status: 'SCHEDULED', type: 'Checkup', gender: 'F', age: 24 },
    ]
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Good Morning, Dr. Sarah!</h1>
          <p className="text-slate-500">You have 7 appointments remaining today.</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Video className="w-4 h-4" /> Start Teleconsultation
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 border-l-4 border-l-brand-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-slate-500">Today's Appointments</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stats.todayAppointments}</h3>
            </div>
            <div className="p-3 bg-brand-50 dark:bg-brand-500/10 rounded-full text-brand-500">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
        </div>
        
        <div className="glass-card p-6 border-l-4 border-l-emerald-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-slate-500">Completed</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stats.completedAppointments}</h3>
            </div>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-full text-emerald-500">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="glass-card p-6 border-l-4 border-l-amber-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-slate-500">Pending Lab Reports</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stats.pendingReports}</h3>
            </div>
            <div className="p-3 bg-amber-50 dark:bg-amber-500/10 rounded-full text-amber-500">
              <FileText className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="glass-card p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Upcoming Appointments</h2>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search patient..." 
              className="pl-9 pr-4 py-1.5 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-sm text-slate-500">
                <th className="pb-3 font-medium">Patient Name</th>
                <th className="pb-3 font-medium">Time</th>
                <th className="pb-3 font-medium">Type</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {stats.appointments.map((apt) => (
                <tr key={apt.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300">
                        {apt.patientName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{apt.patientName}</p>
                        <p className="text-xs text-slate-500">{apt.gender}, {apt.age} yrs</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300">
                      <Clock className="w-4 h-4 text-brand-500" />
                      {apt.time}
                    </div>
                  </td>
                  <td className="py-4 text-sm text-slate-600 dark:text-slate-300">{apt.type}</td>
                  <td className="py-4">
                    <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${
                      apt.status === 'COMPLETED' 
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
                    }`}>
                      {apt.status}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <button className="btn-secondary py-1.5 px-3 text-xs">View History</button>
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
