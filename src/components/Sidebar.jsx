import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  FileText, 
  Activity, 
  Settings, 
  CreditCard,
  Bot,
  X,
  Bed
} from 'lucide-react';
import { useStore } from '../store';

import { Pill } from 'lucide-react';

const getNavItems = (role) => {
  const common = [
    { name: 'AI Assistant', path: '/ai-assistant', icon: Bot },
  ];

  switch (role) {
    case 'SUPER_ADMIN':
      return [
        { name: 'Dashboard',          path: '/admin',     icon: LayoutDashboard },
        { name: 'Hospital Analytics', path: '/analytics', icon: Activity },
        ...common,
      ];

    case 'RECEPTIONIST':
      return [
        { name: 'Dashboard',    path: '/receptionist',  icon: LayoutDashboard },
        { name: 'Appointments', path: '/appointments',  icon: Calendar },
        { name: 'Patients',     path: '/admin/patients',icon: Users },
        ...common,
      ];

    case 'NURSE':
      return [
        { name: 'Dashboard',    path: '/nurse',          icon: LayoutDashboard },
        { name: 'IPD Wards',    path: '/ipd',            icon: Bed },
        { name: 'Patients',     path: '/admin/patients', icon: Users },
        ...common,
      ];

    case 'DOCTOR':
      return [
        { name: 'Dashboard',       path: '/doctor',                icon: LayoutDashboard },
        { name: 'Appointments',    path: '/doctor/appointments',   icon: Calendar },
        { name: 'Patients',        path: '/doctor/patients',       icon: Users },
        { name: 'Prescriptions',   path: '/doctor/prescriptions',  icon: FileText },
        { name: 'Lab Reports',     path: '/reports',               icon: Activity },
        { name: 'Inpatient (IPD)', path: '/ipd',                   icon: Bed },
        ...common,
      ];

    case 'LAB_TECH':
      return [
        { name: 'Dashboard',   path: '/lab',     icon: LayoutDashboard },
        { name: 'All Reports', path: '/reports', icon: Activity },
        ...common,
      ];

    case 'PHARMACIST':
      return [
        { name: 'Dashboard', path: '/pharmacist', icon: LayoutDashboard },
        { name: 'Pharmacy',  path: '/pharmacy',   icon: Pill },
        ...common,
      ];

    case 'BILLING_CLERK':
      return [
        { name: 'Dashboard',       path: '/billing-desk', icon: LayoutDashboard },
        { name: 'Billing & Finance',path: '/billing',     icon: CreditCard },
      ];

    case 'PATIENT':
      return [
        { name: 'My Dashboard',    path: '/patient',              icon: LayoutDashboard },
        { name: 'My Appointments', path: '/patient/appointments', icon: Calendar },
        { name: 'My Lab Results',  path: '/patient/results',      icon: Activity },
        ...common,
      ];

    default:
      return [];
  }
};


export default function Sidebar({ userRole }) {
  const isMobileMenuOpen = useStore((state) => state.isMobileMenuOpen);
  const closeMobileMenu = useStore((state) => state.closeMobileMenu);

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar Content */}
      <div className={`
        fixed inset-y-0 left-0 z-50 md:static md:flex flex-col w-64 glass-panel h-full shadow-lg transition-transform duration-300
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Mobile Close Button */}
        <button 
          onClick={closeMobileMenu}
          className="md:hidden absolute top-4 right-4 p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-brand-500/40">
            H
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight text-slate-900 dark:text-white">NovaHealth</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Management System</p>
          </div>
        </div>
        
        <div className="px-4 py-2 flex-1 overflow-y-auto">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-2">Menu</p>
          <nav className="space-y-1">
            {getNavItems(userRole).map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => {
                    if (window.innerWidth < 768) {
                      closeMobileMenu();
                    }
                  }}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group active:scale-95 ${
                      isActive 
                        ? 'bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400 font-medium' 
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="p-4 mt-auto">
          <NavLink
            to="/settings"
            className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200 transition-colors active:scale-95"
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </NavLink>
        </div>
      </div>
    </>
  );
}
