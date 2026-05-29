import { useState } from 'react';
import { 
  Users, Activity, DollarSign, TrendingUp, 
  ArrowUpRight, ArrowDownRight, UserPlus, X, Search, Filter, Download
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import { useStore } from '../store';

const ALL_ACTIVITIES = [
  { id: 1, text: 'Dr. Smith completed 5 appointments', time: '10 mins ago', type: 'appointment', details: 'General Checkup, Follow-up' },
  { id: 2, text: 'New patient registered: Emma Watson', time: '25 mins ago', type: 'patient', details: 'Added by Receptionist Sarah' },
  { id: 3, text: 'Lab report uploaded for Patient #4532', time: '1 hour ago', type: 'lab', details: 'Complete Blood Count (CBC)' },
  { id: 4, text: 'Invoice #INV-2049 paid successfully', time: '2 hours ago', type: 'billing', details: 'Amount: $150 via Credit Card' },
  { id: 5, text: 'Dr. Patel updated prescription for Patient #3021', time: '3 hours ago', type: 'appointment', details: 'Added antibiotics' },
  { id: 6, text: 'New appointment scheduled: John Doe', time: '4 hours ago', type: 'appointment', details: 'Cardiology Dept - Tomorrow 10 AM' },
  { id: 7, text: 'System backup completed successfully', time: '5 hours ago', type: 'system', details: 'Automated daily backup' },
  { id: 8, text: 'Inventory low: Amoxicillin 500mg', time: '6 hours ago', type: 'alert', details: 'Only 5 boxes remaining in pharmacy' },
];

export default function AdminDashboard() {
  const showToast = useStore(state => state.showToast);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [stats, setStats] = useState({
    totalPatients: 12450,
    activeDoctors: 45,
    todayAppointments: 184,
    monthlyRevenue: 245000,
    patientChart: [
      { name: 'Jan', inPatient: 400, outPatient: 2400 },
      { name: 'Feb', inPatient: 300, outPatient: 1398 },
      { name: 'Mar', inPatient: 200, outPatient: 9800 },
      { name: 'Apr', inPatient: 278, outPatient: 3908 },
      { name: 'May', inPatient: 189, outPatient: 4800 },
      { name: 'Jun', inPatient: 239, outPatient: 3800 },
    ],
    recentActivity: ALL_ACTIVITIES.slice(0, 4)
  });

  const cards = [
    { title: 'Total Patients', value: '12,450', change: '+12%', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'Today Appointments', value: '184', change: '+5%', icon: Activity, color: 'text-brand-500', bg: 'bg-brand-500/10' },
    { title: 'Bed Occupancy', value: '85%', change: '+2%', icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { title: 'Active Doctors', value: '45', change: '0%', icon: UserPlus, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ];

  const filteredActivities = ALL_ACTIVITIES.filter(activity => 
    activity.text.toLowerCase().includes(searchTerm.toLowerCase()) || 
    activity.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 relative">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-slate-500">Overview of hospital performance</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => {
          const Icon = card.icon;
          const isPositive = card.change.startsWith('+');
          return (
            <div key={i} className="glass-card p-6 flex flex-col hover:-translate-y-1 transition-transform duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${card.bg} ${card.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className={`flex items-center text-xs font-semibold px-2 py-1 rounded-full ${
                  isPositive ? 'text-emerald-700 bg-emerald-100 dark:bg-emerald-500/20 dark:text-emerald-400' : 'text-slate-700 bg-slate-100'
                }`}>
                  {isPositive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <TrendingUp className="w-3 h-3 mr-1" />}
                  {card.change}
                </span>
              </div>
              <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">{card.title}</h3>
              <p className="text-3xl font-bold text-slate-800 dark:text-white mt-1">{card.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Overview Chart */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Patient Overview</h2>
            <select className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm rounded-lg px-3 py-1.5 focus:outline-none">
              <option>Last 6 Months</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.patientChart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" dark={{ stroke: '#334155' }} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: 'var(--card-bg)' }}
                  cursor={{fill: 'transparent'}}
                />
                <Bar dataKey="outPatient" name="Outpatient" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="inPatient" name="Inpatient" fill="#14b8a6" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-card p-6 flex flex-col h-full">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">Recent Activity</h2>
          <div className="space-y-6 flex-1">
            {stats.recentActivity.map((activity, i) => (
              <div key={activity.id} className="flex gap-4 relative">
                {i !== stats.recentActivity.length - 1 && (
                  <div className="absolute left-[11px] top-8 bottom-[-24px] w-0.5 bg-slate-200 dark:bg-slate-700"></div>
                )}
                <div className={`w-6 h-6 rounded-full flex-shrink-0 border-4 border-white dark:border-slate-800 z-10 ${
                  activity.type === 'patient' ? 'bg-blue-500' :
                  activity.type === 'appointment' ? 'bg-brand-500' :
                  activity.type === 'billing' ? 'bg-emerald-500' : 'bg-purple-500'
                }`}></div>
                <div className="-mt-1.5">
                  <p className="text-sm text-slate-800 dark:text-slate-200 font-medium leading-tight">{activity.text}</p>
                  <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={() => setIsActivityModalOpen(true)}
            className="w-full mt-8 btn-secondary py-2 text-sm font-semibold"
          >
            View All Activity
          </button>
        </div>
      </div>

      {/* Activity Log Modal */}
      {isActivityModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden animate-slide-up flex flex-col max-h-[85vh]">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Activity className="w-6 h-6 text-brand-500" /> System Activity Logs
                </h2>
                <p className="text-sm text-slate-500 mt-1">Comprehensive audit trail of all hospital operations</p>
              </div>
              <button 
                onClick={() => setIsActivityModalOpen(false)} 
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Actions */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search activities..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div className="flex gap-2">
                <button className="btn-secondary py-2 px-3 text-sm flex items-center gap-2">
                  <Filter className="w-4 h-4" /> Filter
                </button>
                <button onClick={() => showToast('Exporting activity logs as CSV...', 'info')} className="btn-secondary py-2 px-3 text-sm flex items-center gap-2">
                  <Download className="w-4 h-4" /> Export
                </button>
              </div>
            </div>

            {/* Scrollable Timeline */}
            <div className="p-6 overflow-y-auto flex-1">
              {filteredActivities.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <Activity className="w-12 h-12 mx-auto text-slate-300 mb-3 opacity-50" />
                  <p>No activities found matching your search.</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {filteredActivities.map((activity, i) => (
                    <div key={activity.id} className="flex gap-4 relative group">
                      {i !== filteredActivities.length - 1 && (
                        <div className="absolute left-[15px] top-10 bottom-[-32px] w-0.5 bg-slate-200 dark:bg-slate-700"></div>
                      )}
                      
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-4 border-white dark:border-slate-900 shadow-sm z-10 ${
                        activity.type === 'patient' ? 'bg-blue-100 text-blue-500 dark:bg-blue-500/20' :
                        activity.type === 'appointment' ? 'bg-brand-100 text-brand-500 dark:bg-brand-500/20' :
                        activity.type === 'billing' ? 'bg-emerald-100 text-emerald-500 dark:bg-emerald-500/20' :
                        activity.type === 'system' ? 'bg-slate-100 text-slate-500 dark:bg-slate-500/20' :
                        activity.type === 'alert' ? 'bg-rose-100 text-rose-500 dark:bg-rose-500/20' :
                        'bg-purple-100 text-purple-500 dark:bg-purple-500/20'
                      }`}>
                        <div className={`w-2.5 h-2.5 rounded-full ${
                          activity.type === 'patient' ? 'bg-blue-500' :
                          activity.type === 'appointment' ? 'bg-brand-500' :
                          activity.type === 'billing' ? 'bg-emerald-500' :
                          activity.type === 'system' ? 'bg-slate-500' :
                          activity.type === 'alert' ? 'bg-rose-500' :
                          'bg-purple-500'
                        }`}></div>
                      </div>
                      
                      <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 p-4 rounded-xl flex-1 group-hover:shadow-md transition-shadow">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 mb-1">
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{activity.text}</p>
                          <span className="text-xs font-medium text-slate-400 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-full border border-slate-100 dark:border-slate-700 self-start">
                            {activity.time}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{activity.details}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}