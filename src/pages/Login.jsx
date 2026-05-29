import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, Lock, Mail, ArrowRight, Loader2, ChevronDown } from 'lucide-react';
import { useStore } from '../store';

// Role → home route mapping (mirrors EnterpriseLayout)
const HOME_ROUTES = {
  SUPER_ADMIN:   '/admin',
  DOCTOR:        '/doctor',
  RECEPTIONIST:  '/receptionist',
  NURSE:         '/nurse',
  LAB_TECH:      '/lab',
  PHARMACIST:    '/pharmacist',
  BILLING_CLERK: '/billing-desk',
  PATIENT:       '/patient',
};

// All demo accounts — click any to prefill
const DEMO_ACCOUNTS = [
  { label: 'Admin',        email: 'admin@nova.com',       password: 'admin',       role: 'SUPER_ADMIN',   color: 'bg-brand-500'   },
  { label: 'Doctor',       email: 'doctor@nova.com',      password: 'doctor',      role: 'DOCTOR',        color: 'bg-blue-500'    },
  { label: 'Receptionist', email: 'reception@nova.com',   password: 'reception',   role: 'RECEPTIONIST',  color: 'bg-purple-500'  },
  { label: 'Nurse',        email: 'nurse@nova.com',       password: 'nurse',       role: 'NURSE',         color: 'bg-pink-500'    },
  { label: 'Lab Tech',     email: 'lab@nova.com',         password: 'lab',         role: 'LAB_TECH',      color: 'bg-amber-500'   },
  { label: 'Pharmacist',   email: 'pharmacist@nova.com',  password: 'pharmacist',  role: 'PHARMACIST',    color: 'bg-teal-500'    },
  { label: 'Billing',      email: 'billing@nova.com',     password: 'billing',     role: 'BILLING_CLERK', color: 'bg-orange-500'  },
  { label: 'Patient',      email: 'patient@nova.com',     password: 'patient',     role: 'PATIENT',       color: 'bg-emerald-500' },
];

export default function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState('');
  const [showAll, setShowAll]     = useState(false);

  const navigate = useNavigate();
  const login    = useStore(state => state.login);

  const prefill = (acc) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setError('');
    setShowAll(false);
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

      // Redirect every role to their own dashboard
      const destination = HOME_ROUTES[data.user.role] || '/unauthorized';
      navigate(destination, { replace: true });

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // First 2 always visible; rest toggled
  const visible = showAll ? DEMO_ACCOUNTS : DEMO_ACCOUNTS.slice(0, 2);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-500/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md p-6 relative z-10">
        <div className="glass-card p-8 rounded-2xl shadow-xl shadow-brand-500/10 border border-white/50 dark:border-slate-800/50">

          {/* Logo */}
          <div className="flex flex-col items-center mb-7">
            <img src="/logo.png" alt="CarePulse Logo" className="w-16 h-16 object-contain rounded-2xl shadow-lg shadow-brand-500/20 mb-4 transform -rotate-6 hover:rotate-0 transition-transform duration-300 bg-white p-1" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome Back</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Sign in to CarePulse</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

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

          {/* Demo Accounts */}
          <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-700">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide text-center mb-3">
              Demo Accounts — click to sign in
            </p>
            <div className="grid grid-cols-4 gap-2">
              {visible.map(acc => (
                <button
                  key={acc.role}
                  type="button"
                  onClick={() => prefill(acc)}
                  title={`${acc.email} / ${acc.password}`}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 transition-all hover:scale-105 active:scale-95 ${
                    email === acc.email
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

            {/* Show more / less */}
            <button
              type="button"
              onClick={() => setShowAll(v => !v)}
              className="w-full mt-2 flex items-center justify-center gap-1 text-xs text-brand-600 dark:text-brand-400 hover:text-brand-500 font-medium py-1.5 transition-colors"
            >
              {showAll ? 'Show less' : `+${DEMO_ACCOUNTS.length - 2} more roles`}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAll ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}