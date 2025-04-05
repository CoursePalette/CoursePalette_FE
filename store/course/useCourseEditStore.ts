import { create } from 'zustand';

interface CourseEditStore {
  isEdit: boolean;
  setIsEdit: (state: boolean) => void;
}

export const useCourseEditStore = create<CourseEditStore>((set) => ({
  isEdit: false,
  setIsEdit: (state: boolean) => set({ isEdit: state }),
}));
