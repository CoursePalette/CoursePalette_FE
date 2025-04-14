import { create } from 'zustand';

interface InfoModalState {
  isShown: boolean;
  closeModal: () => void;
}

export const useInfoModalStore = create<InfoModalState>((set) => ({
  isShown: true,
  closeModal: () => set({ isShown: false }),
}));
