import express from 'express';
import { db } from '../db/mockData.js';

const router = express.Router();

// ─── Phase 15: Bed & Room Management ──────────────────────────────────────────
router.get('/beds', (req, res) => {
  res.json(db.beds);
});

router.post('/beds/allocate', (req, res) => {
  const { bedId, patientId } = req.body;
  const bed = db.beds.find(b => b.id === bedId);
  if (!bed) return res.status(404).json({ message: 'Bed not found' });
  bed.status = 'OCCUPIED';
  bed.patientId = patientId;
  db.triggerAudit(req.user?.id || 'sys', 'ALLOCATE', 'BED', `Allocated bed ${bed.number} to patient ${patientId}`);
  res.json({ message: 'Bed allocated successfully', bed });
});

router.post('/beds/status', (req, res) => {
  const { bedId, status } = req.body;
  const bed = db.beds.find(b => b.id === bedId);
  if (!bed) return res.status(404).json({ message: 'Bed not found' });
  bed.status = status;
  if (status === 'AVAILABLE') bed.patientId = null;
  db.triggerAudit(req.user?.id || 'sys', 'UPDATE_STATUS', 'BED', `Updated bed ${bed.number} status to ${status}`);
  res.json({ message: 'Bed status updated', bed });
});

// ─── Phase 16: Operation Theatre (OT) Management ──────────────────────────────
router.get('/ot', (req, res) => {
  const populated = db.otSchedules.map(ot => ({
    ...ot,
    patient: db.patients.find(p => p.id === ot.patientId),
  }));
  res.json(populated);
});

router.post('/ot/schedule', (req, res) => {
  const newOt = {
    id: `ot${Date.now()}`,
    checklist: { preOpVitals: false, consentSigned: false, anesthesiaCleared: false },
    ...req.body,
  };
  db.otSchedules.push(newOt);
  db.triggerAudit(req.user?.id || 'sys', 'CREATE', 'OT_SCHEDULE', `Scheduled surgery for patient ${req.body.patientId}`);
  res.status(201).json(newOt);
});

router.post('/ot/checklist', (req, res) => {
  const { otId, checklist } = req.body;
  const ot = db.otSchedules.find(o => o.id === otId);
  if (!ot) return res.status(404).json({ message: 'OT Schedule not found' });
  ot.checklist = { ...ot.checklist, ...checklist };
  res.json({ message: 'Checklist updated', ot });
});

// ─── Phase 17: Insurance & TPA Management ─────────────────────────────────────
router.get('/insurance/claims', (req, res) => {
  const populated = db.insuranceClaims.map(c => ({
    ...c,
    patient: db.patients.find(p => p.id === c.patientId),
  }));
  res.json(populated);
});

router.post('/insurance/claim', (req, res) => {
  const claim = {
    id: `clm${Date.now()}`,
    status: 'UNDER_REVIEW',
    ...req.body,
  };
  db.insuranceClaims.push(claim);
  db.triggerAudit(req.user?.id || 'sys', 'CREATE', 'CLAIM', `Created claim for invoice ${req.body.invoiceId}`);
  res.status(201).json(claim);
});

router.post('/insurance/approve', (req, res) => {
  const { claimId, status } = req.body;
  const claim = db.insuranceClaims.find(c => c.id === claimId);
  if (!claim) return res.status(404).json({ message: 'Claim not found' });
  claim.status = status;
  if (status === 'APPROVED') {
    claim.settlementDate = new Date().toISOString();
  }
  res.json({ message: `Claim ${status}`, claim });
});

// ─── Phase 18: Staff Management System ────────────────────────────────────────
router.get('/staff', (req, res) => {
  res.json(db.staff);
});

router.post('/staff/attendance', (req, res) => {
  const { staffId, attendance } = req.body;
  const staffMem = db.staff.find(s => s.id === staffId);
  if (!staffMem) return res.status(404).json({ message: 'Staff member not found' });
  staffMem.attendance = attendance;
  res.json({ message: 'Attendance logged', staffMem });
});

// ─── Phase 19: Radiology Department ───────────────────────────────────────────
router.get('/radiology', (req, res) => {
  const populated = db.radiologyRequests.map(rad => ({
    ...rad,
    patient: db.patients.find(p => p.id === rad.patientId),
  }));
  res.json(populated);
});

router.post('/radiology/upload', (req, res) => {
  const { radId, results, status } = req.body;
  const rad = db.radiologyRequests.find(r => r.id === radId);
  if (!rad) return res.status(404).json({ message: 'Radiology request not found' });
  rad.results = results;
  rad.status = status;
  rad.fileUrl = `/samples/mri_brain.png`; // Simulating file upload
  
  db.triggerAudit(req.user?.id || 'sys', 'UPLOAD', 'RADIOLOGY_REPORT', `Uploaded scan for request ${radId}`);
  res.json({ message: 'Radiology scan saved', rad });
});

// ─── Phase 20: Emergency & Triage Management ──────────────────────────────────
router.get('/emergency', (req, res) => {
  const populated = db.emergencyQueue.map(er => ({
    ...er,
    patient: db.patients.find(p => p.id === er.patientId),
  }));
  res.json(populated);
});

