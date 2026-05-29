import express from 'express';
import { db } from '../db/mockData.js';

const router = express.Router();

router.get('/inventory', (req, res) => {
  res.json(db.pharmacyInventory);
});

let prescriptionsList = [
  { id: 'RX-001', patientId: 'p1', patient: 'Emma Watson', doctor: 'Dr. Sarah Jenkins', medicines: ['Amoxicillin 500mg', 'Paracetamol 650mg'], status: 'PENDING', time: '09:15 AM' },
  { id: 'RX-002', patientId: 'p2', patient: 'John Doe', doctor: 'Dr. Michael Chen', medicines: ['Lisinopril 10mg'], status: 'DISPENSED', time: '09:45 AM' },
];

// GET /api/pharmacy/prescriptions
router.get('/prescriptions', (req, res) => {
  let list = prescriptionsList;
  if (req.user.role === 'PATIENT') {
    const patientId = req.user.patientId || 'p1';
    list = list.filter(rx => rx.patientId === patientId);
  }
  res.json(list);
});

// POST /api/pharmacy/dispense/:id
router.post('/dispense/:id', (req, res) => {
  const { id } = req.params;
  
  // Decrement inventory stock logic
  db.pharmacyInventory.forEach(item => {
    if (item.stock > 10) item.stock -= 10;
  });

  db.triggerAudit(req.user?.id || 'sys', 'DISPENSE', 'PHARMACY_PRESCRIPTION', `Dispensed prescription ${id} and decremented stocks`);
  res.json({ message: 'Prescription dispensed successfully and stock decremented!' });
});

export default router;
