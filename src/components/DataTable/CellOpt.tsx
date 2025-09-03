import { memo } from 'react';
import { NOT_AVAILABLE, SpecialColumns } from '~/constants';
import { classNames } from '~/utils/classNames';
import { CellProps } from './@types';
import styles from './DataTable.module.css';

export const Cell = memo(function CellOpt({
  value,
  isChanged,
  columnKey,
  loading = false,
}: CellProps) {
  const formatValue = (value: unknown): string => {
    if (value === undefined || value === null) return NOT_AVAILABLE;
    if (typeof value === 'number' && columnKey !== SpecialColumns.Year) {
      return value.toLocaleString();
    }
    return String(value);
  };

  return loading ? (
    <td className={classNames(styles.cell, styles.skeletonCell)} data-column={columnKey}>
      <div className={styles.skeletonCellInner}></div>
    </td>
  ) : (
    <td
      className={classNames(styles.cell, { [styles.changedCell]: isChanged })}
      data-column={columnKey}
    >
      {formatValue(value)}
    </td>
  );
});
