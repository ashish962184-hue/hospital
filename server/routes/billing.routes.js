import express from 'express';
import { db } from '../db/mockData.js';

const router = express.Router();

router.get('/', (req, res) => {
  const populated = db.invoices.map(inv => ({
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
