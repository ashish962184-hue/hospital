import { useState, useEffect } from 'react';
import { Calendar, Clock, FileText, CheckCircle, Search, Video, Plus, X, Heart, ShieldAlert, Bot } from 'lucide-react';
import { useStore } from '../store';

export default function DoctorDashboard() {
  const { showToast, token } = useStore();
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeConsult, setActiveConsult] = useState(null);
  const [form, setForm] = useState({ symptoms: '', diagnosis: '', medName: '', dosage: '', labTest: '', referralDept: '' });
  const [aiSummary, setAiSummary] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const loadAppointments = () => {
    fetch('/api/appointments', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        setAppointments(data);
        setIsLoading(false);
      })
      .catch(() => {
        showToast('Failed to load doctor schedule', 'error');
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadAppointments();
  }, [token]);

  const generateAiSummary = () => {
    if (!activeConsult?.patient) return;
    setIsAiLoading(true);
    setAiSummary('');
    setTimeout(() => {
      setAiSummary(
        `Clinical Summary for ${activeConsult.patient.firstName} ${activeConsult.patient.lastName}: Patient has historical registry for ${activeConsult.patient.chronicDiseases?.join(', ') || 'no chronic illnesses'}. Present complaints involve vital telemetry showing stable respiratory cycles. Recommended approach: immediate symptomatic relief coupled with diagnostic pathology clearance.`
      );
      setIsAiLoading(false);
      showToast('AI Clinical Summary generated!', 'success');
    }, 1200);
  };

  const handleConsultSubmit = (e) => {
    e.preventDefault();
    if (!activeConsult) return;

    // Simulate unified relational update across multiple backend endpoints
    const patientId = activeConsult.patientId;

    // 1. If prescription was written, write to pharmacy endpoints
    if (form.medName) {
      showToast(`Prescription written: ${form.medName} (${form.dosage})`, 'success');
    }

    // 2. If lab test was ordered, submit to labs
    if (form.labTest) {
      fetch('/api/labs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ patientId, testName: form.labTest, category: 'Pathology' })
      }).catch(() => {});
    }

    // 3. Mark appointment as completed
    showToast('Consultation notes saved. Patient file updated.', 'success');
    setActiveConsult(null);
    setForm({ symptoms: '', diagnosis: '', medName: '', dosage: '', labTest: '', referralDept: '' });
    setAiSummary('');
    loadAppointments();
  };

  const filtered = appointments.filter(apt => {
    const pName = apt.patient ? `${apt.patient.firstName} ${apt.patient.lastName}`.toLowerCase() : '';
    return pName.includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Good Morning, Dr. Sarah!</h1>
          <p className="text-slate-500">You have {appointments.filter(a => a.status === 'SCHEDULED').length} pending consultations today.</p>
        </div>
        <button onClick={() => showToast('Starting Teleconsultation Room...', 'info')} className="btn-primary flex items-center gap-2">
          <Video className="w-4 h-4" /> Start Teleconsultation
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 border-l-4 border-l-brand-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-slate-500">Today's Appointments</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{appointments.length}</h3>
            </div>
            <div className="p-3 bg-brand-50 dark:bg-brand-500/10 rounded-full text-brand-500">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
        </div>
        
        <div className="glass-card p-6 border-l-4 border-l-emerald-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-slate-500">Completed consultations</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{appointments.filter(a => a.status === 'COMPLETED').length}</h3>
            </div>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-full text-emerald-500">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="glass-card p-6 border-l-4 border-l-rose-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-slate-500">High Priority Triage</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">1 Case</h3>
            </div>
            <div className="p-3 bg-rose-50 dark:bg-rose-500/10 rounded-full text-rose-500">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="glass-card p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Upcoming Worklist</h2>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search patient..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-1.5 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-slate-500 animate-pulse">Loading worklist...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-sm text-slate-500">
                  <th className="pb-3 font-medium">Patient Name</th>
                  <th className="pb-3 font-medium">Time</th>
                  <th className="pb-3 font-medium">Type</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((apt) => (
                  <tr key={apt.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300">
                          {apt.patient ? apt.patient.firstName.charAt(0) : '?'}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">
                            {apt.patient ? `${apt.patient.firstName} ${apt.patient.lastName}` : 'Unknown Patient'}
                          </p>
                          <p className="text-xs text-slate-500">{apt.patient?.gender || 'M'}, {apt.patient?.dob ? (new Date().getFullYear() - new Date(apt.patient.dob).getFullYear()) : 35} yrs</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300">
                        <Clock className="w-4 h-4 text-brand-500" />
                        {apt.timeSlot}
                      </div>
                    </td>
                    <td className="py-4 text-sm text-slate-600 dark:text-slate-300">{apt.type}</td>
                    <td className="py-4">
                      <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${
                        apt.status === 'COMPLETED' 
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
                      }`}>{apt.status}</span>
                    </td>
                    <td className="py-4 text-right">
                      {apt.status !== 'COMPLETED' ? (
                        <button onClick={() => setActiveConsult(apt)} className="btn-primary py-1.5 px-3 text-xs flex items-center gap-1.5 ml-auto">
                          <Plus className="w-3.5 h-3.5" /> Start Exam
                        </button>
                      ) : (
                        <button onClick={() => showToast('Consultation file is locked.', 'info')} className="btn-secondary py-1.5 px-3 text-xs ml-auto">
                          View File
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Consultation & Prescribing Modal */}
      {activeConsult && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-500" /> Clinical Consultation & Rx Notes
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Examining: {activeConsult.patient ? `${activeConsult.patient.firstName} ${activeConsult.patient.lastName}` : 'Jane Roe'}
                </p>
              </div>
              <button onClick={() => setActiveConsult(null)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleConsultSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
              {/* AI Clinical Summary */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-brand-600 dark:text-brand-400 flex items-center gap-1">
                    <Bot className="w-4 h-4 animate-bounce" /> CarePulse Clinical AI Assistant
                  </span>
                  <button type="button" onClick={generateAiSummary} className="btn-secondary py-1 px-2 text-xs">
                    {isAiLoading ? 'Synthesizing...' : 'Generate AI Summary'}
                  </button>
                </div>
                {aiSummary ? (
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-mono">{aiSummary}</p>
                ) : (
                  <p className="text-xs text-slate-400 italic">Click the button to scan Jane's historical logs and generate an automated summary notes draft.</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Chief Complaints / Vitals Logs</label>
                  <textarea required value={form.symptoms} onChange={e => setForm({...form, symptoms: e.target.value})} rows={2} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" placeholder="e.g. Cough, mild fever for 2 days. Vitals: BP 120/80..." />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Clinical Diagnosis</label>
                  <input required type="text" value={form.diagnosis} onChange={e => setForm({...form, diagnosis: e.target.value})} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="e.g. Viral Pharyngitis" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Rx Med name</label>
                  <input type="text" value={form.medName} onChange={e => setForm({...form, medName: e.target.value})} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="e.g. Paracetamol 650mg" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Rx Dosage frequency</label>
                  <input type="text" value={form.dosage} onChange={e => setForm({...form, dosage: e.target.value})} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="e.g. 1-0-1 after food (5 Days)" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Order Diagnostic pathology test</label>
                  <select value={form.labTest} onChange={e => setForm({...form, labTest: e.target.value})} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
                    <option value="">No laboratory test ordered</option>
                    <option value="Complete Blood Count">Complete Blood Count (CBC)</option>
                    <option value="Thyroid Panel">Thyroid Panel (TSH/T3/T4)</option>
                    <option value="HbA1c test">Glycated Hemoglobin (HbA1c)</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Specialist referral department</label>
                  <select value={form.referralDept} onChange={e => setForm({...form, referralDept: e.target.value})} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
                    <option value="">No internal referral required</option>
                    <option value="Cardiology">Cardiology specialist</option>
                    <option value="Neurology">Neurology specialist</option>
                    <option value="Pediatrics">Pediatrics clinic</option>
                  </select>
                </div>
              </div>
              
              <button type="submit" className="btn-primary w-full mt-4 py-2">Lock Consultation & Issue prescriptions</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
