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

export default router;
