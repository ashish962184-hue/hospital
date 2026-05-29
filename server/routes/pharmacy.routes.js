import express from 'express';
import { db } from '../db/mockData.js';

const router = express.Router();

router.get('/inventory', (req, res) => {
  res.json(db.pharmacyInventory);
});

export default router;
