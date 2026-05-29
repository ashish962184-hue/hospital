import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Toast from '../components/Toast';

export default function DashboardLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-[url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat before:content-[''] before:absolute before:inset-0 before:bg-slate-50/90 dark:before:bg-slate-900/90 before:backdrop-blur-sm before:-z-10 relative z-0">
      
      <Sidebar />

      <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
        <Navbar />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
      
      {/* Global Interactive Feedback */}
      <Toast />
    </div>
  );
}