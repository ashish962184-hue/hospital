import { useState } from 'react';
import {
  CreditCard, DollarSign, Clock, CheckCircle,
  AlertCircle, Search, FileText, X, TrendingUp, User
} from 'lucide-react';
import StatCard from '../components/StatCard';
import { useStore } from '../store';

const PENDING_BILLS = [
  { id: 'INV-3001', patient: 'Ravi Kumar',    type: 'IPD',  services: ['Room (3 days)', 'ICU Charges', 'Lab: CBC, LFT', 'Medication'], amount: 48500, insurance: true,  status: 'PENDING',    due: 'Today'      },
  { id: 'INV-3002', patient: 'Priya Sharma',  type: 'OPD',  services: ['Consultation', 'Lab: Urine Culture'],                          amount: 2800,  insurance: false, status: 'PENDING',    due: 'Today'      },
  { id: 'INV-3003', patient: 'Emma Watson',   type: 'OPD',  services: ['Consultation', 'X-Ray Chest'],                                  amount: 3200,  insurance: true,  status: 'PROCESSING', due: 'Tomorrow'   },
  { id: 'INV-3004', patient: 'David Wilson',  type: 'IPD',  services: ['Room (7 days)', 'MRI Brain', 'Surgeon Fees'],                   amount: 95000, insurance: true,  status: 'PENDING',    due: '31 May'     },
  { id: 'INV-3005', patient: 'Anand Mehta',   type: 'OPD',  services: ['Consultation', 'HbA1c', 'Lipid Profile'],                       amount: 1850,  insurance: false, status: 'PENDING',    due: 'Today'      },
];

const RECENT_PAYMENTS = [
  { id: 'INV-2998', patient: 'Sunita Rao',   amount: 12500, method: 'Insurance', paidAt: '09:15 AM' },
  { id: 'INV-2999', patient: 'Amit Patel',   amount: 3600,  method: 'UPI',       paidAt: '09:45 AM' },
  { id: 'INV-3000', patient: 'Nisha Kapoor', amount: 5800,  method: 'Card',      paidAt: '10:20 AM' },
];

const fmt = v => `₹${v.toLocaleString('en-IN')}`;

export default function BillingDashboard() {
  const { showToast } = useStore();
  const [bills, setBills]       = useState(PENDING_BILLS);
  const [search, setSearch]     = useState('');
  const [paying, setPaying]     = useState(null);
  const [method, setMethod]     = useState('');

  const filtered = bills.filter(b =>
    b.patient.toLowerCase().includes(search.toLowerCase()) ||
    b.id.toLowerCase().includes(search.toLowerCase())
  );

  const totalPending  = bills.reduce((s, b) => s + b.amount, 0);
  const totalCollected = RECENT_PAYMENTS.reduce((s, p) => s + p.amount, 0);

  const handlePay = (e) => {
    e.preventDefault();
    setBills(prev => prev.filter(b => b.id !== paying.id));
    showToast(`${fmt(paying.amount)} collected from ${paying.patient} via ${method}`, 'success');
    setPaying(null);
    setMethod('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Billing Dashboard</h1>
        <p className="text-slate-500">Invoice management, payment collection & financial overview</p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Pending Invoices"   value={String(bills.length)}  icon={FileText}     color="text-amber-500"   bg="bg-amber-500/10"   accentColor="border-l-amber-500"   />
        <StatCard title="Pending Amount"     value={`₹${(totalPending/1000).toFixed(0)}k`}  icon={AlertCircle} color="text-rose-500" bg="bg-rose-500/10" accentColor="border-l-rose-500" />
        <StatCard title="Collected Today"    value={`₹${(totalCollected/1000).toFixed(1)}k`} icon={CheckCircle} color="text-emerald-500" bg="bg-emerald-500/10" accentColor="border-l-emerald-500" />
        <StatCard title="Insurance Claims"   value={String(bills.filter(b => b.insurance).length)} icon={CreditCard} color="text-brand-500" bg="bg-brand-500/10" accentColor="border-l-brand-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Invoices */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-500" /> Pending Invoices
            </h2>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-4 py-1.5 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="space-y-3">
            {filtered.map(bill => (
              <div key={bill.id} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-mono text-xs text-brand-600 dark:text-brand-400 font-bold">{bill.id}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        bill.type === 'IPD'
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400'
                      }`}>{bill.type}</span>
                      {bill.insurance && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 font-medium">Insurance</span>
                      )}
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        bill.status === 'PROCESSING'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                      }`}>{bill.status}</span>
                    </div>
                    <p className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />{bill.patient}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {bill.services.map((s, i) => (
                        <span key={i} className="text-xs text-slate-500 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-1.5 py-0.5 rounded">{s}</span>
                      ))}
                    </div>
                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-1.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Due: {bill.due}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-lg font-bold text-slate-900 dark:text-white">{fmt(bill.amount)}</p>
                    <button
                      onClick={() => setPaying(bill)}
                      className="btn-primary py-1.5 px-3 text-xs mt-2"
                    >
                      Collect Payment
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-12 text-slate-400">
                <CheckCircle className="w-12 h-12 mx-auto mb-3 text-emerald-400" />
                <p className="font-semibold">All invoices cleared!</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Payments */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-5 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-500" /> Payments Today
          </h2>
          <div className="space-y-3 mb-6">
            {RECENT_PAYMENTS.map((p, i) => (
              <div key={i} className="p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-white text-sm">{p.patient}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{p.id} · {p.method}</p>
                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" />{p.paidAt}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{fmt(p.amount)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Collected</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">{fmt(totalCollected)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Pending</span>
              <span className="font-semibold text-rose-600 dark:text-rose-400">{fmt(totalPending)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {paying && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Collect Payment</h2>
                <p className="text-xs text-slate-500 mt-0.5">{paying.patient} · {paying.id}</p>
              </div>
              <button onClick={() => setPaying(null)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handlePay} className="p-6 space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                <p className="text-xs text-slate-500 mb-1">Total Amount Due</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{fmt(paying.amount)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Payment Method</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Cash', 'Card', 'UPI', 'Insurance'].map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMethod(m)}
                      className={`py-2.5 rounded-xl text-sm font-medium border transition-all ${
                        method === m
                          ? 'bg-brand-500 text-white border-brand-500'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-brand-400'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              <button type="submit" disabled={!method} className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed">
                <CheckCircle className="w-4 h-4" /> Confirm Payment
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
