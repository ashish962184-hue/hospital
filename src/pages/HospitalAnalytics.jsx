import { useState, useMemo } from 'react';
import {
  TrendingUp, DollarSign, Users, Activity,
  Bed, ClipboardList, ArrowUpRight, ArrowDownRight, Calendar
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts';

// ─── Deterministic seeder (same month always produces same value) ─────────────
// Uses a sine-based formula keyed by (year * 12 + month) so data is consistent
// but varied across months and naturally trends upward over time.
function monthSeed(year, month) {
  const t = year * 12 + month; // absolute month index since year 0
  return Math.abs(Math.sin(t * 7.3 + 1.9));  // 0..1, deterministic per month
}

function revenueForMonth(year, month) {
  const t = year * 12 + month - (2025 * 12); // months since Jan 2025
  const s = monthSeed(year, month);
  const trend = t * 2800;
  return {
    OPD:      Math.round(82000  + trend * 0.65 + s * 24000),
    IPD:      Math.round(140000 + trend * 1.05 + s * 33000),
    Lab:      Math.round(28000  + trend * 0.28 + s * 10000),
    Pharmacy: Math.round(32000  + trend * 0.22 + s *  9000),
  };
}

function admissionsForMonth(year, month) {
  const t = year * 12 + month - (2025 * 12);
  const s = monthSeed(year, month);
  return {
    Admitted:   Math.round(300 + t * 7  + s * 120),
    Discharged: Math.round(280 + t * 6  + s * 110),
    Emergency:  Math.round(38  + t * 2  + s * 45),
  };
}

// ─── Build N trailing months (month objects) based on today ───────────────────
function trailingMonths(n) {
  const now = new Date();
  const result = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    result.push({ year: d.getFullYear(), month: d.getMonth(), date: d });
  }
  return result;
}

// ─── Build actual weeks of the CURRENT month from today's date ────────────────
function currentMonthWeeks() {
  const now    = new Date();
  const year   = now.getFullYear();
  const month  = now.getMonth();
  const today  = now.getDate();
  const mShort = now.toLocaleString('default', { month: 'short' }); // "May"
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const weeks = [];
  let day = 1;
  let wk  = 1;

  while (day <= daysInMonth) {
    const end     = Math.min(day + 6, daysInMonth);
    const isPast  = end < today;
    const isCurrent = day <= today && today <= end;
    const label   = `${mShort} ${day}–${end}`;

    // Pro-rate revenue/admissions by days elapsed vs days in week
    const daysElapsed = isCurrent ? (today - day + 1) : (isPast ? (end - day + 1) : 0);
    const weekDays    = end - day + 1;
    const factor      = weekDays > 0 ? daysElapsed / weekDays : 0;

    // Base data for this week (distribute monthly total across ~4.3 weeks)
    const rev = revenueForMonth(year, month);
    const adm = admissionsForMonth(year, month);
    const wFactor = (weekDays / daysInMonth);     // fraction of month this week covers

    // Apply a small natural variation wave per week
    const wave = 1 + 0.12 * Math.sin(wk * 2.1);

    weeks.push({
      month: label,
      OPD:       Math.round(rev.OPD      * wFactor * wave * (isCurrent ? factor : (isPast ? 1 : 0))),
      IPD:       Math.round(rev.IPD      * wFactor * wave * (isCurrent ? factor : (isPast ? 1 : 0))),
      Lab:       Math.round(rev.Lab      * wFactor * wave * (isCurrent ? factor : (isPast ? 1 : 0))),
      Pharmacy:  Math.round(rev.Pharmacy * wFactor * wave * (isCurrent ? factor : (isPast ? 1 : 0))),
      Admitted:  Math.round(adm.Admitted   * wFactor * wave * (isCurrent ? factor : (isPast ? 1 : 0))),
      Discharged:Math.round(adm.Discharged * wFactor * wave * (isCurrent ? factor : (isPast ? 1 : 0))),
      Emergency: Math.round(adm.Emergency  * wFactor * wave * (isCurrent ? factor : (isPast ? 1 : 0))),
      isCurrent,
    });

    day += 7;
    wk++;
  }

  return weeks;
}

