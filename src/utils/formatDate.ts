import { TMDBVideo } from '~/types';

export function formatReleaseDate(video: TMDBVideo): string {
  try {
    if (video.release_date) {
      const date = new Date(video.release_date);
      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    }
    const yearMatch = video.title.match(/(\d{4})$/) || video.original_title.match(/(\d{4})$/);
    return yearMatch ? yearMatch[1] : '?';
  } catch {
    return '?';
  }
}
