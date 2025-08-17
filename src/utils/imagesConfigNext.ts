import { fetchImagesConfig } from '~/services/movieService';
import { ImageConfiguration } from '~/types';

let cachedImageConfig: ImageConfiguration | null = null;
let lastUpdated: number = 0;
const CACHE_TTL = 24 * 60 * 60 * 1000;

export async function getImagesConfig(): Promise<ImageConfiguration> {
  const now = Date.now();

  if (!cachedImageConfig || now - lastUpdated > CACHE_TTL) {
    cachedImageConfig = await fetchImagesConfig();
    lastUpdated = now;
  }

  return cachedImageConfig;
}
