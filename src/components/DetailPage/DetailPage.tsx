'use client';

import { renderImage } from '~/helpers/renderImage';
import { BackdropSize, ImageConfiguration, PosterSize, TMDBVideo } from '~/types';
import { formatReleaseDate } from '~/utils/formatReleaseDate';
import { imageBaseUrl } from '~/utils/imageBaseUrl';
import { safeCall } from '~/utils/safeCall';
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner';
import styles from './DetailPage.module.css';

export const DetailPage = ({
  video,
  imagesConfig,
  onClose,
  loading,
}: {
  video: TMDBVideo | undefined;
  imagesConfig: ImageConfiguration;
  onClose: () => void;
  loading?: boolean;
  id?: string;
}) => {
  if (!loading && !video) {
    return null;
  }
  const handleCloseTrigger = () => {
    onClose();
  };

  const getContent = () => {
    if (loading) {
      return (
        <div className={styles.loadingWrapper}>
          <LoadingSpinner inline={true} />
        </div>
      );
    } else if (video) {
      const posterUrl = imageBaseUrl({ size: BackdropSize.W780, type: 'backdrop' }, imagesConfig);
      const backdropUrl = imageBaseUrl({ size: PosterSize.W500, type: 'poster' }, imagesConfig);
      return (
        <>
          <div className={styles.topBlock}>
            <div className={styles.imageContainerDetail}>
              {renderImage(video, posterUrl, backdropUrl, styles)}
            </div>
            <div className={styles.info}>
              <h2 className={styles.title}>{video.title}</h2>
              <p className={styles.originalTitle}>{video.original_title}</p>
              <div className={styles.metadata}>
                <span className={styles.chip}>
                  {safeCall(video.original_language, 'toLocaleUpperCase', [], '?')}
                </span>
                <span className={styles.chip}>{formatReleaseDate(video)}</span>
                <span className={styles.chip}>
                  {safeCall(video.popularity, 'toFixed', [1], '-')}
                </span>
                <span className={styles.chip}>
                  {safeCall(video.vote_average, 'toFixed', [1], '-')}/
                  {safeCall(video.vote_count, 'toFixed', [0], '-')}
                </span>
              </div>
            </div>
          </div>
          <div className={styles.bottomBlock}>
            <div className={styles.overview}>{video.overview}</div>
          </div>
        </>
      );
    }
  };

  return (
    <div className={styles.container}>
      <button className={styles.roundButton} onClick={handleCloseTrigger}>
        <span className={styles.closeCrossText}>&#xD7;</span>
      </button>
      <div className={styles.content}>{getContent()}</div>
    </div>
  );
};
