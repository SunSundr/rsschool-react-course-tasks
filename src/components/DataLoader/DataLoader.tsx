import { useCallback, useEffect, useMemo, useState } from 'react';
import { TITLE, USE_OPTIMIZATIONS } from '../../constants';
import { fetchCountriesData } from '../../services/dataService';
import { useColumnStore } from '../../store/columnStore';
import { CountriesData, CountryData, FilterConfig, SortConfig, TableColumn } from '../../types';
import { Button } from '../Button/Button';
import { ColumnSelectorForm } from '../ColumnSelectorForm/ColumnSelectorForm';
import { DataTable } from '../DataTable/DataTable';
import { Filters } from '../Filters/Filters';
import { Modal } from '../Modal/Modal';
import { Skeleton } from '../Skeleton/Skeleton';
import styles from './DataLoader.module.css';

export const DataLoader: React.FC = () => {
  const [columnSelectorModalOpen, setColumnSelectorModalOpen] = useState(false);
  const [data, setData] = useState<CountriesData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterConfig>({
    selectedYear: null,
    countrySearch: '',
    selectedRegion: '',
  });
  const [defaultYear, setDefaultYear] = useState<number | null>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'country',
    direction: 'asc',
  });

  const { selectedColumns } = useColumnStore();

  useEffect(() => {
    fetchCountriesData()
      .then((data) => {
        setData(data);
        const years = new Set<number>();
        Object.values(data).forEach((country) => {
          country.data.forEach((yearData) => {
            if (yearData.year) years.add(yearData.year);
          });
        });
        const maxYear = Math.max(...Array.from(years));
        setDefaultYear(maxYear);
        setFilters((prev) => ({ ...prev, selectedYear: maxYear }));
      })
      .catch((err) => setError(err.message));
  }, []);

  const availableColumns: TableColumn[] = useMemo(() => {
    if (!data) return [];

    const allKeys = new Set<string>();
    Object.entries(data).forEach(([_countryName, country]) => {
      allKeys.add('country');
      allKeys.add('iso_code');
      country.data.forEach((yearData) => {
        Object.keys(yearData).forEach((key) => allKeys.add(key));
      });
    });

    return Array.from(allKeys).map((key) => ({
      key,
      label: key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
      sortable: true,
    }));
  }, [data]);

  const flattenedData = useMemo(() => {
    if (!data) return [];

    const result: Array<CountryData & { country: string; iso_code: string }> = [];
    Object.entries(data).forEach(([countryName, country]) => {
      country.data.forEach((yearData) => {
        result.push({
          ...yearData,
          country: countryName,
          iso_code: country.iso_code,
        } as CountryData & { country: string; iso_code: string });
      });
    });
    return result;
  }, [data]);

  const getAvailableYears = () => {
    const years = new Set<number>();
    flattenedData.forEach((item) => {
      if (item.year) years.add(item.year);
    });
    return Array.from(years).sort((a, b) => b - a);
  };

  const availableYears = USE_OPTIMIZATIONS
    ? useMemo(getAvailableYears, [flattenedData])
    : getAvailableYears();

  const getAvailableRegions = () => {
    const regions = new Set<string>();
    flattenedData.forEach((item) => {
      if (item.country) regions.add(item.country);
    });
    return Array.from(regions).sort();
  };

  const availableRegions = USE_OPTIMIZATIONS
    ? useMemo(getAvailableRegions, [flattenedData])
    : getAvailableRegions();

  const getFilteredAndSortedData = () => {
    let filtered = flattenedData;

    if (filters.selectedYear) {
      filtered = filtered.filter((item) => item.year === filters.selectedYear);
    } else if (defaultYear) {
      filtered = filtered.filter((item) => item.year === defaultYear);
    }

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
  };

  const filteredAndSortedData = USE_OPTIMIZATIONS
    ? useMemo(getFilteredAndSortedData, [
        flattenedData,
        filters.selectedYear,
        filters.selectedRegion,
        filters.countrySearch,
        sortConfig.key,
        sortConfig.direction,
        defaultYear,
      ])
    : getFilteredAndSortedData();

  const getDisplayColumns = () => {
    return availableColumns.filter((col) => selectedColumns.includes(col.key));
  };

  const displayColumns = USE_OPTIMIZATIONS
    ? useMemo(getDisplayColumns, [availableColumns, selectedColumns])
    : getDisplayColumns();

  const handleFilterChange = USE_OPTIMIZATIONS
    ? useCallback((newFilters: FilterConfig) => {
        setFilters(newFilters);
      }, [])
    : (newFilters: FilterConfig) => {
        setFilters(newFilters);
      };

  const handleSort = USE_OPTIMIZATIONS
    ? useCallback((key: string) => {
        setSortConfig((prev) => ({
          key,
          direction:
            prev.key === key && prev.direction === 'asc'
              ? 'desc'
              : prev.key === key && prev.direction === 'desc'
                ? null
                : 'asc',
        }));
      }, [])
    : (key: string) => {
        setSortConfig((prev) => ({
          key,
          direction:
            prev.key === key && prev.direction === 'asc'
              ? 'desc'
              : prev.key === key && prev.direction === 'desc'
                ? null
                : 'asc',
        }));
      };

  const renderControls = USE_OPTIMIZATIONS
    ? useMemo(() => {
        const getControls = (disabled: boolean) => (
          <>
            <h1 className={styles.title}>{TITLE}</h1>
            <div className={styles.controls}>
              {disabled ? (
                <Filters disabled={true} />
              ) : (
                <Filters
                  filters={filters}
                  availableYears={availableYears}
                  availableRegions={availableRegions}
                  onFilterChange={handleFilterChange}
                />
              )}
              <Button
                style={{ lineHeight: 1, minHeight: '42px', marginTop: '10px' }}
                onClick={() => setColumnSelectorModalOpen(true)}
                size="small"
                disabled={disabled}
              >
                Select Columns
              </Button>
            </div>
          </>
        );
        return getControls;
      }, [
        filters.selectedYear,
        filters.selectedRegion,
        filters.countrySearch,
        availableYears,
        availableRegions,
        handleFilterChange,
      ])
    : (disabled: boolean) => (
        <>
          <h1 className={styles.title}>{TITLE}</h1>
          <div className={styles.controls}>
            {disabled ? (
              <Filters disabled={true} />
            ) : (
              <Filters
                filters={filters}
                availableYears={availableYears}
                availableRegions={availableRegions}
                onFilterChange={handleFilterChange}
              />
            )}
            <Button
              style={{ lineHeight: 1, minHeight: '42px', marginTop: '10px' }}
              onClick={() => setColumnSelectorModalOpen(true)}
              size="small"
              disabled={disabled}
            >
              Select Columns
            </Button>
          </div>
        </>
      );

  if (!data || error) {
    return (
      <div className={styles.container}>
        {renderControls(true)}
        {error ? <div className={styles.error}>Error loading data: {error}</div> : <Skeleton />}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {renderControls(false)}
      <DataTable
        data={filteredAndSortedData}
        columns={displayColumns}
        sortConfig={sortConfig}
        onSort={handleSort}
        selectedYear={filters.selectedYear}
      />

      <Modal
        title="Select Columns"
        isOpen={columnSelectorModalOpen}
        onClose={() => setColumnSelectorModalOpen(false)}
      >
        <ColumnSelectorForm
          availableColumns={availableColumns}
          onClose={() => setColumnSelectorModalOpen(false)}
        />
      </Modal>
    </div>
  );
};
