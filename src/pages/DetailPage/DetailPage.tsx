import { useContext } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import { RefreshContext } from '~/components/Layout/Layout';
import { LoadingSpinner } from '~/components/LoadingSpinner/LoadingSpinner';
import { renderImage } from '~/helpers/renderImage';
import { useMovieDetail } from '~/hooks/useMovieDetail';
import { useResetQueries } from '~/hooks/useRefreshData';
import { BackdropSize, ImageConfiguration, PosterSize } from '~/types';
import { formatReleaseDate } from '~/utils/formatReleaseDate';
import { imageBaseUrl } from '~/utils/imageBaseUrl';
import { safeCall } from '~/utils/safeCall';
import styles from './DetailPage.module.css';

export const DetailPage = () => {
  const { id } = useParams();
  const { handleCloseTrigger } = useContext(RefreshContext);
  const { imagesConfig } = useOutletContext<{ imagesConfig: ImageConfiguration }>();
  const { data: video, isLoading: loading, error } = useMovieDetail(id || '');
  const { resetMovieQueries } = useResetQueries();

  const getContent = () => {
    if (error) {
      return (
        <div className={styles.emptyWrapper}>
          <h2>Error</h2>
          <div className={styles.error}>{error.message || 'Unknown error'}</div>
        </div>
      );
    } else if (loading) {
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
            <div className={styles.imageContainer}>
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
      <button className={styles.roundButton} onClick={handleCloseTrigger}>
        <span className={styles.closeCrossText}>&#xD7;</span>
      </button>
      <button
        className={`${styles.roundButton} ${styles.right}`}
        onClick={() => resetMovieQueries(video?.id)}
      >
        <span>↻</span>
      </button>
      <div className={styles.content}>{getContent()}</div>
    </div>
  );
};
