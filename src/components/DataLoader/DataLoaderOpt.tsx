import { use, useCallback, useMemo, useRef, useState } from 'react';
import {
  REQUIRED_COLUMNS,
  REQUIRED_NAMES_COLUMNS,
  SortDirection,
  SpecialColumns,
} from '~/constants';
import { getCountriesData } from '~/services/dataService';
import { useAppStore } from '~/store/store';
import { SortConfig } from '~/types';
import { columnFrom, unionStringKey } from '~/utils/helpers';
import { DataTable } from '../DataTable/DataTableOpt';

const data = getCountriesData();

const DataLoader = () => {
  const sortedData = use(data);
  const { filters, selectedColumns } = useAppStore();

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: SpecialColumns.Country,
    direction: SortDirection.Ascending,
  });

  const previousSortMarkRef = useRef<string>('');

  const filteredAndSortedData = useMemo(() => {
    let filtered = sortedData[filters.selectedYear];

    const hasRegionFilter = filters.selectedRegion;
    const hasSearchFilter = filters.countrySearch;

    if (hasRegionFilter || hasSearchFilter) {
      const searchTerm = hasSearchFilter ? filters.countrySearch.toLowerCase() : '';
      filtered = filtered.filter(
        (item) =>
          (!hasRegionFilter || item.country === filters.selectedRegion) &&
          (!hasSearchFilter || item.country.toLowerCase().includes(searchTerm)),
      );
    }

    const currentSort = unionStringKey(sortConfig.key, sortConfig.direction);

    if (currentSort !== previousSortMarkRef.current) {
      filtered.sort((a, b) => {
        const aVal = a[sortConfig.key as keyof typeof a];
        const bVal = b[sortConfig.key as keyof typeof b];

        if (aVal === undefined && bVal === undefined) return 0;
        if (aVal === undefined) return 1;
        if (bVal === undefined) return -1;

        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return sortConfig.direction === SortDirection.Ascending
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }

        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortConfig.direction === SortDirection.Ascending ? aVal - bVal : bVal - aVal;
        }

        return 0;
      });

      previousSortMarkRef.current = currentSort;
    }

    return filtered;
  }, [
    filters.selectedYear,
    filters.selectedRegion,
    filters.countrySearch,
    sortConfig.key,
    sortConfig.direction,
  ]);

  const displayColumns = useMemo(
    () => [
      ...REQUIRED_COLUMNS,
      ...selectedColumns
        .filter((item) => !REQUIRED_NAMES_COLUMNS.includes(item))
        .map((item) => columnFrom(item)),
    ],
    [selectedColumns],
  );

  const handleSort = useCallback((key: string) => {
    setSortConfig((prev) => {
      if (prev.key !== key) return { key, direction: SortDirection.Ascending };
      const newDirection =
        prev.direction === SortDirection.Ascending
          ? SortDirection.Descending
          : SortDirection.Ascending;

      return { key, direction: newDirection };
    });
  }, []);

  return (
    <DataTable
      data={filteredAndSortedData}
      columns={displayColumns}
      sortConfig={sortConfig}
      onSort={handleSort}
      selectedYear={filters.selectedYear}
    />
  );
};

export default DataLoader;
