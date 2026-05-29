import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Calendar, Activity, FileText, Pill, Clock, Bot, Sparkles, 
  Download, Printer, Share2, Heart, Shield, Bell, QrCode, 
  User, MapPin, Phone, ShieldCheck, ChevronRight, Video, Plus, CheckCircle, Trash2, X
} from 'lucide-react';
import { useStore } from '../store';

const DEPARTMENTS = ['Cardiology', 'Neurology', 'Pediatrics', 'General Medicine'];

const DOCTORS = [
  { id: 'd1', name: 'Dr. Sarah Jenkins', specialization: 'Cardiology', fee: 150, experience: '12 Years', languages: ['English', 'Spanish'], days: ['Monday', 'Wednesday', 'Friday'], slots: ['09:00 AM', '10:30 AM', '11:15 AM', '02:00 PM'], branch: 'CarePulse Manhattan' },
  { id: 'd2', name: 'Dr. Michael Chen', specialization: 'Neurology', fee: 200, experience: '15 Years', languages: ['English', 'Mandarin'], days: ['Tuesday', 'Thursday'], slots: ['10:00 AM', '11:30 AM', '03:00 PM', '04:15 PM'], branch: 'CarePulse Brooklyn' },
  { id: 'd3', name: 'Dr. Emily Brown', specialization: 'Pediatrics', fee: 120, experience: '8 Years', languages: ['English', 'French'], days: ['Monday', 'Tuesday', 'Thursday'], slots: ['09:30 AM', '11:00 AM', '01:30 PM', '03:30 PM'], branch: 'CarePulse Queens' },
];

