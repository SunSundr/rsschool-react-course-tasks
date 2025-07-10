import { Component } from 'react';
import { TMDBVideo } from '~/types';
import { safeCall } from '~/utils/safeCall';
import styles from './Card.module.css';

export interface CardProps {
  index: number;
  video: TMDBVideo;
  backdropUrl: string;
  posterUrl: string;
  onClick: (video: TMDBVideo, event: React.MouseEvent) => void;
}

class Card extends Component<CardProps> {
  formatReleaseDate = (): string => {
    const { video } = this.props;
    try {
      if (video.release_date) {
        const date = new Date(video.release_date);
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
      }
      const yearMatch = video.title.match(/(\d{4})$/) || video.original_title.match(/(\d{4})$/);
      return yearMatch ? yearMatch[1] : '?';
    } catch {
      return '?';
    }
  };

  renderImage = () => {
    const { video, posterUrl, backdropUrl } = this.props;

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

  render() {
    const { video, index } = this.props;

    return (
      <article className={styles.card} onClick={(event) => this.props.onClick(video, event)}>
        <div className={styles.imageContainer}>
          {this.renderImage()}
          <div className={styles.cardNumber}>{index}</div>
        </div>

        <div className={styles.content}>
          <h3 className={styles.title}>{video.title}</h3>
          <p className={styles.originalTitle}>{video.original_title}</p>

          <div className={styles.metadataWrapper}>
            <div className={styles.metadata}>
              <span className={styles.chip}>
                {safeCall(video.original_language, 'toLocaleUpperCase', [], '?')}
              </span>
              <span className={styles.chip}>{this.formatReleaseDate()}</span>
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
  }
}

export default Card;
