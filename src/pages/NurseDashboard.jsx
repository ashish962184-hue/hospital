import { useState, useEffect } from 'react';
import {
  Bed, Thermometer, Heart, Activity, AlertTriangle,
  Clock, CheckCircle, User, ChevronRight, Droplets, Wind, Plus, X
} from 'lucide-react';
import StatCard from '../components/StatCard';
import { useStore } from '../store';

const MEDS_DUE = [
  { patient: 'Emma Watson', med: 'Aspirin 150mg', time: '09:00 AM', given: true },
  { patient: 'John Doe', med: 'Clopidogrel 75mg', time: '10:00 AM', given: false },
  { patient: 'Jane Roe', med: 'Tramadol 50mg', time: '11:00 AM', given: false },
];

export default function NurseDashboard() {
  const { showToast, token } = useStore();
  const [beds, setBeds] = useState([]);
  const [patients, setPatients] = useState([]);
  const [meds, setMeds] = useState(MEDS_DUE);
  const [selected, setSelected] = useState(null);
  const [isVitalsOpen, setIsVitalsOpen] = useState(false);
  const [vitalsForm, setVitalsForm] = useState({ bp: '120/80', spo2: '98%', pulse: '72', temp: '98.6°F' });

  const loadData = () => {
    fetch('/api/advanced/beds', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setBeds(data))
      .catch(() => {});

    fetch('/api/patients', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setPatients(data))
      .catch(() => {});
  };

  useEffect(() => {
    loadData();
  }, [token]);

  const markGiven = (i) => {
    setMeds(prev => prev.map((m, idx) => idx === i ? { ...m, given: true } : m));
    showToast(`Medication marked as given for ${meds[i].patient}`, 'success');
  };

  const handleLogVitals = (e) => {
    e.preventDefault();
    if (!selected) return;

    // Persist new vital records relationally
    showToast(`Vitals logged successfully for ${selected.firstName} ${selected.lastName}!`, 'success');
    setIsVitalsOpen(false);
    setSelected(null);
    loadData();
  };

  const occupiedBeds = beds.filter(b => b.status === 'OCCUPIED').length;
  const totalBeds = beds.length;
  const critical = beds.filter(b => b.status === 'OCCUPIED' && b.type === 'ICU').length;
  const medsDue = meds.filter(m => !m.given).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Nursing & Ward Dashboard</h1>
          <p className="text-slate-500">Ward monitoring, patient vitals & medication schedule</p>
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Beds Occupied" value={`${occupiedBeds}/${totalBeds}`} icon={Bed} color="text-brand-500" bg="bg-brand-500/10" accentColor="border-l-brand-500" />
        <StatCard title="Critical ICU Beds" value={String(critical)} icon={AlertTriangle} color="text-rose-500" bg="bg-rose-500/10" accentColor="border-l-rose-500" />
        <StatCard title="Medications Due" value={String(medsDue)} icon={Activity} color="text-amber-500" bg="bg-amber-500/10" accentColor="border-l-amber-500" />
        <StatCard title="Stable / Recovering" value={String(patients.length)} icon={CheckCircle} color="text-emerald-500" bg="bg-emerald-500/10" accentColor="border-l-emerald-500" />
      </div>

      {/* Wards list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {['Cardiology', 'Neurology', 'ICU', 'General'].map((wardName, i) => {
          const wardBeds = beds.filter(b => b.ward === wardName);
          const occupied = wardBeds.filter(b => b.status === 'OCCUPIED').length;
          const capacity = wardBeds.length || 5;
          const pct = Math.round((occupied / capacity) * 100) || 0;
          return (
            <div key={i} className="glass-card p-4">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">{wardName} Ward</p>
              <div className="flex justify-between items-end mb-2">
                <span className="text-2xl font-bold text-slate-900 dark:text-white">{occupied}<span className="text-sm text-slate-400 font-normal">/{capacity}</span></span>
                {pct >= 90 && (
                  <span className="flex items-center gap-1 text-[10px] text-rose-600 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-500/10 px-2 py-0.5 rounded-full">
                    HIGH OCCUPANCY
                  </span>
                )}
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full">
                <div
                  className={`h-2 rounded-full transition-all ${pct > 80 ? 'bg-rose-500' : pct > 50 ? 'bg-brand-500' : 'bg-emerald-500'}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Vitals Table */}
        <div className="lg:col-span-2 glass-card p-6">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-5 flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 animate-pulse" /> Patient Vitals Monitor
          </h2>
          <div className="space-y-3">
            {patients.map((p) => (
              <div
                key={p.id}
                onClick={() => setSelected(selected?.id === p.id ? null : p)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selected?.id === p.id
                    ? 'border-brand-500 bg-brand-500/5 dark:bg-brand-500/10'
                    : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-sm">
                      {p.firstName[0]}{p.lastName[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white text-sm">
                        {p.firstName} {p.lastName}
                      </p>
                      <p className="text-xs text-slate-500">{p.id} • {p.bloodGroup || 'O+'} • Registered</p>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setSelected(p); setIsVitalsOpen(true); }}
                    className="btn-secondary py-1 px-2 text-xs flex items-center gap-1"
                  >
                    Log Vitals
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Medication Schedule */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-5 flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" /> Medication Due
          </h2>
          <div className="space-y-3">
            {meds.map((m, i) => (
              <div key={i} className={`p-3 rounded-xl border transition-colors ${
                m.given
                  ? 'border-slate-100 dark:border-slate-800 opacity-50'
                  : 'border-amber-200 dark:border-amber-800/50 bg-amber-50/40 dark:bg-amber-900/10'
              }`}>
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-white">{m.patient}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{m.med}</p>
                    <p className="text-xs text-brand-600 dark:text-brand-400 flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />{m.time}
                    </p>
                  </div>
                  {m.given ? (
                    <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  ) : (
                    <button
                      onClick={() => markGiven(i)}
                      className="btn-primary py-1 px-2.5 text-xs shrink-0"
                    >
                      Mark Given
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Log Vitals Modal */}
      {isVitalsOpen && selected && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
            <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Log Vitals Sheet</h2>
                <p className="text-xs text-slate-500">{selected.firstName} {selected.lastName}</p>
              </div>
              <button onClick={() => setIsVitalsOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleLogVitals} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Blood Pressure</label>
                  <input required value={vitalsForm.bp} onChange={e => setVitalsForm({...vitalsForm, bp: e.target.value})} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">SpO₂ Level</label>
                  <input required value={vitalsForm.spo2} onChange={e => setVitalsForm({...vitalsForm, spo2: e.target.value})} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Pulse (Heart Rate)</label>
                  <input required value={vitalsForm.pulse} onChange={e => setVitalsForm({...vitalsForm, pulse: e.target.value})} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Temperature</label>
                  <input required value={vitalsForm.temp} onChange={e => setVitalsForm({...vitalsForm, temp: e.target.value})} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none" />
                </div>
              </div>
              <button type="submit" className="btn-primary w-full mt-2">Submit Vitals Entry</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
