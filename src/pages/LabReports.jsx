import { useState, useEffect } from 'react';
import { Microscope, Download, Search, FileText } from 'lucide-react';
import { useStore } from '../store';

export default function LabReports() {
  const [labs, setLabs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token, showToast, user } = useStore();

  useEffect(() => {
    fetch('/api/labs', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      setLabs(data);
      setIsLoading(false);
    })
    .catch(() => {
      showToast('Failed to load lab requests', 'error');
      setIsLoading(false);
    });
  }, [token, showToast]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Laboratory & Diagnostics</h1>
        <p className="text-slate-500">Manage patient test results and pathology</p>
      </div>

      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
          <Microscope className="w-5 h-5 text-brand-500" /> Lab Requests Queue
        </h2>
        
        {isLoading ? (
          <div className="p-8 text-center text-slate-500 animate-pulse">Loading diagnostic data...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-sm text-slate-500">
                  <th className="pb-3 font-medium">Test ID</th>
                  <th className="pb-3 font-medium">Patient</th>
                  <th className="pb-3 font-medium">Test Name</th>
                  <th className="pb-3 font-medium">Category</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium text-right">Results</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {labs.map((lab) => (
                  <tr key={lab.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-4 font-mono text-xs text-slate-500">#{lab.id.toUpperCase()}</td>
                    <td className="py-4 font-medium text-slate-900 dark:text-white">
                      {lab.patient ? `${lab.patient.firstName} ${lab.patient.lastName}` : 'Unknown'}
                    </td>
                    <td className="py-4 text-slate-800 dark:text-slate-200">{lab.testName}</td>
                    <td className="py-4 text-sm text-slate-600 dark:text-slate-400">{lab.category}</td>
                    <td className="py-4">
                      <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${
                        lab.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
                      }`}>
                        {lab.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      {lab.status === 'COMPLETED' ? (
                        <button onClick={() => showToast('Downloading PDF Report...', 'success')} className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5 ml-auto">
                          <Download className="w-3.5 h-3.5" /> PDF
                        </button>
                      ) : (
                        user?.role === 'LAB_TECH' ? (
                          <button onClick={() => showToast('Opening results editor...', 'info')} className="btn-primary py-1.5 px-3 text-xs ml-auto">
                            Upload Result
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400 italic">Awaiting Lab Tech</span>
                        )
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
