import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store';
import EnterpriseLayout from './layouts/EnterpriseLayout';
import Login from './pages/Login';

// Admin
import AdminDashboard from './pages/AdminDashboard';
import HospitalAnalytics from './pages/HospitalAnalytics';

// Doctor
import DoctorDashboard from './pages/DoctorDashboard';

// Nurse
import NurseDashboard from './pages/NurseDashboard';

// Receptionist
import ReceptionistDashboard from './pages/ReceptionistDashboard';

// Lab Tech
import LabDashboard from './pages/LabDashboard';

// Pharmacist
import PharmacistDashboard from './pages/PharmacistDashboard';

// Billing
import BillingDashboard from './pages/BillingDashboard';

// Patient
import PatientDashboard from './pages/PatientDashboard';

// Shared feature pages
import Patients from './pages/Patients';
import Prescriptions from './pages/Prescriptions';
import Appointments from './pages/Appointments';
import Billing from './pages/Billing';
import LabReports from './pages/LabReports';
import Pharmacy from './pages/Pharmacy';
import AIAssistant from './pages/AIAssistant';
import NursingDashboard from './pages/NursingDashboard';
import DirectorDashboard from './pages/DirectorDashboard';
import RadiologyDashboard from './pages/RadiologyDashboard';
import CommandCenter from './pages/CommandCenter';

function App() {
  const initAuth = useStore(state => state.initAuth);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* ── ADMIN Operations Suite ────────────────────────────────────── */}
        <Route element={<EnterpriseLayout allowedRoles={['ADMIN']} />}>
          <Route path="/admin"          element={<AdminDashboard />} />
          <Route path="/analytics"      element={<HospitalAnalytics />} />
          <Route path="/receptionist"   element={<ReceptionistDashboard />} />
          <Route path="/appointments"   element={<Appointments />} />
          <Route path="/admin/patients" element={<Patients />} />
          <Route path="/nurse"          element={<NurseDashboard />} />
          <Route path="/ipd"            element={<NursingDashboard />} />
          <Route path="/lab"            element={<LabDashboard />} />
          <Route path="/reports"        element={<LabReports />} />
          <Route path="/pharmacist"     element={<PharmacistDashboard />} />
          <Route path="/pharmacy"       element={<Pharmacy />} />
          <Route path="/billing-desk"   element={<BillingDashboard />} />
          <Route path="/billing"        element={<Billing />} />
          <Route path="/director"       element={<DirectorDashboard />} />
          <Route path="/command-center" element={<CommandCenter />} />
          <Route path="/radiology"      element={<RadiologyDashboard />} />
        </Route>

        {/* ── DOCTOR Workspace ─────────────────────────────────────────── */}
        <Route element={<EnterpriseLayout allowedRoles={['DOCTOR']} />}>
          <Route path="/doctor"               element={<DoctorDashboard />} />
          <Route path="/doctor/patients"      element={<Patients />} />
          <Route path="/doctor/prescriptions" element={<Prescriptions />} />
          <Route path="/doctor/appointments"  element={<Appointments />} />
        </Route>

        {/* ── Practo-Style PATIENT Portal ───────────────────────────────── */}
        <Route element={<EnterpriseLayout allowedRoles={['PATIENT']} />}>
          <Route path="/patient"                  element={<PatientDashboard />} />
          <Route path="/patient/appointments"     element={<PatientDashboard />} />
          <Route path="/patient/records"          element={<PatientDashboard />} />
          <Route path="/patient/results"          element={<PatientDashboard />} />
          <Route path="/patient/prescriptions"    element={<PatientDashboard />} />
          <Route path="/patient/billing"          element={<PatientDashboard />} />
          <Route path="/patient/reminders"        element={<PatientDashboard />} />
          <Route path="/patient/queue"            element={<PatientDashboard />} />
          <Route path="/patient/qr"               element={<PatientDashboard />} />
          <Route path="/patient/symptom-checker"  element={<PatientDashboard />} />
          <Route path="/patient/insurance"        element={<PatientDashboard />} />
          <Route path="/patient/documents"        element={<PatientDashboard />} />
          <Route path="/patient/settings"         element={<PatientDashboard />} />
        </Route>

        {/* ── Shared / All Authenticated ───────────────────────────────── */}
        <Route element={<EnterpriseLayout />}>
          <Route path="/ai-assistant" element={<AIAssistant />} />
          <Route path="/settings"     element={<div className="p-8 text-slate-800 dark:text-white">Settings Page coming soon...</div>} />
          <Route path="/unauthorized" element={
            <div className="p-8 text-center text-rose-500 font-bold text-xl">
              403 - Access Denied
              <br />
              <span className="text-sm text-slate-500 font-normal">Your role does not have permission to view this page.</span>
            </div>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;