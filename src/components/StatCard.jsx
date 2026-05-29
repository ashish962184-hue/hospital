import { ArrowUpRight, TrendingUp } from 'lucide-react';

/**
 * Reusable KPI stat card used across every role dashboard.
 * Accepts: title, value, change (string e.g "+12%"), icon component,
 *          color (tailwind text class), bg (tailwind bg class),
 *          accentColor (optional left-border colour like 'border-l-brand-500')
 */
export default function StatCard({ title, value, change, icon: Icon, color, bg, accentColor }) {
  const isPositive = change && change.startsWith('+');

  if (accentColor) {
    // Compact card style with left accent border (used by Doctor / Nurse etc.)
    return (
      <div className={`glass-card p-6 border-l-4 ${accentColor} hover:-translate-y-1 transition-transform duration-300`}>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{value}</h3>
            {change && (
              <p className={`text-xs font-semibold mt-1 ${isPositive ? 'text-emerald-600' : 'text-slate-400'}`}>
                {change} vs last period
              </p>
            )}
          </div>
          {Icon && (
            <div className={`p-3 rounded-full ${bg} ${color}`}>
              <Icon className="w-6 h-6" />
            </div>
          )}
        </div>
      </div>
    );
  }

  // Full icon-top card style (used by Admin etc.)
  return (
    <div className="glass-card p-6 flex flex-col hover:-translate-y-1 transition-transform duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${bg} ${color}`}>
          {Icon && <Icon className="w-6 h-6" />}
        </div>
        {change && (
          <span className={`flex items-center text-xs font-semibold px-2 py-1 rounded-full ${
            isPositive
              ? 'text-emerald-700 bg-emerald-100 dark:bg-emerald-500/20 dark:text-emerald-400'
              : 'text-slate-700 bg-slate-100 dark:bg-slate-700 dark:text-slate-300'
          }`}>
            {isPositive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <TrendingUp className="w-3 h-3 mr-1" />}
            {change}
          </span>
        )}
      </div>
      <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">{title}</h3>
      <p className="text-3xl font-bold text-slate-800 dark:text-white mt-1">{value}</p>
    </div>
  );
}
