import express from 'express';
import { db } from '../db/mockData.js';

const router = express.Router();

router.get('/', (req, res) => {
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
  const patient = db.patients.find(p => p.id === req.params.id);
  if (!patient) return res.status(404).json({ message: 'Patient not found' });
  res.json(patient);
});

export default router;
