import React from 'react';
import { FilterConfig } from '../../types';
import styles from './Filters.module.css';

type FiltersProps =
  | {
      disabled: true;
      filters?: Partial<FilterConfig>;
      availableYears?: number[];
      availableRegions?: string[];
      onFilterChange?: (filters: FilterConfig) => void;
    }
  | {
      disabled?: false;
      filters: FilterConfig;
      availableYears: number[];
      availableRegions: string[];
      onFilterChange: (filters: FilterConfig) => void;
    };

export const Filters: React.FC<FiltersProps> = ({
  filters = { selectedYear: null, selectedRegion: '', countrySearch: '' },
  availableYears = [],
  availableRegions = [],
  onFilterChange = () => {},
  disabled = false,
}) => {
  const safeFilters: FilterConfig = {
    selectedYear: filters?.selectedYear ?? null,
    selectedRegion: filters?.selectedRegion ?? '',
    countrySearch: filters?.countrySearch ?? '',
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (disabled) return;
    const year = e.target.value ? parseInt(e.target.value) : null;
    onFilterChange({ ...safeFilters, selectedYear: year });
  };

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (disabled) return;
    onFilterChange({ ...safeFilters, selectedRegion: e.target.value });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    onFilterChange({ ...safeFilters, countrySearch: e.target.value });
  };

  return (
    <div className={styles.container}>
      <div className={styles.filterGroup}>
        <label className={styles.label}>Year:</label>
        <select
          className={styles.select}
          value={safeFilters.selectedYear || ''}
          onChange={handleYearChange}
          disabled={disabled}
        >
          {disabled && <option value="">0000</option>}
          {availableYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.label}>Region:</label>
        <select
          className={styles.select}
          value={safeFilters.selectedRegion}
          onChange={handleRegionChange}
          disabled={disabled}
        >
          <option value="">All Regions</option>
          {availableRegions.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.label}>Search Country:</label>
        <input
          className={styles.input}
          type="text"
          placeholder="Enter country name..."
          value={safeFilters.countrySearch}
          onChange={handleSearchChange}
          disabled={disabled}
        />
      </div>
    </div>
  );
};
