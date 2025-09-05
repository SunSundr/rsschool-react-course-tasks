import { StateCreator } from 'zustand';
import { Column } from '~/types';
import { REQUIRED_NAMES_COLUMNS } from '../constants';

export interface ColumnSlice {
  selectedColumns: string[];
  availableColumns: Column[];
  setSelectedColumns: (columns: string[]) => void;
  setAvailableColumns: (availableColumns: Column[]) => void;
}

export const createColumnSlice: StateCreator<ColumnSlice> = (set) => ({
  selectedColumns: [...REQUIRED_NAMES_COLUMNS],
  availableColumns: [],

  setSelectedColumns: (columns) =>
    set({
      selectedColumns: [
        ...REQUIRED_NAMES_COLUMNS,
        ...columns.filter((col) => !REQUIRED_NAMES_COLUMNS.includes(col)),
      ],
    }),
  setAvailableColumns: (availableColumns) => set({ availableColumns }),
});
