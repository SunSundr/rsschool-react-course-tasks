import { useMemo } from 'react';
import { CountryData, TableColumn } from '~/types';
import { calcWidthData, getCanvasContext } from '~/utils/getCanvasContext';

export const useColumnWidths = (data: CountryData[], columns: TableColumn[]) => {
  return useMemo(() => {
    const context = getCanvasContext();
    const widths: Record<string, number> = {};

    if (!context) {
      columns.forEach((column) => {
        widths[column.key] = calcWidthData.defaultWidth;
      });
      return widths;
    }

    context.font = calcWidthData.font;

    columns.forEach((column) => {
      const headerWidth = context.measureText(column.label).width;

      const dataWidth = Math.max(
        ...data.map((row) => {
          const value = row[column.key];
          if (value === undefined || value === null) {
            return context.measureText('-').width;
          }
          const text = typeof value === 'number' ? value.toLocaleString() : String(value);

          return context.measureText(text).width;
        }),
        0,
      );

      widths[column.key] =
        Math.max(headerWidth, dataWidth) + calcWidthData.padding + calcWidthData.sortIconSpace;
    });

    return widths;
  }, [columns]);
};
