import { CSV_SEPARATOR } from '~/constants';
import { TMDBVideo } from '~/types';
import { formatReleaseDate } from './formatReleaseDate';

export const downloadCSV = (
  selectedItems: TMDBVideo[],
  setDownloadUrl: React.Dispatch<React.SetStateAction<string | null>>,
) => {
  const escapeCsv = (value: unknown) => {
    if (value === null || value === undefined) return '';
    const stringValue = String(value);
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  };

  const processVideo = (video: TMDBVideo) => {
    const getSafeString = (value: string | null | undefined, fallback = '<empty>') =>
      value?.trim() || fallback;

    const getSafeNumber = (value: number | undefined, fallback = '0') =>
      typeof value === 'number' ? String(value) : fallback;

    const getSafeBoolean = (value: boolean | undefined) =>
      typeof value === 'boolean' ? (value ? 'true' : 'false') : 'false';

    const getSafeArray = (arr: number[] | undefined) => (arr?.length ? arr.join('|') : '<none>');

    return [
      escapeCsv(video.id),
      escapeCsv(getSafeString(video.title, '<untitled>')),
      escapeCsv(getSafeString(video.original_title, getSafeString(video.title, '<untitled>'))),
      escapeCsv(formatReleaseDate(video) || '<no date>'),
      escapeCsv(getSafeString(video.overview)),
      escapeCsv(getSafeNumber(video.popularity)),
      escapeCsv(getSafeNumber(video.vote_average)),
      escapeCsv(getSafeNumber(video.vote_count)),
      escapeCsv(getSafeBoolean(video.adult)),
      escapeCsv(getSafeBoolean(video.video)),
      escapeCsv(getSafeString(video.backdrop_path, '<no backdrop>')),
      escapeCsv(getSafeString(video.poster_path, '<no poster>')),
      escapeCsv(getSafeString(video.original_language, '<unknown>')),
      escapeCsv(getSafeArray(video.genre_ids)),
    ].join(CSV_SEPARATOR);
  };

  const csvHeader = [
    'ID',
    'Title',
    'Original Title',
    'Release Date',
    'Overview',
    'Popularity',
    'Vote Average',
    'Vote Count',
    'Adult',
    'Video',
    'Backdrop Path',
    'Poster Path',
    'Original Language',
    'Genre IDs',
  ].join(CSV_SEPARATOR);

  const csvContent = [csvHeader, ...selectedItems.map(processVideo)].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  setDownloadUrl(url);
};
