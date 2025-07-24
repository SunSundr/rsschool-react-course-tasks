import { useContext, useEffect, useState } from 'react';
import { useLocation, useOutletContext, useParams } from 'react-router-dom';
import { RefreshContext } from '~/components/Layout/Layout';
import { LoadingSpinner } from '~/components/LoadingSpinner/LoadingSpinner';
import { renderImage } from '~/helpers/renderImage';
import { fetchDetailMovie } from '~/services/movieService';
import { BackdropSize, ImageConfiguration, PosterSize, TMDBVideo } from '~/types';
import { getErrorData } from '~/utils/error';
import { formatReleaseDate } from '~/utils/formatReleaseDate';
import { imageBaseUrl } from '~/utils/imageBaseUrl';
import { safeCall } from '~/utils/safeCall';
import styles from './DetailPage.module.css';

interface DetailProps {
  video?: TMDBVideo;
  backdropUrl?: string;
  posterUrl?: string;
}

export const DetailPage = (props: DetailProps = {}) => {
  const { id } = useParams();
  const location = useLocation();
  const { handleCloseTrigger } = useContext(RefreshContext);
  const { imagesConfig } = useOutletContext<{ imagesConfig: ImageConfiguration }>();
  const [video, setVideo] = useState<TMDBVideo | null>(props.video || null);
  const [loading, setLoading] = useState(!props.video);
  const [error, setError] = useState<{ msg: string; statusCode?: number } | null>(null);

  const locationState = location.state as { video?: TMDBVideo };

  useEffect(() => {
    if (locationState?.video) {
      setVideo(locationState.video);
      setLoading(false);
      return;
    }

    if (!props.video && id) {
      const loadData = async () => {
        try {
          const data = await fetchDetailMovie(id);
          setVideo(data);
        } catch (err) {
          const errData = getErrorData(err);
          setError({ msg: errData.message, statusCode: errData.statusCode });
        } finally {
          setLoading(false);
        }
      };

      loadData();
    }
  }, [id, props.video, locationState]);

  const handleClose = () => {
    handleCloseTrigger();
  };

  const getContent = () => {
    if (error) {
      return (
        <div className={styles.emptyWrapper}>
          <h2>Error {error.statusCode}</h2>
          <div className={styles.error}>{error.msg}</div>
        </div>
      );
    } else if (loading) {
      return (
        <div className={styles.loadingWrapper}>
          <LoadingSpinner />
        </div>
      );
    } else if (video) {
      const posterUrl =
        props.posterUrl ||
        imageBaseUrl({ size: BackdropSize.W780, type: 'backdrop' }, imagesConfig);
      const backdropUrl =
        props.backdropUrl || imageBaseUrl({ size: PosterSize.W500, type: 'poster' }, imagesConfig);
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
      <button className={styles.closeButton} onClick={handleClose}>
        <span className={styles.closeCrossText}>&#xD7;</span>
      </button>
      <div className={styles.content}>{getContent()}</div>
    </div>
  );
};
