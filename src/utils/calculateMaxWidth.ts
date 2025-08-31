import { CountryData, TableColumn } from '~/types';

export const calculateMaxWidth = (
  data: CountryData[],
  columns: TableColumn[],
  columnKey: string,
): number => {
  const font = '14px sans-serif';
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) return 40;

  context.font = font;
  const headerWidth = context.measureText(
    columns.find((c) => c.key === columnKey)?.label || '',
  ).width;

  const dataWidth = Math.max(
    ...data.map((row) => {
      const value = row[columnKey as keyof typeof row];
      const formatedValue = typeof value === 'number' ? value.toLocaleString() : value;
      const text = formatedValue !== undefined && value !== null ? String(formatedValue) : '-';
      return context.measureText(text).width;
    }),
  );

  const padding = 32;
  const sortIconSpace = 20;

  return Math.max(headerWidth, dataWidth) + padding + sortIconSpace;
};
