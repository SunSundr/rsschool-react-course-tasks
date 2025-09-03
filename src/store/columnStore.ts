import { create } from 'zustand';
import { REQUIRED_COLUMNS } from '../constants';

interface ColumnStore {
  selectedColumns: string[];
  setSelectedColumns: (columnKey: string[]) => void;
  toggleColumn: (columnKey: string) => void;
  addSelectedColumns: (columnKey: string[]) => void;
  clearSelectedColumns: () => void;
}

export const useColumnStore = create<ColumnStore>((set) => ({
  selectedColumns: [...REQUIRED_COLUMNS],
  clearSelectedColumns: () => set({ selectedColumns: [...REQUIRED_COLUMNS] }),
  setSelectedColumns: (columnKey) =>
    set({
      selectedColumns: [...REQUIRED_COLUMNS, ...columnKey],
    }),
  addSelectedColumns: (columnKey: string[]) =>
    set((state) => ({
      selectedColumns: [...state.selectedColumns, ...columnKey],
    })),
  toggleColumn: (columnKey) =>
    set((state) => ({
      selectedColumns: state.selectedColumns.includes(columnKey)
        ? state.selectedColumns.filter((key) => key !== columnKey)
        : [...state.selectedColumns, columnKey],
    })),
}));
