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

        {/* ── Super Admin ──────────────────────────────────────────────── */}
        <Route element={<EnterpriseLayout allowedRoles={['SUPER_ADMIN', 'HOSPITAL_DIRECTOR']} />}>
          <Route path="/admin"     element={<AdminDashboard />} />
          <Route path="/analytics" element={<HospitalAnalytics />} />
        </Route>

        {/* ── Receptionist ─────────────────────────────────────────────── */}
        <Route element={<EnterpriseLayout allowedRoles={['RECEPTIONIST']} />}>
          <Route path="/receptionist"  element={<ReceptionistDashboard />} />
          <Route path="/appointments"  element={<Appointments />} />
          <Route path="/admin/patients" element={<Patients />} />
        </Route>

        {/* ── Nurse ────────────────────────────────────────────────────── */}
        <Route element={<EnterpriseLayout allowedRoles={['NURSE', 'DOCTOR']} />}>
          <Route path="/nurse" element={<NurseDashboard />} />
          <Route path="/ipd"   element={<NursingDashboard />} />
        </Route>

        {/* ── Doctor ───────────────────────────────────────────────────── */}
        <Route element={<EnterpriseLayout allowedRoles={['DOCTOR']} />}>
          <Route path="/doctor"               element={<DoctorDashboard />} />
          <Route path="/doctor/patients"      element={<Patients />} />
          <Route path="/doctor/prescriptions" element={<Prescriptions />} />
          <Route path="/doctor/appointments"  element={<Appointments />} />
        </Route>

        {/* ── Lab Tech ─────────────────────────────────────────────────── */}
        <Route element={<EnterpriseLayout allowedRoles={['LAB_TECH', 'DOCTOR']} />}>
          <Route path="/lab"     element={<LabDashboard />} />
          <Route path="/reports" element={<LabReports />} />
        </Route>

        {/* ── Pharmacist ───────────────────────────────────────────────── */}
        <Route element={<EnterpriseLayout allowedRoles={['PHARMACIST']} />}>
          <Route path="/pharmacist" element={<PharmacistDashboard />} />
          <Route path="/pharmacy"   element={<Pharmacy />} />
        </Route>

        {/* ── Billing Clerk ─────────────────────────────────────────────── */}
        <Route element={<EnterpriseLayout allowedRoles={['BILLING_CLERK']} />}>
          <Route path="/billing-desk" element={<BillingDashboard />} />
          <Route path="/billing"      element={<Billing />} />
        </Route>

        {/* ── Patient Portal ───────────────────────────────────────────── */}
        <Route element={<EnterpriseLayout allowedRoles={['PATIENT']} />}>
          <Route path="/patient"              element={<PatientDashboard />} />
          <Route path="/patient/appointments" element={<Appointments />} />
          <Route path="/patient/results"      element={<LabReports />} />
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