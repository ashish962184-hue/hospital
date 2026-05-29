// In-memory robust mock database to ensure "Single Command" run without requiring PostgreSQL installation.
// This mimics the schema structures perfectly.

export const db = {
  patients: [
    { id: 'p1', mrn: 'MRN-1001', firstName: 'Emma', lastName: 'Watson', dob: '1990-04-15', gender: 'Female', bloodGroup: 'O+', phone: '+1 555-0101', address: '123 Main St, NY', emergencyCont: '+1 555-0102', allergies: ['Penicillin'], chronicDiseases: [] },
    { id: 'p2', mrn: 'MRN-1002', firstName: 'John', lastName: 'Doe', dob: '1985-11-20', gender: 'Male', bloodGroup: 'A+', phone: '+1 555-0201', address: '456 Oak St, CA', emergencyCont: '+1 555-0202', allergies: [], chronicDiseases: ['Hypertension'] },
  ],
  
  doctors: [
    { id: 'd1', userId: 'u1', name: 'Dr. Sarah Jenkins', specialization: 'Cardiology', consultationFee: 150 },
    { id: 'd2', userId: 'u2', name: 'Dr. Michael Chen', specialization: 'Neurology', consultationFee: 200 },
    { id: 'd3', userId: 'u3', name: 'Dr. Emily Brown', specialization: 'Pediatrics', consultationFee: 120 },
  ],

  appointments: [
    { id: 'a1', patientId: 'p1', doctorId: 'd1', date: new Date().toISOString().split('T')[0], timeSlot: '10:00 AM', status: 'SCHEDULED', type: 'Checkup' },
    { id: 'a2', patientId: 'p2', doctorId: 'd2', date: new Date().toISOString().split('T')[0], timeSlot: '11:30 AM', status: 'COMPLETED', type: 'Follow up' },
  ],

  labRequests: [
    { id: 'l1', patientId: 'p1', testName: 'Complete Blood Count', category: 'Pathology', status: 'COMPLETED', results: 'Normal' },
    { id: 'l2', patientId: 'p2', testName: 'Chest X-Ray', category: 'Radiology', status: 'PENDING', results: null },
  ],

  pharmacyInventory: [
    { id: 'm1', name: 'Amoxicillin 500mg', batchNo: 'B-4401', stock: 150, expiryDate: '2027-12-01', price: 15 },
    { id: 'm2', name: 'Paracetamol 650mg', batchNo: 'B-4402', stock: 500, expiryDate: '2028-05-15', price: 5 },
    { id: 'm3', name: 'Lisinopril 10mg', batchNo: 'B-4403', stock: 80, expiryDate: '2026-11-20', price: 25 },
  ],

  invoices: [
    { id: 'inv1', patientId: 'p1', type: 'OPD', totalAmount: 150, status: 'PAID', date: new Date().toISOString() },
    { id: 'inv2', patientId: 'p2', type: 'LAB', totalAmount: 85, status: 'UNPAID', date: new Date().toISOString() },
  ]
};
