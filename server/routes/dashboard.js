import express from 'express';
import { getAdminStats, getDoctorStats } from '../controllers/dashboard.js';

const router = express.Router();

router.get('/admin', getAdminStats);
router.get('/doctor', getDoctorStats);

export default router;
