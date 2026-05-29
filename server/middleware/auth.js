import jwt from 'jsonwebtoken';

let prisma;
try {
  const { PrismaClient } = await import('@prisma/client');
  prisma = new PrismaClient();
} catch (e) {
  // Silent catch for database offline mode
}

export const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'enterprise_super_secret_key_12345');
    req.user = decoded;

    // Standardize role simplification backwards compatibility
    if (req.user.role === 'SUPER_ADMIN' || req.user.role === 'HOSPITAL_DIRECTOR' || req.user.role === 'RECEPTIONIST' || req.user.role === 'NURSE' || req.user.role === 'LAB_TECH' || req.user.role === 'PHARMACIST' || req.user.role === 'BILLING_CLERK' || req.user.role === 'RADIOLOGIST') {
      req.user.role = 'ADMIN';
    }

    // Dynamic Clinical Entity Fallbacks for Demo and Production DB Accounts
    if (req.user.role === 'PATIENT') {
      if (req.user.id === 'mock-pat') {
        req.user.patientId = 'p1';
      } else if (!req.user.patientId && prisma) {
        const profile = await prisma.patientProfile.findUnique({ where: { userId: req.user.id } });
        if (profile) req.user.patientId = profile.id;
      }
    } else if (req.user.role === 'DOCTOR') {
      if (req.user.id === 'mock-doc') {
        req.user.doctorId = 'd1';
      } else if (!req.user.doctorId && prisma) {
        const profile = await prisma.doctorProfile.findUnique({ where: { userId: req.user.id } });
        if (profile) req.user.doctorId = profile.id;
      }
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized - Invalid Token' });
  }
};

export const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    // Normalise roles for checks
    let currentRole = req.user?.role;
    if (allowedRoles.includes('ADMIN') && (currentRole === 'SUPER_ADMIN' || currentRole === 'ADMIN')) {
      return next();
    }
    if (!req.user || !allowedRoles.includes(currentRole)) {
      return res.status(403).json({ 
        message: 'Forbidden - Insufficient permissions to access this resource',
        required: allowedRoles,
        current: currentRole
      });
    }
    next();
  };
};

