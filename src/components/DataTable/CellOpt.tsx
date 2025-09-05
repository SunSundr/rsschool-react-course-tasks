import { memo } from 'react';
import { classNames } from '~/utils/classNames';
import { formatValue } from '~/utils/helpers';
import { CellProps } from './@types';
import styles from './DataTable.module.css';

export const Cell = memo(function CellOpt({
  value,
  isChanged,
  columnKey,
  loading = false,
}: CellProps) {
  if (loading) {
    return (
      <td className={classNames(styles.cell, styles.skeletonCell)} data-column={columnKey}>
        <div className={styles.skeletonCellInner}></div>
      </td>
    );
  } else {
    return (
      <td
        className={classNames(styles.cell, { [styles.changedCell]: isChanged })}
        data-column={columnKey}
      >
        {formatValue(value, columnKey)}
      </td>
    );
  }
});
