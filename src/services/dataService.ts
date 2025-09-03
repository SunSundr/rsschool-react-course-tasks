import { BATCH_SIZE_CALC, SpecialColumns } from '~/constants';
import { progressStore } from '~/store/progressStore';
import { formatLabel } from '~/utils/labelFormatter';
import { fetchAndParseWorker } from '~/workers/worker-client';
import { CountriesData, FlattenData } from '../types';

interface ProcessedData {
  maxYear: number;
  availableYears: number[];
  availableRegions: string[];
  availableColumns: { key: string; label: string; sortable: boolean }[];
  sortedData: { [key: number]: FlattenData[] };
}

export const fetchCountriesData = async (): Promise<CountriesData> => {
  try {
    return await fetchAndParseWorker.fetchAndParseJson('/owid-co2-data.json');
  } finally {
    fetchAndParseWorker.terminate();
  }
};

export const processDataInBatches = async (data: CountriesData): Promise<ProcessedData> => {
  const result: ProcessedData = {
    maxYear: 0,
    availableYears: [],
    availableRegions: [],
    availableColumns: [],
    sortedData: {},
  };

  const countries = Object.entries(data);
  const allYears = new Set<number>();
  const allRegions = new Set<string>();
  const allKeys = new Set<string>([SpecialColumns.Country, SpecialColumns.IsoCode]);

  for (let i = 0; i < countries.length; i += BATCH_SIZE_CALC) {
    const batch = countries.slice(i, i + BATCH_SIZE_CALC);

    batch.forEach(([countryName, country]) => {
      allRegions.add(countryName);

      country.data.forEach((yearData) => {
        const year = yearData.year;
        if (!year) return;

        // years
        allYears.add(year);
        result.maxYear = Math.max(result.maxYear, year);

        Object.keys(yearData).forEach((key) => allKeys.add(key));

        // sortedData
        const dataItem = {
          ...yearData,
          country: countryName,
          iso_code: country.iso_code,
        };

        if (!result.sortedData[year]) result.sortedData[year] = [];
        result.sortedData[year].push(dataItem);
      });
    });

    if (i + BATCH_SIZE_CALC < countries.length) {
      await new Promise((resolve) => setTimeout(resolve, 10));
      progressStore.setState({
        message: `Data processing: ${Math.round((i / countries.length) * 100)}%`,
      });
    }
  }

  result.availableYears = Array.from(allYears).sort((a, b) => b - a);
  result.availableRegions = Array.from(allRegions).sort();
  result.availableColumns = Array.from(allKeys)
    .map((key) => ({
      key,
      label: formatLabel(key),
      sortable: key !== SpecialColumns.Year,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  progressStore.setState({ message: 'Complete!' });
  return result;
};

export const getCountriesData = async (): Promise<ProcessedData> => {
  const data = await fetchCountriesData();
  progressStore.setState({ message: 'Sorting the received data...' });
  return await processDataInBatches(data);
};
