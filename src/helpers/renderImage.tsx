import { TMDBVideo } from '~/types';

export const renderImage = (
  video: TMDBVideo,
  posterUrl: string,
  backdropUrl: string,
  styles: Record<string, string>,
) => {
  if (video.poster_path) {
    return (
      <img src={`${posterUrl}${video.poster_path}`} alt={video.title} className={styles.image} />
    );
  }

  if (video.backdrop_path) {
    return (
      <img
        src={`${backdropUrl}${video.backdrop_path}`}
        alt={video.title}
        className={`${styles.image} ${styles.backdropImage}`}
      />
    );
  }

  return <img src="/noImage.png" alt="No image available" className={styles.image} />;
};
