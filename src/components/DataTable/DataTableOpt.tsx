import { memo, useEffect, useRef, useState } from 'react';
import { CHANGE_DISPLAY_TIME_MS, SpecialColumns } from '~/constants';
import { DataTableProps } from './@types';
import { Table } from './TableOpt';
import { FlattenData } from '../../types';
import styles from './DataTable.module.css';

export const DataTable = memo(function DataTableOpt({
  data,
  columns,
  sortConfig,
  onSort,
  selectedYear,
}: DataTableProps) {
  const [changedCells, setChangedCells] = useState<Map<string, Set<string>>>(new Map());
  const previousYearRef = useRef<number | null>(null);
  const previousDataRef = useRef<Map<string, FlattenData>>(new Map());

  useEffect(() => {
    const newChangedCells = new Map<string, Set<string>>();

    data.forEach((currentRow) => {
      const rowKey = `${currentRow.country}-${currentRow.iso_code}`;
      const previousRow = previousDataRef.current.get(rowKey);

      if (previousRow) {
        const changedColumns = new Set<string>();

        columns.forEach((column) => {
          if (column.key === SpecialColumns.Country || column.key === SpecialColumns.IsoCode) {
            return;
          }
          const currentValue = currentRow[column.key as keyof typeof currentRow];
          const previousValue = previousRow[column.key as keyof typeof previousRow];

          if (currentValue !== previousValue) {
            changedColumns.add(column.key);
          }
        });

        if (changedColumns.size > 0) {
          newChangedCells.set(rowKey, changedColumns);
        }
      }
    });

    setChangedCells(newChangedCells);

    const timer = setTimeout(() => setChangedCells(new Map()), CHANGE_DISPLAY_TIME_MS);

    const dataMap = new Map();
    data.forEach((row) => {
      dataMap.set(`${row.country}-${row.iso_code}`, row);
    });
    previousDataRef.current = dataMap;
    previousYearRef.current = selectedYear;

    return () => clearTimeout(timer);
  }, [selectedYear]);

  return (
    <div className={styles.tableWrapper}>
      <Table
        data={data}
        columns={columns}
        sortConfig={sortConfig}
        onSort={onSort}
        changedCells={changedCells}
      />
    </div>
  );
});
