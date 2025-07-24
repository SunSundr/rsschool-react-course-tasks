import { useContext, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { RefreshContext } from '~/components/Layout/Layout';
import { renderImage } from '~/helpers/renderImage';
import { fetchDetailMovie } from '~/services/movieService';
import { TMDBVideo } from '~/types';
import { formatReleaseDate } from '~/utils/formatReleaseDate';
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
  const [video, setVideo] = useState<TMDBVideo | null>(props.video || null);
  const [loading, setLoading] = useState(!props.video);
  const [error, setError] = useState<string | null>(null);

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
          setError('Failed to load movie details');
          console.error(err);
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

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  const posterUrl = props.posterUrl || `https://image.tmdb.org/t/p/w500${video?.poster_path}`;
  const backdropUrl =
    props.backdropUrl || `https://image.tmdb.org/t/p/original${video?.backdrop_path}`;

  return (
    <div className={styles.container}>
      <button className={styles.closeButton} onClick={handleClose}>
        <span className={styles.closeCrossText}>&#xD7;</span>
      </button>
      <div className={styles.content}>
        {video && (
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
        )}
        {video && (
          <div className={styles.bottomBlock}>
            <div className={styles.overview}>{video.overview}</div>
          </div>
        )}
        {!video && <div className={styles.error}>Movie not found</div>}
      </div>
    </div>
  );
};
