import { FilterConfig } from '~/types';

export type FiltersProps =
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
