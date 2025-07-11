import { Component } from 'react';
import { renderImage } from '~/helpers/renderImage';
import { TMDBVideo } from '~/types';
import { formatReleaseDate } from '~/utils/formatDate';
import { safeCall } from '~/utils/safeCall';
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
  state = { transition: true };

  componentDidMount() {
    setTimeout(() => this.setState({ transition: false }));
  }

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
    const { video, onClose, posterUrl, backdropUrl } = this.props;
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
              <div className={styles.imageContainer}>
                {renderImage(video, posterUrl, backdropUrl, styles)}
              </div>
              <div className={styles.info}>
                <h2 className={styles.title}>{video.title}</h2>
                <p className={styles.originalTitle}>{video.original_title}</p>
                <div className={styles.overview}>{video.overview}</div>
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
          </div>
        </div>
      </>
    );
  }
}

export default Detail;
