import { useRef } from 'react';
import { renderImage } from '~/helpers/renderImage';
import { TMDBVideo } from '~/types';
import { formatReleaseDate } from '~/utils/formatReleaseDate';
import { safeCall } from '~/utils/safeCall';
import styles from './Card.module.css';

export interface CardProps {
  index: number;
  video: TMDBVideo;
  backdropUrl: string;
  posterUrl: string;
  isSelected: boolean;
  onClick: (
    video: TMDBVideo,
    event: React.MouseEvent,
    ref: React.RefObject<HTMLElement | null>,
  ) => void;
}

export const Card: React.FC<CardProps> = ({
  video,
  index,
  posterUrl,
  backdropUrl,
  onClick,
  isSelected,
}) => {
  const ref = useRef(null);
  return (
    <article
      ref={ref}
      className={`${styles.card} ${isSelected ? styles.detailSelected : ''}`}
      onClick={(event) => onClick(video, event, ref)}
    >
      <div className={styles.imageContainer}>
        {renderImage(video, posterUrl, backdropUrl, styles)}
        <div className={styles.cardNumber}>{index}</div>
        <input
          type="checkbox"
          className={styles.checkbox}
          // checked={isSelected}
          // onChange={onCheckboxChange}
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{video.title}</h3>
        <p className={styles.originalTitle}>{video.original_title}</p>

        <div className={styles.metadataWrapper}>
          <div className={styles.metadata}>
            <span className={styles.chip}>
              {safeCall(video.original_language, 'toLocaleUpperCase', [], '?')}
            </span>
            <span className={styles.chip}>{formatReleaseDate(video)}</span>
          </div>
          <div className={styles.metadata}>
            <span className={styles.chip}>{safeCall(video.popularity, 'toFixed', [1], '-')}</span>
            <span className={styles.chip}>
              {safeCall(video.vote_average, 'toFixed', [1], '-')}/
              {safeCall(video.vote_count, 'toFixed', [0], '-')}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};
