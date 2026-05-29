import { useState } from 'react';
import {
  Bed, Thermometer, Heart, Activity, AlertTriangle,
  Clock, CheckCircle, User, ChevronRight, Droplets, Wind
} from 'lucide-react';
import StatCard from '../components/StatCard';
import { useStore } from '../store';

const WARDS = [
  { ward: 'Ward A – Cardiology', beds: 20, occupied: 17, critical: 3 },
  { ward: 'Ward B – Neurology',  beds: 16, occupied: 12, critical: 1 },
  { ward: 'Ward C – General',    beds: 30, occupied: 24, critical: 2 },
  { ward: 'Ward D – Ortho',      beds: 14, occupied: 10, critical: 0 },
];

const PATIENTS = [
  { id: 'IPD-101', name: 'Ravi Kumar',    age: 62, ward: 'Ward A', diagnosis: 'Myocardial Infarction', bp: '138/88', temp: '99.1°F', spo2: '94%', pulse: 96,  status: 'CRITICAL', lastVitals: '10 min ago' },
  { id: 'IPD-102', name: 'Sunita Rao',    age: 45, ward: 'Ward B', diagnosis: 'Ischaemic Stroke',      bp: '145/92', temp: '98.6°F', spo2: '97%', pulse: 82,  status: 'STABLE',   lastVitals: '20 min ago' },
  { id: 'IPD-103', name: 'Anand Mehta',   age: 58, ward: 'Ward C', diagnosis: 'Type 2 Diabetes',       bp: '126/80', temp: '98.2°F', spo2: '99%', pulse: 74,  status: 'STABLE',   lastVitals: '30 min ago' },
  { id: 'IPD-104', name: 'Fatima Sheikh', age: 34, ward: 'Ward A', diagnosis: 'Heart Failure',          bp: '155/95', temp: '100.4°F',spo2: '91%', pulse: 108, status: 'CRITICAL', lastVitals: '5 min ago'  },
  { id: 'IPD-105', name: 'Prakash Nair',  age: 70, ward: 'Ward D', diagnosis: 'Hip Fracture',           bp: '120/76', temp: '98.8°F', spo2: '98%', pulse: 68,  status: 'RECOVERING',lastVitals: '45 min ago'},
];

const MEDS_DUE = [
  { patient: 'Ravi Kumar',    med: 'Aspirin 150mg',       time: '09:00 AM', given: true  },
  { patient: 'Fatima Sheikh', med: 'Furosemide 40mg IV',  time: '09:30 AM', given: false },
  { patient: 'Sunita Rao',   med: 'Clopidogrel 75mg',    time: '10:00 AM', given: false },
  { patient: 'Anand Mehta',  med: 'Metformin 500mg',     time: '10:30 AM', given: false },
  { patient: 'Prakash Nair', med: 'Tramadol 50mg',       time: '11:00 AM', given: false },
];

export default function NurseDashboard() {
  const { showToast } = useStore();
  const [meds, setMeds] = useState(MEDS_DUE);
  const [selected, setSelected] = useState(null);

  const markGiven = (i) => {
    setMeds(prev => prev.map((m, idx) => idx === i ? { ...m, given: true } : m));
    showToast(`Medication marked as given for ${meds[i].patient}`, 'success');
  };

  const totalBeds    = WARDS.reduce((s, w) => s + w.beds, 0);
  const occupied     = WARDS.reduce((s, w) => s + w.occupied, 0);
  const critical     = PATIENTS.filter(p => p.status === 'CRITICAL').length;
  const medsDue      = meds.filter(m => !m.given).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Nursing Dashboard</h1>
        <p className="text-slate-500">Ward monitoring, patient vitals & medication schedule</p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Beds Occupied"       value={`${occupied}/${totalBeds}`} icon={Bed}          color="text-brand-500"   bg="bg-brand-500/10"   accentColor="border-l-brand-500"   />
        <StatCard title="Critical Patients"   value={String(critical)}           icon={AlertTriangle} color="text-rose-500"    bg="bg-rose-500/10"    accentColor="border-l-rose-500"    />
        <StatCard title="Medications Due"     value={String(medsDue)}            icon={Activity}      color="text-amber-500"   bg="bg-amber-500/10"   accentColor="border-l-amber-500"   />
        <StatCard title="Stable / Recovering" value={String(PATIENTS.length - critical)} icon={CheckCircle} color="text-emerald-500" bg="bg-emerald-500/10" accentColor="border-l-emerald-500" />
      </div>

      {/* Ward Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {WARDS.map((w, i) => {
          const pct = Math.round((w.occupied / w.beds) * 100);
          return (
            <div key={i} className="glass-card p-4">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">{w.ward}</p>
              <div className="flex justify-between items-end mb-2">
                <span className="text-2xl font-bold text-slate-900 dark:text-white">{w.occupied}<span className="text-sm text-slate-400 font-normal">/{w.beds}</span></span>
                {w.critical > 0 && (
                  <span className="flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400 font-semibold bg-rose-50 dark:bg-rose-500/10 px-2 py-0.5 rounded-full">
                    <AlertTriangle className="w-3 h-3" />{w.critical} critical
                  </span>
                )}
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full">
                <div
                  className={`h-2 rounded-full transition-all ${pct > 85 ? 'bg-rose-500' : pct > 70 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">{pct}% occupied</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Vitals Table */}
        <div className="lg:col-span-2 glass-card p-6">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-5 flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500" /> Patient Vitals Monitor
          </h2>
          <div className="space-y-3">
            {PATIENTS.map((p) => (
              <div
                key={p.id}
                onClick={() => setSelected(selected?.id === p.id ? null : p)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  p.status === 'CRITICAL'
                    ? 'border-rose-200 dark:border-rose-800/50 bg-rose-50/40 dark:bg-rose-900/10'
                    : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${
                      p.status === 'CRITICAL' ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400' : 'bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400'
                    }`}>
                      {p.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white text-sm">{p.name} <span className="text-slate-400 font-normal">· {p.age}y</span></p>
                      <p className="text-xs text-slate-500">{p.id} · {p.ward} · {p.diagnosis}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      p.status === 'CRITICAL'   ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400' :
                      p.status === 'STABLE'     ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' :
                      'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400'
                    }`}>{p.status}</span>
                    <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${selected?.id === p.id ? 'rotate-90' : ''}`} />
                  </div>
                </div>

                {/* Expanded vitals */}
                {selected?.id === p.id && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    {[
                      { icon: Activity,     label: 'Blood Pressure', value: p.bp,   color: 'text-brand-500' },
                      { icon: Thermometer,  label: 'Temperature',    value: p.temp, color: 'text-amber-500' },
                      { icon: Droplets,     label: 'SpO₂',           value: p.spo2, color: 'text-blue-500'  },
                      { icon: Heart,        label: 'Pulse',          value: `${p.pulse} bpm`, color: 'text-rose-500' },
                    ].map((v, i) => {
                      const Icon = v.icon;
                      return (
                        <div key={i} className="text-center p-2 rounded-lg bg-white dark:bg-slate-800/50">
                          <Icon className={`w-4 h-4 mx-auto mb-1 ${v.color}`} />
                          <p className="text-xs text-slate-500">{v.label}</p>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">{v.value}</p>
                        </div>
                      );
                    })}
                    <div className="col-span-2 sm:col-span-4 text-xs text-slate-400 flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" /> Last recorded: {p.lastVitals}
                    </div>
                  </div>
                )}
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
    </div>
  );
}
