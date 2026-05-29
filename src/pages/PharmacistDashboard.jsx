import { useState, useEffect } from 'react';
import { Pill, AlertTriangle, ShoppingCart, ClipboardList, Search, CheckCircle, Clock, Package } from 'lucide-react';
import StatCard from '../components/StatCard';
import { useStore } from '../store';

export default function PharmacistDashboard() {
  const { showToast, token } = useStore();
  const [search, setSearch] = useState('');
  const [prescriptions, setPrescriptions] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = () => {
    fetch('/api/pharmacy/prescriptions', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setPrescriptions(data))
      .catch(() => {});

    fetch('/api/pharmacy/inventory', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        setInventory(data);
        setIsLoading(false);
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadData();
  }, [token]);

  const dispense = (id) => {
    fetch(`/api/pharmacy/dispense/${id}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(() => {
        showToast('Prescription dispensed successfully and inventory decremented!', 'success');
        loadData();
      })
      .catch(() => showToast('Failed to dispense prescription', 'error'));
  };

  const filteredInventory = inventory.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));
  const lowStock = inventory.filter(m => m.stock < 100).length;
  const pending = prescriptions.filter(rx => rx.status === 'PENDING').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Pharmacy Dashboard</h1>
        <p className="text-slate-500">Prescriptions queue, medicine inventory, and stock alerts</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Pending Prescriptions" value={String(pending)} icon={ClipboardList} color="text-amber-500" bg="bg-amber-500/10" accentColor="border-l-amber-500" />
        <StatCard title="Dispensed Today" value="18" change="+4" icon={CheckCircle} color="text-emerald-500" bg="bg-emerald-500/10" accentColor="border-l-emerald-500" />
        <StatCard title="Low Stock Alerts" value={String(lowStock)} icon={AlertTriangle} color="text-rose-500" bg="bg-rose-500/10" accentColor="border-l-rose-500" />
        <StatCard title="Total SKUs" value={String(inventory.length)} icon={Package} color="text-brand-500" bg="bg-brand-500/10" accentColor="border-l-brand-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Prescriptions Queue */}
        <div className="lg:col-span-3 glass-card p-6">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-5 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-brand-500" /> Prescriptions Queue
          </h2>
          <div className="space-y-4">
            {prescriptions.map(rx => (
              <div key={rx.id} className={`p-4 rounded-xl border transition-colors ${
                rx.status === 'PENDING'
                  ? 'border-amber-200 dark:border-amber-800/50 bg-amber-50/50 dark:bg-amber-900/10'
                  : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20'
              }`}>
                <div className="flex justify-between items-start gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-brand-600 dark:text-brand-400 font-bold">{rx.id}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        rx.status === 'PENDING'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
                      }`}>{rx.status}</span>
                    </div>
                    <p className="font-semibold text-slate-900 dark:text-white mt-1">{rx.patient}</p>
                    <p className="text-xs text-slate-500">{rx.doctor} · {rx.time}</p>
                  </div>
                  {rx.status === 'PENDING' && (
                    <button onClick={() => dispense(rx.id)} className="btn-primary py-1.5 px-3 text-xs shrink-0 flex items-center gap-1.5">
                      <ShoppingCart className="w-3.5 h-3.5" /> Dispense
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {rx.medicines.map((med, i) => (
                    <span key={i} className="inline-flex items-center gap-1 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-lg">
                      <Pill className="w-3 h-3 text-brand-500" />{med}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inventory */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Inventory</h2>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 w-28"
              />
            </div>
          </div>
          <div className="space-y-3">
            {filteredInventory.map((item, i) => {
              const isLow = item.stock < 100;
              return (
                <div key={i} className="p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-sm font-semibold text-slate-800 dark:text-white leading-tight">{item.name}</p>
                    {isLow && <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 animate-bounce" />}
                  </div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className={`text-xs font-semibold ${isLow ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                      {item.stock} Units
                    </span>
                    <span className="text-xs text-slate-400">Exp: {item.expiryDate || '2027-12-01'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
