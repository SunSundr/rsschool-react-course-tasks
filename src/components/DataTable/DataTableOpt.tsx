import { memo, useEffect, useRef, useState } from 'react';
import { DelayTime, SpecialColumns } from '~/constants';
import { FlattenData } from '~/types';
import { unionStringKey } from '~/utils/helpers';
import { DataTableProps } from './@types';
import { Table } from './TableOpt';
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
    const dataMap = new Map();
    data.forEach((currentRow) => {
      const rowKey = unionStringKey(currentRow.country, currentRow.iso_code);
      const previousRefRow = previousDataRef.current.get(rowKey);

      if (previousRefRow) {
        const changedColumns = new Set<string>();

        columns.forEach((column) => {
          if (column.key !== SpecialColumns.Country && column.key !== SpecialColumns.IsoCode) {
            const currentValue = currentRow[column.key];
            const previousValue = previousRefRow[column.key];
            if (currentValue !== previousValue) changedColumns.add(column.key);
          }
        });

        if (changedColumns.size > 0) newChangedCells.set(rowKey, changedColumns);
      }
      dataMap.set(rowKey, currentRow);
    });

    setChangedCells(newChangedCells);
    previousDataRef.current = dataMap;
    previousYearRef.current = selectedYear;

    const timer = setTimeout(() => setChangedCells(new Map()), DelayTime.HighlightCells);
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
