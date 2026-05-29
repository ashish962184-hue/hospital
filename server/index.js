import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import dashboardRoutes from './routes/dashboard.js';
import patientRoutes from './routes/patients.routes.js';
import appointmentRoutes from './routes/appointments.routes.js';
import labRoutes from './routes/labs.routes.js';
import pharmacyRoutes from './routes/pharmacy.routes.js';
import billingRoutes from './routes/billing.routes.js';
import { verifyToken } from './middleware/auth.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Basic health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Enterprise HMS API is running' });
});

// Public Enterprise Routes
app.use('/api/auth', authRoutes);

// Protected Enterprise Routes
app.use('/api/dashboard', verifyToken, dashboardRoutes);
app.use('/api/patients', verifyToken, patientRoutes);
app.use('/api/appointments', verifyToken, appointmentRoutes);
app.use('/api/labs', verifyToken, labRoutes);
app.use('/api/pharmacy', verifyToken, pharmacyRoutes);
app.use('/api/billing', verifyToken, billingRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Enterprise HMS Server running on port ${PORT}`);
});