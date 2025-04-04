import { create } from 'zustand';

interface CategoryStore {
  selectedCategory: string;
  setCategory: (category: string) => void;
}

export const useCategoryStore = create<CategoryStore>((set) => ({
  selectedCategory: '전체',
  setCategory: (category: string) => set({ selectedCategory: category }),
}));
