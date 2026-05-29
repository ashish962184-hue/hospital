import { useStore } from '../store';
import { CheckCircle, Info, XCircle, X } from 'lucide-react';

export default function Toast() {
  const toast = useStore((state) => state.toast);
  const hideToast = useStore((state) => state.hideToast);

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border backdrop-blur-md ${
        toast.type === 'success' ? 'bg-emerald-50/90 dark:bg-emerald-900/40 border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-200' :
        toast.type === 'info' ? 'bg-blue-50/90 dark:bg-blue-900/40 border-blue-200 dark:border-blue-500/30 text-blue-800 dark:text-blue-200' :
        'bg-rose-50/90 dark:bg-rose-900/40 border-rose-200 dark:border-rose-500/30 text-rose-800 dark:text-rose-200'
      }`}>
        {toast.type === 'success' ? <CheckCircle className="w-5 h-5 text-emerald-500" /> : 
         toast.type === 'info' ? <Info className="w-5 h-5 text-blue-500" /> :
         <XCircle className="w-5 h-5 text-rose-500" />}
        <p className="text-sm font-medium">{toast.message}</p>
        <button onClick={hideToast} className="ml-2 text-current opacity-60 hover:opacity-100 transition-opacity">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