export default function PatientDashboard() {
  const { user, token, showToast } = useStore();
  const location = useLocation();
  const navigate = useNavigate();

  // Unified States
  const [appointments, setAppointments] = useState([]);
  const [labs, setLabs] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [claims, setClaims] = useState([]);
  const [patientProfile, setPatientProfile] = useState(null);
  const [surgeries, setSurgeries] = useState([]);
  const [vaccinations, setVaccinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Dynamic Route Tab Solver
  const getTabFromPath = () => {
    const path = location.pathname;
    if (path.includes('/appointments')) return 'appointments';
    if (path.includes('/records')) return 'records';
    if (path.includes('/results')) return 'results';
    if (path.includes('/prescriptions')) return 'prescriptions';
    if (path.includes('/billing')) return 'billing';
    if (path.includes('/reminders')) return 'reminders';
    if (path.includes('/queue')) return 'queue';
    if (path.includes('/qr')) return 'qr';
    if (path.includes('/symptom-checker')) return 'symptom-checker';
    if (path.includes('/insurance')) return 'insurance';
    if (path.includes('/documents')) return 'documents';
    if (path.includes('/settings')) return 'settings';
    return 'dashboard';
  };

  const activeTab = getTabFromPath();

  // Booking Flow States
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [activeToken, setActiveToken] = useState(null);

  // AI Checker States
  const [symptoms, setSymptoms] = useState('');
  const [aiReport, setAiReport] = useState(null);
  const [isAiChecking, setIsAiChecking] = useState(false);

  // AI Labs Explainer States
  const [aiExplanation, setAiExplanation] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Active Video Modal
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const loadData = () => {
    const headers = { Authorization: `Bearer ${token}` };

    fetch('/api/appointments', { headers })
      .then(res => res.json())
      .then(data => setAppointments(data))
      .catch(() => {});

    fetch('/api/labs', { headers })
      .then(res => res.json())
      .then(data => setLabs(data))
      .catch(() => {});

    fetch('/api/pharmacy/prescriptions', { headers })
      .then(res => res.json())
      .then(data => setPrescriptions(data))
      .catch(() => {});

    fetch('/api/billing', { headers })
      .then(res => res.json())
      .then(data => setInvoices(data))
      .catch(() => {});

    fetch('/api/advanced/insurance/claims', { headers })
      .then(res => res.json())
      .then(data => setClaims(data))
      .catch(() => {});

    fetch('/api/patients', { headers })
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setPatientProfile(data[0]);
        }
      })
      .catch(() => {});

    fetch('/api/advanced/ot', { headers })
      .then(res => res.json())
      .then(data => setSurgeries(data))
      .catch(() => {});

    fetch('/api/advanced/vaccinations', { headers })
      .then(res => res.json())
      .then(data => setVaccinations(data))
      .catch(() => {});

    fetch('/api/advanced/documents', { headers })
      .then(res => res.json())
      .then(data => {
        setDocuments(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [token]);

  const getTimelineEvents = () => {
    const events = [];
    
    // 1. Appointments
    appointments.forEach(apt => {
      events.push({
        date: apt.date,
        title: `${apt.type || 'Consultation'} with ${apt.doctor?.name || 'Dr. Sarah Jenkins'}`,
        desc: `Status: ${apt.status}. Slot: ${apt.timeSlot}. Branch: ${apt.doctor?.branch || 'CarePulse Manhattan'}`,
        icon: Calendar,
        color: 'bg-brand-500',
        timestamp: new Date(apt.date).getTime()
      });
    });

    // 2. Lab Reports
    labs.forEach(lab => {
      events.push({
        date: 'May 28, 2026',
        title: `${lab.testName} Pathology Order`,
        desc: `Status: ${lab.status}. Category: ${lab.category}. Priority: ${lab.priority || 'ROUTINE'}`,
        icon: Activity,
        color: 'bg-emerald-500',
        timestamp: new Date().getTime() - 86400000
      });
    });

    // 3. Prescriptions
    prescriptions.forEach(p => {
      events.push({
        date: 'May 28, 2026',
        title: `Prescription Rx Issued`,
        desc: `Medication: ${p.medicines ? p.medicines.join(', ') : p.name || p.medicine}`,
        icon: Pill,
        color: 'bg-blue-500',
        timestamp: new Date().getTime() - 86400000 * 2
      });
    });

    // 4. Surgeries
    surgeries.forEach(ot => {
      events.push({
        date: ot.date,
        title: `${ot.procedure} Surgery Scheduled`,
        desc: `Surgeon: ${ot.surgeon}. OT Room: ${ot.otRoom}. Status: ${ot.status}`,
        icon: ShieldCheck,
        color: 'bg-purple-500',
        timestamp: new Date(ot.date).getTime()
      });
    });

    // Sort chronologically descending
    return events.sort((a, b) => b.timestamp - a.timestamp);
  };

  // Appointment Actions
  const handleBook = (e) => {
    e.preventDefault();
    if (!selectedDoctor || !selectedDate || !selectedSlot) {
      return showToast('Please select all booking parameters', 'error');
    }

    const patientId = user?.patientId || 'p1';
    const tokenNo = `A${Math.floor(Math.random() * 20) + 100}`;

    fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        patientId,
        doctorId: selectedDoctor.id,
        date: selectedDate,
        timeSlot: selectedSlot,
        type: 'General Consultation',
        notes: `Token Assigned: ${tokenNo}`
      })
    })
      .then(res => res.json())
      .then(() => {
        showToast(`Appointment confirmed! Token ${tokenNo} issued.`, 'success');
        setActiveToken(tokenNo);
        // Reset booking form
        setSelectedDept('');
        setSelectedDoctor(null);
        setSelectedDate('');
        setSelectedSlot('');
        loadData();
      })
      .catch(() => showToast('Failed to book appointment', 'error'));
  };

  const handleCancel = (id) => {
    showToast('Appointment successfully canceled', 'success');
    // Live update local view
    setAppointments(prev => prev.filter(a => a.id !== id));
  };

  // AI Symptom Checker
  const checkSymptoms = (e) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    setIsAiChecking(true);
    setAiReport(null);

    setTimeout(() => {
      let result = {
        conditions: 'Acute Bronchitis vs Mild Allergic Respiratory Spasm',
        urgency: 'ROUTINE (Schedule Visit)',
        dept: 'Cardiology',
        suggested: DOCTORS[0]
      };

      if (symptoms.toLowerCase().includes('chest') || symptoms.toLowerCase().includes('heart')) {
        result = {
          conditions: 'Potential Angina Pectoris / Coronary telemetric distress indicators',
          urgency: 'HIGH PRIORITY / STAT',
          dept: 'Cardiology',
          suggested: DOCTORS[0]
        };
      } else if (symptoms.toLowerCase().includes('child') || symptoms.toLowerCase().includes('baby')) {
        result = {
          conditions: 'Pediatric viral fever registry',
          urgency: 'ROUTINE',
          dept: 'Pediatrics',
          suggested: DOCTORS[2]
        };
      }

      setAiReport(result);
      setIsAiChecking(false);
      showToast('AI Symptom analysis completed!', 'success');
    }, 1200);
  };

  // AI Lab Explainer
  const explainLab = (testName) => {
    setIsAiLoading(true);
    setAiExplanation('');
    setTimeout(() => {
      setAiExplanation(
        `Your CBC results are perfectly normal. Red Blood Cell (RBC) count is outstanding suggesting optimal oxygenation capacity. Inflammation active indexes show zero markers.`
      );
      setIsAiLoading(false);
      showToast('AI Clinical Interpretation prepared!', 'success');
    }, 1000);
  };

  const patientName = user?.name || 'Emma Watson';
  const patientEmail = user?.email || 'patient@nova.com';
  const patientMRN = 'MRN-1001';
  const patientID = user?.patientId || 'p1';

  // Navigation redirect helpers
  const setTab = (tab) => {
    navigate(`/patient/${tab === 'dashboard' ? '' : tab}`);
  };

  return (
    <div className="space-y-6">
      {/* Premium Practo Glass Header */}
      <div className="glass-card p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-brand-500 text-white flex items-center justify-center text-xl font-bold shadow-lg shadow-brand-500/20">
            {patientName[0]}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">CarePulse Patient Portal</h1>
            <p className="text-slate-500 text-sm">Welcome back, {patientName} • ID: {patientID} • MRN: {patientMRN}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setTab('qr')} className="btn-secondary py-2 px-3 text-xs flex items-center gap-1.5">
            <QrCode className="w-4 h-4 text-brand-500" /> My QR Card
          </button>
          <button onClick={() => setTab('symptom-checker')} className="btn-primary py-2 px-3 text-xs flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" /> AI Symptom Checker
          </button>
        </div>
      </div>

      {/* RENDER DYNAMIC TAB VIEWS */}
      
      {/* ─────────────────── TAB: DASHBOARD ─────────────────── */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Vitals Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Blood Pressure', value: '118/78 mmHg', desc: 'Normal Limits', icon: Heart, color: 'text-rose-500', bg: 'bg-rose-500/10' },
              { label: 'Pulse Telemetry', value: '72 bpm', desc: 'Stable resting', icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
              { label: 'Body Weight', value: '64 kg', desc: 'Target index met', icon: User, color: 'text-blue-500', bg: 'bg-blue-500/10' },
              { label: 'SpO₂ Oxygen', value: '98%', desc: 'Optimal capacity', icon: Sparkles, color: 'text-purple-500', bg: 'bg-purple-500/10' },
            ].map((vital, idx) => (
              <div key={idx} className="glass-card p-5 flex flex-col justify-between">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-semibold text-slate-400">{vital.label}</span>
                  <div className={`p-2 rounded-xl ${vital.bg} ${vital.color}`}>
                    <vital.icon className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white leading-tight">{vital.value}</h3>
                  <p className="text-[10px] text-slate-400 mt-1">{vital.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Upcoming Appointment Widget */}
              <div className="glass-card p-6">
                <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">My Next Consultation</h2>
                {appointments.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-800/10">
                    <p className="text-sm italic">No upcoming consultations booked.</p>
                    <button onClick={() => setTab('appointments')} className="btn-primary text-xs py-1.5 px-3 mt-3">Book Visit Now</button>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/30 flex items-center justify-center font-bold text-sm">
                        Rx
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white">{appointments[0].type || 'Cardiology Consultation'}</h4>
                        <p className="text-xs text-slate-500">{appointments[0].doctor?.name || 'Dr. Sarah Jenkins'} • {appointments[0].date} at {appointments[0].timeSlot}</p>
                      </div>
                    </div>
                    <button onClick={() => setIsVideoOpen(true)} className="btn-primary py-2 px-3 text-xs flex items-center gap-1.5 shrink-0">
                      <Video className="w-4 h-4" /> Join Teleconsultation
                    </button>
                  </div>
                )}
              </div>

              {/* Patient Timeline */}
              <div className="glass-card p-6">
                <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-5">Patient Clinical History Timeline</h2>
                <div className="relative border-l border-slate-200 dark:border-slate-700 pl-6 ml-4 space-y-6">
                  {getTimelineEvents().length > 0 ? (
                    getTimelineEvents().map((event, idx) => (
                      <div key={idx} className="relative">
                        <div className={`absolute -left-[35px] top-0 w-7 h-7 rounded-full ${event.color} text-white flex items-center justify-center border-4 border-slate-50 dark:border-slate-950`}>
                          <event.icon className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-400">{event.date}</span>
                          <h4 className="font-semibold text-slate-800 dark:text-white text-sm mt-0.5">{event.title}</h4>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">{event.desc}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 italic">No clinical history timeline available.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Health Checklist & Vaccination Status */}
            <div className="space-y-6">
              <div className="glass-card p-6">
                <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Medication Reminders</h2>
                <div className="space-y-3">
                  {prescriptions.flatMap(rx => rx.medicines || []).length > 0 ? (
                    prescriptions.flatMap(rx => rx.medicines || []).map((med, idx) => (
                      <div key={idx} className="p-3 border border-slate-100 dark:border-slate-800 rounded-xl">
                        <p className="text-sm font-semibold text-slate-800 dark:text-white">{med}</p>
                        <p className="text-xs text-slate-500 mt-0.5">1 tablet/capsule • As prescribed by clinician</p>
                        <span className="inline-flex items-center gap-1 text-[10px] text-brand-600 dark:text-brand-400 font-bold mt-2">
                          <Clock className="w-3 h-3" /> Active Course
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 italic">No active medication reminders.</p>
                  )}
                </div>
              </div>

              <div className="glass-card p-6">
                <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Vaccination Status</h2>
                <div className="space-y-3">
                  {vaccinations.length > 0 ? (
                    vaccinations.map((vac, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 border border-slate-100 dark:border-slate-800 rounded-xl">
                        <div>
                          <p className="text-sm font-semibold text-slate-800 dark:text-white">{vac.vaccine}</p>
                          <p className="text-xs text-slate-500 mt-0.5">Dose {vac.doseNo} · {vac.dateAdministered}</p>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          new Date(vac.nextDueDate) > new Date() ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-amber-50 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
                        }`}>
                          {new Date(vac.nextDueDate) > new Date() ? 'COMPLETED' : 'BOOSTER DUE'}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 italic">No vaccinations recorded.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────── TAB: APPOINTMENTS ─────────────────── */}
      {activeTab === 'appointments' && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Booking Engine */}
          <div className="lg:col-span-3 glass-card p-6">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-5">Practo Slot-Based Appointment Engine</h2>
            
            {activeToken && (
              <div className="p-4 mb-5 border border-brand-200 dark:border-brand-800/50 bg-brand-50/30 dark:bg-brand-900/10 rounded-xl text-brand-600 dark:text-brand-400 flex items-center gap-3">
                <CheckCircle className="w-5 h-5" />
                <div>
                  <p className="font-semibold text-sm">Appointment Booked Successfully!</p>
                  <p className="text-xs mt-0.5">Your Live Triage Check-in Token is <span className="font-bold text-base">{activeToken}</span></p>
                </div>
              </div>
            )}

            <form onSubmit={handleBook} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1">1. Select Medical Department</label>
                <select 
                  value={selectedDept} 
                  onChange={e => { setSelectedDept(e.target.value); setSelectedDoctor(null); }}
                  required
                  className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 focus:outline-none"
                >
                  <option value="">Choose department...</option>
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              {selectedDept && (
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-2">2. Choose Specialised Specialist</label>
                  <div className="space-y-3">
                    {DOCTORS.filter(doc => doc.specialization === selectedDept || selectedDept === 'General Medicine').map(doc => (
                      <div 
                        key={doc.id}
                        onClick={() => setSelectedDoctor(doc)}
                        className={`p-4 border rounded-xl cursor-pointer transition-all ${
                          selectedDoctor?.id === doc.id 
                            ? 'border-brand-500 bg-brand-500/5' 
                            : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                        }`}
                      >
                        <p className="font-semibold text-slate-900 dark:text-white text-sm">{doc.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{doc.specialization} • {doc.experience} Experience • Fees: ${doc.fee}</p>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {doc.languages.map(l => <span key={l} className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500">{l}</span>)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedDoctor && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1">3. Select Date</label>
                    <input 
                      required 
                      type="date" 
                      value={selectedDate} 
                      onChange={e => setSelectedDate(e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1">4. Select Available Time Slot</label>
                    <select 
                      required 
                      value={selectedSlot} 
                      onChange={e => setSelectedSlot(e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 focus:outline-none"
                    >
                      <option value="">Choose slot...</option>
                      {selectedDoctor.slots.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              )}

              <button 
                type="submit" 
                disabled={!selectedSlot}
                className="w-full btn-primary py-2.5 text-sm mt-3"
              >
                Confirm Appointment Slot
              </button>
            </form>
          </div>

          {/* Booking History */}
          <div className="lg:col-span-2 glass-card p-6">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-5">My Consultation Ledger</h2>
            <div className="space-y-4">
              {appointments.filter(a => a.patientId === patientID).map(apt => (
                <div key={apt.id} className="p-4 border border-slate-100 dark:border-slate-800 rounded-xl">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-white text-sm">{apt.type}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{apt.doctor?.name || 'Dr. Sarah Jenkins'}</p>
                      <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />{apt.date} at {apt.timeSlot}
                      </p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      apt.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20' : 'bg-brand-50 text-brand-700 dark:bg-brand-500/20'
                    }`}>{apt.status}</span>
                  </div>
                  {apt.status === 'SCHEDULED' && (
                    <div className="flex gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                      <button onClick={() => handleCancel(apt.id)} className="w-1/2 btn-secondary py-1 text-xs hover:text-rose-500">Cancel Slot</button>
                      <button onClick={() => showToast('Rescheduling options initialized', 'info')} className="w-1/2 btn-primary py-1 text-xs">Reschedule</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────── TAB: RECORDS ─────────────────── */}
      {activeTab === 'records' && (
        <div className="glass-card p-6">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Patient Health & EHR Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 border border-slate-100 dark:border-slate-800 rounded-xl">
              <h3 className="font-bold text-slate-800 dark:text-white text-sm border-b border-slate-100 dark:border-slate-800 pb-2 mb-3">Chronic Diseases & Allergies</h3>
              
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Chronic Diseases</p>
              {patientProfile?.chronicDiseases && patientProfile.chronicDiseases.length > 0 ? (
                <ul className="space-y-2 mb-4">
                  {patientProfile.chronicDiseases.map((disease, idx) => (
                    <li key={idx} className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 dark:text-slate-300 font-medium">{disease} Registry:</span>
                      <span className="font-bold text-brand-600">Active - Under Cardiology Control</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-400 italic mb-4">No chronic conditions recorded.</p>
              )}

              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Allergies</p>
              {patientProfile?.allergies && patientProfile.allergies.length > 0 ? (
                <ul className="space-y-2">
                  {patientProfile.allergies.map((allergy, idx) => (
                    <li key={idx} className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 dark:text-slate-300 font-medium">{allergy} Allergy:</span>
                      <span className="font-bold text-rose-500">Severe Anaphylaxis Risk</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-400 italic">No allergies recorded.</p>
              )}
            </div>
            
            <div className="p-4 border border-slate-100 dark:border-slate-800 rounded-xl">
              <h3 className="font-bold text-slate-800 dark:text-white text-sm border-b border-slate-100 dark:border-slate-800 pb-2 mb-3">Surgical History</h3>
              {surgeries && surgeries.length > 0 ? (
                <ul className="space-y-2">
                  {surgeries.map((ot, idx) => (
                    <li key={idx} className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 dark:text-slate-300 font-medium">{ot.procedure}:</span>
                      <span className="font-semibold text-slate-600 dark:text-slate-300">{ot.status} - {ot.date}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-400 italic">No surgical history available.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────── TAB: LAB RESULTS ─────────────────── */}
      {activeTab === 'results' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Labs List */}
          <div className="lg:col-span-2 glass-card p-6">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-5">My Diagnostic Pathology Reports</h2>
            <div className="space-y-4">
              {labs.filter(l => l.patientId === patientID).length > 0 ? (
                labs.filter(l => l.patientId === patientID).map(lab => (
                  <div key={lab.id} className="p-4 border border-slate-100 dark:border-slate-800 rounded-xl flex justify-between items-start gap-4">
                    <div>
                      <span className="font-mono text-[10px] text-brand-500 font-bold uppercase">#{lab.id}</span>
                      <h4 className="font-semibold text-slate-800 dark:text-white text-sm mt-1">{lab.testName}</h4>
                      <p className="text-xs text-slate-500">{lab.category} • Status: {lab.status}</p>
                    </div>
                    <div className="flex gap-2">
                      {lab.status === 'COMPLETED' ? (
                        <>
                          <button onClick={() => explainLab(lab.testName)} className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1">
                            <Bot className="w-3.5 h-3.5 text-brand-600" /> Explain
                          </button>
                          <button onClick={() => showToast('Downloading PDF diagnostic file...', 'success')} className="btn-primary py-1.5 px-3 text-xs flex items-center gap-1">
                            <Download className="w-3.5 h-3.5" /> PDF
                          </button>
                        </>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Awaiting Lab verification</span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-400 italic">No lab reports found.</p>
              )}
            </div>
          </div>

          {/* AI Clinical explainer panel */}
          <div className="glass-card p-6 border-l-4 border-l-brand-500 h-fit bg-brand-500/[0.01]">
            <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-3">
              <Bot className="w-5 h-5 text-brand-600" /> CarePulse Clinical Interpretation
            </h3>
            {aiExplanation ? (
              <div className="p-4 bg-white dark:bg-slate-900 border border-brand-200 dark:border-slate-800 rounded-xl">
                <p className="text-xs text-slate-600 dark:text-slate-300 font-mono leading-relaxed">{aiExplanation}</p>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">Select the "Explain" button next to any completed laboratory diagnostic to parse telemetry.</p>
            )}
          </div>
        </div>
      )}

      {/* ─────────────────── TAB: PRESCRIPTIONS ─────────────────── */}
      {activeTab === 'prescriptions' && (
        <div className="glass-card p-6">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-5">Active Digital e-Prescriptions (Rx)</h2>
          <div className="space-y-4">
            {prescriptions.length > 0 ? (
              prescriptions.map(rx => (
                <div key={rx.id} className="p-5 border border-slate-100 dark:border-slate-800 rounded-xl">
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <div>
                      <span className="font-mono text-[10px] text-brand-500 font-bold uppercase">{rx.id}</span>
                      <h3 className="font-bold text-slate-900 dark:text-white mt-0.5">Cardiology Clinical Script</h3>
                      <p className="text-xs text-slate-500">Issued by: {rx.doctor} · Status: {rx.status}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => window.print()} className="btn-secondary p-2 rounded-xl" title="Print Script"><Printer className="w-4 h-4" /></button>
                      <button onClick={() => showToast('Downloading PDF clinical Rx...', 'success')} className="btn-primary py-1.5 px-3 text-xs flex items-center gap-1.5"><Download className="w-3.5 h-3.5" /> PDF</button>
                    </div>
                  </div>
                  <div className="space-y-2 mt-4">
                    {rx.medicines.map((m, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-brand-50 dark:bg-brand-900/30 text-brand-600 rounded-lg"><Pill className="w-4 h-4" /></div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800 dark:text-white">{m}</p>
                            <p className="text-xs text-slate-500">1 capsule · Twice a day (After food)</p>
                          </div>
                        </div>
                        <span className="text-[10px] text-brand-600 dark:text-brand-400 font-bold bg-brand-50 dark:bg-brand-500/10 px-2 py-0.5 rounded-full">5 Days Course</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400 italic">No prescriptions found.</p>
            )}
          </div>
        </div>
      )}

      {/* ─────────────────── TAB: BILLING ─────────────────── */}
      {activeTab === 'billing' && (
        <div className="glass-card p-6">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-5">Outstanding Invoices Ledger</h2>
          <div className="space-y-4">
            {invoices.filter(i => i.patientId === patientID).length > 0 ? (
              invoices.filter(i => i.patientId === patientID).map(inv => (
                <div key={inv.id} className="p-4 border border-slate-100 dark:border-slate-800 rounded-xl flex justify-between items-center gap-4">
                  <div>
                    <span className="font-mono text-xs text-brand-500 font-bold uppercase">#{inv.id}</span>
                    <h4 className="font-semibold text-slate-800 dark:text-white text-sm mt-1">{inv.type} Service Ledger</h4>
                    <p className="text-xs text-slate-500">Settled via BlueCross Insurance</p>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-bold text-slate-900 dark:text-white">${inv.totalAmount}</p>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full mt-2 inline-block ${
                      inv.status === 'PAID' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-rose-50 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400'
                    }`}>{inv.status}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400 italic">No outstanding or settled invoices found.</p>
            )}
          </div>
        </div>
      )}

      {/* ─────────────────── TAB: REMINDERS ─────────────────── */}
      {activeTab === 'reminders' && (
        <div className="glass-card p-6">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-5">Patient Notification Alarms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              ...prescriptions.flatMap(rx => rx.medicines || []).map(med => ({
                title: `Medicine Dose: ${med}`,
                time: 'Active Prescribed Course',
                type: 'e-Prescription dosage frequency check'
              })),
              ...appointments.filter(a => a.status === 'SCHEDULED').map(apt => ({
                title: `${apt.type} with ${apt.doctor?.name || 'Dr. Sarah Jenkins'}`,
                time: `Scheduled: ${apt.date} at ${apt.timeSlot}`,
                type: 'Upcoming Teleconsultation Visit'
              })),
              ...vaccinations.map(vac => ({
                title: `Vaccine: ${vac.vaccine} (Dose #${vac.doseNo})`,
                time: `Booster Due: ${vac.nextDueDate}`,
                type: 'Immunization Schedule Alarm'
              }))
            ].length > 0 ? (
              [
                ...prescriptions.flatMap(rx => rx.medicines || []).map(med => ({
                  title: `Medicine Dose: ${med}`,
                  time: 'Active Prescribed Course',
                  type: 'e-Prescription dosage frequency check'
                })),
                ...appointments.filter(a => a.status === 'SCHEDULED').map(apt => ({
                  title: `${apt.type} with ${apt.doctor?.name || 'Dr. Sarah Jenkins'}`,
                  time: `Scheduled: ${apt.date} at ${apt.timeSlot}`,
                  type: 'Upcoming Teleconsultation Visit'
                })),
                ...vaccinations.map(vac => ({
                  title: `Vaccine: ${vac.vaccine} (Dose #${vac.doseNo})`,
                  time: `Booster Due: ${vac.nextDueDate}`,
                  type: 'Immunization Schedule Alarm'
                }))
              ].map((rem, idx) => (
                <div key={idx} className="p-4 border border-slate-100 dark:border-slate-800 rounded-xl flex items-start gap-3">
                  <div className="p-2.5 bg-brand-50 dark:bg-brand-900/30 text-brand-600 rounded-xl"><Bell className="w-5 h-5" /></div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-white">{rem.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{rem.type}</p>
                    <span className="text-[10px] text-slate-400 font-bold mt-2 inline-block">{rem.time}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400 italic">No active alarms or reminders recorded.</p>
            )}
          </div>
        </div>
      )}

      {/* ─────────────────── TAB: QUEUE STATUS ─────────────────── */}
      {activeTab === 'queue' && (() => {
        const activeApt = appointments.find(a => a.status === 'SCHEDULED');
        const tokenMatch = activeApt?.notes?.match(/A\d+/);
        const tokenNo = tokenMatch ? tokenMatch[0] : (activeToken || null);
        const doctorName = activeApt?.doctor?.name || 'Dr. Sarah Jenkins';
        
        return (
          <div className="glass-card p-8 flex flex-col items-center justify-center max-w-md mx-auto text-center border-l-4 border-l-brand-500">
            <Clock className="w-12 h-12 text-brand-500 animate-pulse mb-4" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Active Queue Telemetry</h2>
            
            {activeApt || tokenNo ? (
              <>
                <p className="text-slate-500 text-xs mt-1">Live tracking for {activeApt?.type || 'Consultation'}</p>

                <div className="grid grid-cols-2 gap-4 w-full mt-6 mb-6">
                  <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Your Token</span>
                    <p className="text-3xl font-extrabold text-brand-600 mt-1">{tokenNo || 'A105'}</p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Current Serving</span>
                    <p className="text-3xl font-extrabold text-slate-800 dark:text-white mt-1">A097</p>
                  </div>
                </div>

                <div className="space-y-2 w-full text-left p-4 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/30">
                  <div className="flex justify-between text-xs"><span className="text-slate-500">Queue Position:</span><span className="font-bold text-slate-800 dark:text-white">8 Patients Ahead</span></div>
                  <div className="flex justify-between text-xs mt-1.5"><span className="text-slate-500">Estimated Wait:</span><span className="font-bold text-brand-600">24 Minutes</span></div>
                  <div className="flex justify-between text-xs mt-1.5"><span className="text-slate-500">Consulting Specialist:</span><span className="font-bold text-slate-800 dark:text-white">{doctorName}</span></div>
                </div>
              </>
            ) : (
              <p className="text-sm text-slate-400 italic mt-4">No active queue telemetry. Book an appointment to join the live waitlist.</p>
            )}
          </div>
        );
      })()}

      {/* ─────────────────── TAB: QR CARD ─────────────────── */}
      {activeTab === 'qr' && (
        <div className="glass-card p-8 flex flex-col items-center justify-center max-w-sm mx-auto text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/10 rounded-full blur-xl pointer-events-none" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">CarePulse Smart Pass</h2>
          <p className="text-xs text-slate-500 mt-0.5">Scan at reception for instant check-in</p>

          <div className="p-4 bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg my-6">
            <div className="w-48 h-48 bg-slate-50 dark:bg-slate-800/80 rounded-xl flex items-center justify-center border border-slate-100 dark:border-slate-700/80 relative">
              <QrCode className="w-36 h-36 text-slate-850 dark:text-slate-100" />
              <div className="absolute inset-0 border border-brand-500/40 animate-pulse rounded-xl" />
            </div>
          </div>

          <div className="w-full text-left space-y-2 border-t border-slate-100 dark:border-slate-800 pt-4">
            <div className="flex justify-between text-xs"><span className="text-slate-400">Patient Name:</span><span className="font-bold text-slate-800 dark:text-white">{patientName}</span></div>
            <div className="flex justify-between text-xs"><span className="text-slate-400">MRN:</span><span className="font-bold text-brand-600">{patientMRN}</span></div>
            <div className="flex justify-between text-xs"><span className="text-slate-400">Blood Group:</span><span className="font-bold text-slate-800 dark:text-white">{patientProfile?.bloodGroup || 'O+'}</span></div>
            <div className="flex justify-between text-xs"><span className="text-slate-400">Emergency:</span><span className="font-bold text-slate-800 dark:text-white">{patientProfile?.emergencyCont || '+1 555-0102'}</span></div>
          </div>
        </div>
      )}

      {/* ─────────────────── TAB: AI SYMPTOM CHECKER ─────────────────── */}
      {activeTab === 'symptom-checker' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-card p-6">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <Bot className="w-5 h-5 text-brand-600" /> Clinical Symptom Checker
            </h2>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">Describe your chief complaints in detail (e.g. "I have a sore throat, runny nose and mild dry cough"). The AI checks potential departments.</p>

            <form onSubmit={checkSymptoms} className="space-y-4">
              <textarea 
                required 
                value={symptoms} 
                onChange={e => setSymptoms(e.target.value)}
                rows={4} 
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" 
                placeholder="Describe what you are currently feeling..." 
              />
              <button type="submit" disabled={isAiChecking} className="btn-primary w-full py-2.5 text-sm">
                {isAiChecking ? 'Analyzing clinical telemetry...' : 'Analyze Symptoms'}
              </button>
            </form>
          </div>

          {/* AI Output Result */}
          {aiReport ? (
            <div className="glass-card p-6 border-l-4 border-l-brand-500 bg-brand-500/[0.02]">
              <h3 className="text-sm font-bold text-brand-600 flex items-center gap-1.5"><Sparkles className="w-4 h-4 animate-bounce" /> Clinical Triage Conclusion</h3>
              
              <div className="space-y-3 mt-4">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Urgency Assessment</span>
                  <p className={`text-xs font-extrabold ${aiReport.urgency.includes('STAT') ? 'text-rose-500 animate-pulse' : 'text-slate-800 dark:text-white'}`}>{aiReport.urgency}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Potential Pathologies</span>
                  <p className="text-xs font-semibold text-slate-800 dark:text-white leading-relaxed">{aiReport.conditions}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Department Clinic</span>
                  <p className="text-xs font-semibold text-slate-800 dark:text-white">{aiReport.dept}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Recommended Specialist</span>
                  <p className="text-xs font-semibold text-slate-800 dark:text-white">{aiReport.suggested.name}</p>
                </div>
              </div>

              <button 
                onClick={() => { setSelectedDept(aiReport.dept); setSelectedDoctor(aiReport.suggested); setTab('appointments'); }}
                className="w-full btn-primary py-2 text-xs mt-5"
              >
                Book with {aiReport.suggested.name} Directly
              </button>
            </div>
          ) : (
            <div className="glass-card p-6 flex items-center justify-center text-center text-slate-400 bg-slate-50/20 dark:bg-slate-900/30">
              <p className="text-xs italic">Submit symptom logs to generate triage diagnostics.</p>
            </div>
          )}
        </div>
      )}

      {/* ─────────────────── TAB: INSURANCE ─────────────────── */}
      {activeTab === 'insurance' && (
        <div className="glass-card p-6">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-5">Digital TPA & Active Coverage</h2>
          <div className="space-y-4">
            {[
              { 
                provider: patientProfile?.insuranceProvider || 'No Insurance Registered', 
                policy: patientProfile?.insuranceNumber || 'N/A', 
                limit: '$15,000 Cap', 
                used: '$380.00 Settled', 
                status: patientProfile?.insuranceProvider ? 'ACTIVE' : 'INACTIVE' 
              }
            ].map((ins, idx) => (
              <div key={idx} className="p-5 border border-slate-100 dark:border-slate-800 rounded-xl">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-brand-50 dark:bg-brand-900/30 text-brand-600 rounded-xl"><Shield className="w-6 h-6" /></div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white leading-tight">{ins.provider}</h4>
                      <p className="text-xs text-slate-500 mt-1">Policy: {ins.policy} · Limit: {ins.limit}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    ins.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20' : 'bg-rose-50 text-rose-700 dark:bg-rose-500/20'
                  }`}>{ins.status}</span>
                </div>
                {ins.status === 'ACTIVE' && (
                  <div className="flex justify-between items-center mt-5 text-xs text-slate-500 border-t border-slate-100 dark:border-slate-800/80 pt-3">
                    <span>Co-pay ratio: 10/90</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">Used today: {ins.used}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─────────────────── TAB: DOCUMENTS ─────────────────── */}
      {activeTab === 'documents' && (
        <div className="glass-card p-6">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-5">Patient Health Records DMS Vault</h2>
          <div className="space-y-4">
            {documents.filter(d => d.patientId === patientID).map(doc => (
              <div key={doc.id} className="p-4 border border-slate-100 dark:border-slate-800 rounded-xl flex justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-50 dark:bg-slate-900 text-slate-500 rounded-lg"><FileText className="w-5 h-5" /></div>
                  <div>
                    <h4 className="font-semibold text-slate-850 dark:text-slate-100 text-sm">{doc.name}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{doc.category} • Uploaded {doc.uploadDate}</p>
                  </div>
                </div>
                <button onClick={() => showToast('Opening document vault file...', 'info')} className="btn-secondary py-1 px-3 text-xs">View File</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─────────────────── TAB: SETTINGS ─────────────────── */}
      {activeTab === 'settings' && (
        <div className="glass-card p-6">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-5">Profile Settings</h2>
          <form onSubmit={e => { e.preventDefault(); showToast('Profile settings saved successfully!'); }} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Full Name</label>
                <input required type="text" className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none" defaultValue={patientName} />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Email Address</label>
                <input required type="email" className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none" defaultValue={patientEmail} readOnly />
              </div>
            </div>
            <button type="submit" className="btn-primary py-2 px-4 text-xs mt-3">Save Profile Modifications</button>
          </form>
        </div>
      )}

      {/* Dynamic Teleconsultation Mock call modal */}
      {isVideoOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950 px-4">
          <div className="w-full max-w-4xl h-[85vh] rounded-3xl bg-slate-900 overflow-hidden relative border border-slate-800 shadow-2xl flex flex-col">
            <div className="flex-1 flex relative">
              {/* Doctor Video feed */}
              <div className="absolute inset-0 bg-slate-850 flex items-center justify-center">
                <div className="text-center text-slate-400">
                  <Video className="w-12 h-12 mx-auto animate-pulse mb-3" />
                  <p className="font-semibold text-sm">Consultation Active: Dr. Sarah Jenkins</p>
                  <p className="text-xs mt-1">Telemetry connection stable • 1080p Ultra HD</p>
                </div>
              </div>
              {/* Patient Self-view pip */}
              <div className="absolute top-4 right-4 w-32 h-44 rounded-2xl bg-slate-900 border border-slate-700 overflow-hidden flex items-center justify-center text-[10px] text-slate-500 shadow-xl">
                Self-View (Emma)
              </div>
            </div>
            <div className="p-6 bg-slate-950 border-t border-slate-800 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Teleconsultation Room</span>
                <p className="text-sm font-semibold text-white mt-0.5">Cardiology Exam #4019</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => showToast('Microphone toggled', 'info')} className="btn-secondary text-xs text-white border-slate-800 hover:bg-slate-900">Mute</button>
                <button onClick={() => showToast('Camera toggled', 'info')} className="btn-secondary text-xs text-white border-slate-800 hover:bg-slate-900">Stop Video</button>
                <button onClick={() => { setIsVideoOpen(false); showToast('Teleconsultation ended.', 'info'); }} className="btn-primary py-2 px-4 text-xs bg-rose-600 hover:bg-rose-700 border-rose-600 font-bold rounded-full">Disconnect Call</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
