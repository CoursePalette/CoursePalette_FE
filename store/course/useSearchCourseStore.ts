import { create } from 'zustand';

interface SearchCourseState {
  search: string;
  setSearch: (search: string) => void;
  clearSearch: () => void;
}

export const useSearchCourseStore = create<SearchCourseState>((set) => ({
  search: '',
  setSearch: (search) => set(() => ({ search })),
  clearSearch: () => set(() => ({ search: '' })),
}));
