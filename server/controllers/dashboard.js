// Mock data for the demo dashboard

export const getAdminStats = async (req, res) => {
  try {
    // Generate realistic looking data for the demo
    const stats = {
      totalPatients: 12450,
      activeDoctors: 45,
      todayAppointments: 184,
      monthlyRevenue: 245000,
      patientChart: [
        { name: 'Jan', inPatient: 400, outPatient: 2400 },
        { name: 'Feb', inPatient: 300, outPatient: 1398 },
        { name: 'Mar', inPatient: 200, outPatient: 9800 },
        { name: 'Apr', inPatient: 278, outPatient: 3908 },
        { name: 'May', inPatient: 189, outPatient: 4800 },
        { name: 'Jun', inPatient: 239, outPatient: 3800 },
      ],
      recentActivity: [
        { id: 1, text: 'Dr. Smith completed 5 appointments', time: '10 mins ago' },
        { id: 2, text: 'New patient registered: Emma Watson', time: '25 mins ago' },
        { id: 3, text: 'Lab report uploaded for Patient #4532', time: '1 hour ago' },
      ]
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getDoctorStats = async (req, res) => {
  try {
    const stats = {
      todayAppointments: 12,
      pendingReports: 4,
      completedAppointments: 5,
      appointments: [
        { id: '101', patientName: 'John Doe', time: '09:00 AM', status: 'COMPLETED', type: 'Checkup' },
        { id: '102', patientName: 'Jane Smith', time: '10:30 AM', status: 'SCHEDULED', type: 'Follow up' },
        { id: '103', patientName: 'Michael Brown', time: '11:15 AM', status: 'SCHEDULED', type: 'Consultation' },
        { id: '104', patientName: 'Emily Davis', time: '02:00 PM', status: 'SCHEDULED', type: 'Checkup' },
      ]
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
