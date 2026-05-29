import { useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useStore } from '../store';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Toast from '../components/Toast';

export default function EnterpriseLayout({ allowedRoles }) {
  const { user, isAuthenticated, initAuth } = useStore();
  const location = useLocation();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If roles are specified, check if user has permission
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    const homeRoutes = {
      SUPER_ADMIN: '/admin',
      DOCTOR: '/doctor',
      RECEPTIONIST: '/receptionist',
      NURSE: '/nurse',
      LAB_TECH: '/lab',
      PHARMACIST: '/pharmacist',
      BILLING_CLERK: '/billing-desk',
      PATIENT: '/patient',
    };
    const home = homeRoutes[user.role] || '/unauthorized';
    return <Navigate to={home} replace />;
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      <Sidebar userRole={user?.role} />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Navbar user={user} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 dark:bg-slate-900 p-4 md:p-6 transition-colors duration-200 relative">
          <Outlet />
        </main>
      </div>
      <Toast />
    </div>
  );
}
