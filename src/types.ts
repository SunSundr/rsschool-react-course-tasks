import { SortDirection } from './constants';

export interface CountryData {
  year?: number;
  population?: number;
  gdp?: number;
  co2?: number;
  co2_per_capita?: number;
  [key: string]: number | string | undefined;
}

export interface Country {
  iso_code: string;
  data: CountryData[];
}

export interface CountriesData {
  [countryName: string]: Country;
}

export interface TableColumn {
  key: string;
  label: string;
  sortable: boolean;
}

export interface SortConfig {
  key: string;
  direction: `${SortDirection}` | null;
}

export interface FilterConfig {
  selectedYear: number;
  countrySearch: string;
  selectedRegion: string;
}

export type FlattenData = CountryData & { country: string; iso_code: string };

export interface Column {
  key: string;
  label: string;
  sortable: boolean;
}

export interface SortedData {
  [key: number]: FlattenData[];
}

export type FilterChangeType = 'year' | 'region' | 'search';
