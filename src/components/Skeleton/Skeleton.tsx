import { REQUIRED_COLUMNS } from '~/constants';
import { CountryData, TableColumn } from '~/types';
import { snakeToTitleCase } from '~/utils/snakeToTitleCase';
import { Row } from '../DataTable/Row';
import styles from '../DataTable/DataTable.module.css';

export const Skeleton = () => {
  const columns: TableColumn[] = REQUIRED_COLUMNS.map((column) => ({
    key: column,
    label: column.includes('_')
      ? snakeToTitleCase(column)
      : column.charAt(0).toUpperCase() + column.slice(1),
    sortable: true,
  }));

  const emptyRow = REQUIRED_COLUMNS.reduce((acc, column) => {
    const key = column as keyof CountryData;
    (acc as Record<keyof CountryData, unknown>)[key] = null;
    return acc;
  }, {} as CountryData);

  const rows = Array.from({ length: 14 }, (_, i) => i);

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index} className={styles.headerCell}>
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
              columns={columns}
              changedColumns={new Set()}
              loading={true}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
