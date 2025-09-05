import { memo, useMemo } from 'react';
import { useColumnWidths } from '~/hooks/useColumnWidths';
import { classNames } from '~/utils/classNames';
import { getSortIcon } from '~/utils/getSortIcon';
import { unionStringKey } from '~/utils/helpers';
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
  const columnWidths = useColumnWidths(data, columns);

  const tableContent = useMemo(() => {
    return (
      <tbody>
        {data.map((row) => {
          const rowKey = unionStringKey(row.country, row.iso_code);
          const changedColumns = changedCells.get(rowKey) || new Set();
          return (
            <Row
              key={rowKey}
              row={row}
              columns={columns}
              changedColumns={changedColumns}
              columnWidths={columnWidths}
            />
          );
        })}
      </tbody>
    );
  }, [data, columns, changedCells, columnWidths, sortConfig]);

  const columnStyles = useMemo(() => {
    return Object.entries(columnWidths)
      .map(
        ([key, width]) => `
          .${styles.table} th[data-column="${key}"],
          .${styles.table} td[data-column="${key}"] {
            width: ${width}px;
            min-width: ${width}px;
            max-width: ${width}px;
          }`,
      )
      .join('');
  }, [columnWidths]);

  const tableStyles = useMemo(() => {
    return data.length > MAX_ROWS
      ? `.${styles.tableWrapper} { height: calc(100vh - 235px); } 
         .${styles.headerCell}:last-child { border-top-right-radius: unset; }`
      : '';
  }, [columnWidths, data]);

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <style>
          {columnStyles}
          {tableStyles}
        </style>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={classNames(styles.headerCell, {
                  [styles.withSort]: sortConfig.key === column.key,
                })}
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
