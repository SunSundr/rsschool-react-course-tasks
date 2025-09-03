import { SUBSCRIPT } from './utils/unicodeSubscripts';

export const TITLE = `CO${SUBSCRIPT['2']} Emissions Data`;

export enum SpecialColumns {
  Country = 'country',
  IsoCode = 'iso_code',
  Year = 'year',
}

export const REQUIRED_COLUMNS = [
  SpecialColumns.Country,
  SpecialColumns.IsoCode,
  SpecialColumns.Year,
  'population',
  'co2',
  'co2_per_capita',
];

export const NOT_AVAILABLE = '-';

export const MAX_ROWS = 14;

export const CHANGE_DISPLAY_TIME_MS = 3000;

export const BATCH_SIZE_CALC = 300;

export const BATCH_SIZE_UPDATE_COLUMNS = 10;
