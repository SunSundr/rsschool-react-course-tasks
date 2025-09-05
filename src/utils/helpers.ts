import { NOT_AVAILABLE, SpecialColumns } from '~/constants';
import { Column } from '~/types';
import { formatLabel } from './labelFormatter';

export const columnFrom = (name: string): Column => ({
  key: name,
  label: formatLabel(name),
  sortable: name !== SpecialColumns.Year,
});

export const unionStringKey = (a: unknown, b: unknown) => `${a}-${b}`;

export const formatValue = (value: unknown, columnKey?: string): string => {
  if (value === undefined || value === null) return NOT_AVAILABLE;
  if (typeof value === 'number' && columnKey !== SpecialColumns.Year) {
    return value.toLocaleString();
  }
  return String(value);
};
