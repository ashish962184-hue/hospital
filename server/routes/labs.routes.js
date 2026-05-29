import express from 'express';
import { db } from '../db/mockData.js';

const router = express.Router();

router.get('/', (req, res) => {
  let list = db.labRequests;
  if (req.user.role === 'PATIENT') {
    const patientId = req.user.patientId || 'p1';
    list = list.filter(lab => lab.patientId === patientId);
  } else if (req.user.role === 'DOCTOR') {
    const doctorId = req.user.doctorId || 'd1';
    const patientIds = db.appointments.filter(a => a.doctorId === doctorId).map(a => a.patientId);
    list = list.filter(lab => patientIds.includes(lab.patientId));
  }

  const populated = list.map(lab => ({
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
