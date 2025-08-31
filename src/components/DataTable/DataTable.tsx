import React, { useEffect, useRef, useState } from 'react';
import { Table } from './Table';
import { USE_OPTIMIZATIONS } from '../../constants';
import { CountryData, SortConfig, TableColumn } from '../../types';
import styles from './DataTable.module.css';

interface DataTableProps {
  data: Array<CountryData & { country: string; iso_code: string }>;
  columns: TableColumn[];
  sortConfig: SortConfig;
  onSort: (key: string) => void;
  selectedYear: number | null;
}

const DataTableComponent: React.FC<DataTableProps> = ({
  data,
  columns,
  sortConfig,
  onSort,
  selectedYear,
}) => {
  const [changedCells, setChangedCells] = useState<Map<string, Set<string>>>(new Map());
  const previousDataRef = useRef<Map<string, CountryData & { country: string; iso_code: string }>>(
    new Map(),
  );
  const previousYearRef = useRef<number | null>(null);

  useEffect(() => {
    if (previousYearRef.current === null || previousYearRef.current === selectedYear) {
      const dataMap = new Map();
      data.forEach((row) => {
        dataMap.set(`${row.country}-${row.iso_code}`, row);
      });
      previousDataRef.current = dataMap;
      previousYearRef.current = selectedYear;
      return;
    }

    const newChangedCells = new Map<string, Set<string>>();

    data.forEach((currentRow) => {
      const rowKey = `${currentRow.country}-${currentRow.iso_code}`;
      const previousRow = previousDataRef.current.get(rowKey);

      if (previousRow) {
        const changedColumns = new Set<string>();

        columns.forEach((column) => {
          if (column.key === 'country' || column.key === 'iso_code') return;

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

    if (newChangedCells.size > 0) {
      setChangedCells(newChangedCells);
      const timer = setTimeout(() => {
        setChangedCells(new Map());
      }, 3000);
      const dataMap = new Map();
      data.forEach((row) => {
        dataMap.set(`${row.country}-${row.iso_code}`, row);
      });
      previousDataRef.current = dataMap;
      previousYearRef.current = selectedYear;
      return () => clearTimeout(timer);
    }

    const dataMap = new Map();
    data.forEach((row) => {
      dataMap.set(`${row.country}-${row.iso_code}`, row);
    });
    previousDataRef.current = dataMap;
    previousYearRef.current = selectedYear;
  }, [data, columns, selectedYear]);

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
};

export const DataTable = USE_OPTIMIZATIONS ? React.memo(DataTableComponent) : DataTableComponent;
