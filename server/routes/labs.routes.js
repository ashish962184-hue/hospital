import express from 'express';
import { db } from '../db/mockData.js';

const router = express.Router();

router.get('/', (req, res) => {
  const populated = db.labRequests.map(lab => ({
    ...lab,
    patient: db.patients.find(p => p.id === lab.patientId)
  }));
  res.json(populated);
});

router.post('/', (req, res) => {
  const newLab = {
    id: `l${Date.now()}`,
    status: 'PENDING',
    ...req.body
  };
  db.labRequests.push(newLab);
  res.status(201).json(newLab);
});

router.patch('/:id/complete', (req, res) => {
  const { id } = req.params;
  const { results, status } = req.body;
  const lab = db.labRequests.find(l => l.id === id);
  if (!lab) return res.status(404).json({ message: 'Lab request not found' });
  lab.results = results;
  lab.status = status || 'COMPLETED';
  res.json({ message: 'Lab request completed successfully', lab });
});

export default router;
