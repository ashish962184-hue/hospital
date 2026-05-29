import { useState, useEffect } from 'react';
import { Calendar, Clock, User, Plus, Search, Filter } from 'lucide-react';
import { useStore } from '../store';

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token, showToast, user } = useStore();

  useEffect(() => {
    fetch('/api/appointments', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      setAppointments(data);
      setIsLoading(false);
    })
    .catch(() => {
      showToast('Failed to load appointments', 'error');
      setIsLoading(false);
    });
  }, [token, showToast]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Appointments & OPD</h1>
          <p className="text-slate-500">Manage daily schedules and queues</p>
        </div>
        {user?.role === 'RECEPTIONIST' && (
          <button className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Book Appointment
          </button>
        )}
      </div>

      <div className="glass-card p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search appointments..." 
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <button className="btn-secondary py-2 px-3 flex items-center gap-2 text-sm">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-slate-500 animate-pulse">Loading schedule...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-sm text-slate-500">
                  <th className="pb-3 font-medium">Patient</th>
                  <th className="pb-3 font-medium">Doctor</th>
                  <th className="pb-3 font-medium">Date & Time</th>
                  <th className="pb-3 font-medium">Type</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {appointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-4 font-medium text-slate-900 dark:text-white">
                      {apt.patient ? `${apt.patient.firstName} ${apt.patient.lastName}` : 'Unknown'}
                    </td>
                    <td className="py-4 text-slate-600 dark:text-slate-300">
                      {apt.doctor?.name || 'Unassigned'}
                    </td>
                    <td className="py-4">
                      <div className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300">
                        <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-slate-400"/> {apt.date}</span>
                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-400"/> {apt.timeSlot}</span>
                      </div>
                    </td>
                    <td className="py-4 text-sm text-slate-600 dark:text-slate-300">{apt.type}</td>
                    <td className="py-4">
                      <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${
                        apt.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : 
                        'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
                      }`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      {(user?.role === 'RECEPTIONIST' || user?.role === 'DOCTOR') ? (
                        <button className="btn-secondary py-1.5 px-3 text-xs">Manage</button>
                      ) : (
                        <span className="text-xs text-slate-400 italic">View Only</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
