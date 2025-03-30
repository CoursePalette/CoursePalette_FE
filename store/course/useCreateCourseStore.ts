
import { create } from 'zustand'


interface CreateCourseState {
  title: string,
  setTitle: (title: string) => void,

  category: string,
  setCategory: (category : string) => void;
}

export const useCreateCourseStore = create<CreateCourseState>((set) => ({
  title: "",
  setTitle: (title) => set(() => ({title})),
  category: "",
  setCategory: (category) => set(() => ({category}))
}))