import { useState, useEffect } from 'react';
import { 
  Users, Activity, Bed, ShieldAlert,
  Flame, Calendar, CreditCard, Droplets, MapPin, Bus, CheckCircle
} from 'lucide-react';
import { useStore } from '../store';
import StatCard from '../components/StatCard';

const LIVE_ALARMS = [
  { id: 'AL-101', text: 'Blood Bank: Critical O- shortage detected!', time: '1 min ago', priority: 'CRITICAL' },
  { id: 'AL-102', text: 'Emergency: Ambulance dispatch assigned to trip #224', time: '5 mins ago', priority: 'HIGH' },
  { id: 'AL-103', text: 'ICU: Occupancy reached 94%', time: '12 mins ago', priority: 'HIGH' },
  { id: 'AL-104', text: 'Asset: Ventilator #14 marked under maintenance', time: '1 hour ago', priority: 'MEDIUM' },
];

const FLIGHTS = [
  { id: 'AMB-201', location: '7th Avenue Mall', driver: 'Alex R.', status: 'IN_TRANSIT', eta: '4m' },
  { id: 'AMB-204', location: 'Broad St Crossing', driver: 'Marcus S.', status: 'PICKUP', eta: '8m' },
  { id: 'AMB-209', location: 'Base Terminal', driver: 'Sarah K.', status: 'AVAILABLE', eta: '—' },
];

export default function CommandCenter() {
  const { showToast } = useStore();
  const [alarms, setAlarms] = useState(LIVE_ALARMS);

  const resolveAlarm = (id) => {
    setAlarms(prev => prev.filter(al => al.id !== id));
    showToast('Alarm acknowledged and routed to on-duty staff.', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute right-[-10%] top-[-20%] w-[300px] h-[300px] bg-rose-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-rose-500">
            <Flame className="w-6 h-6 animate-pulse" /> Operations Command Center
          </h1>
          <p className="text-slate-400 text-sm mt-1">Real-time emergency telemetry, fleet dispatch status, and clinical alert matrix</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">Telemetry Active</span>
        </div>
      </div>

      {/* Real-time Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Triage / Alarms */}
        <div className="lg:col-span-2 glass-card p-6 border-l-4 border-l-rose-500/80">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-5 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-500" /> Active Emergency Warning Matrix
          </h2>
          {alarms.length === 0 ? (
            <div className="text-center py-12 text-slate-400 bg-slate-50/50 dark:bg-slate-800/10 rounded-xl">
              <CheckCircle className="w-12 h-12 mx-auto text-emerald-400 mb-2" />
              <p className="font-semibold">All operational warning clear!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {alarms.map((al) => (
                <div key={al.id} className={`p-4 rounded-xl border flex justify-between items-center ${
                  al.priority === 'CRITICAL' 
                    ? 'border-rose-200 dark:border-rose-800/50 bg-rose-50/40 dark:bg-rose-900/10'
                    : 'border-amber-200 dark:border-amber-800/50 bg-amber-50/40 dark:bg-amber-900/10'
                }`}>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        al.priority === 'CRITICAL' ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/20' : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20'
                      }`}>{al.priority}</span>
                      <span className="text-xs text-slate-400">{al.time}</span>
                    </div>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{al.text}</p>
                  </div>
                  <button 
                    onClick={() => resolveAlarm(al.id)}
                    className="btn-secondary py-1.5 px-3 text-xs border-rose-200 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 shrink-0"
                  >
                    Acknowledge
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ambulance Dispatch */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-5 flex items-center gap-2">
            <Bus className="w-5 h-5 text-brand-500 animate-bounce" /> Ambulance Dispatch Logs
          </h2>
          <div className="space-y-4">
            {FLIGHTS.map((f, i) => (
              <div key={i} className="p-3 border border-slate-100 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-white text-sm">{f.id}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5"><MapPin className="w-3.5 h-3.5 text-brand-500"/> {f.location}</p>
                    <p className="text-xs text-slate-400 mt-0.5">Driver: {f.driver}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    f.status === 'IN_TRANSIT' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20' :
                    f.status === 'PICKUP' ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/20' :
                    'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20'
                  }`}>{f.status.replace('_', ' ')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bed Utilization & OT Schedule summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Bed Utilization Monitor</h3>
          <div className="space-y-4">
            {[
              { ward: 'ICU Ward A', occupied: 14, capacity: 15, color: 'bg-rose-500' },
              { ward: 'Cardiology Ward', occupied: 22, capacity: 30, color: 'bg-brand-500' },
              { ward: 'Neurology Ward', occupied: 12, capacity: 20, color: 'bg-indigo-500' },
              { ward: 'General Wards', occupied: 80, capacity: 85, color: 'bg-amber-500' },
            ].map((w, idx) => {
              const pct = Math.round((w.occupied / w.capacity) * 100);
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
                    <span>{w.ward}</span>
                    <span>{w.occupied} / {w.capacity} beds ({pct}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full">
                    <div className={`h-2.5 rounded-full ${w.color}`} style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">OT Surgeries Queue</h3>
          <div className="space-y-3">
            {[
              { patient: 'David Wilson', surgeon: 'Dr. Sarah Jenkins', room: 'OT-01', time: '11:00 AM', status: 'IN_PROGRESS' },
              { patient: 'Rajesh Kumar', surgeon: 'Dr. Michael Chen', room: 'OT-02', time: '01:30 PM', status: 'SCHEDULED' },
            ].map((ot, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 rounded-lg bg-slate-50/50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800">
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-white">{ot.patient}</p>
                  <p className="text-xs text-slate-500">{ot.surgeon} • Room {ot.room}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-brand-500 font-bold">{ot.time}</p>
                  <span className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded-full mt-1 ${
                    ot.status === 'IN_PROGRESS' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20' : 'bg-blue-100 text-blue-700 dark:bg-blue-500/20'
                  }`}>{ot.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
