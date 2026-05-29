import { useState, useEffect } from 'react';
import { Activity, Thermometer, Droplet, Clock, Search } from 'lucide-react';
import { useStore } from '../store';

export default function NursingDashboard() {
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token, showToast } = useStore();

  useEffect(() => {
    // Simulate fetching IPD patients
    setTimeout(() => {
      setPatients([
        { id: 'IPD-001', name: 'John Doe', ward: 'ICU-A', bed: '01', status: 'CRITICAL', vitals: { bp: '120/80', hr: 85, temp: 99.2 } },
        { id: 'IPD-002', name: 'Emma Watson', ward: 'Gen-B', bed: '12', status: 'STABLE', vitals: { bp: '110/75', hr: 72, temp: 98.6 } },
        { id: 'IPD-003', name: 'Michael Brown', ward: 'Recovery', bed: '05', status: 'STABLE', vitals: { bp: '130/85', hr: 78, temp: 98.8 } },
      ]);
      setIsLoading(false);
    }, 500);
  }, [token]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Nursing & IPD Management</h1>
        <p className="text-slate-500">Ward allocation, vitals tracking, and daily monitoring</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 border-l-4 border-l-rose-500">
          <p className="text-sm font-medium text-slate-500">Critical Patients (ICU)</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">4</h3>
        </div>
        <div className="glass-card p-6 border-l-4 border-l-blue-500">
          <p className="text-sm font-medium text-slate-500">Occupied Beds</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">128 / 150</h3>
        </div>
        <div className="glass-card p-6 border-l-4 border-l-emerald-500">
          <p className="text-sm font-medium text-slate-500">Pending Medications</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">12</h3>
        </div>
      </div>

      <div className="glass-card p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Inpatient Monitoring (IPD)</h2>
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search ward or patient..." 
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-slate-500 animate-pulse">Loading IPD records...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-sm text-slate-500">
                  <th className="pb-3 font-medium">Patient ID</th>
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Ward / Bed</th>
                  <th className="pb-3 font-medium">Vitals (BP | HR | Temp)</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {patients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-4 font-mono text-sm text-slate-500">{patient.id}</td>
                    <td className="py-4 font-medium text-slate-900 dark:text-white">{patient.name}</td>
                    <td className="py-4 text-sm text-slate-600 dark:text-slate-300">
                      <span className="font-semibold">{patient.ward}</span> - Bed {patient.bed}
                    </td>
                    <td className="py-4">
                      <div className="flex gap-3 text-xs text-slate-600 dark:text-slate-400">
                        <span className="flex items-center gap-1"><Droplet className="w-3 h-3 text-rose-500"/> {patient.vitals.bp}</span>
                        <span className="flex items-center gap-1"><Activity className="w-3 h-3 text-brand-500"/> {patient.vitals.hr} bpm</span>
                        <span className="flex items-center gap-1"><Thermometer className="w-3 h-3 text-amber-500"/> {patient.vitals.temp}°F</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${
                        patient.status === 'CRITICAL' ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
                      }`}>
                        {patient.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <button onClick={() => showToast('Updating patient vitals...', 'info')} className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5 ml-auto">
                        <Clock className="w-3.5 h-3.5" /> Log Vitals
                      </button>
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
