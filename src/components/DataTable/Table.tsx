import { useEffect, useState } from 'react';
import { calculateMaxWidth } from '~/utils/calculateMaxWidth';
import { classNames } from '~/utils/classNames';
import { getSortIcon } from '~/utils/getSortIcon';
import { unionStringKey } from '~/utils/helpers';
import { TableProps } from './@types';
import { Row } from './Row';
import { MAX_ROWS } from '../../constants';
import styles from './DataTable.module.css';

export const Table = ({ data, columns, sortConfig, onSort, changedCells }: TableProps) => {
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});

  useEffect(() => {
    if (data.length === 0) return;
    const widths: Record<string, number> = {};
    columns.forEach((column) => {
      widths[column.key] = calculateMaxWidth(data, columns, column.key);
    });
    setColumnWidths(widths);
  }, [data, columns]);

  const columnStyles = () => {
    const stringStyles = Object.entries(columnWidths)
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
    const wrapperStyle =
      data.length > MAX_ROWS
        ? `.${styles.tableWrapper} { height: calc(100vh - 235px); } 
           .${styles.headerCell}:last-child { border-top-right-radius: unset; }`
        : '';
    return `${stringStyles} ${wrapperStyle}`;
  };

  return (
    <div className={styles.tableWrapper}>
      <style>{columnStyles()}</style>
      <table className={styles.table}>
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
      </table>
    </div>
  );
};
