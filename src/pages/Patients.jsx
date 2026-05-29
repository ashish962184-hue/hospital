import { useState } from 'react';
import { Search, Plus, MoreVertical, Filter, Phone, Mail, User, X } from 'lucide-react';
import { useStore } from '../store';

const initialPatients = [
  { id: 'PT-1001', name: 'Emma Watson', age: 34, gender: 'Female', blood: 'O+', phone: '+1 234-567-8900', lastVisit: '2023-10-15', status: 'Active' },
  { id: 'PT-1002', name: 'Michael Chen', age: 45, gender: 'Male', blood: 'A-', phone: '+1 234-567-8901', lastVisit: '2023-10-12', status: 'Active' },
  { id: 'PT-1003', name: 'Sarah Davis', age: 28, gender: 'Female', blood: 'B+', phone: '+1 234-567-8902', lastVisit: '2023-09-28', status: 'Inactive' },
  { id: 'PT-1004', name: 'James Wilson', age: 62, gender: 'Male', blood: 'O-', phone: '+1 234-567-8903', lastVisit: '2023-10-18', status: 'Active' },
  { id: 'PT-1005', name: 'Sophia Martinez', age: 19, gender: 'Female', blood: 'AB+', phone: '+1 234-567-8904', lastVisit: '2023-08-05', status: 'Active' },
];

export default function Patients() {
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState(initialPatients);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showToast = useStore(state => state.showToast);

  const handleAddPatient = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newPatient = {
      id: `PT-${1000 + patients.length + 1}`,
      name: formData.get('name'),
      age: formData.get('age'),
      gender: formData.get('gender'),
      blood: formData.get('blood'),
      phone: formData.get('phone'),
      lastVisit: new Date().toISOString().split('T')[0],
      status: 'Active'
    };
    setPatients([newPatient, ...patients]);
    setIsModalOpen(false);
    showToast(`${newPatient.name} registered successfully!`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Patient Management</h1>
          <p className="text-slate-500">View and manage all registered patients</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary">
          <Plus className="w-4 h-4" /> Add New Patient
        </button>
      </div>

      <div className="glass-card p-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name, ID, or phone..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14b8a6] text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button onClick={() => showToast('Advanced filtering coming soon', 'info')} className="btn-secondary text-sm">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-500">
                <th className="pb-3 px-4">Patient ID</th>
                <th className="pb-3 px-4">Patient Info</th>
                <th className="pb-3 px-4">Blood/Age</th>
                <th className="pb-3 px-4">Contact</th>
                <th className="pb-3 px-4">Last Visit</th>
                <th className="pb-3 px-4">Status</th>
                <th className="pb-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {patients.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map((patient) => (
                <tr key={patient.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-4 px-4 text-sm font-medium text-[#14b8a6]">
                    {patient.id}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300">
                        {patient.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">{patient.name}</p>
                        <p className="text-xs text-slate-500">{patient.gender}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm text-slate-700 dark:text-slate-300">
                      <span className="font-medium text-rose-500">{patient.blood}</span>
                      <span className="mx-2 text-slate-300">|</span>
                      {patient.age} yrs
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                        <Phone className="w-3 h-3" /> {patient.phone}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-slate-600 dark:text-slate-400">
                    {patient.lastVisit}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${
                      patient.status === 'Active' 
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                    }`}>
                      {patient.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button onClick={() => showToast('Opening patient options...', 'info')} className="p-1.5 text-slate-400 hover:text-[#14b8a6] hover:bg-[#14b8a6]/10 rounded-lg transition-colors active:scale-95">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="flex items-center justify-between mt-6 text-sm text-slate-500">
          <p>Showing 1 to {patients.length} entries</p>
          <div className="flex gap-2">
            <button onClick={() => showToast('Already on first page', 'info')} className="btn-secondary py-1 px-3">Previous</button>
            <button onClick={() => showToast('Fetching next page...', 'info')} className="btn-secondary py-1 px-3">Next</button>
          </div>
        </div>
      </div>

      {/* Add Patient Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
            <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Register New Patient</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddPatient} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                  <input required name="name" type="text" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#14b8a6]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Age</label>
                  <input required name="age" type="number" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#14b8a6]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Gender</label>
                  <select name="gender" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#14b8a6]">
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Blood Group</label>
                  <select name="blood" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#14b8a6]">
                    <option>A+</option><option>A-</option>
                    <option>B+</option><option>B-</option>
                    <option>O+</option><option>O-</option>
                    <option>AB+</option><option>AB-</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone</label>
                  <input required name="phone" type="text" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#14b8a6]" />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Register Patient</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
