import { CountriesData } from '../types';

export const fetchCountriesData = async (): Promise<CountriesData> => {
  const response = await fetch('/owid-co2-data.json');
  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }
  return response.json();
};
