// In-memory robust mock database to ensure "Single Command" run without requiring PostgreSQL installation.
// Standardized and upgraded to Enterprise Hospital Suite v2.0.

export const db = {
  patients: [
    { id: 'p1', mrn: 'MRN-1001', firstName: 'Emma', lastName: 'Watson', dob: '1990-04-15', gender: 'Female', bloodGroup: 'O+', phone: '+1 555-0101', address: '123 Main St, NY', emergencyCont: '+1 555-0102', allergies: ['Penicillin'], chronicDiseases: ['Diabetes'] },
    { id: 'p2', mrn: 'MRN-1002', firstName: 'John', lastName: 'Doe', dob: '1985-11-20', gender: 'Male', bloodGroup: 'A+', phone: '+1 555-0201', address: '456 Oak St, CA', emergencyCont: '+1 555-0202', allergies: [], chronicDiseases: ['Hypertension'] },
  ],
  
  doctors: [
    { id: 'd1', userId: 'u1', name: 'Dr. Sarah Jenkins', specialization: 'Cardiology', consultationFee: 150 },
    { id: 'd2', userId: 'u2', name: 'Dr. Michael Chen', specialization: 'Neurology', consultationFee: 200 },
    { id: 'd3', userId: 'u3', name: 'Dr. Emily Brown', specialization: 'Pediatrics', consultationFee: 120 },
  ],

  appointments: [
    { id: 'a1', patientId: 'p1', doctorId: 'd1', date: new Date().toISOString().split('T')[0], timeSlot: '10:00 AM', status: 'SCHEDULED', type: 'Checkup' },
    { id: 'a2', patientId: 'p2', doctorId: 'd2', date: new Date().toISOString().split('T')[0], timeSlot: '11:30 AM', status: 'COMPLETED', type: 'Follow up' },
  ],

  labRequests: [
    { id: 'l1', patientId: 'p1', testName: 'Complete Blood Count', category: 'Pathology', status: 'COMPLETED', results: 'Normal', priority: 'ROUTINE' },
    { id: 'l2', patientId: 'p2', testName: 'Chest X-Ray', category: 'Radiology', status: 'PENDING', results: null, priority: 'STAT' },
  ],

  pharmacyInventory: [
    { id: 'm1', name: 'Amoxicillin 500mg', batchNo: 'B-4401', stock: 150, expiryDate: '2027-12-01', price: 15 },
    { id: 'm2', name: 'Paracetamol 650mg', batchNo: 'B-4402', stock: 500, expiryDate: '2028-05-15', price: 5 },
    { id: 'm3', name: 'Lisinopril 10mg', batchNo: 'B-4403', stock: 80, expiryDate: '2026-11-20', price: 25 },
  ],

  invoices: [
    { id: 'inv1', patientId: 'p1', type: 'OPD', totalAmount: 150, status: 'PAID', date: new Date().toISOString() },
    { id: 'inv2', patientId: 'p2', type: 'LAB', totalAmount: 85, status: 'UNPAID', date: new Date().toISOString() },
  ],

  // ─── HMS v2.0 Operations & Specialized Clinical Databases ───────────────────
  beds: [
    { id: 'b1', number: '101-A', ward: 'Cardiology', room: '101', type: 'GENERAL', status: 'OCCUPIED', patientId: 'p1' },
    { id: 'b2', number: '101-B', ward: 'Cardiology', room: '101', type: 'GENERAL', status: 'AVAILABLE', patientId: null },
    { id: 'b3', number: 'ICU-01', ward: 'ICU', room: '201', type: 'ICU', status: 'OCCUPIED', patientId: 'p2' },
    { id: 'b4', number: 'ICU-02', ward: 'ICU', room: '201', type: 'ICU', status: 'CLEANING', patientId: null },
    { id: 'b5', number: '202-A', ward: 'Neurology', room: '202', type: 'GENERAL', status: 'MAINTENANCE', patientId: null },
  ],

  otSchedules: [
    { id: 'ot1', patientId: 'p1', surgeon: 'Dr. Sarah Jenkins', procedure: 'Coronary Angioplasty', otRoom: 'OT-01', date: new Date().toISOString().split('T')[0], time: '09:00 AM', status: 'COMPLETED', checklist: { preOpVitals: true, consentSigned: true, anesthesiaCleared: true } },
    { id: 'ot2', patientId: 'p2', surgeon: 'Dr. Michael Chen', procedure: 'Craniotomy', otRoom: 'OT-02', date: new Date().toISOString().split('T')[0], time: '11:00 AM', status: 'IN_PROGRESS', checklist: { preOpVitals: true, consentSigned: true, anesthesiaCleared: false } },
  ],

  insuranceClaims: [
    { id: 'clm1', invoiceId: 'inv1', patientId: 'p1', provider: 'BlueCross Health', claimAmount: 150, status: 'APPROVED', settlementDate: new Date().toISOString() },
    { id: 'clm2', invoiceId: 'inv2', patientId: 'p2', provider: 'Aetna Insurance', claimAmount: 85, status: 'UNDER_REVIEW', settlementDate: null },
  ],

  staff: [
    { id: 'stf1', name: 'Dr. Sarah Jenkins', role: 'DOCTOR', dept: 'Cardiology', attendance: 'PRESENT', shift: 'DAY', performance: 95 },
    { id: 'stf2', name: 'Head Nurse Mary', role: 'NURSE', dept: 'Cardiology', attendance: 'PRESENT', shift: 'DAY', performance: 92 },
    { id: 'stf3', name: 'Tech Robert', role: 'LAB_TECH', dept: 'Laboratory', attendance: 'PRESENT', shift: 'NIGHT', performance: 88 },
    { id: 'stf4', name: 'Pharma Lisa', role: 'PHARMACIST', dept: 'Pharmacy', attendance: 'ABSENT', shift: 'DAY', performance: 90 },
  ],

  radiologyRequests: [
    { id: 'rad1', patientId: 'p1', scanType: 'MRI Brain', priority: 'URGENT', status: 'COMPLETED', results: 'Normal scan, no lesions found.', fileUrl: '/samples/mri_brain.png' },
    { id: 'rad2', patientId: 'p2', scanType: 'CT Abdomen', priority: 'STAT', status: 'PENDING', results: null, fileUrl: null },
  ],

  emergencyQueue: [
    { id: 'er1', patientId: 'p1', triagePriority: 'HIGH', triageNurse: 'Head Nurse Mary', assignedDoctorId: 'd1', status: 'ADMITTED', notes: 'Chest pain, elevated heart rate.' },
    { id: 'er2', patientId: 'p2', triagePriority: 'CRITICAL', triageNurse: 'Nurse John', assignedDoctorId: 'd2', status: 'IN_TRIAGE', notes: 'Severe head trauma from fall.' },
  ],

  discharges: [
    { id: 'dis1', patientId: 'p1', status: 'DISCHARGED', approvals: { doctor: true, nurse: true, lab: true, pharmacy: true, billing: true }, summary: 'Patient recovered fully from minor cardiac checkup.' },
    { id: 'dis2', patientId: 'p2', status: 'PENDING', approvals: { doctor: true, nurse: false, lab: true, pharmacy: false, billing: false }, summary: 'Post-op observation under neurology monitoring.' },
  ],

  documents: [
    { id: 'doc1', patientId: 'p1', category: 'Prescription', name: 'Jane Roe - Cardiology Rx.pdf', uploadDate: '2026-05-28', url: '/dms/rx1.pdf' },
    { id: 'doc2', patientId: 'p2', category: 'Consent', name: 'John Doe - Craniotomy Consent.pdf', uploadDate: '2026-05-29', url: '/dms/consent2.pdf' },
  ],

  consents: [
    { id: 'cns1', patientId: 'p1', type: 'MRI Consent', signedBy: 'Emma Watson', signedDate: '2026-05-28', verifiedBy: 'Dr. Sarah Jenkins' },
    { id: 'cns2', patientId: 'p2', type: 'Surgery Consent', signedBy: 'John Doe', signedDate: '2026-05-29', verifiedBy: 'Dr. Michael Chen' },
  ],

  certificates: [
    { id: 'cert1', patientId: 'p1', type: 'Sick Leave Certificate', doctor: 'Dr. Sarah Jenkins', startDate: '2026-05-28', duration: '3 Days', reason: 'Post-cardiac minor observation recovery.' },
  ],

  chronicDisease: [
    { id: 'chr1', patientId: 'p1', condition: 'Diabetes', riskLevel: 'MEDIUM', adherence: 88, lastCheck: '2026-05-15' },
    { id: 'chr2', patientId: 'p2', condition: 'Hypertension', riskLevel: 'HIGH', adherence: 74, lastCheck: '2026-05-20' },
  ],

  vaccinations: [
    { id: 'vac1', patientId: 'p1', vaccine: 'Hepatitis B', doseNo: 1, dateAdministered: '2026-01-15', nextDueDate: '2026-07-15' },
    { id: 'vac2', patientId: 'p2', vaccine: 'Tetanus Toxoid', doseNo: 3, dateAdministered: '2025-11-20', nextDueDate: '2028-11-20' },
  ],

  auditTrail: [
    { id: 'aud1', userId: 'mock-admin', action: 'LOGIN', entity: 'USER', details: 'Admin logged in from demo pre-fill.', timestamp: new Date().toISOString() },
    { id: 'aud2', userId: 'mock-doc', action: 'VIEW_RECORD', entity: 'PATIENT_PROFILE', details: 'Dr. Sarah viewed patient p1 record.', timestamp: new Date().toISOString() },
  ],

  notifications: [
    { id: 'ntf1', recipientRole: 'DOCTOR', text: 'New critical triage alert issued for Bed ICU-01!', read: false, time: '2 mins ago' },
    { id: 'ntf2', recipientRole: 'RECEPTIONIST', text: 'Ambulance dispatcher reports pickup of trauma patient.', read: true, time: '1 hour ago' },
  ],

  bloodStock: [
    { id: 'bg1', group: 'A+', units: 12, status: 'NORMAL' },
    { id: 'bg2', group: 'A-', units: 4, status: 'LOW' },
    { id: 'bg3', group: 'B+', units: 18, status: 'NORMAL' },
    { id: 'bg4', group: 'B-', units: 3, status: 'LOW' },
    { id: 'bg5', group: 'O+', units: 25, status: 'NORMAL' },
    { id: 'bg6', group: 'O-', units: 2, status: 'CRITICAL' },
    { id: 'bg7', group: 'AB+', units: 8, status: 'NORMAL' },
    { id: 'bg8', group: 'AB-', units: 1, status: 'CRITICAL' },
  ],

  bloodDonors: [
    { id: 'bd1', name: 'Amit Patel', group: 'O+', contact: '+1 555-0301', lastDonation: '2026-02-14' },
    { id: 'bd2', name: 'Nisha Kapoor', group: 'A-', contact: '+1 555-0302', lastDonation: '2026-03-22' },
  ],

  // ─── HMS v2.0 Helper Relational Methods ─────────────────────────────────────
  triggerAudit(userId, action, entity, details) {
    const log = {
      id: `aud${Date.now()}`,
      userId,
      action,
      entity,
      details,
      timestamp: new Date().toISOString()
    };
    this.auditTrail.unshift(log);
  },

  addNotification(recipientRole, text) {
    const notify = {
      id: `ntf${Date.now()}`,
      recipientRole,
      text,
      read: false,
      time: 'Just now'
    };
    this.notifications.unshift(notify);
  }
};
