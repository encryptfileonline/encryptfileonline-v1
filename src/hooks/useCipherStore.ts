import { create } from 'zustand';
export type CipherMode = 'encrypt' | 'decrypt';
type CipherState = {
  mode: CipherMode;
  file: File | null;
  passphrase: string;
  isLoading: boolean;
  progress: number;
  error: string | null;
  isSuccess: boolean;
  successMessage: string | null;
};
type CipherActions = {
  setMode: (mode: CipherMode) => void;
  setFile: (file: File | null) => void;
  setPassphrase: (passphrase: string) => void;
  startProcessing: () => void;
  setProgress: (progress: number) => void;
  setSuccess: (message: string) => void;
  setError: (error: string) => void;
  reset: () => void;
};
const initialState: CipherState = {
  mode: 'encrypt',
  file: null,
  passphrase: '',
  isLoading: false,
  progress: 0,
  error: null,
  isSuccess: false,
  successMessage: null,
};
export const useCipherStore = create<CipherState & CipherActions>((set) => ({
  ...initialState,
  setMode: (mode) => set({ mode, file: null, error: null, isSuccess: false, successMessage: null }),
  setFile: (file) => set({ file, error: null, isSuccess: false, successMessage: null }),
  setPassphrase: (passphrase) => set({ passphrase }),
  startProcessing: () => set({ isLoading: true, progress: 0, error: null, isSuccess: false, successMessage: null }),
  setProgress: (progress) => set({ progress }),
  setSuccess: (message) => set({ isSuccess: true, successMessage: message, isLoading: false, progress: 100 }),
  setError: (error) => set({ error, isLoading: false, progress: 0 }),
  reset: () => set((state) => ({ ...initialState, mode: state.mode })),
}));