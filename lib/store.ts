import { create } from "zustand";
import type { CategoryId } from "@/lib/categories";

type Store = {
  selectedCategories: CategoryId[];
  toggleCategory: (id: CategoryId) => void;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  proposeOpen: boolean;
  openPropose: () => void;
  closePropose: () => void;
};

export const useStore = create<Store>((set) => ({
  selectedCategories: [],
  toggleCategory: (id) =>
    set((state) => ({
      selectedCategories: state.selectedCategories.includes(id)
        ? state.selectedCategories.filter((c) => c !== id)
        : [...state.selectedCategories, id],
    })),
  drawerOpen: false,
  openDrawer: () => set({ drawerOpen: true }),
  closeDrawer: () => set({ drawerOpen: false }),
  proposeOpen: false,
  openPropose: () => set({ proposeOpen: true }),
  closePropose: () => set({ proposeOpen: false }),
}));
