import React from 'react';
import { Cell } from './Cell';
import { USE_OPTIMIZATIONS } from '../../constants';
import { CountryData, TableColumn } from '../../types';
import styles from './DataTable.module.css';

interface RowProps {
  row: CountryData & { country: string; iso_code: string };
  columns: TableColumn[];
  changedColumns: Set<string>;
  columnWidths?: Record<string, number>;
  loading?: boolean;
}

const RowComponent: React.FC<RowProps> = ({ row, columns, changedColumns, loading = false }) => {
  return (
    <tr className={styles.row}>
      {columns.map((column) => (
        <Cell
          key={column.key}
          value={row[column.key as keyof typeof row]}
          isChanged={changedColumns.has(column.key)}
          columnKey={column.key}
          loading={loading}
        />
      ))}
    </tr>
  );
};

export const Row = USE_OPTIMIZATIONS ? React.memo(RowComponent) : RowComponent;
