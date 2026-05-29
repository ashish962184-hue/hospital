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

export default router;
