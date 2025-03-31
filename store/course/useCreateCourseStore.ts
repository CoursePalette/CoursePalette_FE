import { Place, PlaceWithSequence } from '@/types/Place';
import { create } from 'zustand';

interface CreateCourseState {
  title: string;
  setTitle: (title: string) => void;

  category: string;
  setCategory: (category: string) => void;

  places: PlaceWithSequence[];
  addPlace: (place: Place) => void;
  removePlace: (id: string) => void;
  reorderPlaces : (newOrder: PlaceWithSequence[]) => void;
  clearPlaces: () => void;
}

export const useCreateCourseStore = create<CreateCourseState>((set) => ({
  title: '',
  setTitle: (title) => set(() => ({ title })),

  category: '',
  setCategory: (category) => set(() => ({ category })),

  places: [],
  addPlace: (place) => set((state) => ({ places: [...state.places, {...place, sequence: state.places.length + 1}] })),
  removePlace: (id) => set((state) => ({
    places: state.places
    .filter((p) => p.id !== id)
    .map((p, idx) => ({...p, sequence: idx + 1}))
  })),
  reorderPlaces: (newOrder) => set(() => ({
    places: newOrder.map((p, idx) => ({
      ...p,
      sequence: idx + 1
    }))
  })),
  clearPlaces: () => set({ places: [] }),
}));
