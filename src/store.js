import { create } from 'zustand';

export const useStore = create((set) => ({
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
}));
