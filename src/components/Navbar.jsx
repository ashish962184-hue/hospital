import { Bell, Search, Menu, User, Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, toggleMobileMenu, logout } = useStore();

  useEffect(() => {
    // Add a slight shadow when scrolling
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);

    // Check initial dark mode state
    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  };

  return (
    <header className={`h-16 px-4 md:px-8 flex items-center justify-between z-20 transition-all duration-300 ${
      isScrolled ? 'glass-card mx-4 mt-4 mb-2' : 'bg-transparent'
    }`}>
      
      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center">
        <button 
          onClick={toggleMobileMenu}
          className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="hidden md:flex flex-1 max-w-md relative group">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
        <input 
          type="text" 
          placeholder="Search patients, doctors, or reports..." 
          className="w-full pl-10 pr-4 py-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400"
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 md:gap-4 ml-auto">
        <button 
          onClick={toggleDarkMode}
          className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          title="Toggle Dark Mode"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <div className="relative">
          <button 
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900"></span>
          </button>
          
          {isNotificationsOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsNotificationsOpen(false)}></div>
              <div className="absolute right-0 mt-2 w-80 glass-card rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 z-50 overflow-hidden animate-fade-in">
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <h3 className="font-semibold text-slate-800 dark:text-slate-200">Notifications</h3>
                  <span className="text-xs text-brand-600 dark:text-brand-400 font-medium cursor-pointer">Mark all as read</span>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {[
                    { title: 'New Lab Report', time: '5m ago', desc: 'Patient #4532 CBC results available' },
                    { title: 'Appointment Alert', time: '1h ago', desc: 'Dr. Smith has 3 patients waiting' },
                    { title: 'Low Inventory', time: '2h ago', desc: 'Amoxicillin stock is below 10%' }
                  ].map((item, i) => (
                    <div key={i} className="p-4 border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors">
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{item.title}</p>
                        <p className="text-xs text-slate-400">{item.time}</p>
                      </div>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </div>
                  ))}
                </div>
                <div className="p-3 text-center border-t border-slate-100 dark:border-slate-800">
                  <button className="text-sm text-brand-600 dark:text-brand-400 font-medium hover:underline">View All Notifications</button>
                </div>
              </div>
            </>
          )}
        </div>
        
        <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden md:block"></div>
        
        <div className="relative">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 p-1 pr-3 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/50 text-brand-600 dark:text-brand-400 flex items-center justify-center border border-brand-200 dark:border-brand-800">
              <User className="w-4 h-4" />
            </div>
            <div className="hidden md:block text-sm text-left">
              <p className="font-semibold text-slate-800 dark:text-slate-200 leading-none">{user?.name || 'Super Admin'}</p>
              <p className="text-xs text-slate-500 mt-1">{user?.role === 'SUPER_ADMIN' ? 'Admin' : user?.role || 'Staff'}</p>
            </div>
          </button>
          
          {isProfileOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
              <div className="absolute right-0 mt-2 w-56 glass-card rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 z-50 overflow-hidden animate-fade-in py-1">
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{user?.name || 'Super Admin'}</p>
                  <p className="text-xs text-slate-500 truncate">{user?.email || 'admin@nova.com'}</p>
                </div>
                <div className="py-1">
                  <Link 
                    to="/settings" 
                    className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    My Profile
                  </Link>
                  <Link 
                    to="/settings" 
                    className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Settings
                  </Link>
                </div>
                <div className="py-1 border-t border-slate-100 dark:border-slate-800">
                  <button 
                    onClick={() => {
                      setIsProfileOpen(false);
                      logout();
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
