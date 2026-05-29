import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, Lock, Mail, ArrowRight, Loader2, ChevronDown, User, Calendar, Phone, Home, ShieldAlert, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '../store';

const HOME_ROUTES = {
  ADMIN:         '/admin',
  DOCTOR:        '/doctor',
  PATIENT:       '/patient',
};

const DEMO_ACCOUNTS = [
  { label: 'Admin Ops',    email: 'admin@nova.com',       password: 'admin',       role: 'ADMIN',   color: 'bg-brand-500'   },
  { label: 'Doctor',       email: 'doctor@nova.com',      password: 'doctor',      role: 'DOCTOR',        color: 'bg-blue-500'    },
  { label: 'Patient',      email: 'patient@nova.com',     password: 'patient',     role: 'PATIENT',       color: 'bg-emerald-500' },
];

export default function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState('');
  const [isRegister, setIsRegister] = useState(false);

  // Demographics Registration Fields
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('1995-01-01');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [viewDate, setViewDate] = useState(new Date(1995, 0, 1)); // January 1995
  const [dobError, setDobError] = useState('');

  const monthsList = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentYear = new Date().getFullYear();
  const yearsList = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i);

  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y, m) => new Date(y, m, 1).getDay();

  const handlePrevMonth = () => {
    setViewDate(prev => {
      const prevMonth = prev.getMonth() === 0 ? 11 : prev.getMonth() - 1;
      const prevYear = prev.getMonth() === 0 ? prev.getFullYear() - 1 : prev.getFullYear();
      return new Date(prevYear, prevMonth, 1);
    });
  };

  const handleNextMonth = () => {
    setViewDate(prev => {
      const nextMonth = prev.getMonth() === 11 ? 0 : prev.getMonth() + 1;
      const nextYear = prev.getMonth() === 11 ? prev.getFullYear() + 1 : prev.getFullYear();
      return new Date(nextYear, nextMonth, 1);
    });
  };

  const handleYearChange = (year) => {
    setViewDate(prev => new Date(parseInt(year), prev.getMonth(), 1));
  };

  const handleMonthChange = (monthIdx) => {
    setViewDate(prev => new Date(prev.getFullYear(), parseInt(monthIdx), 1));
  };

  const calculateAge = (dateStr) => {
    if (!dateStr) return null;
    const birthDate = new Date(dateStr);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleSelectDate = (day) => {
    const selectedDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate > today) {
      setDobError("Date of birth cannot be in the future");
    } else {
      setDobError("");
      const offset = selectedDate.getTimezoneOffset();
      const localDate = new Date(selectedDate.getTime() - (offset * 60 * 1000));
      const formatted = localDate.toISOString().split('T')[0];
      setDob(formatted);
      setIsCalendarOpen(false);
    }
  };

  const applyPreset = (preset) => {
    const today = new Date();
    let targetDate = new Date();
    if (preset === 'today') {
      targetDate = today;
    } else if (preset === 'last_month') {
      targetDate.setMonth(today.getMonth() - 1);
    } else if (preset === 'last_year') {
      targetDate.setFullYear(today.getFullYear() - 1);
    }

    const offset = targetDate.getTimezoneOffset();
    const localDate = new Date(targetDate.getTime() - (offset * 60 * 1000));
    const formatted = localDate.toISOString().split('T')[0];

    setDob(formatted);
    setViewDate(targetDate);
    setDobError('');
    setIsCalendarOpen(false);
  };

  const [gender, setGender] = useState('Male');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [mobile, setMobile] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [address, setAddress] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [knownAllergies, setKnownAllergies] = useState('');
  const [existingConditions, setExistingConditions] = useState('');

  const navigate = useNavigate();
  const login    = useStore(state => state.login);

  const prefill = (acc) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setError('');
    setIsRegister(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      login(data.user, data.token);
      const destination = HOME_ROUTES[data.user.role] || '/unauthorized';
      navigate(destination, { replace: true });

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          dob,
          gender,
          bloodGroup,
          mobile,
          email: regEmail,
          password: regPassword,
          address,
          emergencyContact,
          knownAllergies,
          existingConditions
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      login(data.user, data.token);
      navigate('/patient', { replace: true });

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const daysInMonth = getDaysInMonth(viewDate.getFullYear(), viewDate.getMonth());
  const firstDayIndex = getFirstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth());
  const blankDays = Array(firstDayIndex).fill(null);
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const calendarCells = [...blankDays, ...monthDays];

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 relative overflow-hidden py-12 px-4">
      {/* Background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-500/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-lg relative z-10">
        <div className="glass-card p-8 rounded-2xl shadow-xl shadow-brand-500/10 border border-white/50 dark:border-slate-800/50">

          {/* Logo */}
          <div className="flex flex-col items-center mb-7">
            <img src="/logo.png" alt="CarePulse Logo" className="w-16 h-16 object-cover rounded-full shadow-lg shadow-brand-500/20 mb-4 transform -rotate-6 hover:rotate-0 transition-transform duration-300" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {isRegister ? 'Register Portal Account' : 'Welcome Back'}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              {isRegister ? 'Enter patient credentials to activate portal' : 'Sign in to CarePulse'}
            </p>
          </div>

          {error && (
            <div className="p-3 mb-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Registration Form */}
          {isRegister ? (
            <form onSubmit={handleRegister} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Full Name</label>
                  <input required type="text" value={fullName} onChange={e => setFullName(e.target.value)} className="block w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white/50 dark:bg-slate-800/50 text-sm text-slate-900 dark:text-white" placeholder="Emma Watson" />
                </div>
                <div className="col-span-2 relative">
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Date of Birth</label>
                  <button
                    type="button"
                    onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                    className="flex items-center justify-between w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white/50 dark:bg-slate-800/50 text-sm text-slate-900 dark:text-white hover:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-left cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-brand-500" />
                      {dob ? new Date(dob).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Select Date of Birth'}
                    </span>
                    <span className="text-xs bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 px-2 py-0.5 rounded-md font-bold">
                      {dob ? `${calculateAge(dob)} Years` : 'Age'}
                    </span>
                  </button>

                  {dobError && (
                    <p className="text-[11px] text-red-500 font-semibold mt-1 flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
                      {dobError}
                    </p>
                  )}

                  {/* Custom Popover Calendar */}
                  {isCalendarOpen && (
                    <div className="absolute top-[100%] left-0 right-0 z-50 mt-2 p-4 glass-card rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 max-w-sm mx-auto">
                      {/* Presets */}
                      <div className="flex gap-1.5 mb-3 justify-center">
                        <button type="button" onClick={() => applyPreset('today')} className="text-[10px] font-bold px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-300 transition-all cursor-pointer">Today</button>
                        <button type="button" onClick={() => applyPreset('last_month')} className="text-[10px] font-bold px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-300 transition-all cursor-pointer">Last Month</button>
                        <button type="button" onClick={() => applyPreset('last_year')} className="text-[10px] font-bold px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-300 transition-all cursor-pointer">Last Year</button>
                        <button type="button" onClick={() => { setViewDate(new Date(1995, 0, 1)); setDob('1995-01-01'); setDobError(''); }} className="text-[10px] font-bold px-2.5 py-1 bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/50 dark:hover:bg-brand-900/50 rounded-lg text-brand-600 dark:text-brand-400 transition-all cursor-pointer">Preset '95</button>
                      </div>

                      {/* Header controls */}
                      <div className="flex items-center justify-between mb-3 gap-1">
                        <button type="button" onClick={handlePrevMonth} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400 transition-all cursor-pointer">
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        
                        <div className="flex gap-1.5">
                          <select
                            value={viewDate.getMonth()}
                            onChange={e => handleMonthChange(e.target.value)}
                            className="text-xs font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-1 text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
                          >
                            {monthsList.map((m, idx) => (
                              <option key={idx} value={idx}>{m}</option>
                            ))}
                          </select>

                          <select
                            value={viewDate.getFullYear()}
                            onChange={e => handleYearChange(e.target.value)}
                            className="text-xs font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-1 text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer max-h-36"
                          >
                            {yearsList.map(y => (
                              <option key={y} value={y}>{y}</option>
                            ))}
                          </select>
                        </div>

                        <button type="button" onClick={handleNextMonth} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400 transition-all cursor-pointer">
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Days Grid */}
                      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 mb-1">
                        <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
                      </div>

                      <div className="grid grid-cols-7 gap-1">
                        {calendarCells.map((day, idx) => {
                          if (day === null) {
                            return <div key={`empty-${idx}`} />;
                          }
                          const isSelected = dob && new Date(dob).getDate() === day && new Date(dob).getMonth() === viewDate.getMonth() && new Date(dob).getFullYear() === viewDate.getFullYear();
                          const isToday = new Date().getDate() === day && new Date().getMonth() === viewDate.getMonth() && new Date().getFullYear() === viewDate.getFullYear();
                          return (
                            <button
                              key={`day-${day}`}
                              type="button"
                              onClick={() => handleSelectDate(day)}
                              className={`aspect-square text-xs font-bold rounded-lg transition-all flex items-center justify-center cursor-pointer ${
                                isSelected
                                  ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                                  : isToday
                                  ? 'border border-brand-500 text-brand-500 bg-brand-50/20'
                                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                              }`}
                            >
                              {day}
                            </button>
                          );
                        })}
                      </div>

                      {/* Age Preview */}
                      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[11px]">
                        <span className="text-slate-400 font-medium">Selected DOB:</span>
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          {dob ? new Date(dob).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'None'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Gender</label>
                  <select value={gender} onChange={e => setGender(e.target.value)} className="block w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white/50 dark:bg-slate-800/50 text-sm text-slate-900 dark:text-white">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Blood Group</label>
                  <select value={bloodGroup} onChange={e => setBloodGroup(e.target.value)} className="block w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white/50 dark:bg-slate-800/50 text-sm text-slate-900 dark:text-white">
                    <option value="O+">O+</option>
                    <option value="A+">A+</option>
                    <option value="B+">B+</option>
                    <option value="AB+">AB+</option>
                    <option value="O-">O-</option>
                    <option value="A-">A-</option>
                    <option value="B-">B-</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Mobile</label>
                  <input required type="tel" value={mobile} onChange={e => setMobile(e.target.value)} className="block w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white/50 dark:bg-slate-800/50 text-sm text-slate-900 dark:text-white" placeholder="+1 555-0101" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Email Address</label>
                  <input required type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)} className="block w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white/50 dark:bg-slate-800/50 text-sm text-slate-900 dark:text-white" placeholder="emma@example.com" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Password</label>
                  <input required type="password" value={regPassword} onChange={e => setRegPassword(e.target.value)} className="block w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white/50 dark:bg-slate-800/50 text-sm text-slate-900 dark:text-white" placeholder="••••••••" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Address</label>
                  <input required type="text" value={address} onChange={e => setAddress(e.target.value)} className="block w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white/50 dark:bg-slate-800/50 text-sm text-slate-900 dark:text-white" placeholder="123 Main St, NY" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Emergency Contact</label>
                  <input required type="text" value={emergencyContact} onChange={e => setEmergencyContact(e.target.value)} className="block w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white/50 dark:bg-slate-800/50 text-sm text-slate-900 dark:text-white" placeholder="+1 555-0102" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Known Allergies (Optional)</label>
                  <input type="text" value={knownAllergies} onChange={e => setKnownAllergies(e.target.value)} className="block w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white/50 dark:bg-slate-800/50 text-sm text-slate-900 dark:text-white" placeholder="e.g. Penicillin, Peanuts (leave empty if none)" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Existing Conditions (Optional)</label>
                  <input type="text" value={existingConditions} onChange={e => setExistingConditions(e.target.value)} className="block w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white/50 dark:bg-slate-800/50 text-sm text-slate-900 dark:text-white" placeholder="e.g. Hypertension, Asthma (leave empty if none)" />
                </div>
              </div>

              <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center gap-2 btn-primary py-2.5 text-sm mt-3">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Activate Patient Account'}
              </button>
            </form>
          ) : (
            /* Login Form */
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white/50 dark:bg-slate-800/50 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm transition-all text-slate-900 dark:text-white"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1.5">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                  <a href="#" className="text-xs text-brand-600 dark:text-brand-400 hover:text-brand-500 font-medium">Forgot password?</a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white/50 dark:bg-slate-800/50 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm transition-all text-slate-900 dark:text-white"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 btn-primary py-2.5 text-sm disabled:opacity-70"
              >
                {isLoading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Signing In...</>
                ) : (
                  <>Sign In <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>
          )}

          {/* Toggle Login/Registration */}
          <div className="mt-4 text-center">
            <button
              onClick={() => { setIsRegister(!isRegister); setError(''); }}
              className="text-xs text-brand-600 dark:text-brand-400 hover:underline font-semibold"
            >
              {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Register as Patient"}
            </button>
          </div>

          {/* Demo Accounts Prefills */}
          <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-700">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide text-center mb-3">
              Demo Accounts — click to prefill
            </p>
            <div className="grid grid-cols-3 gap-2">
              {DEMO_ACCOUNTS.map(acc => (
                <button
                  key={acc.role}
                  type="button"
                  onClick={() => prefill(acc)}
                  title={`${acc.email} / ${acc.password}`}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 transition-all hover:scale-105 active:scale-95 ${
                    email === acc.email && !isRegister
                      ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
                      : 'border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-lg ${acc.color} flex items-center justify-center text-white text-xs font-bold shadow-sm`}>
                    {acc.label[0]}
                  </div>
                  <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400 leading-tight text-center">{acc.label}</span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}