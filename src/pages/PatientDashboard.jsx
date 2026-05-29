import { useState, useEffect } from 'react';
import { Calendar, Activity, FileText, Pill, Clock, Bot, Sparkles } from 'lucide-react';
import { useStore } from '../store';

export default function PatientDashboard() {
  const { user, token, showToast } = useStore();
  const [appointments, setAppointments] = useState([]);
  const [labs, setLabs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [aiExplanation, setAiExplanation] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    // Load patient appointments
    fetch('/api/appointments', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        // Filter appointments for this patient (Emma Watson has patientId 'p1')
        setAppointments(data.filter(a => a.patientId === 'p1'));
      })
      .catch(() => {});

    // Load patient labs
    fetch('/api/labs', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        setLabs(data.filter(l => l.patientId === 'p1'));
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [token]);

  const explainReport = (testName) => {
    setIsAiLoading(true);
    setAiExplanation('');
    setTimeout(() => {
      setAiExplanation(
        `AI Analysis for ${testName}: Your CBC results indicate normal limits. Red Blood Cell (RBC) count and Hematocrit levels are perfectly aligned with reference parameters, suggesting excellent oxygen transport capacity and no indicators of anemia or inflammatory active states. Continue standard diet.`
      );
      setIsAiLoading(false);
      showToast('AI Report Explanation prepared!', 'success');
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Health Portal</h1>
          <p className="text-slate-500">Welcome back, {user?.name || 'Emma Watson'}.</p>
        </div>
      </div>

      {/* Health Vitals Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Next Scheduled Visit', value: appointments.length > 0 ? appointments[0].date : 'Oct 24, 10:00 AM', desc: 'Dr. Sarah Jenkins', icon: Calendar, color: 'text-brand-500', bg: 'bg-brand-500/10' },
          { title: 'Completed Lab Tests', value: `${labs.filter(l => l.status === 'COMPLETED').length} Reports`, desc: 'Latest uploaded today', icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { title: 'Active Prescriptions', value: '2 Medications', desc: 'Amoxicillin, Paracetamol', icon: Pill, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { title: 'Outstanding Balance', value: '$0.00', desc: 'All claims cleared via Insurance', icon: FileText, color: 'text-purple-500', bg: 'bg-purple-500/10' },
        ].map((card, idx) => (
          <div key={idx} className="glass-card p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${card.bg} ${card.color}`}>
                <card.icon className="w-6 h-6" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">{card.title}</p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{card.value}</h3>
              <p className="text-sm text-slate-400 mt-2">{card.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dynamic Patient Records */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Schedule */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">My Appointments</h2>
            {appointments.length === 0 ? (
              <p className="text-sm text-slate-400 italic">No upcoming appointments booked.</p>
            ) : (
              <div className="space-y-3">
                {appointments.map(apt => (
                  <div key={apt.id} className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div className="flex flex-col items-center justify-center w-14 h-14 bg-brand-50 dark:bg-brand-900/20 rounded-lg text-brand-600 dark:text-brand-400 font-bold">
                      <span className="text-xs uppercase">OCT</span>
                      <span className="text-lg">24</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-800 dark:text-white">{apt.type}</h4>
                      <p className="text-sm text-slate-500">{apt.doctor?.name || 'Dr. Sarah Jenkins'} • Cardiology Department</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">{apt.timeSlot}</span>
                      <p className="text-xs text-brand-600 dark:text-brand-400 font-bold mt-1 uppercase">{apt.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI Clinical Translation Module */}
          <div className="glass-card p-6 border-l-4 border-l-brand-500 bg-brand-500/[0.02]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Bot className="w-5 h-5 text-brand-600" /> AI Patient Results Explainer
              </h3>
              <button 
                type="button" 
                onClick={() => explainReport('Complete Blood Count')}
                className="btn-secondary py-1 px-3 text-xs flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-brand-500" /> {isAiLoading ? 'Explaining...' : 'Explain My Labs'}
              </button>
            </div>
            {aiExplanation ? (
              <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-brand-200/50 dark:border-slate-700/50">
                <p className="text-xs text-slate-600 dark:text-slate-300 font-mono leading-relaxed">{aiExplanation}</p>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">Click the button to generate a simple, patient-friendly plain text clinical interpretation of your laboratory diagnostic test results.</p>
            )}
          </div>
        </div>

        {/* Health Vitals */}
        <div className="glass-card p-6 h-full">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">My Vitals Logs</h2>
          <div className="space-y-4">
            {[
              { label: 'Blood Pressure', value: '118/78 mmHg', status: 'Normal' },
              { label: 'Heart Rate', value: '72 bpm', status: 'Normal' },
              { label: 'Body Weight', value: '64 kg', status: 'Stable' },
              { label: 'SpO₂ Oxygen', value: '98%', status: 'Optimal' },
            ].map((vital, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                <div>
                  <p className="text-xs text-slate-500">{vital.label}</p>
                  <p className="font-semibold text-slate-800 dark:text-white">{vital.value}</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 rounded-full">
                  {vital.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
