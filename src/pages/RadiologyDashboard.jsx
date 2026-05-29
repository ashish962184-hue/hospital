import { useState, useEffect } from 'react';
import { Microscope, Upload, Search, CheckCircle, Clock, AlertTriangle, FileText, X } from 'lucide-react';
import StatCard from '../components/StatCard';
import { useStore } from '../store';

const PENDING_SCANS = [
  { id: 'RAD-3001', patient: 'Emma Watson', age: 34, doctor: 'Dr. Sarah Jenkins', scanType: 'MRI Brain', priority: 'URGENT', ordered: '09:00 AM', status: 'PENDING' },
  { id: 'RAD-3002', patient: 'John Doe', age: 45, doctor: 'Dr. Michael Chen', scanType: 'CT Abdomen', priority: 'STAT', ordered: '09:30 AM', status: 'PENDING' },
  { id: 'RAD-3003', patient: 'Anand Mehta', age: 58, doctor: 'Dr. Sarah Jenkins', scanType: 'X-Ray Chest', priority: 'ROUTINE', ordered: '10:00 AM', status: 'PENDING' },
];

const COMPLETED_SCANS = [
  { id: 'RAD-2999', patient: 'Amit Patel', scanType: 'Ultrasound Pelvis', completedAt: '08:45 AM', status: 'NORMAL' },
  { id: 'RAD-3000', patient: 'Nisha Kapoor', scanType: 'MRI Knee', completedAt: '09:20 AM', status: 'ABNORMAL' },
];

const PRIORITY_STYLE = {
  STAT:    'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400',
  URGENT:  'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
  ROUTINE: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',
};

export default function RadiologyDashboard() {
  const { showToast } = useStore();
  const [scans, setScans] = useState(PENDING_SCANS);
  const [completed, setCompleted] = useState(COMPLETED_SCANS);
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(null);
  const [form, setForm] = useState({ result: '', notes: '' });

  const filtered = scans.filter(s =>
    s.patient.toLowerCase().includes(search.toLowerCase()) ||
    s.scanType.toLowerCase().includes(search.toLowerCase())
  );

  const handleUpload = (e) => {
    e.preventDefault();
    setScans(prev => prev.filter(s => s.id !== uploading.id));
    setCompleted([{ id: uploading.id, patient: uploading.patient, scanType: uploading.scanType, completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), status: form.result }, ...completed]);
    showToast(`Radiology scan uploaded and verified for ${uploading.patient}`, 'success');
    setUploading(null);
    setForm({ result: '', notes: '' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Radiology Imaging Board</h1>
        <p className="text-slate-500">MRI, CT Scan, X-Ray and Ultrasound active schedules & scan analysis</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Pending Scans" value={String(scans.length)} icon={Clock} color="text-amber-500" bg="bg-amber-500/10" accentColor="border-l-amber-500" />
        <StatCard title="STAT Orders" value={String(scans.filter(s => s.priority === 'STAT').length)} icon={AlertTriangle} color="text-rose-500" bg="bg-rose-500/10" accentColor="border-l-rose-500" />
        <StatCard title="Completed Today" value={String(completed.length)} icon={CheckCircle} color="text-emerald-500" bg="bg-emerald-500/10" accentColor="border-l-emerald-500" />
        <StatCard title="Scan Health Index" value="98%" icon={FileText} color="text-brand-500" bg="bg-brand-500/10" accentColor="border-l-brand-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scans Queue */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
              <Microscope className="w-5 h-5 text-brand-500 animate-spin" /> Live Imaging Worklist
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

          <div className="space-y-3">
            {filtered.map(s => (
              <div key={s.id} className={`p-4 rounded-xl border ${
                s.priority === 'STAT' ? 'border-rose-200 dark:border-rose-800/50 bg-rose-50/30 dark:bg-rose-900/10' :
                s.priority === 'URGENT' ? 'border-amber-200 dark:border-amber-800/50 bg-amber-50/30 dark:bg-amber-900/10' :
                'border-slate-100 dark:border-slate-800'
              }`}>
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs text-brand-600 dark:text-brand-400 font-bold">{s.id}</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${PRIORITY_STYLE[s.priority]}`}>{s.priority}</span>
                    </div>
                    <p className="font-semibold text-slate-900 dark:text-white">{s.patient} <span className="text-slate-400 font-normal text-sm">· {s.age}y</span></p>
                    <p className="text-xs text-slate-500 mt-0.5">{s.doctor} • {s.scanType} • Ordered {s.ordered}</p>
                  </div>
                  <button
                    onClick={() => setUploading(s)}
                    className="btn-primary py-1.5 px-3 text-xs shrink-0 flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" /> Upload Scan
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Completed list */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-5">Completed Scan Log</h2>
          <div className="space-y-3">
            {completed.map((r, i) => (
              <div key={i} className="p-3 border border-slate-100 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-xs text-brand-600 dark:text-brand-400 font-bold">{r.id}</span>
                    <p className="text-sm font-semibold text-slate-800 dark:text-white mt-0.5">{r.patient}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{r.scanType}</p>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />{r.completedAt}
                    </p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    r.status === 'NORMAL' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20' : 'bg-rose-100 text-rose-700 dark:bg-rose-500/20'
                  }`}>{r.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upload scan modal */}
      {uploading && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
            <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Upload Diagnostic Scan</h2>
                <p className="text-xs text-slate-500 mt-0.5">{uploading.patient} • {uploading.scanType}</p>
              </div>
              <button onClick={() => setUploading(null)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUpload} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Scan Findings</label>
                <select required value={form.result} onChange={e => setForm({...form, result: e.target.value})} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
                  <option value="">Select diagnostic conclusion</option>
                  <option value="NORMAL">Normal Findings</option>
                  <option value="ABNORMAL">Abnormal Findings — Report Sent</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Radiologist Analysis Notes</label>
                <textarea required value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows={3} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" placeholder="Enter scan interpretation details..." />
              </div>
              <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-4 text-center hover:border-brand-400 transition-colors cursor-pointer">
                <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                <p className="text-xs text-slate-500">Attach DICOM / Imaging scan files <span className="text-brand-500">(required)</span></p>
              </div>
              <button type="submit" className="btn-primary w-full">Verify & Release Scan</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
