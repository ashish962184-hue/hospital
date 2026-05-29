import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // 1. Prioritize Demo Accounts to avoid Database connection errors on local machines without PostgreSQL
    if (email === 'admin@nova.com' && password === 'admin') {
      const token = jwt.sign(
        { id: 'mock-admin', role: 'SUPER_ADMIN', name: 'System Admin' },
        process.env.JWT_SECRET || 'enterprise_super_secret_key_12345',
        { expiresIn: '8h' }
      );
      return res.json({ token, user: { role: 'SUPER_ADMIN', name: 'System Admin', email } });
    }
    
    if (email === 'doctor@nova.com' && password === 'doctor') {
      const token = jwt.sign(
        { id: 'mock-doc', role: 'DOCTOR', name: 'Dr. Sarah' },
        process.env.JWT_SECRET || 'enterprise_super_secret_key_12345',
        { expiresIn: '8h' }
      );
      return res.json({ token, user: { role: 'DOCTOR', name: 'Dr. Sarah', email } });
    }
    if (email === 'reception@nova.com' && password === 'reception') {
      const token = jwt.sign(
        { id: 'mock-rec', role: 'RECEPTIONIST', name: 'Front Desk' },
        process.env.JWT_SECRET || 'enterprise_super_secret_key_12345',
        { expiresIn: '8h' }
      );
      return res.json({ token, user: { role: 'RECEPTIONIST', name: 'Front Desk', email } });
    }

    if (email === 'nurse@nova.com' && password === 'nurse') {
      const token = jwt.sign(
        { id: 'mock-nurse', role: 'NURSE', name: 'Head Nurse' },
        process.env.JWT_SECRET || 'enterprise_super_secret_key_12345',
        { expiresIn: '8h' }
      );
      return res.json({ token, user: { role: 'NURSE', name: 'Head Nurse', email } });
    }

    if (email === 'lab@nova.com' && password === 'lab') {
      const token = jwt.sign(
        { id: 'mock-lab', role: 'LAB_TECH', name: 'Lab Technician' },
        process.env.JWT_SECRET || 'enterprise_super_secret_key_12345',
        { expiresIn: '8h' }
      );
      return res.json({ token, user: { role: 'LAB_TECH', name: 'Lab Technician', email } });
    }

    if (email === 'billing@nova.com' && password === 'billing') {
      const token = jwt.sign(
        { id: 'mock-bil', role: 'BILLING_CLERK', name: 'Finance Clerk' },
        process.env.JWT_SECRET || 'enterprise_super_secret_key_12345',
        { expiresIn: '8h' }
      );
      return res.json({ token, user: { role: 'BILLING_CLERK', name: 'Finance Clerk', email } });
    }

    if (email === 'patient@nova.com' && password === 'patient') {
      const token = jwt.sign(
        { id: 'mock-pat', role: 'PATIENT', name: 'Emma Watson' },
        process.env.JWT_SECRET || 'enterprise_super_secret_key_12345',
        { expiresIn: '8h' }
      );
      return res.json({ token, user: { role: 'PATIENT', name: 'Emma Watson', email } });
    }

    if (email === 'pharmacist@nova.com' && password === 'pharmacist') {
      const token = jwt.sign(
        { id: 'mock-pharma', role: 'PHARMACIST', name: 'Pharma Staff' },
        process.env.JWT_SECRET || 'enterprise_super_secret_key_12345',
        { expiresIn: '8h' }
      );
      return res.json({ token, user: { role: 'PHARMACIST', name: 'Pharma Staff', email } });
    }

    if (email === 'director@nova.com' && password === 'director') {
      const token = jwt.sign(
        { id: 'mock-director', role: 'HOSPITAL_DIRECTOR', name: 'Hospital Director' },
        process.env.JWT_SECRET || 'enterprise_super_secret_key_12345',
        { expiresIn: '8h' }
      );
      return res.json({ token, user: { role: 'HOSPITAL_DIRECTOR', name: 'Hospital Director', email } });
    }

    if (email === 'radiology@nova.com' && password === 'radiology') {
      const token = jwt.sign(
        { id: 'mock-radiology', role: 'RADIOLOGIST', name: 'Dr. John (Radiologist)' },
        process.env.JWT_SECRET || 'enterprise_super_secret_key_12345',
        { expiresIn: '8h' }
      );
      return res.json({ token, user: { role: 'RADIOLOGIST', name: 'Dr. John (Radiologist)', email } });
    }

    // 2. Production Database Verification (Will run if demo accounts aren't used)
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password against DB
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Map database roles to frontend equivalents
    let userRole = user.role;
    if (userRole === 'LAB_TECHNICIAN') userRole = 'LAB_TECH';
    if (userRole === 'BILLING_STAFF') userRole = 'BILLING_CLERK';

    const token = jwt.sign(
      { id: user.id, role: userRole, name: `${user.firstName} ${user.lastName}` },
      process.env.JWT_SECRET || 'enterprise_super_secret_key_12345',
      { expiresIn: '8h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        role: userRole
      }
    });

  } catch (error) {
    console.error('Authentication Error:', error.message);
    res.status(500).json({ message: 'Internal server error. Database unreachable.' });
  }
});

// GET /api/auth/me - Validate token and return user
router.get('/me', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'enterprise_super_secret_key_12345');
    res.json({ user: decoded });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

export default router;
