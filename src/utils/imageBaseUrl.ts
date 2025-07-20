import { ImageConfiguration, ImageUrlParams } from '~/types';

export function imageBaseUrl(params: ImageUrlParams, config: ImageConfiguration): string {
  const { size = 'original', type = 'poster', useSecure = true } = params;

  const baseUrl = useSecure ? config.secure_base_url : config.base_url;

  const availableSizes = {
    backdrop: config.backdrop_sizes,
    logo: config.logo_sizes,
    poster: config.poster_sizes,
    profile: config.profile_sizes,
    still: config.still_sizes,
  }[type] as string[];

  const selectedSize = availableSizes.includes(size) ? size : 'original';

  return `${baseUrl}${selectedSize}`;
}
