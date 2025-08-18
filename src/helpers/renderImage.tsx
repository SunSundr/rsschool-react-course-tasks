import { JSX } from 'react';
import Image from 'next/image';
import { TMDBVideo } from '~/types';

export const renderImage = (
  video: TMDBVideo,
  posterUrl: string,
  backdropUrl: string,
  styles: Record<string, string>,
): JSX.Element => {
  const sizes = '(max-width: 9999px) 100vw';

  if (video.poster_path) {
    return (
      <Image
        src={`${posterUrl}${video.poster_path}`}
        alt={video.title}
        fill
        sizes={sizes}
        priority={true}
        fetchPriority="low"
        className={styles.posterImage}
      />
    );
  }

  if (video.backdrop_path) {
    return (
      <Image
        src={`${backdropUrl}${video.backdrop_path}`}
        alt={video.title}
        fill
        sizes={sizes}
        priority={true}
        fetchPriority="low"
        className={styles.backdropImage}
      />
    );
  }

  return (
    <Image
      src="/noImage.png"
      alt="No image available"
      className={styles.image}
      placeholder="empty"
      priority={true}
      fetchPriority="low"
      fill
      sizes={sizes}
    />
  );
};
