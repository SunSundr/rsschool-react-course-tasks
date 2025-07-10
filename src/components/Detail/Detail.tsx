import { Component } from 'react';
import { TMDBVideo } from '~/types';
import styles from './Detail.module.css';

interface DetailProps {
  video: TMDBVideo;
  backdropUrl: string;
  posterUrl: string;
  onClose: () => void;
  transformSide: string;
}

interface DetailState {
  transition: boolean;
}

class Detail extends Component<DetailProps, DetailState> {
  constructor(props: DetailProps) {
    super(props);
    this.state = { transition: true };
  }

  componentDidMount() {
    setTimeout(() => this.setState({ transition: false }));
  }

  formatReleaseDate = (): string => {
    const { video } = this.props;
    if (video.release_date) {
      const date = new Date(video.release_date);
      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    }
    const yearMatch =
      video.title.match(/\((\d{4})\)$/) || video.original_title.match(/\((\d{4})\)$/);
    return yearMatch ? yearMatch[1] : '?';
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

  hasVerticalScroll = () => document.body.scrollHeight > window.innerHeight;

  getTransformClass = () => {
    switch (this.props.transformSide) {
      case 'left':
        return styles.transformLeft;
      case 'right':
        return styles.transformRight;
      case 'top':
        return styles.transformTop;
      case 'bottom':
        return styles.transformBottom;
      default:
        return '';
    }
  };

  render() {
    const { video, onClose } = this.props;
    return (
      <>
        <style>{`body { height: 100vh; overflow-y: hidden; padding-right: ${this.hasVerticalScroll() ? 15 : 0}px; }`}</style>
        <div className={styles.overlay} onClick={onClose}>
          <div
            className={`${styles.dialog} ${this.state.transition ? this.getTransformClass() : ''}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.closeButton} onClick={onClose}>
              <span className={styles.closeCrossText}>&#xD7;</span>
            </button>
            <div className={styles.content}>
              <div className={styles.imageContainer}>{this.renderImage()}</div>
              <div className={styles.info}>
                <h2 className={styles.title}>{video.title}</h2>
                <p className={styles.originalTitle}>{video.original_title}</p>
                <div className={styles.overview}>{video.overview}</div>
                <div className={styles.metadata}>
                  <span className={styles.chip}>{video.original_language.toUpperCase()}</span>
                  <span className={styles.chip}>{this.formatReleaseDate()}</span>
                  <span className={styles.chip}>{video.popularity.toFixed(1)}</span>
                  <span className={styles.chip}>{video.vote_count}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Detail;
