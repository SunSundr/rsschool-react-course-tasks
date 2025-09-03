import { use, useCallback, useMemo, useState } from 'react';
import { BATCH_SIZE_UPDATE_COLUMNS, REQUIRED_COLUMNS } from '~/constants';
import { getCountriesData } from '../../services/dataService';
import { useColumnStore } from '../../store/columnStore';
import { FilterConfig, SortConfig, TableColumn } from '../../types';
import { Button } from '../Button/Button';
import { ColumnSelector } from '../ColumnSelector/ColumnSelector';
import { DataTable } from '../DataTable/DataTableOpt';
import { Filters } from '../Filters/FiltersOpt';
import { Modal } from '../Modal/Modal';
import styles from './DataLoader.module.css';

const data = getCountriesData();

const DataLoader = () => {
  const { maxYear, availableYears, availableRegions, availableColumns, sortedData } = use(data);

  const [columnSelectorModalOpen, setColumnSelectorModalOpen] = useState(false);
  const [filters, setFilters] = useState<FilterConfig>({
    selectedYear: null,
    countrySearch: '',
    selectedRegion: '',
  });
  const defaultYear = maxYear;
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'country',
    direction: 'asc',
  });

  const { selectedColumns, addSelectedColumns, clearSelectedColumns } = useColumnStore();
  const [localSelectedColumns, setLocalSelectedColumns] = useState(selectedColumns);
  const [isUpdatingColumns, setIsUpdatingColumns] = useState(false);

  const filteredAndSortedData = useMemo(() => {
    let filtered = sortedData[filters.selectedYear ?? defaultYear];

    if (filters.selectedRegion) {
      filtered = filtered.filter((item) => item.country === filters.selectedRegion);
    }

    if (filters.countrySearch) {
      filtered = filtered.filter((item) =>
        item.country.toLowerCase().includes(filters.countrySearch.toLowerCase()),
      );
    }

    if (sortConfig.key && sortConfig.direction) {
      filtered.sort((a, b) => {
        const aVal = a[sortConfig.key as keyof typeof a];
        const bVal = b[sortConfig.key as keyof typeof b];

        if (aVal === undefined && bVal === undefined) return 0;
        if (aVal === undefined) return 1;
        if (bVal === undefined) return -1;

        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return sortConfig.direction === 'asc'
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }

        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
        }

        return 0;
      });
    }
    return filtered;
  }, [
    filters.selectedYear,
    filters.selectedRegion,
    filters.countrySearch,
    sortConfig.key,
    sortConfig.direction,
  ]);

  const displayColumns = useCallback(() => {
    const required: TableColumn[] = [];
    const rest: TableColumn[] = [];
    availableColumns.forEach((column) => {
      if (REQUIRED_COLUMNS.includes(column.key)) {
        required[REQUIRED_COLUMNS.indexOf(column.key)] = column;
      } else {
        rest.push(column);
      }
    });
    return [...required, ...rest.filter((col) => selectedColumns.includes(col.key))];
  }, [selectedColumns, availableColumns]);

  const handleFilterChange = useCallback((newFilters: FilterConfig) => {
    setFilters(newFilters);
  }, []);

  const handleSort = useCallback((key: string) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  const modalClose = useCallback(() => {
    setColumnSelectorModalOpen(false);
    setIsUpdatingColumns(true);
    clearSelectedColumns();

    const updateColumnsInBatches = () => {
      const batchSize = BATCH_SIZE_UPDATE_COLUMNS;
      const newColumns = [...localSelectedColumns];
      let currentIndex = 0;
      const processBatch = () => {
        const endIndex = Math.min(currentIndex + batchSize, newColumns.length);
        const batch = newColumns.slice(currentIndex, endIndex);
        currentIndex = endIndex;
        addSelectedColumns(batch);
        if (currentIndex < newColumns.length) {
          setTimeout(processBatch, 10);
        } else {
          setTimeout(() => setIsUpdatingColumns(false), 200);
        }
      };
      processBatch();
    };

    setTimeout(updateColumnsInBatches, 0);
  }, [localSelectedColumns]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.controls}>
          <Filters
            filters={filters}
            availableYears={availableYears}
            availableRegions={availableRegions}
            onFilterChange={handleFilterChange}
            disabled={isUpdatingColumns}
          />
          <Button
            className={styles.controlButton}
            onClick={() => setColumnSelectorModalOpen(true)}
            size="small"
            disabled={isUpdatingColumns}
          >
            Select Columns
          </Button>
        </div>

        <DataTable
          data={filteredAndSortedData}
          columns={displayColumns()}
          sortConfig={sortConfig}
          onSort={handleSort}
          selectedYear={filters.selectedYear}
        />
      </div>

      {isUpdatingColumns && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingMessage}>Updating Columns...</div>
        </div>
      )}

      <Modal title="Select Columns" isOpen={columnSelectorModalOpen} onClose={modalClose}>
        <ColumnSelector
          availableColumns={availableColumns}
          localSelectedColumns={localSelectedColumns}
          setLocalSelectedColumns={setLocalSelectedColumns}
        />
      </Modal>
    </div>
  );
};

export default DataLoader;
