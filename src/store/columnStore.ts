import { create } from 'zustand';
import { REQUIRED_COLUMNS } from '../constants';

interface ColumnStore {
  selectedColumns: string[];
  setSelectedColumns: (columns: string[]) => void;
  toggleColumn: (columnKey: string) => void;
}

export const useColumnStore = create<ColumnStore>((set) => ({
  selectedColumns: [...REQUIRED_COLUMNS],
  setSelectedColumns: (columns) =>
    set({
      selectedColumns: [
        ...REQUIRED_COLUMNS,
        ...columns.filter((col) => !REQUIRED_COLUMNS.includes(col)),
      ],
    }),
  toggleColumn: (columnKey) =>
    set((state) => ({
      selectedColumns: state.selectedColumns.includes(columnKey)
        ? state.selectedColumns.filter((key) => key !== columnKey)
        : [...state.selectedColumns, columnKey],
    })),
}));
