import { useRef, useState } from 'react';
import { BATCH_SIZE_UPDATE_COLUMNS, DelayTime } from '~/constants';
import { useAppStore } from '~/store/store';
import { FilterChangeType } from '~/types';
import { SelectFilterGroup } from './SelectFilterGroup';
import { Button } from '../Button/Button';
import { ColumnSelector } from '../ColumnSelector/ColumnSelector';
import { Modal } from '../Modal/Modal';
import styles from './Filters.module.css';

export const Filters = () => {
  const {
    filters,
    availableYears,
    availableRegions,
    isUpdatingColumns,
    selectedColumns,
    availableColumns,
    setFilters,
    setIsUpdatingColumns,
    setSelectedColumns,
  } = useAppStore();

  const [columnSelectorModalOpen, setColumnSelectorModalOpen] = useState(false);
  const [localSelectedColumns, setLocalSelectedColumns] = useState(selectedColumns);
  const debounceRef = useRef<NodeJS.Timeout>(undefined);

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>,
    type: FilterChangeType,
  ) => {
    if (isUpdatingColumns) return;
    if (type === 'year') {
      setFilters({ ...filters, selectedYear: parseInt(e.target.value) || 0 });
    } else if (type === 'region') {
      setFilters({ ...filters, selectedRegion: e.target.value });
    } else if (type === 'search') {
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        setFilters({ ...filters, countrySearch: e.target.value });
      }, DelayTime.InputDebounce);
    }
  };

  const handleUpdateColumns = () => {
    setColumnSelectorModalOpen(false);
    setIsUpdatingColumns(true);

    const updateColumnsInBatches = () => {
      const batchSize = BATCH_SIZE_UPDATE_COLUMNS;
      let currentIndex = 0;

      const processBatch = () => {
        const endIndex = Math.min(currentIndex + batchSize, localSelectedColumns.length);
        const batch = localSelectedColumns.slice(0, endIndex);
        currentIndex = endIndex;
        setSelectedColumns(batch);

        if (currentIndex < localSelectedColumns.length) {
          setTimeout(processBatch, DelayTime.Min);
        } else {
          setTimeout(() => setIsUpdatingColumns(false), DelayTime.Average);
        }
      };

      processBatch();
    };

    setTimeout(updateColumnsInBatches, DelayTime.Zero);
  };

  const disabled = isUpdatingColumns || !filters.selectedYear;

  return (
    <>
      <div className={styles.controls}>
        <div className={styles.container}>
          <SelectFilterGroup
            label="Year"
            type="year"
            value={filters.selectedYear}
            options={availableYears}
            onChange={handleChange}
            disabled={disabled}
          />

          <SelectFilterGroup
            label="Region or Country"
            type="region"
            value={filters.selectedRegion}
            defaultValue="All Regions"
            options={availableRegions}
            onChange={handleChange}
            disabled={disabled}
            classNameWrapper={styles.filterGroupRegion}
          />

          <div className={styles.filterGroup}>
            <label className={styles.label}>Search Region or Country:</label>
            <input
              className={styles.input}
              type="text"
              placeholder="Enter country name...2"
              defaultValue={filters.countrySearch}
              onChange={(e) => handleChange(e, 'search')}
              disabled={disabled}
            />
          </div>
        </div>

        <Button
          className={styles.controlButton}
          onClick={() => setColumnSelectorModalOpen(true)}
          size="small"
          disabled={disabled}
        >
          Select Columns
        </Button>
      </div>

      <Modal title="Select Columns" isOpen={columnSelectorModalOpen} onClose={handleUpdateColumns}>
        <ColumnSelector
          localSelectedColumns={localSelectedColumns}
          setLocalSelectedColumns={setLocalSelectedColumns}
          availableColumns={availableColumns}
        />
      </Modal>

      {isUpdatingColumns && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingMessage}>Updating Columns...</div>
        </div>
      )}
    </>
  );
};
