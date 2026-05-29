import { useState, useEffect } from 'react';
import { Microscope, Upload, Search, CheckCircle, Clock, AlertTriangle, FileText, X } from 'lucide-react';
import StatCard from '../components/StatCard';
import { useStore } from '../store';

const PRIORITY_STYLE = {
  STAT:    'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400',
  URGENT:  'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
  ROUTINE: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',
};

export default function LabDashboard() {
  const { showToast, token } = useStore();
  const [labs, setLabs] = useState([]);
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(null);
  const [form, setForm] = useState({ result: 'NORMAL', notes: '' });
  const [isLoading, setIsLoading] = useState(true);

  const loadLabs = () => {
    fetch('/api/labs', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        setLabs(data);
        setIsLoading(false);
      })
      .catch(() => {
        showToast('Failed to load laboratory queue', 'error');
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadLabs();
  }, [token]);

  const handleUpload = (e) => {
    e.preventDefault();
    if (!uploading) return;

    fetch(`/api/labs/${uploading.id}/complete`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        results: form.result,
        notes: form.notes
      })
    })
      .then(res => res.json())
      .then(() => {
        showToast(`Report uploaded and verified for ${uploading.patient ? `${uploading.patient.firstName} ${uploading.patient.lastName}` : 'Jane Roe'}`, 'success');
        setUploading(null);
        setForm({ result: 'NORMAL', notes: '' });
        loadLabs();
      })
      .catch(() => showToast('Failed to upload report', 'error'));
  };

  const pendingList = labs.filter(l => l.status === 'PENDING');
  const completedList = labs.filter(l => l.status === 'COMPLETED');

  const filtered = pendingList.filter(l => {
    const pName = l.patient ? `${l.patient.firstName} ${l.patient.lastName}`.toLowerCase() : '';
    return pName.includes(search.toLowerCase()) || l.id.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Laboratory Dashboard</h1>
        <p className="text-slate-500">Pending test requests, sample tracking & report upload</p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Pending Tests" value={String(pendingList.length)} icon={Clock} color="text-amber-500" bg="bg-amber-500/10" accentColor="border-l-amber-500" />
        <StatCard title="STAT / Urgent" value={String(pendingList.filter(l => l.priority === 'STAT' || l.priority === 'URGENT').length)} icon={AlertTriangle} color="text-rose-500" bg="bg-rose-500/10" accentColor="border-l-rose-500" />
        <StatCard title="Completed Today" value={String(completedList.length)} icon={CheckCircle} color="text-emerald-500" bg="bg-emerald-500/10" accentColor="border-l-emerald-500" />
        <StatCard title="Total Lab Log" value={String(labs.length)} icon={FileText} color="text-brand-500" bg="bg-brand-500/10" accentColor="border-l-brand-500" />
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

          {isLoading ? (
            <div className="p-8 text-center text-slate-500 animate-pulse">Loading worklist...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-400 bg-slate-50/50 dark:bg-slate-800/10 rounded-xl">
              <CheckCircle className="w-12 h-12 mx-auto mb-3 text-emerald-400" />
              <p className="font-semibold">All lab tests cleared!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map(l => (
                <div key={l.id} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-mono text-xs text-brand-600 dark:text-brand-400 font-bold">{l.id}</span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-500/20">PENDING</span>
                      </div>
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {l.patient ? `${l.patient.firstName} ${l.patient.lastName}` : 'Unknown Patient'}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">Test: <span className="font-bold text-brand-600">{l.testName}</span> • Category: {l.category}</p>
                    </div>
                    <button
                      onClick={() => setUploading(l)}
                      className="btn-primary py-1.5 px-3 text-xs shrink-0 flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" /> Upload Report
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Completed Today */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-5">Completed Logs</h2>
          <div className="space-y-3">
            {completedList.map((r, i) => (
              <div key={i} className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-xs text-brand-600 dark:text-brand-400 font-bold">{r.id}</span>
                    <p className="text-sm font-semibold text-slate-800 dark:text-white mt-0.5">
                      {r.patient ? `${r.patient.firstName} ${r.patient.lastName}` : 'Unknown Patient'}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">{r.testName}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full shrink-0 ${
                    r.results === 'Normal' || r.results === 'NORMAL'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
                      : 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400'
                  }`}>{r.results}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upload Report Modal */}
      {uploading && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
            <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Upload Lab Report</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {uploading.patient ? `${uploading.patient.firstName} ${uploading.patient.lastName}` : 'Jane Roe'} • {uploading.id}
                </p>
              </div>
              <button onClick={() => setUploading(null)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUpload} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Test Ordered</label>
                <div className="text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-lg font-bold text-brand-600">
                  {uploading.testName}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Result Summary</label>
                <select required value={form.result} onChange={e => setForm({...form, result: e.target.value})} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
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
                <p className="text-xs text-slate-500">Attach PDF / Image report <span className="text-brand-500">(required)</span></p>
              </div>
              <button type="submit" className="btn-primary w-full">Verify & Release Report</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
