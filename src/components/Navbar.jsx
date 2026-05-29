import { Bell, Search, Menu, User, Moon, Sun, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store';

const getRoleNotifications = (role, email) => {
  if (role === 'DOCTOR') {
    if (email && email !== 'doctor@nova.com') {
      return [
        { id: 200, category: 'Patient Reports', title: '👋 Welcome to CarePulse 👋', desc: 'Welcome! Your clinical portal dashboard is activated. Patient records, clinical reports, and critical cases will appear here as they are logged.', time: 'Just now', unread: true }
      ];
    }
    return [
      { id: 201, category: 'New Patient Details', title: '🆕 New Patient Registered: Arthur Pendragon 🆕', desc: 'Arthur Pendragon (34 M, O-) was admitted under your service for acute pneumonia monitoring. Background clinical profile loaded.', time: '10m ago', unread: true },
      { id: 202, category: 'Patient Reports', title: '🔬 Critical Pathology Findings: Patient #8832 🔬', desc: 'Patient #8832 CBC panel completed. High leukocyte count detected (16,000/mcL) suggesting active infection indicators. Immediate action recommended.', time: '45m ago', unread: true },
      { id: 203, category: 'Critical Cases', title: '🚨 Emergency Triage: Patient ICU Bed #03 🚨', desc: 'Cardiac monitoring indicates minor telemetry fluctuations for ICU Bed #03. Nurse shift alerts and backup on-call doctor routed.', time: '1h ago', unread: false },
      { id: 204, category: 'Patient Reports', title: '🩻 Radiology Scan Ready: Jane Doe MRI 🩻', desc: 'MRI Spine scan reports for Jane Doe are ready in your workspace. High-resolution diagnostic imaging slices are fully unlocked.', time: '1d ago', unread: false }
    ];
  }
  if (role === 'PATIENT') {
    if (email && email !== 'patient@nova.com') {
      return [
        { id: 300, category: 'Patient Care', title: '👋 Welcome to CarePulse 👋', desc: 'Welcome! Your profile has been successfully registered. You can now book appointments and view your test reports or prescriptions as they are prepared by our clinical staff.', time: 'Just now', unread: true }
      ];
    }
    return [
      { id: 301, category: 'Test Reports', title: '🔬 Your CBC Pathology Results are Ready 🔬', desc: 'Complete Blood Count (CBC) analysis results uploaded. Your leukocyte and RBC values are within standard healthy bounds. Click to view PDF report.', time: '12m ago', unread: true },
      { id: 302, category: 'Appointments', title: '📅 Doctor Consultation Confirmed 📅', desc: 'Your appointment with Dr. Sarah Jenkins is confirmed for tomorrow at 10:30 AM. Token A105 and QR Card cleared.', time: '30m ago', unread: true },
      { id: 303, category: 'Patient Care', title: '💊 Daily Prescription Plan Prepared 💊', desc: 'Dr. Sarah Jenkins has issued your daily medication plan: Amoxicillin 500mg, Paracetamol 650mg. Alarms are active in your reminders list.', time: '2h ago', unread: false },
      { id: 304, category: 'Patient Care', title: '🔔 Daily Lisinopril Dosage Reminder 🔔', desc: 'Take your Lisinopril 10mg tablet with water after lunch. Keep track of daily vitals under your Health Records tab.', time: '1d ago', unread: false }
    ];
  }
  // Default ADMIN (SUPER_ADMIN or ADMIN)
  if (email && email !== 'admin@nova.com') {
    return [
      { id: 100, category: 'Systems', title: '👋 Welcome Admin 👋', desc: 'Welcome to the CarePulse Enterprise Admin Console. System operational logs, ward capacities, and database systems are ready.', time: 'Just now', unread: true }
    ];
  }
  return [
    { id: 101, category: 'Systems', title: '🖥️ Mainframe Database Optimization Complete 🖥️', desc: 'Routine backup and query logs indexation finished successfully. Mainframe systems latency minimized to sub-millisecond levels.', time: '15m ago', unread: true },
    { id: 102, category: 'Hospitals', title: '🚨 Critical Wards At 95% Occupancy 🚨', desc: 'General wards A and B are close to maximum capacity. Please coordinate admissions through the central dispatch room immediately.', time: '1h ago', unread: true },
    { id: 103, category: 'Hospitals', title: '⚡ Emergency Auxiliary Power Test Successful ⚡', desc: 'The monthly validation backup test of the backup generator suite completed successfully. Power grids are 100% stable.', time: '1d ago', unread: false },
    { id: 104, category: 'Systems', title: '🔒 SSL Firewall Certificates Upgraded 🔒', desc: 'Hospital local network firewalls and VPN servers updated with high-security SSL tokens to encrypt client data exchanges.', time: '2d ago', unread: false }
  ];
};

const getRoleCategories = (role) => {
  if (role === 'DOCTOR') {
    return ['All', 'New Patient Details', 'Patient Reports', 'Critical Cases'];
  }
  if (role === 'PATIENT') {
    return ['All', 'Test Reports', 'Appointments', 'Patient Care'];
  }
  return ['All', 'Hospitals', 'Systems'];
};

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const hasUnread = notifications.some(n => n.unread);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    setDrawerNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const handleNotificationClick = (id) => {
    // Mark as read immediately
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
    setDrawerNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
    
    // Close overlays so the details modal in the center of the screen is fully visible and not blocked
    setIsNotificationsOpen(false);
    setIsDrawerOpen(false);
    
    const found = drawerNotifications.find(n => n.id === id) || notifications.find(n => n.id === id);
    if (found) {
      setSelectedNotification({
        id: found.id,
        category: found.category || found.title,
        title: found.category ? found.title : found.desc,
        desc: found.desc,
        time: found.time,
        unread: false
      });
    }
  };
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [drawerNotifications, setDrawerNotifications] = useState([]);

  const { user, toggleMobileMenu, logout, showToast } = useStore();
  const categories = getRoleCategories(user?.role);

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

  useEffect(() => {
    if (user?.role) {
      setDrawerNotifications(getRoleNotifications(user.role, user.email));
      
      const initialBell = getRoleNotifications(user.role, user.email).slice(0, 3).map(n => ({
        id: n.id,
        title: n.category,
        time: n.time,
        desc: n.title,
        unread: n.unread
      }));
      setNotifications(initialBell);
    }
  }, [user]);

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
            className="relative p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
          >
            <Bell className="w-5 h-5" />
            {hasUnread && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></span>
            )}
          </button>
          
          {isNotificationsOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsNotificationsOpen(false)}></div>
              <div className="absolute right-0 mt-2 w-80 glass-card rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 z-50 overflow-hidden animate-fade-in">
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                  <h3 className="font-semibold text-slate-800 dark:text-slate-200">Notifications</h3>
                  {notifications.length > 0 ? (
                    <button onClick={() => setNotifications([])} className="text-xs text-brand-600 dark:text-brand-400 font-semibold cursor-pointer hover:underline bg-transparent border-none">Clear all</button>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-bold">0 Alerts</span>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((item) => (
                      <div 
                        key={item.id} 
                        onClick={() => handleNotificationClick(item.id)}
                        className={`p-4 border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-all duration-200 ${
                          item.unread ? 'bg-brand-50/20 dark:bg-brand-950/20 border-l-2 border-l-brand-500' : ''
                        }`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <div className="flex items-center gap-2">
                            {item.unread && <span className="w-1.5 h-1.5 bg-brand-500 rounded-full"></span>}
                            <p className={`text-sm ${item.unread ? 'font-semibold text-slate-900 dark:text-white' : 'font-medium text-slate-600 dark:text-slate-400'}`}>{item.title}</p>
                          </div>
                          <p className="text-xs text-slate-400">{item.time}</p>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 pl-3.5">{item.desc}</p>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center flex flex-col items-center justify-center">
                      <span className="text-emerald-500 text-3xl mb-2 font-bold">✓</span>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">You're all caught up</p>
                      <p className="text-xs text-slate-400 mt-0.5">No new notifications available.</p>
                    </div>
                  )}
                </div>
                <div className="p-3 text-center border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30">
                  <button onClick={() => { setIsNotificationsOpen(false); setIsDrawerOpen(true); }} className="text-sm text-brand-600 dark:text-brand-400 font-medium hover:underline cursor-pointer bg-transparent border-none">View All Notifications</button>
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

      {/* ── STYLISH SLIDE-OVER DRAWER: UPDATES ── */}
      {isDrawerOpen && (
        <>
          {/* Backdrop Blur Overlay */}
          <div 
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[9999] transition-opacity duration-300 animate-fade-in"
            onClick={() => setIsDrawerOpen(false)}
          />
          
          {/* Drawer Panel */}
          <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl z-[10000] flex flex-col transition-all duration-300 transform translate-x-0 border-l border-slate-200 dark:border-slate-800 animate-slide-in-right">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-lg shadow-sm">
                  <Bell className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                </div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">Notifications</h2>
              </div>
              <button 
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400 cursor-pointer transition-all border-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter controls */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Filter By Category</span>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Show Unread</span>
                  <input 
                    type="checkbox" 
                    checked={showUnreadOnly} 
                    onChange={e => setShowUnreadOnly(e.target.checked)}
                    className="rounded border-slate-300 text-brand-500 focus:ring-brand-500 cursor-pointer"
                  />
                </label>
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pr-1">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer border-none ${
                      activeCategory === cat
                        ? 'bg-brand-500 text-white shadow-sm font-bold'
                        : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Updates list */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Previous Updates</h3>
              
              {drawerNotifications.filter(item => {
                const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
                const matchesUnread = !showUnreadOnly || item.unread;
                return matchesCategory && matchesUnread;
              }).length > 0 ? (
                drawerNotifications.filter(item => {
                  const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
                  const matchesUnread = !showUnreadOnly || item.unread;
                  return matchesCategory && matchesUnread;
                }).map(item => (
                  <div 
                    key={item.id}
                    onClick={() => handleNotificationClick(item.id)}
                    className={`p-4 border border-slate-100 dark:border-slate-800/80 rounded-xl relative transition-all hover:scale-[1.01] cursor-pointer ${
                      item.unread 
                        ? 'bg-brand-50/10 dark:bg-brand-900/5 border-l-4 border-l-brand-500' 
                        : 'bg-white dark:bg-slate-900/30'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="px-2 py-0.5 text-[9px] font-extrabold bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-md uppercase tracking-wider">
                        {item.category}
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                        ⏱️ {item.time}
                      </span>
                    </div>
                    
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-1">{item.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                    
                    {item.unread && (
                      <button 
                        onClick={() => {
                          setDrawerNotifications(prev => prev.map(n => n.id === item.id ? { ...n, unread: false } : n));
                          showToast('Update marked as read', 'success');
                        }}
                        className="absolute bottom-2 right-2 text-[10px] text-brand-600 hover:underline cursor-pointer bg-transparent border-none font-semibold"
                      >
                        Dismiss
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-8 text-center flex flex-col items-center justify-center">
                  <span className="text-slate-300 dark:text-slate-700 text-4xl mb-2">📥</span>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">No updates matching filters</p>
                  <p className="text-xs text-slate-400 mt-0.5">Try widening your category search.</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* ── STYLISH DETAILS MODAL DIALOG ── */}
      {selectedNotification && (
        <>
          {/* Backdrop Blur Overlay */}
          <div 
            className="fixed inset-0 bg-slate-950/50 backdrop-blur-md z-[10001] transition-opacity duration-300 animate-fade-in"
            onClick={() => setSelectedNotification(null)}
          />
          
          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center p-4 z-[10002] animate-scale-up pointer-events-none">
            <div className="glass-card w-full max-w-md bg-white dark:bg-slate-950 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 pointer-events-auto">
              {/* Header metadata */}
              <div className="flex justify-between items-center mb-4">
                <span className="px-2.5 py-0.5 text-[9px] font-extrabold bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-md uppercase tracking-wider">
                  {selectedNotification.category || 'Notification'}
                </span>
                <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                  ⏱️ {selectedNotification.time || '1d ago'}
                </span>
              </div>

              {/* Title & Body */}
              <div className="space-y-3 mb-6">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white leading-snug">
                  {selectedNotification.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                  {selectedNotification.desc || 'No detailed description available.'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end">
                <button 
                  onClick={() => setSelectedNotification(null)}
                  className="px-4 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl text-slate-700 dark:text-slate-300 cursor-pointer transition-all border-none"
                >
                  Close
                </button>
                <button 
                  onClick={() => {
                    setDrawerNotifications(prev => prev.map(n => n.id === selectedNotification.id ? { ...n, unread: false } : n));
                    setNotifications(prev => prev.map(n => n.id === selectedNotification.id ? { ...n, unread: false } : n));
                    setSelectedNotification(null);
                    showToast('Notification cleared', 'success');
                  }}
                  className="px-4 py-2 text-xs font-bold bg-brand-500 hover:bg-brand-600 text-white rounded-xl cursor-pointer shadow-md shadow-brand-500/10 transition-all border-none animate-pulse"
                >
                  Acknowledge Alert
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
