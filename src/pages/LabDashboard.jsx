import { useState } from 'react';
import { Microscope, Upload, Search, CheckCircle, Clock, AlertTriangle, FileText, X } from 'lucide-react';
import StatCard from '../components/StatCard';
import { useStore } from '../store';

const PENDING_TESTS = [
  { id: 'LAB-2001', patient: 'Ravi Kumar',    age: 62, doctor: 'Dr. Sarah Jenkins', tests: ['CBC', 'LFT', 'Cardiac Enzymes'], priority: 'URGENT',  ordered: '08:30 AM', sample: 'Blood'  },
  { id: 'LAB-2002', patient: 'Priya Sharma',  age: 34, doctor: 'Dr. Michael Chen',  tests: ['Urine Culture'],                  priority: 'ROUTINE', ordered: '09:00 AM', sample: 'Urine'  },
  { id: 'LAB-2003', patient: 'David Wilson',   age: 55, doctor: 'Dr. Ravi Mehta',    tests: ['MRI Brain', 'CSF Analysis'],      priority: 'URGENT',  ordered: '09:15 AM', sample: 'CSF'    },
  { id: 'LAB-2004', patient: 'Fatima Sheikh',  age: 34, doctor: 'Dr. Sarah Jenkins', tests: ['BNP', 'ECG Trace'],               priority: 'STAT',    ordered: '09:45 AM', sample: 'Blood'  },
  { id: 'LAB-2005', patient: 'Anand Mehta',    age: 58, doctor: 'Dr. Michael Chen',  tests: ['HbA1c', 'Lipid Profile'],         priority: 'ROUTINE', ordered: '10:00 AM', sample: 'Blood'  },
];

const COMPLETED = [
  { id: 'LAB-1998', patient: 'Sunita Rao',   tests: ['CBC', 'ESR'],     completedAt: '08:10 AM', status: 'NORMAL'   },
  { id: 'LAB-1999', patient: 'Amit Patel',   tests: ['Troponin I'],     completedAt: '08:45 AM', status: 'ABNORMAL' },
  { id: 'LAB-2000', patient: 'Nisha Kapoor', tests: ['Thyroid Panel'],  completedAt: '09:20 AM', status: 'NORMAL'   },
];

const PRIORITY_STYLE = {
  STAT:    'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400',
  URGENT:  'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
  ROUTINE: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',
};

export default function LabDashboard() {
  const { showToast } = useStore();
  const [tests, setTests] = useState(PENDING_TESTS);
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(null);
  const [form, setForm] = useState({ result: '', notes: '' });

  const filtered = tests.filter(t =>
    t.patient.toLowerCase().includes(search.toLowerCase()) ||
    t.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleUpload = (e) => {
    e.preventDefault();
    setTests(prev => prev.filter(t => t.id !== uploading.id));
    showToast(`Report uploaded for ${uploading.patient}`, 'success');
    setUploading(null);
    setForm({ result: '', notes: '' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Laboratory Dashboard</h1>
        <p className="text-slate-500">Pending test requests, sample tracking & report upload</p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Pending Tests" value={String(tests.length)}       icon={Clock}        color="text-amber-500"   bg="bg-amber-500/10"   accentColor="border-l-amber-500"   />
        <StatCard title="STAT / Urgent"  value={String(tests.filter(t => t.priority !== 'ROUTINE').length)} icon={AlertTriangle} color="text-rose-500" bg="bg-rose-500/10" accentColor="border-l-rose-500" />
        <StatCard title="Completed Today" value={String(COMPLETED.length)} icon={CheckCircle}  color="text-emerald-500" bg="bg-emerald-500/10" accentColor="border-l-emerald-500" />
        <StatCard title="Abnormal Results" value="1"                       icon={FileText}     color="text-brand-500"   bg="bg-brand-500/10"   accentColor="border-l-brand-500"   />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Queue */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
              <Microscope className="w-5 h-5 text-brand-500" /> Pending Test Queue
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

          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <CheckCircle className="w-12 h-12 mx-auto mb-3 text-emerald-400" />
              <p className="font-semibold">All tests cleared!</p>
            </div>
          )}

          <div className="space-y-3">
            {filtered.map(t => (
              <div key={t.id} className={`p-4 rounded-xl border ${
                t.priority === 'STAT' ? 'border-rose-200 dark:border-rose-800/50 bg-rose-50/30 dark:bg-rose-900/10' :
                t.priority === 'URGENT' ? 'border-amber-200 dark:border-amber-800/50 bg-amber-50/30 dark:bg-amber-900/10' :
                'border-slate-100 dark:border-slate-800'
              }`}>
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-mono text-xs text-brand-600 dark:text-brand-400 font-bold">{t.id}</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${PRIORITY_STYLE[t.priority]}`}>{t.priority}</span>
                    </div>
                    <p className="font-semibold text-slate-900 dark:text-white">{t.patient} <span className="text-slate-400 font-normal text-sm">· {t.age}y</span></p>
                    <p className="text-xs text-slate-500 mt-0.5">{t.doctor} · {t.sample} sample · {t.ordered}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {t.tests.map((test, i) => (
                        <span key={i} className="text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-md">
                          {test}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => setUploading(t)}
                    className="btn-primary py-1.5 px-3 text-xs shrink-0 flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" /> Upload Report
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Completed Today */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-5">Completed Today</h2>
          <div className="space-y-3">
            {COMPLETED.map((r, i) => (
              <div key={i} className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-xs text-brand-600 dark:text-brand-400 font-bold">{r.id}</span>
                    <p className="text-sm font-semibold text-slate-800 dark:text-white mt-0.5">{r.patient}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{r.tests.join(', ')}</p>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />{r.completedAt}
                    </p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full shrink-0 ${
                    r.status === 'NORMAL'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
                      : 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400'
                  }`}>
                    {r.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upload Report Modal */}
      {uploading && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Upload Lab Report</h2>
                <p className="text-xs text-slate-500 mt-0.5">{uploading.patient} · {uploading.id}</p>
              </div>
              <button onClick={() => setUploading(null)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUpload} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Tests Completed</label>
                <div className="flex flex-wrap gap-1.5">
                  {uploading.tests.map((t, i) => (
                    <span key={i} className="text-xs bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400 border border-brand-200 dark:border-brand-800 px-2 py-0.5 rounded-md">{t}</span>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Result Summary</label>
                <select required value={form.result} onChange={e => setForm({...form, result: e.target.value})} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
                  <option value="">Select result status</option>
                  <option value="NORMAL">Normal</option>
                  <option value="ABNORMAL">Abnormal</option>
                  <option value="CRITICAL">Critical — Notify Doctor</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Clinical Notes</label>
                <textarea required value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows={3} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" placeholder="Enter findings or observations..." />
              </div>
              <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-4 text-center hover:border-brand-400 transition-colors cursor-pointer">
                <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                <p className="text-xs text-slate-500">Attach PDF / Image report <span className="text-brand-500">(optional)</span></p>
              </div>
              <button type="submit" className="btn-primary w-full">Submit Report</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
