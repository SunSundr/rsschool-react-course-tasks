import { useContext } from 'react';
import { useLocation, useOutletContext, useParams } from 'react-router-dom';
import { RefreshContext } from '~/components/Layout/Layout';
import { LoadingSpinner } from '~/components/LoadingSpinner/LoadingSpinner';
import { renderImage } from '~/helpers/renderImage';
import { useMovieDetail } from '~/hooks/useMovieDetail';
import { BackdropSize, ImageConfiguration, PosterSize, TMDBVideo } from '~/types';
import { formatReleaseDate } from '~/utils/formatReleaseDate';
import { imageBaseUrl } from '~/utils/imageBaseUrl';
import { safeCall } from '~/utils/safeCall';
import styles from './DetailPage.module.css';

export const DetailPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const { handleCloseTrigger } = useContext(RefreshContext);
  const { imagesConfig } = useOutletContext<{ imagesConfig: ImageConfiguration }>();

  const locationState = location.state as { video?: TMDBVideo };
  const { data: video, isLoading: loading, error } = useMovieDetail(id || '');

  const currentVideo = locationState?.video || video;

  const handleClose = () => {
    handleCloseTrigger();
  };

  const getContent = () => {
    if (error) {
      return (
        <div className={styles.emptyWrapper}>
          <h2>Error</h2>
          <div className={styles.error}>{error.message || 'Unknown error'}</div>
        </div>
      );
    } else if (loading && !locationState?.video) {
      return (
        <div className={styles.loadingWrapper}>
          <LoadingSpinner inline={true} />
        </div>
      );
    } else if (currentVideo) {
      const posterUrl = imageBaseUrl({ size: BackdropSize.W780, type: 'backdrop' }, imagesConfig);
      const backdropUrl = imageBaseUrl({ size: PosterSize.W500, type: 'poster' }, imagesConfig);
      return (
        <>
          <div className={styles.topBlock}>
            <div className={styles.imageContainer}>
              {renderImage(currentVideo, posterUrl, backdropUrl, styles)}
            </div>
            <div className={styles.info}>
              <h2 className={styles.title}>{currentVideo.title}</h2>
              <p className={styles.originalTitle}>{currentVideo.original_title}</p>
              <div className={styles.metadata}>
                <span className={styles.chip}>
                  {safeCall(currentVideo.original_language, 'toLocaleUpperCase', [], '?')}
                </span>
                <span className={styles.chip}>{formatReleaseDate(currentVideo)}</span>
                <span className={styles.chip}>
                  {safeCall(currentVideo.popularity, 'toFixed', [1], '-')}
                </span>
                <span className={styles.chip}>
                  {safeCall(currentVideo.vote_average, 'toFixed', [1], '-')}/
                  {safeCall(currentVideo.vote_count, 'toFixed', [0], '-')}
                </span>
              </div>
            </div>
          </div>
          <div className={styles.bottomBlock}>
            <div className={styles.overview}>{currentVideo.overview}</div>
          </div>
        </>
      );
    } else {
      return (
        <div className={styles.emptyWrapper}>
          <div className={styles.error}>Movie not found</div>
        </div>
      );
    }
  };

  return (
    <div className={styles.container}>
      <button className={styles.closeButton} onClick={handleClose}>
        <span className={styles.closeCrossText}>&#xD7;</span>
      </button>
      <div className={styles.content}>{getContent()}</div>
    </div>
  );
};
