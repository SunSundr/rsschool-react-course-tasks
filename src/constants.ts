import { Column } from './types';
import { columnFrom } from './utils/helpers';
import { SUBSCRIPT } from './utils/unicodeSubscripts';

export const APP_TITLE = `Data on CO${SUBSCRIPT['2']} and Greenhouse Gas Emissions`;

export enum SpecialColumns {
  Country = 'country',
  IsoCode = 'iso_code',
  Year = 'year',
}

export const REQUIRED_NAMES_COLUMNS = [
  SpecialColumns.Country,
  SpecialColumns.IsoCode,
  SpecialColumns.Year,
  'population',
  'co2',
  'co2_per_capita',
];

export const REQUIRED_COLUMNS: Column[] = REQUIRED_NAMES_COLUMNS.map((item) => columnFrom(item));

export const NOT_AVAILABLE = '-';

export const MAX_ROWS = 14;

export const BATCH_SIZE_CALC = 300;

export const BATCH_SIZE_UPDATE_COLUMNS = 10;

export enum SortDirection {
  Ascending = 'asc',
  Descending = 'desc',
}

export enum DelayTime {
  Zero = 0,
  Min = 10,
  Average = 200,
  Max = 600,
  InputDebounce = 300,
  HighlightCells = 3000,
}