router.post('/emergency/triage', (req, res) => {
  const erCase = {
    id: `er${Date.now()}`,
    status: 'IN_TRIAGE',
    ...req.body,
  };
  db.emergencyQueue.push(erCase);
  db.addNotification('DOCTOR', `EMERGENCY ALERT: New ${req.body.triagePriority} case registered!`);
  res.status(201).json(erCase);
});

// ─── Phase 21: Discharge Management ───────────────────────────────────────────
router.get('/discharges', (req, res) => {
  const populated = db.discharges.map(d => ({
    ...d,
    patient: db.patients.find(p => p.id === d.patientId),
  }));
  res.json(populated);
});

router.post('/discharges/clear', (req, res) => {
  const { dischargeId, approvalType } = req.body;
  const dis = db.discharges.find(d => d.id === dischargeId);
  if (!dis) return res.status(404).json({ message: 'Discharge record not found' });
  dis.approvals[approvalType] = true;
  res.json({ message: `Clearance granted for ${approvalType}`, dis });
});

router.post('/discharges/finalize', (req, res) => {
  const { dischargeId, summary } = req.body;
  const dis = db.discharges.find(d => d.id === dischargeId);
  if (!dis) return res.status(404).json({ message: 'Discharge record not found' });
  dis.status = 'DISCHARGED';
  dis.summary = summary;
  db.triggerAudit(req.user?.id || 'sys', 'DISCHARGE', 'PATIENT_PROFILE', `Discharged patient ${dis.patientId}`);
  res.json({ message: 'Discharge finalized successfully', dis });
});

// ─── Phase 30: Blood Bank Management ──────────────────────────────────────────
router.get('/bloodbank/stock', (req, res) => {
  res.json(db.bloodStock);
});

router.post('/bloodbank/issue', (req, res) => {
  const { group, units } = req.body;
  const bStock = db.bloodStock.find(b => b.group === group);
  if (!bStock) return res.status(404).json({ message: 'Blood group not found' });
  if (bStock.units < units) return res.status(400).json({ message: 'Insufficient blood units in inventory' });
  
  bStock.units -= units;
  if (bStock.units <= 2) {
    bStock.status = 'CRITICAL';
    db.addNotification('DOCTOR', `CRITICAL SHORTAGE: Blood group ${group} is critically low!`);
  } else if (bStock.units <= 5) {
    bStock.status = 'LOW';
  }
  
  res.json({ message: `Issued ${units} units of ${group}`, bStock });
});

// ─── Phase 34: Document Management System (DMS) ───────────────────────────────
router.get('/documents', (req, res) => {
  res.json(db.documents);
});

router.post('/documents/upload', (req, res) => {
  const newDoc = {
    id: `doc${Date.now()}`,
    uploadDate: new Date().toISOString().split('T')[0],
    ...req.body,
  };
  db.documents.push(newDoc);
  res.status(201).json(newDoc);
});

// ─── Phase 35: Digital Consent Management ─────────────────────────────────────
router.get('/consents', (req, res) => {
  res.json(db.consents);
});

router.post('/consents/sign', (req, res) => {
  const newConsent = {
    id: `cns${Date.now()}`,
    signedDate: new Date().toISOString().split('T')[0],
    ...req.body,
  };
  db.consents.push(newConsent);
  res.status(201).json(newConsent);
});

// ─── Phase 36: Medical Certificate System ─────────────────────────────────────
router.get('/certificates', (req, res) => {
  res.json(db.certificates);
});

router.post('/certificates/create', (req, res) => {
  const newCert = {
    id: `cert${Date.now()}`,
    ...req.body,
  };
  db.certificates.push(newCert);
  res.status(201).json(newCert);
});

// ─── Phase 37: Chronic Disease Management ─────────────────────────────────────
router.get('/chronic', (req, res) => {
  res.json(db.chronicDisease);
});

router.post('/chronic/update', (req, res) => {
  const { patientId, adherence } = req.body;
  const chronic = db.chronicDisease.find(c => c.patientId === patientId);
  if (chronic) {
    chronic.adherence = adherence;
    chronic.lastCheck = new Date().toISOString().split('T')[0];
    return res.json(chronic);
  }
  res.status(404).json({ message: 'Patient chronic disease file not found' });
});

// ─── Phase 38: Vaccination Management ─────────────────────────────────────────
router.get('/vaccinations', (req, res) => {
  res.json(db.vaccinations);
});

// ─── Phase 27: Enterprise Notification Center ─────────────────────────────────
router.get('/notifications', (req, res) => {
  res.json(db.notifications);
});

router.post('/notifications/read', (req, res) => {
  const { id } = req.body;
  const ntf = db.notifications.find(n => n.id === id);
  if (ntf) ntf.read = true;
  res.json({ message: 'Notification read' });
});

// ─── Phase 25: Compliance Audit Trail ─────────────────────────────────────────
router.get('/audit', (req, res) => {
  res.json(db.auditTrail);
});

export default router;
