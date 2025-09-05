import { SpecialColumns } from '~/constants';
import { SortConfig } from '~/types';

export const getSortIcon = (sortConfig: SortConfig, columnKey: string) => {
  if (sortConfig.key !== columnKey || sortConfig.key === SpecialColumns.Year) return '';
  return sortConfig.direction === 'asc' ? '↑' : '↓';
};
