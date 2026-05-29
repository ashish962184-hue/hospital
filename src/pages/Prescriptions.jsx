import { useState } from 'react';
import { Plus, Printer, Download, Save, Pill, Trash2 } from 'lucide-react';
import { useStore } from '../store';

export default function Prescriptions() {
  const [medicines, setMedicines] = useState([
    { id: 1, name: 'Amoxicillin 500mg', dosage: '1 tablet', frequency: 'Twice a day (After food)', days: '5 Days' }
  ]);

  const addMedicine = () => {
    setMedicines([...medicines, { id: Date.now(), name: '', dosage: '', frequency: '', days: '' }]);
  };

  const showToast = useStore(state => state.showToast);

  const removeMedicine = (id) => {
    if (medicines.length > 1) {
      setMedicines(medicines.filter(med => med.id !== id));
    }
  };

  const updateMedicine = (id, field, value) => {
    setMedicines(medicines.map(med => 
      med.id === id ? { ...med, [field]: value } : med
    ));
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Digital Prescription</h1>
          <p className="text-slate-500">Create and generate e-prescriptions</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => { window.print(); showToast('Preparing document for printing...', 'info'); }} className="btn-secondary">
            <Printer className="w-4 h-4" /> Print
          </button>
          <button onClick={() => showToast('Downloading PDF version...', 'info')} className="btn-secondary">
            <Download className="w-4 h-4" /> PDF
          </button>
          <button onClick={() => showToast('Prescription saved to patient records successfully!')} className="btn-primary">
            <Save className="w-4 h-4" /> Save
          </button>
        </div>
      </div>

      <div className="glass-card p-0 overflow-hidden">
        {/* Prescription Header */}
        <div className="bg-[#14b8a6] text-white p-6 md:p-8 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">CarePulse General Hospital</h2>
            <p className="text-[#ccfbf1] text-sm mt-1">123 Health Avenue, Medical District, NY 10001</p>
            <p className="text-[#ccfbf1] text-sm">Phone: +1 800-555-0199</p>
          </div>
          <div className="text-right">
            <img src="/logo.png" alt="CarePulse Logo" className="w-16 h-16 bg-white object-contain rounded-2xl p-1 shadow-lg ml-auto mb-2" />
          </div>
        </div>

        {/* Patient Details */}
        <div className="p-6 md:p-8 border-b border-slate-200 dark:border-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Patient Details</label>
              <div className="space-y-3">
                <input type="text" placeholder="Patient Name" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6]" defaultValue="Emma Watson" />
                <div className="flex gap-3">
                  <input type="text" placeholder="Age" className="w-1/3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6]" defaultValue="34 yrs" />
                  <input type="text" placeholder="Gender" className="w-2/3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6]" defaultValue="Female" />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Doctor Details</label>
              <div className="space-y-3">
                <input type="text" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white font-medium focus:outline-none" defaultValue="Dr. Sarah Smith" readOnly />
                <input type="text" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6]" defaultValue="MD, General Medicine" readOnly />
              </div>
            </div>
          </div>
        </div>

        {/* Diagnosis & Medicine */}
        <div className="p-6 md:p-8">
          <div className="mb-8">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Chief Complaints & Diagnosis</label>
            <textarea 
              rows={3}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6]"
              placeholder="Enter symptoms and diagnosis details..."
              defaultValue="Patient complains of mild fever and sore throat for 2 days. Diagnosed with mild viral pharyngitis."
            />
          </div>

          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Pill className="w-5 h-5 text-[#14b8a6]" /> Rx Medicines
            </h3>
            <button onClick={addMedicine} className="btn-secondary py-1.5 px-3 text-sm">
              <Plus className="w-4 h-4" /> Add Medicine
            </button>
          </div>

          <div className="overflow-x-auto mb-8">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="p-3 font-semibold rounded-l-lg">Medicine Name</th>
                  <th className="p-3 font-semibold">Dosage</th>
                  <th className="p-3 font-semibold">Frequency</th>
                  <th className="p-3 font-semibold">Duration</th>
                  <th className="p-3 font-semibold rounded-r-lg w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {medicines.map((med) => (
                  <tr key={med.id} className="group">
                    <td className="p-2">
                      <input 
                        type="text" 
                        value={med.name}
                        onChange={(e) => updateMedicine(med.id, 'name', e.target.value)}
                        className="w-full bg-transparent border-b border-transparent focus:border-[#14b8a6] hover:border-slate-200 dark:hover:border-slate-700 px-2 py-1.5 focus:outline-none text-sm transition-colors" 
                        placeholder="e.g. Paracetamol" 
                      />
                    </td>
                    <td className="p-2">
                      <input 
                        type="text" 
                        value={med.dosage}
                        onChange={(e) => updateMedicine(med.id, 'dosage', e.target.value)}
                        className="w-full bg-transparent border-b border-transparent focus:border-[#14b8a6] hover:border-slate-200 dark:hover:border-slate-700 px-2 py-1.5 focus:outline-none text-sm transition-colors" 
                        placeholder="e.g. 500mg" 
                      />
                    </td>
                    <td className="p-2">
                      <input 
                        type="text" 
                        value={med.frequency}
                        onChange={(e) => updateMedicine(med.id, 'frequency', e.target.value)}
                        className="w-full bg-transparent border-b border-transparent focus:border-[#14b8a6] hover:border-slate-200 dark:hover:border-slate-700 px-2 py-1.5 focus:outline-none text-sm transition-colors" 
                        placeholder="e.g. 1-0-1" 
                      />
                    </td>
                    <td className="p-2">
                      <input 
                        type="text" 
                        value={med.days}
                        onChange={(e) => updateMedicine(med.id, 'days', e.target.value)}
                        className="w-full bg-transparent border-b border-transparent focus:border-[#14b8a6] hover:border-slate-200 dark:hover:border-slate-700 px-2 py-1.5 focus:outline-none text-sm transition-colors" 
                        placeholder="e.g. 3 Days" 
                      />
                    </td>
                    <td className="p-2 text-right">
                      <button 
                        onClick={() => removeMedicine(med.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-slate-400"
                        disabled={medicines.length === 1}
                        title="Remove medicine"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end mt-12 pt-8 border-t border-slate-200 dark:border-slate-700 border-dashed">
            <div className="text-center">
              <div className="h-16 w-48 border-b border-slate-300 dark:border-slate-600 mb-2">
                {/* Space for signature */}
              </div>
              <p className="text-sm font-semibold text-slate-800 dark:text-white">Dr. Sarah Smith</p>
              <p className="text-xs text-slate-500">Signature & Seal</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
