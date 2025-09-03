import { memo, useEffect, useMemo, useState } from 'react';
import { calculateMaxWidth } from '~/utils/calculateMaxWidth';
import { getSortIcon } from '~/utils/getSortIcon';
import { TableProps } from './@types';
import { Row } from './RowOpt';
import { MAX_ROWS } from '../../constants';
import styles from './DataTable.module.css';

export const Table = memo(function TableOpt({
  data,
  columns,
  sortConfig,
  onSort,
  changedCells,
}: TableProps) {
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});

  useEffect(() => {
    if (data.length === 0) return;
    const widths: Record<string, number> = {};
    columns.forEach((column) => {
      widths[column.key] = calculateMaxWidth(data, columns, column.key);
    });
    setColumnWidths(widths);
  }, [data, columns]);

  const tableContent = useMemo(() => {
    return (
      <tbody>
        {data.map((row, index) => {
          const rowKey = `${row.country}-${row.iso_code}`;
          const changedColumns = changedCells.get(rowKey) || new Set();
          return (
            <Row
              key={`${row.country}-${row.year}-${index}`}
              row={row}
              columns={columns}
              changedColumns={changedColumns}
              columnWidths={columnWidths}
            />
          );
        })}
      </tbody>
    );
  }, [data, columns, changedCells, columnWidths]);

  const columnStyles = useMemo(() => {
    return Object.entries(columnWidths)
      .map(
        ([key, width]) => `
      .${styles.table} th[data-column="${key}"],
      .${styles.table} td[data-column="${key}"] {
        width: ${width}px;
        min-width: ${width}px;
        max-width: ${width}px;
      }
    `,
      )
      .join('');
  }, [columnWidths]);

  return (
    <div className={styles.tableWrapper}>
      <style>
        {columnStyles}{' '}
        {data.length > MAX_ROWS
          ? `.${styles.tableWrapper} { height: calc(100vh - 235px); } .${styles.headerCell}:last-child { border-top-right-radius: unset; }`
          : ''}
      </style>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`${styles.headerCell} ${sortConfig.key === column.key ? styles.withSort : ''}`}
                onClick={() => column.sortable && onSort(column.key)}
                data-column={column.key}
              >
                {column.label}
                {column.sortable && (
                  <span className={styles.sortIcon}>{getSortIcon(sortConfig, column.key)}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        {tableContent}
      </table>
    </div>
  );
});
