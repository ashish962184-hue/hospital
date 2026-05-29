import express from 'express';
import { db } from '../db/mockData.js';

const router = express.Router();

router.get('/', (req, res) => {
  if (req.user.role === 'PATIENT') {
    const patientId = req.user.patientId || 'p1';
    return res.json(db.patients.filter(p => p.id === patientId));
  }
  res.json(db.patients);
});

router.post('/', (req, res) => {
  const newPatient = {
    id: `p${Date.now()}`,
    mrn: `MRN-${Math.floor(Math.random() * 9000) + 1000}`,
    ...req.body,
    allergies: req.body.allergies || [],
    chronicDiseases: req.body.chronicDiseases || []
  };
  db.patients.push(newPatient);
  res.status(201).json(newPatient);
});

router.get('/:id', (req, res) => {
  if (req.user.role === 'PATIENT' && req.params.id !== req.user.patientId) {
    return res.status(403).json({ message: 'Forbidden - You cannot access other patients\' files' });
  }
  const patient = db.patients.find(p => p.id === req.params.id);
  if (!patient) return res.status(404).json({ message: 'Patient not found' });
  res.json(patient);
});

export default router;
