import { useState, useEffect } from 'react';
import { Calendar, Users, Clock, UserPlus, Search, CheckCircle, AlertCircle, X, Phone } from 'lucide-react';
import StatCard from '../components/StatCard';
import { useStore } from '../store';

const DOCTORS = [
  { id: 'd1', name: 'Dr. Sarah Jenkins', dept: 'Cardiology', status: 'AVAILABLE', patients: 4 },
  { id: 'd2', name: 'Dr. Michael Chen', dept: 'General', status: 'BUSY', patients: 7 },
  { id: 'd3', name: 'Dr. Emily Brown', dept: 'Pediatrics', status: 'AVAILABLE', patients: 2 },
];

export default function ReceptionistDashboard() {
  const { showToast, token } = useStore();
  const [search, setSearch] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [patientsList, setPatientsList] = useState([]);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [form, setForm] = useState({ patientId: '', doctorId: '', type: 'Walk-in', timeSlot: '11:00 AM' });

  const loadAll = () => {
    fetch('/api/appointments', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setAppointments(data))
      .catch(() => showToast('Failed to load appointments', 'error'));

    fetch('/api/patients', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setPatientsList(data))
      .catch(() => showToast('Failed to load patients', 'error'));
  };

  useEffect(() => {
    loadAll();
  }, [token]);

  const handleBook = (e) => {
    e.preventDefault();
    if (!form.patientId || !form.doctorId) {
      showToast('Please select a patient and a doctor', 'warning');
      return;
    }

    const body = {
      patientId: form.patientId,
      doctorId: form.doctorId,
      date: new Date().toISOString().split('T')[0],
      timeSlot: form.timeSlot,
      type: form.type,
      notes: 'Booked via front desk dashboard.'
    };

    fetch('/api/appointments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body)
    })
      .then(res => res.json())
      .then(() => {
        showToast('Appointment booked successfully!', 'success');
        setIsBookingOpen(false);
        setForm({ patientId: '', doctorId: '', type: 'Walk-in', timeSlot: '11:00 AM' });
        loadAll();
      })
      .catch(() => showToast('Failed to book appointment', 'error'));
  };

  const filteredQueue = appointments.filter(apt => {
    const pName = apt.patient ? `${apt.patient.firstName} ${apt.patient.lastName}`.toLowerCase() : '';
    return pName.includes(search.toLowerCase()) || apt.id.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Reception & OPD Queue</h1>
          <p className="text-slate-500">Manage walk-ins, appointments, and doctor availability</p>
        </div>
        <button onClick={() => setIsBookingOpen(true)} className="btn-primary flex items-center gap-2">
          <UserPlus className="w-4 h-4" /> Book Appointment
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Today's Queue" value={String(appointments.length)} icon={Users} color="text-brand-500" bg="bg-brand-500/10" accentColor="border-l-brand-500" />
        <StatCard title="In Progress" value={String(appointments.filter(a => a.status === 'IN_CONSULTATION').length)} icon={Clock} color="text-amber-500" bg="bg-amber-500/10" accentColor="border-l-amber-500" />
        <StatCard title="Completed" value={String(appointments.filter(a => a.status === 'COMPLETED').length)} icon={CheckCircle} color="text-emerald-500" bg="bg-emerald-500/10" accentColor="border-l-emerald-500" />
        <StatCard title="Total Appointments" value={String(appointments.length)} icon={Calendar} color="text-blue-500" bg="bg-blue-500/10" accentColor="border-l-blue-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Queue Table */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-brand-500" /> Live OPD Queue
            </h2>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search patient..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-4 py-1.5 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-sm text-slate-500">
                  <th className="pb-3 font-medium">Token ID</th>
                  <th className="pb-3 font-medium">Patient</th>
                  <th className="pb-3 font-medium">Doctor</th>
                  <th className="pb-3 font-medium">Type</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredQueue.map((apt, idx) => (
                  <tr key={apt.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 font-mono text-sm font-bold text-brand-600 dark:text-brand-400">
                      T-00{idx + 1}
                    </td>
                    <td className="py-3">
                      <p className="font-medium text-slate-900 dark:text-white">
                        {apt.patient ? `${apt.patient.firstName} ${apt.patient.lastName}` : 'Unknown Patient'}
                      </p>
                      <p className="text-xs text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3"/>{apt.timeSlot}</p>
                    </td>
                    <td className="py-3 text-sm text-slate-600 dark:text-slate-300">
                      {apt.doctor?.name || 'Unassigned'}
                    </td>
                    <td className="py-3 text-sm text-slate-500">{apt.type}</td>
                    <td className="py-3">
                      <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${
                        apt.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20' :
                        apt.status === 'IN_CONSULTATION' ? 'bg-brand-100 text-brand-700 dark:bg-brand-500/20' :
                        'bg-amber-100 text-amber-700 dark:bg-amber-500/20'
                      }`}>{apt.status}</span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => showToast(`Calling patient token T-00${idx + 1}...`, 'info')}
                        className="btn-secondary py-1.5 px-3 text-xs"
                      >
                        Call Next
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Doctor Availability */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-5">Doctor Availability</h2>
          <div className="space-y-3">
            {DOCTORS.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-sm">
                    {doc.name.split(' ')[1][0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-white">{doc.name}</p>
                    <p className="text-xs text-slate-500">{doc.dept} • {doc.patients} patients today</p>
                  </div>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  doc.status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20' : 'bg-rose-100 text-rose-700 dark:bg-rose-500/20'
                }`}>{doc.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {isBookingOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
            <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">New Appointment</h2>
              <button onClick={() => setIsBookingOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleBook} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Patient Name</label>
                <select 
                  required 
                  value={form.patientId} 
                  onChange={e => setForm({...form, patientId: e.target.value})} 
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                >
                  <option value="">Select Patient Profile</option>
                  {patientsList.map(p => <option key={p.id} value={p.id}>{p.firstName} {p.lastName} — {p.id}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Doctor</label>
                <select 
                  required 
                  value={form.doctorId} 
                  onChange={e => setForm({...form, doctorId: e.target.value})} 
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                >
                  <option value="">Select Doctor</option>
                  {DOCTORS.map(d => <option key={d.id} value={d.id}>{d.name} — {d.dept}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Time Slot</label>
                  <input required type="text" value={form.timeSlot} onChange={e => setForm({...form, timeSlot: e.target.value})} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm" placeholder="e.g. 10:00 AM" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Visit Type</label>
                  <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm">
                    <option>Walk-in</option>
                    <option>Scheduled</option>
                    <option>Emergency</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="btn-primary w-full mt-2">Confirm & Issue Token</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
