import { StateCreator } from 'zustand';

export interface PendingSlice {
  pending: boolean;
  setPending: (id: boolean) => void;
  togglePending: () => void;
}

export const createPendingSlice: StateCreator<PendingSlice> = (set) => ({
  pending: false,
  setPending: (value) => set({ pending: value }),
  togglePending: () => set((state) => ({ pending: !state.pending })),
});
