import express from 'express';
import { db } from '../db/mockData.js';

const router = express.Router();

router.get('/', (req, res) => {
  // Populate patient and doctor details
  const populated = db.appointments.map(apt => ({
    ...apt,
    patient: db.patients.find(p => p.id === apt.patientId),
    doctor: db.doctors.find(d => d.id === apt.doctorId)
  }));
  res.json(populated);
});

router.post('/', (req, res) => {
  const newApt = {
    id: `a${Date.now()}`,
    status: 'SCHEDULED',
    ...req.body
  };
  db.appointments.push(newApt);
  res.status(201).json(newApt);
});

export default router;
