import { CountryData, TableColumn } from '~/types';
import { calcWidthData, getCanvasContext } from './getCanvasContext';

const widthCache = new Map<string, number>();

export const calculateMaxWidth = (
  data: CountryData[],
  columns: TableColumn[],
  columnKey: string,
): number => {
  const cacheKey = `${columnKey}_${data.length}_${columns.map((c) => c.key).join('_')}`;

  if (widthCache.has(cacheKey)) return widthCache.get(cacheKey)!;

  const context = getCanvasContext();
  if (!context) return calcWidthData.defaultWidth;

  context.font = calcWidthData.font;

  const column = columns.find((c) => c.key === columnKey);
  const headerWidth = context.measureText(column?.label || '').width;

  const dataWidth = Math.max(
    ...data.map((row) => {
      const value = row[columnKey];
      if (value === undefined || value === null) {
        return context.measureText('-').width;
      }
      const text = typeof value === 'number' ? value.toLocaleString() : String(value);

      return context.measureText(text).width;
    }),
    0,
  );

  const maxWidth =
    Math.max(headerWidth, dataWidth) + calcWidthData.padding + calcWidthData.sortIconSpace;

  widthCache.set(cacheKey, maxWidth);
  return maxWidth;
};

export const clearWidthCache = () => widthCache.clear();
