import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_demo';

// Mock users for the demo
const MOCK_USERS = {
  'admin@demo.com': { id: '1', role: 'ADMIN', name: 'Super Admin', email: 'admin@demo.com' },
  'doctor@demo.com': { id: '2', role: 'DOCTOR', name: 'Dr. Sarah Smith', email: 'doctor@demo.com' },
  'receptionist@demo.com': { id: '3', role: 'RECEPTIONIST', name: 'John Desk', email: 'receptionist@demo.com' },
  'patient@demo.com': { id: '4', role: 'PATIENT', name: 'Emma Johnson', email: 'patient@demo.com' },
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // In demo mode, accept any password as long as the email matches our mock users
    const user = MOCK_USERS[email];
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials. Try admin@demo.com, doctor@demo.com, etc.' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    
    res.json({
      token,
      user
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const me = async (req, res) => {
  // Simple mock 'me' endpoint. Usually reads from JWT.
  res.json({ message: 'Authenticated' });
};
