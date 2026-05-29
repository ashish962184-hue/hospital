import { create } from 'zustand';

export const useStore = create((set, get) => ({
  // Authentication State
  user: null,
  token: localStorage.getItem('hms_token') || null,
  isAuthenticated: !!localStorage.getItem('hms_token'),
  
  login: (userData, token) => {
    localStorage.setItem('hms_token', token);
    localStorage.setItem('hms_user', JSON.stringify(userData));
    set({ user: userData, token, isAuthenticated: true });
  },
  
  logout: () => {
    localStorage.removeItem('hms_token');
    localStorage.removeItem('hms_user');
    set({ user: null, token: null, isAuthenticated: false });
  },

  initAuth: () => {
    try {
      const storedUser = localStorage.getItem('hms_user');
      if (storedUser) {
        set({ user: JSON.parse(storedUser) });
      }
    } catch (e) {
      console.error('Failed to parse stored user', e);
    }
  },

  // UI State
  isMobileMenuOpen: false,
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),

  toast: null,
  showToast: (message, type = 'success') => {
    const id = Date.now();
    set({ toast: { message, type, id } });
    setTimeout(() => {
      set((state) => state.toast?.id === id ? { ...state, toast: null } : state);
    }, 3000);
  },
  hideToast: () => set({ toast: null }),

  // ─── HMS v2.0 Global Operations State ───────────────────────────────────────
  beds: [],
  surgeries: [],
  claims: [],
  staff: [],
  scans: [],
  emergencyQueue: [],
  discharges: [],
  notifications: [],
  auditLogs: [],
  bloodStock: [],
  documents: [],
  consents: [],
  certificates: [],
  chronicDisease: [],
  vaccinations: [],

  // Helper fetch parameters
  getAuthHeaders: () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${get().token}`
  }),

  // Beds Action API
  fetchBeds: async () => {
    try {
      const res = await fetch('/api/advanced/beds', { headers: get().getAuthHeaders() });
      if (res.ok) set({ beds: await res.json() });
    } catch (e) {
      console.error('Failed to fetch beds', e);
    }
  },

  allocateBed: async (bedId, patientId) => {
    try {
      const res = await fetch('/api/advanced/beds/allocate', {
        method: 'POST',
        headers: get().getAuthHeaders(),
        body: JSON.stringify({ bedId, patientId })
      });
      if (res.ok) {
        await get().fetchBeds();
        get().showToast('Bed allocated successfully!', 'success');
      }
    } catch (e) {
      get().showToast('Failed to allocate bed', 'error');
    }
  },

  updateBedStatus: async (bedId, status) => {
    try {
      const res = await fetch('/api/advanced/beds/status', {
        method: 'POST',
        headers: get().getAuthHeaders(),
        body: JSON.stringify({ bedId, status })
      });
      if (res.ok) {
        await get().fetchBeds();
        get().showToast(`Bed marked as ${status.toLowerCase()}`, 'success');
      }
    } catch (e) {
      get().showToast('Failed to update bed status', 'error');
    }
  },

  // Surgeries Action API
  fetchSurgeries: async () => {
    try {
      const res = await fetch('/api/advanced/ot', { headers: get().getAuthHeaders() });
      if (res.ok) set({ surgeries: await res.json() });
    } catch (e) {
      console.error('Failed to fetch surgeries', e);
    }
  },

  scheduleSurgery: async (surgeryData) => {
    try {
      const res = await fetch('/api/advanced/ot/schedule', {
        method: 'POST',
        headers: get().getAuthHeaders(),
        body: JSON.stringify(surgeryData)
      });
      if (res.ok) {
        await get().fetchSurgeries();
        get().showToast('Surgery scheduled successfully!', 'success');
      }
    } catch (e) {
      get().showToast('Failed to schedule surgery', 'error');
    }
  },

  // Claims Action API
  fetchClaims: async () => {
    try {
      const res = await fetch('/api/advanced/insurance/claims', { headers: get().getAuthHeaders() });
      if (res.ok) set({ claims: await res.json() });
    } catch (e) {
      console.error('Failed to fetch claims', e);
    }
  },

  approveClaim: async (claimId, status) => {
    try {
      const res = await fetch('/api/advanced/insurance/approve', {
        method: 'POST',
        headers: get().getAuthHeaders(),
        body: JSON.stringify({ claimId, status })
      });
      if (res.ok) {
        await get().fetchClaims();
        get().showToast(`Claim marked as ${status.toLowerCase()}`, 'success');
      }
    } catch (e) {
      get().showToast('Failed to update claim', 'error');
    }
  },

  // HR Staff Action API
  fetchStaff: async () => {
    try {
      const res = await fetch('/api/advanced/staff', { headers: get().getAuthHeaders() });
      if (res.ok) set({ staff: await res.json() });
    } catch (e) {
      console.error('Failed to fetch staff list', e);
    }
  },

  logAttendance: async (staffId, attendance) => {
    try {
      const res = await fetch('/api/advanced/staff/attendance', {
        method: 'POST',
        headers: get().getAuthHeaders(),
        body: JSON.stringify({ staffId, attendance })
      });
      if (res.ok) {
        await get().fetchStaff();
        get().showToast('Attendance logged successfully!', 'success');
      }
    } catch (e) {
      get().showToast('Failed to log attendance', 'error');
    }
  },

  // Radiology Action API
  fetchScans: async () => {
    try {
      const res = await fetch('/api/advanced/radiology', { headers: get().getAuthHeaders() });
      if (res.ok) set({ scans: await res.json() });
    } catch (e) {
      console.error('Failed to fetch radiology scans', e);
    }
  },

  uploadScan: async (radId, results, status) => {
    try {
      const res = await fetch('/api/advanced/radiology/upload', {
        method: 'POST',
        headers: get().getAuthHeaders(),
        body: JSON.stringify({ radId, results, status })
      });
      if (res.ok) {
        await get().fetchScans();
        get().showToast('Diagnostic scan verified and released!', 'success');
      }
    } catch (e) {
      get().showToast('Failed to upload scan', 'error');
    }
  },

  // Emergency Queue Action API
  fetchEmergencyQueue: async () => {
    try {
      const res = await fetch('/api/advanced/emergency', { headers: get().getAuthHeaders() });
      if (res.ok) set({ emergencyQueue: await res.json() });
    } catch (e) {
      console.error('Failed to fetch emergency queue', e);
    }
  },

  triagePatient: async (triageData) => {
    try {
      const res = await fetch('/api/advanced/emergency/triage', {
        method: 'POST',
        headers: get().getAuthHeaders(),
        body: JSON.stringify(triageData)
      });
      if (res.ok) {
        await get().fetchEmergencyQueue();
        get().showToast('Emergency case triaged and routed!', 'success');
      }
    } catch (e) {
      get().showToast('Failed to log triage', 'error');
    }
  },

  // Discharge Checklist Action API
  fetchDischarges: async () => {
    try {
      const res = await fetch('/api/advanced/discharges', { headers: get().getAuthHeaders() });
      if (res.ok) set({ discharges: await res.json() });
    } catch (e) {
      console.error('Failed to fetch discharges', e);
    }
  },

  clearDischarge: async (dischargeId, approvalType) => {
    try {
      const res = await fetch('/api/advanced/discharges/clear', {
        method: 'POST',
        headers: get().getAuthHeaders(),
        body: JSON.stringify({ dischargeId, approvalType })
      });
      if (res.ok) {
        await get().fetchDischarges();
        get().showToast(`Granted clearance for ${approvalType}`, 'success');
      }
    } catch (e) {
      get().showToast('Failed to log clearance', 'error');
    }
  },

  finalizeDischarge: async (dischargeId, summary) => {
    try {
      const res = await fetch('/api/advanced/discharges/finalize', {
        method: 'POST',
        headers: get().getAuthHeaders(),
        body: JSON.stringify({ dischargeId, summary })
      });
      if (res.ok) {
        await get().fetchDischarges();
        get().showToast('Patient discharged successfully!', 'success');
      }
    } catch (e) {
      get().showToast('Failed to finalize discharge', 'error');
    }
  },

  // Notifications Action API
  fetchNotifications: async () => {
    try {
      const res = await fetch('/api/advanced/notifications', { headers: get().getAuthHeaders() });
      if (res.ok) set({ notifications: await res.json() });
    } catch (e) {
      console.error('Failed to fetch notifications', e);
    }
  },

  readNotification: async (id) => {
    try {
      const res = await fetch('/api/advanced/notifications/read', {
        method: 'POST',
        headers: get().getAuthHeaders(),
        body: JSON.stringify({ id })
      });
      if (res.ok) await get().fetchNotifications();
    } catch (e) {
      console.error('Failed to read notification', e);
    }
  },

  // Blood Bank Action API
  fetchBloodStock: async () => {
    try {
      const res = await fetch('/api/advanced/bloodbank/stock', { headers: get().getAuthHeaders() });
      if (res.ok) set({ bloodStock: await res.json() });
    } catch (e) {
      console.error('Failed to fetch blood stock', e);
    }
  },

  issueBlood: async (group, units) => {
    try {
      const res = await fetch('/api/advanced/bloodbank/issue', {
        method: 'POST',
        headers: get().getAuthHeaders(),
        body: JSON.stringify({ group, units })
      });
      if (res.ok) {
        await get().fetchBloodStock();
        get().showToast(`Issued ${units} units of ${group}`, 'success');
      } else {
        const errorData = await res.json();
        get().showToast(errorData.message || 'Failed to issue blood', 'error');
      }
    } catch (e) {
      get().showToast('Failed to connect to Blood Bank', 'error');
    }
  },

  // Audit Logs Action API
  fetchAudits: async () => {
    try {
      const res = await fetch('/api/advanced/audit', { headers: get().getAuthHeaders() });
      if (res.ok) set({ auditLogs: await res.json() });
    } catch (e) {
      console.error('Failed to fetch audit logs', e);
    }
  }
}));
