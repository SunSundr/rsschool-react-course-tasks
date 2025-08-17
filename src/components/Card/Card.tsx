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
  isActive: boolean;
  onClick: (
    video: TMDBVideo,
    event: React.MouseEvent,
    ref: React.RefObject<HTMLElement | null>,
  ) => void;
  onCheckboxChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isSelected: boolean;
  scrolRef?: React.RefObject<HTMLDivElement | null>;
}

export const Card: React.FC<CardProps> = ({
  video,
  index,
  posterUrl,
  backdropUrl,
  onClick,
  isActive,
  onCheckboxChange,
  isSelected,
  scrolRef,
}) => {
  const ref = useRef(null);

  if (scrolRef) {
    setTimeout(
      () => scrolRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }),
      800,
    );
  }

  return (
    <article
      ref={ref}
      className={`${styles.card} ${isActive ? styles.detailSelected : ''}`}
      onClick={(event) => onClick(video, event, ref)}
    >
      <div className={styles.imageContainer} ref={scrolRef}>
        {renderImage(video, posterUrl, backdropUrl, styles)}
        <div className={styles.cardNumber}>{index}</div>
        <input
          type="checkbox"
          className={styles.checkbox}
          checked={isSelected}
          onChange={onCheckboxChange}
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
