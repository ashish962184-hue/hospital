import { useState, useEffect } from 'react';
import { DollarSign, FileText, Search, Plus, CreditCard } from 'lucide-react';
import { useStore } from '../store';

export default function Billing() {
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token, showToast, user } = useStore();

  useEffect(() => {
    fetch('/api/billing', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      setInvoices(data);
      setIsLoading(false);
    })
    .catch(() => {
      showToast('Failed to load invoices', 'error');
      setIsLoading(false);
    });
  }, [token, showToast]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Billing & Finance</h1>
          <p className="text-slate-500">Enterprise billing and insurance claims</p>
        </div>
        {user?.role === 'BILLING_CLERK' && (
          <button className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Create Invoice
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 border-l-4 border-l-emerald-500">
          <p className="text-sm font-medium text-slate-500">Today's Revenue</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">$12,450</h3>
        </div>
        <div className="glass-card p-6 border-l-4 border-l-amber-500">
          <p className="text-sm font-medium text-slate-500">Pending Payments</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">$4,320</h3>
        </div>
        <div className="glass-card p-6 border-l-4 border-l-blue-500">
          <p className="text-sm font-medium text-slate-500">Insurance Claims Processing</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">24</h3>
        </div>
      </div>

      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">Recent Invoices</h2>
        {isLoading ? (
          <div className="p-8 text-center text-slate-500 animate-pulse">Loading finance data...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-sm text-slate-500">
                  <th className="pb-3 font-medium">Invoice ID</th>
                  <th className="pb-3 font-medium">Patient</th>
                  <th className="pb-3 font-medium">Type</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-4 font-mono text-sm text-slate-600 dark:text-slate-300">#{inv.id.toUpperCase()}</td>
                    <td className="py-4 font-medium text-slate-900 dark:text-white">
                      {inv.patient ? `${inv.patient.firstName} ${inv.patient.lastName}` : 'Unknown'}
                    </td>
                    <td className="py-4 text-sm text-slate-600 dark:text-slate-300">{inv.type}</td>
                    <td className="py-4 font-semibold text-slate-800 dark:text-slate-200">${inv.totalAmount}</td>
                    <td className="py-4">
                      <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${
                        inv.status === 'PAID' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      {user?.role === 'BILLING_CLERK' ? (
                        <button className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5 ml-auto">
                          <CreditCard className="w-3.5 h-3.5" /> Process
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400 italic">View Only</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
