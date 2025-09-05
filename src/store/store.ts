import { create } from 'zustand';
import { ColumnSlice, createColumnSlice } from './columnSlice';
import { createFiltersSlice, FiltersSlice } from './filtersSlice';

type AppStore = FiltersSlice & ColumnSlice;

export const useAppStore = create<AppStore>()((...a) => ({
  ...createFiltersSlice(...a),
  ...createColumnSlice(...a),
}));

export type { FiltersSlice, ColumnSlice };
