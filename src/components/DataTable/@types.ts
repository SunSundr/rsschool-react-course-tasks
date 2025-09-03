import { FlattenData, SortConfig, TableColumn } from '~/types';

export interface TableProps {
  data: FlattenData[];
  columns: TableColumn[];
  sortConfig: SortConfig;
  onSort: (key: string) => void;
  changedCells: Map<string, Set<string>>;
}

export interface DataTableProps {
  data: FlattenData[];
  columns: TableColumn[];
  sortConfig: SortConfig;
  onSort: (key: string) => void;
  selectedYear: number | null;
}

export interface RowProps {
  row: FlattenData;
  columns: TableColumn[];
  changedColumns: Set<string>;
  columnWidths?: Record<string, number>;
  loading?: boolean;
}

export interface CellProps {
  value: unknown;
  isChanged: boolean;
  columnKey: string;
  loading?: boolean;
}
