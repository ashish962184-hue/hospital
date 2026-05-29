import express from 'express';
import { db } from '../db/mockData.js';

const router = express.Router();

router.get('/', (req, res) => {
  // Enforce role-based access control (RBAC)
  if (req.user.role !== 'ADMIN' && req.user.role !== 'PATIENT' && req.user.role !== 'SUPER_ADMIN') {
    return res.status(403).json({ message: 'Forbidden - Insufficient permissions to view billing records' });
  }

  let list = db.invoices;
  if (req.user.role === 'PATIENT') {
    const patientId = req.user.patientId || 'p1';
    list = list.filter(inv => inv.patientId === patientId);
  }

  const populated = list.map(inv => ({
    ...inv,
    patient: db.patients.find(p => p.id === inv.patientId)
  }));
  res.json(populated);
});

// POST /api/billing/pay/:id
router.post('/pay/:id', (req, res) => {
  const { id } = req.params;
  const { method } = req.body;
  const inv = db.invoices.find(i => i.id === id);
  if (!inv) return res.status(404).json({ message: 'Invoice not found' });
  inv.status = 'PAID';
  
  db.triggerAudit(req.user?.id || 'sys', 'PAY', 'INVOICE', `Collected payment for invoice ${id} via ${method}`);
  res.json({ message: 'Payment recorded successfully', inv });
});

export default router;
