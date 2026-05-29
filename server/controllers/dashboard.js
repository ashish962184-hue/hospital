import { db } from '../db/mockData.js';

export const getAdminStats = async (req, res) => {
  try {
    const totalPatients = db.patients.length;
    const activeDoctors = db.doctors.length;
    const todayAppointments = db.appointments.filter(a => a.date === new Date().toISOString().split('T')[0]).length;
    const monthlyRevenue = db.invoices.reduce((acc, inv) => acc + (inv.status === 'PAID' ? inv.totalAmount : 0), 0);

    const stats = {
      totalPatients: totalPatients || 12450,
      activeDoctors: activeDoctors || 45,
      todayAppointments: todayAppointments || 184,
      monthlyRevenue: monthlyRevenue || 245000,
      patientChart: [
        { name: 'Jan', inPatient: 400, outPatient: 2400 },
        { name: 'Feb', inPatient: 300, outPatient: 1398 },
        { name: 'Mar', inPatient: 200, outPatient: 9800 },
        { name: 'Apr', inPatient: 278, outPatient: 3908 },
        { name: 'May', inPatient: 189, outPatient: 4800 },
        { name: 'Jun', inPatient: 239, outPatient: 3800 },
      ],
      recentActivity: db.auditTrail.slice(0, 5).map((aud, index) => ({
        id: index + 1,
        text: `${aud.action} performed by ${aud.userId} on ${aud.entity}: ${aud.details}`,
        time: 'Just now'
      }))
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getDoctorStats = async (req, res) => {
  try {
    const doctorId = req.user.doctorId || 'd1';
    
    // Filter appointments for this specific doctor
    const doctorAppointments = db.appointments.filter(a => a.doctorId === doctorId);
    
    const todayDateStr = new Date().toISOString().split('T')[0];
    const todayAppointments = doctorAppointments.filter(a => a.date === todayDateStr);
    const completedAppointments = doctorAppointments.filter(a => a.status === 'COMPLETED');
    
    // Find pending lab/radiology requests assigned to doctor's patients or OT schedules
    const pendingReports = db.labRequests.filter(lr => lr.status === 'PENDING').length + 
                           db.radiologyRequests.filter(rr => rr.status === 'PENDING').length;

    const mappedAppointments = doctorAppointments.map(a => {
      const pat = db.patients.find(p => p.id === a.patientId);
      return {
        id: a.id,
        patientName: pat ? `${pat.firstName} ${pat.lastName}` : 'Unknown Patient',
        time: a.timeSlot,
        status: a.status,
        type: a.type
      };
    });

    const stats = {
      todayAppointments: todayAppointments.length,
      pendingReports: pendingReports,
      completedAppointments: completedAppointments.length,
      appointments: mappedAppointments
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
