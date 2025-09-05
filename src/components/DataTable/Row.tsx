import { RowProps } from './@types';
import { Cell } from './Cell';
import styles from './DataTable.module.css';

export const Row = ({ row, columns, changedColumns, loading = false }: RowProps) => {
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
