import { useState } from 'react';
import { useStore } from '../store';
import { User, Lock, Globe, Bell, Calendar, ShieldAlert } from 'lucide-react';

export default function Settings() {
  const { user, showToast } = useStore();
  const [activeSubTab, setActiveSubTab] = useState('profile');
  
  // Profile settings
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '+1 555-0199');
  
  // Password settings
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Notification states
  const [emailNotify, setEmailNotify] = useState(true);
  const [smsNotify, setSmsNotify] = useState(false);
  const [pushNotify, setPushNotify] = useState(true);
  
  // Doctor states
  const [doctorSlot, setDoctorSlot] = useState('10:00 AM - 11:00 AM');
  
  // Admin System states
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    showToast('Profile settings saved successfully!', 'success');
  };

  const handleSavePassword = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match!', 'error');
      return;
    }
    showToast('Password updated successfully!', 'success');
  };

  return (
    <div className="glass-card p-6 max-w-4xl mx-auto my-6">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Account & Platform Settings</h1>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Settings Navigation */}
        <div className="w-full md:w-1/4 flex flex-col gap-1 border-r border-slate-100 dark:border-slate-800 pr-4">
          <button
            onClick={() => setActiveSubTab('profile')}
            className={`flex items-center gap-2.5 px-3 py-2 text-sm font-semibold rounded-xl text-left transition-all ${
              activeSubTab === 'profile'
                ? 'bg-brand-500 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <User className="w-4 h-4" />
            Profile Settings
          </button>
          
          <button
            onClick={() => setActiveSubTab('password')}
            className={`flex items-center gap-2.5 px-3 py-2 text-sm font-semibold rounded-xl text-left transition-all ${
              activeSubTab === 'password'
                ? 'bg-brand-500 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <Lock className="w-4 h-4" />
            Security & Credentials
          </button>
          
          <button
            onClick={() => setActiveSubTab('notifications')}
            className={`flex items-center gap-2.5 px-3 py-2 text-sm font-semibold rounded-xl text-left transition-all ${
              activeSubTab === 'notifications'
                ? 'bg-brand-500 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <Bell className="w-4 h-4" />
            Alert Preferences
          </button>

          {user?.role === 'DOCTOR' && (
            <button
              onClick={() => setActiveSubTab('doctor')}
              className={`flex items-center gap-2.5 px-3 py-2 text-sm font-semibold rounded-xl text-left transition-all ${
                activeSubTab === 'doctor'
                  ? 'bg-brand-500 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <Calendar className="w-4 h-4" />
              Slot Availability
            </button>
          )}

          {user?.role === 'ADMIN' && (
            <button
              onClick={() => setActiveSubTab('admin')}
              className={`flex items-center gap-2.5 px-3 py-2 text-sm font-semibold rounded-xl text-left transition-all ${
                activeSubTab === 'admin'
                  ? 'bg-brand-500 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              System Config
            </button>
          )}
        </div>

        {/* Settings Content Area */}
        <div className="flex-1">
          {activeSubTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white border-b pb-2 mb-4">Edit Profile Demographics</h2>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Full Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="block w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white/50 dark:bg-slate-800/50 text-sm text-slate-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Email Address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="block w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white/50 dark:bg-slate-800/50 text-sm text-slate-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Mobile Phone</label>
                <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className="block w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white/50 dark:bg-slate-800/50 text-sm text-slate-900 dark:text-white" />
              </div>
              <button type="submit" className="btn-primary px-4 py-2 text-xs font-bold rounded-xl mt-2">Save Profile</button>
            </form>
          )}

          {activeSubTab === 'password' && (
            <form onSubmit={handleSavePassword} className="space-y-4">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white border-b pb-2 mb-4">Change Password</h2>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Current Password</label>
                <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="block w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white/50 dark:bg-slate-800/50 text-sm text-slate-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">New Password</label>
                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="block w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white/50 dark:bg-slate-800/50 text-sm text-slate-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Confirm New Password</label>
                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="block w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white/50 dark:bg-slate-800/50 text-sm text-slate-900 dark:text-white" />
              </div>
              <button type="submit" className="btn-primary px-4 py-2 text-xs font-bold rounded-xl mt-2">Change Password</button>
            </form>
          )}

          {activeSubTab === 'notifications' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white border-b pb-2 mb-4">Notification Alerts</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={emailNotify} onChange={e => setEmailNotify(e.target.checked)} className="rounded border-slate-300 text-brand-500 focus:ring-brand-500" />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email Alerts (Appointments & Prescriptions)</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={smsNotify} onChange={e => setSmsNotify(e.target.checked)} className="rounded border-slate-300 text-brand-500 focus:ring-brand-500" />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">SMS Reminders (Immediate Check-in Notices)</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={pushNotify} onChange={e => setPushNotify(e.target.checked)} className="rounded border-slate-300 text-brand-500 focus:ring-brand-500" />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Push App Alerts (AI Medical & Lab Updates)</span>
                </label>
              </div>
            </div>
          )}

          {activeSubTab === 'doctor' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white border-b pb-2 mb-4">Doctor Availability Slots</h2>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Standard Daily Time Slots</label>
                <select value={doctorSlot} onChange={e => setDoctorSlot(e.target.value)} className="block w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white/50 dark:bg-slate-800/50 text-sm text-slate-900 dark:text-white">
                  <option value="09:00 AM - 10:00 AM">09:00 AM - 10:00 AM</option>
                  <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                  <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</option>
                  <option value="02:00 PM - 03:00 PM">02:00 PM - 03:00 PM</option>
                  <option value="03:00 PM - 04:00 PM">03:00 PM - 04:00 PM</option>
                </select>
              </div>
              <button onClick={() => showToast('Slots updated successfully!', 'success')} className="btn-primary px-4 py-2 text-xs font-bold rounded-xl mt-2 cursor-pointer">Save Slots</button>
            </div>
          )}

          {activeSubTab === 'admin' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white border-b pb-2 mb-4">Hospital System Operations</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={maintenanceMode} onChange={e => setMaintenanceMode(e.target.checked)} className="rounded border-slate-300 text-brand-500 focus:ring-brand-500" />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 font-bold text-rose-500">Enable Platform Maintenance Mode</span>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
