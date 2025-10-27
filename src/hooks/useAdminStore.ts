import { create } from 'zustand';
type AdminState = {
  isAuthenticated: boolean;
};
type AdminActions = {
  login: (username?: string, password?: string) => boolean;
  logout: () => void;
};
// Hardcoded credentials as per the request
const ADMIN_USERNAME = 'eiahta';
const ADMIN_PASSWORD = 'Eiahta@840';
export const useAdminStore = create<AdminState & AdminActions>((set) => ({
  isAuthenticated: false,
  login: (username, password) => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      set({ isAuthenticated: true });
      return true;
    }
    return false;
  },
  logout: () => {
    set({ isAuthenticated: false });
  },
}));