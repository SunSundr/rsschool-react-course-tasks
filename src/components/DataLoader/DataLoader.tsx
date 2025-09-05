import { use, useState } from 'react';
import {
  REQUIRED_COLUMNS,
  REQUIRED_NAMES_COLUMNS,
  SortDirection,
  SpecialColumns,
} from '~/constants';
import { getCountriesData } from '~/services/dataService';
import { useAppStore } from '~/store/store';
import { SortConfig } from '~/types';
import { columnFrom } from '~/utils/helpers';
import { DataTable } from '../DataTable/DataTable';

const data = getCountriesData();

const DataLoader = () => {
  const sortedData = use(data);
  const { filters, selectedColumns } = useAppStore();

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: SpecialColumns.Country,
    direction: SortDirection.Ascending,
  });

  const filteredAndSortedData = () => {
    let filtered = sortedData[filters.selectedYear];

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
          return sortConfig.direction === SortDirection.Ascending
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }

        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortConfig.direction === SortDirection.Ascending ? aVal - bVal : bVal - aVal;
        }

        return 0;
      });
    }

    return filtered;
  };

  const displayColumns = () => [
    ...REQUIRED_COLUMNS,
    ...selectedColumns
      .filter((item) => !REQUIRED_NAMES_COLUMNS.includes(item))
      .map((item) => columnFrom(item)),
  ];

  const handleSort = (key: string) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  return (
    <DataTable
      data={filteredAndSortedData()}
      columns={displayColumns()}
      sortConfig={sortConfig}
      onSort={handleSort}
      selectedYear={filters.selectedYear}
    />
  );
};

export default DataLoader;
