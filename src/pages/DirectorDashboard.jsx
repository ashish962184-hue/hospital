import { useState, useEffect } from 'react';
import { 
  DollarSign, Users, Activity, Bed, 
  TrendingUp, ShieldAlert, Heart, Calendar, Clock,
  ArrowUpRight, AlertTriangle, CheckCircle, Package
} from 'lucide-react';
import { 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import StatCard from '../components/StatCard';
import { useStore } from '../store';

const DEPT_PERFORMANCE = [
  { name: 'Cardiology',   patients: 1240, revenue: 186000, efficiency: 94 },
  { name: 'Neurology',    patients: 980,  revenue: 196000, efficiency: 89 },
  { name: 'Orthopaedics', patients: 870,  revenue: 104400, efficiency: 85 },
  { name: 'General',      patients: 2100, revenue: 252000, efficiency: 91 },
  { name: 'Oncology',     patients: 640,  revenue: 160000, efficiency: 88 },
  { name: 'Paediatrics',  base: 760,   revenue: 91200,  efficiency: 92 },
];

const COLORS = ['#14b8a6', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4'];

export default function DirectorDashboard() {
  const { showToast } = useStore();
  const [stats, setStats] = useState({
    activePatients: 142,
    todayRevenue: 28400,
    emergencyResponse: '4.8 mins',
    icuUtilization: '92%',
    revenueChart: [
      { name: 'Jan', revenue: 245000 },
      { name: 'Feb', revenue: 260000 },
      { name: 'Mar', revenue: 285000 },
      { name: 'Apr', revenue: 270000 },
      { name: 'May', revenue: 310000 },
      { name: 'Jun', revenue: 340000 },
    ],
    bedsOccupied: '128 / 150',
    todaySurgeries: 8,
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Director's Executive Portal</h1>
          <p className="text-slate-500">Live operational oversight, financial indicators, and clinical pathways performance</p>
        </div>
        <button 
          onClick={() => showToast('Generating Executive Quarterly Report...', 'info')}
          className="btn-primary flex items-center gap-2"
        >
          Export Executive Briefing
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Inpatients" value={String(stats.activePatients)} icon={Users} color="text-brand-500" bg="bg-brand-500/10" accentColor="border-l-brand-500" />
        <StatCard title="Today's Revenue" value={`$${stats.todayRevenue.toLocaleString()}`} change="+12%" icon={DollarSign} color="text-emerald-500" bg="bg-emerald-500/10" accentColor="border-l-emerald-500" />
        <StatCard title="Emergency Response" value={stats.emergencyResponse} change="-0.8m" icon={Activity} color="text-rose-500" bg="bg-rose-500/10" accentColor="border-l-rose-500" />
        <StatCard title="ICU Occupancy" value={stats.icuUtilization} change="+3%" icon={Bed} color="text-amber-500" bg="bg-amber-500/10" accentColor="border-l-amber-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Performance Chart */}
        <div className="lg:col-span-2 glass-card p-6">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">Financial Growth Trend</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.revenueChart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" dark={{ stroke: '#334155' }} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', backgroundColor: 'var(--card-bg)' }} />
                <Area type="monotone" dataKey="revenue" stroke="#14b8a6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Revenue Share */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">Department Share</h2>
          <div className="h-[240px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={DEPT_PERFORMANCE}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="revenue"
                >
                  {DEPT_PERFORMANCE.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-sm text-slate-400">Total YTD</span>
              <span className="text-2xl font-bold text-slate-800 dark:text-white">$898k</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4 text-center">
            {DEPT_PERFORMANCE.slice(0, 3).map((d, i) => (
              <div key={i} className="text-xs">
                <span className="inline-block w-2.5 h-2.5 rounded-full mr-1" style={{ backgroundColor: COLORS[i] }}></span>
                <span className="text-slate-500 font-medium">{d.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Operational Performance Table */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-5">Department Efficiency & Capacity Ledger</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-sm text-slate-500 font-semibold">
                <th className="pb-3">Department</th>
                <th className="pb-3">Clinical Operations (Patients YTD)</th>
                <th className="pb-3">Revenue Contribution</th>
                <th className="pb-3">Clinical Pathway Efficiency Score</th>
                <th className="pb-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {DEPT_PERFORMANCE.map((dept, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 font-semibold text-slate-900 dark:text-white">{dept.name}</td>
                  <td className="py-4 text-slate-600 dark:text-slate-300">{dept.patients || 760} patients</td>
                  <td className="py-4 font-bold text-brand-600 dark:text-brand-400">${dept.revenue.toLocaleString()}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 max-w-[100px] h-2 bg-slate-100 dark:bg-slate-700 rounded-full">
                        <div className="h-2 bg-brand-500 rounded-full" style={{ width: `${dept.efficiency}%` }} />
                      </div>
                      <span className="text-sm font-semibold">{dept.efficiency}%</span>
                    </div>
                  </td>
                  <td className="py-4 text-right">
                    <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${
                      dept.efficiency >= 90 
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
                    }`}>
                      {dept.efficiency >= 90 ? 'OPTIMAL' : 'MONITOR'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
