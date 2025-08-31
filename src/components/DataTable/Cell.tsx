import React from 'react';
import { USE_OPTIMIZATIONS } from '../../constants';
import styles from './DataTable.module.css';

interface CellProps {
  value: unknown;
  isChanged: boolean;
  columnKey: string;
  loading?: boolean;
}

const CellComponent: React.FC<CellProps> = ({ value, isChanged, columnKey, loading = false }) => {
  const formatValue = (value: unknown): string => {
    if (value === undefined || value === null) return '-';
    if (typeof value === 'number' && columnKey !== 'year') {
      return value.toLocaleString();
    }
    return String(value);
  };

  if (loading) {
    return (
      <td className={`${styles.cell} ${styles.skeletonCell}`} data-column={columnKey}>
        <div className={styles.skeletonCellInner}></div>
      </td>
    );
  }

  return (
    <td className={`${styles.cell} ${isChanged ? styles.changedCell : ''}`} data-column={columnKey}>
      {formatValue(value)}
    </td>
  );
};

export const Cell = USE_OPTIMIZATIONS ? React.memo(CellComponent) : CellComponent;
