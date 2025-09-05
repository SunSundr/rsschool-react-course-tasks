import { MAX_ROWS, REQUIRED_COLUMNS, REQUIRED_NAMES_COLUMNS } from '~/constants';
import { CountryData } from '~/types';
import { classNames } from '~/utils/classNames';
import { Row } from '../DataTable/Row';
import styles from '../DataTable/DataTable.module.css';

export const Skeleton = () => {
  const emptyRow = REQUIRED_NAMES_COLUMNS.reduce((acc, column) => {
    const key = column as keyof CountryData;
    (acc as Record<keyof CountryData, unknown>)[key] = null;
    return acc;
  }, {} as CountryData);

  const rows = Array.from({ length: MAX_ROWS }, (_, i) => i);

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {REQUIRED_COLUMNS.map((col, index) => (
              <th key={index} className={classNames(styles.headerCell, styles.disabled)}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((rowIndex) => (
            <Row
              key={rowIndex}
              row={{ ...emptyRow, country: '', iso_code: '', year: 0 }}
              columns={REQUIRED_COLUMNS}
              changedColumns={new Set()}
              loading={true}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
