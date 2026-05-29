import { useState, useEffect } from 'react';
import { Pill, AlertTriangle, Plus, Search } from 'lucide-react';
import { useStore } from '../store';

export default function Pharmacy() {
  const [inventory, setInventory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token, showToast } = useStore();

  useEffect(() => {
    fetch('/api/pharmacy/inventory', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      setInventory(data);
      setIsLoading(false);
    })
    .catch(() => {
      showToast('Failed to load pharmacy inventory', 'error');
      setIsLoading(false);
    });
  }, [token, showToast]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Pharmacy Inventory</h1>
          <p className="text-slate-500">Manage medicines, batches, and stock</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Stock
        </button>
      </div>

      <div className="glass-card p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search medicines..." 
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-slate-500 animate-pulse">Loading inventory...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-sm text-slate-500">
                  <th className="pb-3 font-medium">Medicine Name</th>
                  <th className="pb-3 font-medium">Batch No.</th>
                  <th className="pb-3 font-medium">Stock Level</th>
                  <th className="pb-3 font-medium">Expiry Date</th>
                  <th className="pb-3 font-medium">Unit Price</th>
                  <th className="pb-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {inventory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-4">
                      <div className="flex items-center gap-2 font-medium text-slate-900 dark:text-white">
                        <Pill className="w-4 h-4 text-brand-500" /> {item.name}
                      </div>
                    </td>
                    <td className="py-4 font-mono text-sm text-slate-600 dark:text-slate-400">{item.batchNo}</td>
                    <td className="py-4">
                      <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${
                        item.stock > 100 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400'
                      }`}>
                        {item.stock} Units {item.stock <= 100 && <AlertTriangle className="w-3 h-3 inline ml-1" />}
                      </span>
                    </td>
                    <td className="py-4 text-sm text-slate-600 dark:text-slate-300">{item.expiryDate}</td>
                    <td className="py-4 font-semibold text-slate-800 dark:text-slate-200">${item.price.toFixed(2)}</td>
                    <td className="py-4 text-right">
                      <button className="btn-secondary py-1.5 px-3 text-xs">Update</button>
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