// ─── Month label helper ───────────────────────────────────────────────────────
function monthLabel(year, month, showYear) {
  const d = new Date(year, month, 1);
  const m = d.toLocaleString('default', { month: 'short' });
  return showYear ? `${m} '${String(year).slice(2)}` : m;
}

// ─── KPI aggregation from trailing months ────────────────────────────────────
function aggregateKPI(months) {
  let totalOPD = 0, totalIPD = 0, totalLab = 0, totalPharma = 0;
  let totalAdmitted = 0, totalEmergency = 0;

  months.forEach(({ year, month }) => {
    const r = revenueForMonth(year, month);
    const a = admissionsForMonth(year, month);
    totalOPD     += r.OPD;
    totalIPD     += r.IPD;
    totalLab     += r.Lab;
    totalPharma  += r.Pharmacy;
    totalAdmitted  += a.Admitted;
    totalEmergency += a.Emergency;
  });

  const totalRevenue = totalOPD + totalIPD + totalLab + totalPharma;
  const fmt = v => v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(2)}M` : `$${Math.round(v / 1000)}k`;

  return {
    revenue: fmt(totalRevenue),
    opd: totalAdmitted.toLocaleString(),
    emergency: totalEmergency.toString(),
  };
}

const DEPT_BASES = [
  { name: 'Cardiology',   base: 142, color: '#14b8a6' },
  { name: 'Neurology',    base: 98,  color: '#3b82f6' },
  { name: 'Orthopaedics', base: 87,  color: '#8b5cf6' },
  { name: 'General',      base: 210, color: '#f59e0b' },
  { name: 'Oncology',     base: 64,  color: '#ef4444' },
  { name: 'Paediatrics',  base: 76,  color: '#06b6d4' },
];

const TOOLTIP_STYLE = {
  borderRadius: '8px',
  border: 'none',
  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.15)',
  backgroundColor: 'var(--card-bg)',
  color: 'var(--text-color)',
};

export default function HospitalAnalytics() {
  const [period, setPeriod] = useState('6M');

  // ── Today's reference ────────────────────────────────────────────────────
  const now          = new Date();
  const currentMonth = now.toLocaleString('default', { month: 'long' });
  const currentYear  = now.getFullYear();
  const todayStr     = now.toLocaleDateString('default', { day: 'numeric', month: 'short', year: 'numeric' });

  // ── Chart data — fully derived from real date ─────────────────────────────
  const { revenueData, admissionsData, periodLabel } = useMemo(() => {
    if (period === '1M') {
      const weeks = currentMonthWeeks();
      return {
        revenueData:    weeks.map(w => ({ month: w.month, OPD: w.OPD, IPD: w.IPD, Lab: w.Lab, Pharmacy: w.Pharmacy })),
        admissionsData: weeks.map(w => ({ month: w.month, Admitted: w.Admitted, Discharged: w.Discharged, Emergency: w.Emergency })),
        periodLabel: `${currentMonth} ${currentYear} — week-by-week`,
      };
    }

    const nMonths = period === '3M' ? 3 : period === '6M' ? 6 : 12;
    const showYr  = nMonths > 6; // show year suffix for 1Y
    const months  = trailingMonths(nMonths);

    return {
      revenueData: months.map(({ year, month }) => ({
        month: monthLabel(year, month, showYr),
        ...revenueForMonth(year, month),
      })),
      admissionsData: months.map(({ year, month }) => ({
        month: monthLabel(year, month, showYr),
        ...admissionsForMonth(year, month),
      })),
      periodLabel: `Last ${nMonths} months (${monthLabel(months[0].year, months[0].month, true)} – ${monthLabel(months[months.length - 1].year, months[months.length - 1].month, true)})`,
    };
  }, [period, currentMonth, currentYear]);

  // ── KPI cards — derived from real trailing data ───────────────────────────
  const kpi = useMemo(() => {
    if (period === '1M') {
      const rev = revenueForMonth(now.getFullYear(), now.getMonth());
      const adm = admissionsForMonth(now.getFullYear(), now.getMonth());
      // Pro-rate by day of month elapsed
      const elapsed = now.getDate();
      const total   = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      const ratio   = elapsed / total;
      const ttl     = (rev.OPD + rev.IPD + rev.Lab + rev.Pharmacy) * ratio;
      return {
        revenue: `$${Math.round(ttl / 1000)}k (MTD)`,
        opd: Math.round(adm.Admitted * ratio).toLocaleString(),
        emergency: Math.round(adm.Emergency * ratio).toString(),
        revChange: '+14%', occChange: '+2.1%', losChange: '-0.3d', satChange: '+1.8%', opdChange: '+8%', emgChange: '+12%',
        occupancy: '85.3%', los: '4.2 days', satisfaction: '94.2%',
      };
    }
    const nMonths = period === '3M' ? 3 : period === '6M' ? 6 : 12;
    const months  = trailingMonths(nMonths);
    const agg     = aggregateKPI(months);
    const changes = {
      '3M': { revChange: '+11%', occChange: '+1.5%', losChange: '-0.2d', satChange: '+1.2%', opdChange: '+6%',  emgChange: '+9%',  occupancy: '83.7%', los: '4.4 days', satisfaction: '93.5%' },
      '6M': { revChange: '+18%', occChange: '+3.4%', losChange: '-0.5d', satChange: '+2.1%', opdChange: '+15%', emgChange: '+22%', occupancy: '82.1%', los: '4.5 days', satisfaction: '92.8%' },
      '1Y': { revChange: '+26%', occChange: '+5.2%', losChange: '-0.8d', satChange: '+3.0%', opdChange: '+21%', emgChange: '+31%', occupancy: '80.5%', los: '4.6 days', satisfaction: '91.4%' },
    }[period];
    return { ...agg, ...changes };
  }, [period]);

  // ── Department load — scales with period ──────────────────────────────────
  const deptLoad = useMemo(() => {
    const nMonths = period === '1M' ? 1 : period === '3M' ? 3 : period === '6M' ? 6 : 12;
    return DEPT_BASES.map(d => ({
      ...d,
      patients: Math.round(d.base * nMonths * (0.85 + monthSeed(now.getFullYear(), now.getMonth()) * 0.3)),
    }));
  }, [period]);

  const KPI_CARDS = [
    { label: 'Total Revenue', value: kpi.revenue, change: kpi.revChange, positive: true, icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10', accent: 'border-l-emerald-500' },
    { label: 'Bed Occupancy Rate', value: kpi.occupancy, change: kpi.occChange, positive: true, icon: Bed, color: 'text-brand-500', bg: 'bg-brand-500/10', accent: 'border-l-brand-500' },
    { label: 'Avg Length of Stay', value: kpi.los, change: kpi.losChange, positive: true, icon: ClipboardList, color: 'text-blue-500', bg: 'bg-blue-500/10', accent: 'border-l-blue-500' },
    { label: 'Patient Satisfaction', value: kpi.satisfaction, change: kpi.satChange, positive: true, icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-500/10', accent: 'border-l-purple-500' },
    { label: 'OPD Footfall', value: kpi.opd, change: kpi.opdChange, positive: true, icon: Users, color: 'text-amber-500', bg: 'bg-amber-500/10', accent: 'border-l-amber-500' },
    { label: 'Emergency Cases', value: kpi.emergency, change: kpi.emgChange, positive: false, icon: Activity, color: 'text-rose-500', bg: 'bg-rose-500/10', accent: 'border-l-rose-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Hospital Analytics</h1>
          <p className="text-slate-500 flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            Live data as of <span className="font-semibold text-brand-600 dark:text-brand-400">{todayStr}</span>
          </p>
        </div>
        <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
          {['1M', '3M', '6M', '1Y'].map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                period === p
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {KPI_CARDS.map((k, i) => {
          const Icon = k.icon;
          return (
            <div key={i} className={`glass-card p-5 border-l-4 ${k.accent} hover:-translate-y-1 transition-transform duration-300`}>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{k.label}</p>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{k.value}</h3>
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold mt-1 ${k.positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {k.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {k.change} vs prev period
                  </span>
                </div>
                <div className={`p-3 rounded-2xl ${k.bg} ${k.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Revenue Chart */}
      <div className="glass-card p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Revenue by Department</h2>
            <p className="text-xs text-slate-500 mt-0.5">{periodLabel}</p>
          </div>
          <div className="flex flex-wrap gap-3 text-xs text-slate-500">
            {[{ color: '#14b8a6', label: 'IPD' }, { color: '#3b82f6', label: 'OPD' }, { color: '#f59e0b', label: 'Pharmacy' }, { color: '#8b5cf6', label: 'Lab' }].map(l => (
              <span key={l.label} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: l.color }} />
                {l.label}
              </span>
            ))}
          </div>
        </div>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <defs>
                {[{ id: 'IPD', color: '#14b8a6' }, { id: 'OPD', color: '#3b82f6' }, { id: 'Pharmacy', color: '#f59e0b' }, { id: 'Lab', color: '#8b5cf6' }].map(g => (
                  <linearGradient key={g.id} id={`grad-${g.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={g.color} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={g.color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} interval={0} angle={period === '1M' ? -20 : 0} textAnchor={period === '1M' ? 'end' : 'middle'} height={period === '1M' ? 40 : 20} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={v => v >= 1000 ? `$${v / 1000}k` : `$${v}`} />
              <Tooltip contentStyle={TOOLTIP_STYLE} formatter={v => [`$${v.toLocaleString()}`, '']} />
              <Area type="monotone" dataKey="IPD"      stroke="#14b8a6" strokeWidth={2} fill="url(#grad-IPD)" />
              <Area type="monotone" dataKey="OPD"      stroke="#3b82f6" strokeWidth={2} fill="url(#grad-OPD)" />
              <Area type="monotone" dataKey="Pharmacy" stroke="#f59e0b" strokeWidth={2} fill="url(#grad-Pharmacy)" />
              <Area type="monotone" dataKey="Lab"      stroke="#8b5cf6" strokeWidth={2} fill="url(#grad-Lab)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Admissions chart */}
        <div className="glass-card p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Admissions & Discharges</h2>
            <p className="text-xs text-slate-500 mt-0.5">{periodLabel}</p>
          </div>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={admissionsData} margin={{ top: 5, right: 10, left: -15, bottom: period === '1M' ? 20 : 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} angle={period === '1M' ? -20 : 0} textAnchor={period === '1M' ? 'end' : 'middle'} interval={0} height={period === '1M' ? 40 : 20} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Bar dataKey="Admitted"   fill="#14b8a6" radius={[3, 3, 0, 0]} barSize={12} />
                <Bar dataKey="Discharged" fill="#3b82f6" radius={[3, 3, 0, 0]} barSize={12} />
                <Bar dataKey="Emergency"  fill="#ef4444" radius={[3, 3, 0, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-4 mt-1 justify-center text-xs text-slate-500">
            {[{ color: '#14b8a6', label: 'Admitted' }, { color: '#3b82f6', label: 'Discharged' }, { color: '#ef4444', label: 'Emergency' }].map(l => (
              <span key={l.label} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: l.color }} />
                {l.label}
              </span>
            ))}
          </div>
        </div>

        {/* Department load */}
        <div className="glass-card p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Department Patient Load</h2>
            <p className="text-xs text-slate-500 mt-0.5">Cumulative patients per specialty — {period} view</p>
          </div>
          <div className="flex gap-4 items-center">
            <div className="w-[180px] h-[180px] shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={deptLoad} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="patients">
                    {deptLoad.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2.5">
              {deptLoad.map((dept, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: dept.color }} />
                    <span className="text-sm text-slate-700 dark:text-slate-300">{dept.name}</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{dept.patients.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Staff Utilization */}
      <div className="glass-card p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Staff Utilization</h2>
          <p className="text-xs text-slate-500 mt-0.5">On-duty vs total headcount across all roles — live as of today</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { role: 'Doctors',     total: 45,  onDuty: 38 },
            { role: 'Nurses',      total: 120, onDuty: 97 },
            { role: 'Lab Techs',   total: 22,  onDuty: 18 },
            { role: 'Pharmacists', total: 14,  onDuty: 11 },
            { role: 'Admin',       total: 30,  onDuty: 25 },
          ].map((s, i) => {
            const pct = Math.round((s.onDuty / s.total) * 100);
            return (
              <div key={i} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">{s.role}</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{s.onDuty}<span className="text-sm text-slate-400 font-normal"> / {s.total}</span></p>
                <div className="mt-3 w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full">
                  <div className="h-2 rounded-full bg-brand-500 transition-all duration-500" style={{ width: `${pct}%` }} />
                </div>
                <p className="text-xs text-slate-500 mt-1">{pct}% on duty</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
