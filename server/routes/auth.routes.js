import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const router = express.Router();

let prisma;
try {
  const { PrismaClient } = await import('@prisma/client');
  prisma = new PrismaClient();
} catch (e) {
  console.log('Prisma client not initialized, running in mock-data mode.');
}

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // 1. Prioritize Simplifed 3-Role Demo Accounts for perfect demos
    if (email === 'admin@nova.com' && password === 'admin') {
      const token = jwt.sign(
        { id: 'mock-admin', role: 'ADMIN', name: 'System Admin' },
        process.env.JWT_SECRET || 'enterprise_super_secret_key_12345',
        { expiresIn: '8h' }
      );
      return res.json({ token, user: { role: 'ADMIN', name: 'System Admin', email } });
    }
    
    if (email === 'doctor@nova.com' && password === 'doctor') {
      const token = jwt.sign(
        { id: 'mock-doc', role: 'DOCTOR', name: 'Dr. Sarah', doctorId: 'd1' },
        process.env.JWT_SECRET || 'enterprise_super_secret_key_12345',
        { expiresIn: '8h' }
      );
      return res.json({ token, user: { role: 'DOCTOR', name: 'Dr. Sarah', email, doctorId: 'd1' } });
    }

    if (email === 'patient@nova.com' && password === 'patient') {
      const token = jwt.sign(
        { id: 'mock-pat', role: 'PATIENT', name: 'Emma Watson', patientId: 'p1' },
        process.env.JWT_SECRET || 'enterprise_super_secret_key_12345',
        { expiresIn: '8h' }
      );
      return res.json({ token, user: { role: 'PATIENT', name: 'Emma Watson', email, patientId: 'p1' } });
    }

    // Automatically map legacy credentials under the ADMINOperations Suite
    if (
      (email === 'reception@nova.com' && password === 'reception') ||
      (email === 'nurse@nova.com' && password === 'nurse') ||
      (email === 'lab@nova.com' && password === 'lab') ||
      (email === 'billing@nova.com' && password === 'billing') ||
      (email === 'pharmacist@nova.com' && password === 'pharmacist') ||
      (email === 'director@nova.com' && password === 'director') ||
      (email === 'radiology@nova.com' && password === 'radiology')
    ) {
      const nameMapping = {
        'reception@nova.com': 'Front Desk Coordinator',
        'nurse@nova.com': 'Head Nurse Mary',
        'lab@nova.com': 'Laboratory Tech Robert',
        'billing@nova.com': 'Billing Supervisor',
        'pharmacist@nova.com': 'Chief Pharmacist Lisa',
        'director@nova.com': 'Hospital Executive Director',
        'radiology@nova.com': 'Dr. John (Radiology Chief)'
      };
      const token = jwt.sign(
        { id: 'mock-admin', role: 'ADMIN', name: nameMapping[email] },
        process.env.JWT_SECRET || 'enterprise_super_secret_key_12345',
        { expiresIn: '8h' }
      );
      return res.json({ token, user: { role: 'ADMIN', name: nameMapping[email], email } });
    }

    // 2. Production Database Verification (Will run if demo accounts aren't used)
    if (!prisma) {
      return res.status(500).json({ message: 'Database connection offline. Please use a demo account.' });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        doctorProfile: true,
        patientProfile: true
      }
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password against DB
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Map database roles to simplified 3-role scheme
    let userRole = 'ADMIN';
    if (user.role === 'PATIENT') userRole = 'PATIENT';
    if (user.role === 'DOCTOR') userRole = 'DOCTOR';

    const patientId = user.patientProfile?.id || null;
    const doctorId = user.doctorProfile?.id || null;

    const token = jwt.sign(
      { id: user.id, role: userRole, name: `${user.firstName} ${user.lastName}`, patientId, doctorId },
      process.env.JWT_SECRET || 'enterprise_super_secret_key_12345',
      { expiresIn: '8h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        role: userRole,
        patientId,
        doctorId
      }
    });

  } catch (error) {
    console.error('Authentication Error:', error.message);
    res.status(500).json({ message: 'Internal server error. Database unreachable.' });
  }
});

// POST /api/auth/register - Modern Visitor Registration Flow
router.post('/register', async (req, res) => {
  const {
    fullName,
    dob,
    gender,
    bloodGroup,
    mobile,
    email,
    password,
    address,
    emergencyContact,
    insuranceProvider,
    insuranceNumber
  } = req.body;

  try {
    const patientId = `p${Date.now()}`;
    const mrn = `MRN-${Math.floor(Math.random() * 9000) + 1000}`;

    const nameParts = fullName.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const newPatient = {
      id: patientId,
      mrn,
      firstName,
      lastName,
      dob: dob || '1995-01-01',
      gender: gender || 'Male',
      bloodGroup: bloodGroup || 'O+',
      phone: mobile || '',
      address: address || '',
      emergencyCont: emergencyContact || '',
      insuranceProvider: insuranceProvider || '',
      insuranceNumber: insuranceNumber || '',
      allergies: [],
      chronicDiseases: []
    };

    db.patients.push(newPatient);

    const token = jwt.sign(
      { id: `u-${patientId}`, role: 'PATIENT', name: fullName, patientId },
      process.env.JWT_SECRET || 'enterprise_super_secret_key_12345',
      { expiresIn: '8h' }
    );

    res.status(201).json({
      token,
      user: {
        role: 'PATIENT',
        name: fullName,
        email,
        patientId
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed due to server error.' });
  }
});

// GET /api/auth/me - Validate token and return user
router.get('/me', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'enterprise_super_secret_key_12345');
    
    // Normalise legacy roles on JWT verification too
    let normalisedRole = decoded.role;
    if (normalisedRole === 'SUPER_ADMIN' || normalisedRole === 'HOSPITAL_DIRECTOR' || normalisedRole === 'RECEPTIONIST' || normalisedRole === 'NURSE' || normalisedRole === 'LAB_TECH' || normalisedRole === 'PHARMACIST' || normalisedRole === 'BILLING_CLERK' || normalisedRole === 'RADIOLOGIST') {
      normalisedRole = 'ADMIN';
    }

    res.json({ user: { ...decoded, role: normalisedRole } });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

export default router;
