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
  Bed,
  Pill,
  Clock,
  QrCode,
  Shield,
  Bell,
  Heart,
  FolderOpen
} from 'lucide-react';
import { useStore } from '../store';

const getNavItems = (role) => {
  const common = [
    { name: 'Medical AI Support', path: '/ai-assistant', icon: Bot },
  ];

  if (role === 'ADMIN' || role === 'SUPER_ADMIN' || role === 'HOSPITAL_DIRECTOR') {
    return [
      { name: 'Operations Suite',    path: '/admin',          icon: LayoutDashboard },
      { name: 'Hospital Analytics',  path: '/analytics',      icon: Activity },
      { name: 'Patient Management',  path: '/admin/patients', icon: Users },
      { name: 'Appointment Queue',   path: '/appointments',   icon: Calendar },
      { name: 'Inpatient Wards',     path: '/ipd',            icon: Bed },
      { name: 'Laboratory Suite',    path: '/lab',            icon: Activity },
      { name: 'Pharmacy Suite',      path: '/pharmacy',       icon: Pill },
      { name: 'Radiology Suite',     path: '/radiology',      icon: FolderOpen },
      { name: 'Executive Portal',    path: '/director',       icon: Heart },
      { name: 'Command Center',      path: '/command-center', icon: Shield },
      ...common,
    ];
  }

  if (role === 'DOCTOR') {
    return [
      { name: 'My Dashboard',       path: '/doctor',                icon: LayoutDashboard },
      { name: 'My Appointments',    path: '/doctor/appointments',   icon: Calendar },
      { name: 'Assigned Patients',  path: '/doctor/patients',       icon: Users },
      { name: 'Digital Scripts',    path: '/doctor/prescriptions',  icon: FileText },
      { name: 'Clinical Reports',   path: '/reports',               icon: Activity },
      { name: 'Inpatient (IPD)',    path: '/ipd',                   icon: Bed },
      ...common,
    ];
  }

  if (role === 'PATIENT') {
    return [
      { name: 'Portal Dashboard',    path: '/patient',              icon: LayoutDashboard },
      { name: 'Book Appointments',   path: '/patient/appointments', icon: Calendar },
      { name: 'Health Records',      path: '/patient/records',      icon: Heart },
      { name: 'Lab Reports',         path: '/patient/results',      icon: Activity },
      { name: 'My Prescriptions',    path: '/patient/prescriptions',icon: Pill },
      { name: 'Bills & Payments',    path: '/patient/billing',      icon: CreditCard },
      { name: 'Reminders',           path: '/patient/reminders',    icon: Bell },
      { name: 'Queue Status',        path: '/patient/queue',        icon: Clock },
      { name: 'My QR Card',          path: '/patient/qr',           icon: QrCode },
      { name: 'AI Symptom Checker',  path: '/patient/symptom-checker', icon: Bot },
      { name: 'My Insurance',        path: '/patient/insurance',    icon: Shield },
      { name: 'My Documents',        path: '/patient/documents',    icon: FolderOpen },
      { name: 'Profile Settings',    path: '/patient/settings',     icon: Settings },
    ];
  }

  return [];
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
          <img src="/logo.png" alt="CarePulse Logo" className="w-10 h-10 object-cover rounded-full shadow-lg shadow-brand-500/20" />
          <div>
            <h1 className="font-bold text-lg leading-tight text-slate-900 dark:text-white">CarePulse</h1>
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
                  end
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
