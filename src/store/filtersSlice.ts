import { StateCreator } from 'zustand';
import { Column, FilterConfig } from '../types';

export interface FiltersSlice {
  filters: FilterConfig;
  isUpdatingColumns: boolean;
  availableYears: number[];
  availableRegions: string[];
  availableColumns: Column[];
  setFilters: (filters: FilterConfig) => void;
  setIsUpdatingColumns: (isUpdating: boolean) => void;
  setAvailableYears: (years: number[]) => void;
  setAvailableRegions: (regions: string[]) => void;
}

export const createFiltersSlice: StateCreator<FiltersSlice> = (set) => ({
  filters: {
    selectedYear: 0,
    countrySearch: '',
    selectedRegion: '',
  },
  isUpdatingColumns: false,
  availableYears: [],
  availableRegions: [],
  availableColumns: [],

  setFilters: (filters) => set({ filters }),
  setIsUpdatingColumns: (isUpdatingColumns) => set({ isUpdatingColumns }),
  setAvailableYears: (availableYears) => set({ availableYears }),
  setAvailableRegions: (availableRegions) => set({ availableRegions }),
});
