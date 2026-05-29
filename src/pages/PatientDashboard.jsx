import { Calendar, Activity, FileText, Pill, Clock } from 'lucide-react';

export default function PatientDashboard() {
  return (
    <div className="space-y-6 relative">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Health Dashboard</h1>
        <p className="text-slate-500">Welcome back, Emma Watson.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Next Appointment', value: 'Oct 24, 10:00 AM', desc: 'Dr. Sarah Jenkins', icon: Calendar, color: 'text-brand-500', bg: 'bg-brand-500/10' },
          { title: 'Recent Lab Result', value: 'Normal', desc: 'Complete Blood Count', icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { title: 'Active Prescriptions', value: '2 Medications', desc: 'Last refilled Oct 10', icon: Pill, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { title: 'Pending Bills', value: '$0.00', desc: 'All clear', icon: FileText, color: 'text-purple-500', bg: 'bg-purple-500/10' },
        ].map((card, idx) => (
          <div key={idx} className="glass-card p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${card.bg} ${card.color}`}>
                <card.icon className="w-6 h-6" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">{card.title}</p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{card.value}</h3>
              <p className="text-sm text-slate-400 mt-2">{card.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Upcoming Schedule</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="flex flex-col items-center justify-center w-14 h-14 bg-brand-50 dark:bg-brand-900/20 rounded-lg text-brand-600 dark:text-brand-400">
                <span className="text-xs font-semibold uppercase">Oct</span>
                <span className="text-lg font-bold">24</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-slate-800 dark:text-white">General Checkup</h4>
                <p className="text-sm text-slate-500">Dr. Sarah Jenkins • Cardiology Dept</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Clock className="w-4 h-4" />
                <span>10:00 AM</span>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">Health Vitals</h2>
          <div className="space-y-4">
            {[
              { label: 'Blood Pressure', value: '118/78 mmHg', status: 'Normal' },
              { label: 'Heart Rate', value: '72 bpm', status: 'Normal' },
              { label: 'Weight', value: '64 kg', status: 'Stable' },
            ].map((vital, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                <div>
                  <p className="text-xs text-slate-500">{vital.label}</p>
                  <p className="font-semibold text-slate-800 dark:text-white">{vital.value}</p>
                </div>
                <span className="text-xs font-medium px-2 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full">
                  {vital.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
