import { Component } from 'react';
import { BackdropSize, ImageConfiguration, PosterSize, TMDBVideo } from '~/types';
import { imageBaseUrl } from '~/utils/imageBaseUrl';
import styles from './CardList.module.css';
import Card from '../Card/Card';
import Detail from '../Detail/Detail';

interface CardListProps {
  results: TMDBVideo[];
  imagesConfig: ImageConfiguration;
}

interface CardListState {
  backdropUrl: string;
  posterUrl: string;
  selectedVideo: TMDBVideo | null;
  transformSide: string;
}

class CardList extends Component<CardListProps, CardListState> {
  constructor(props: CardListProps) {
    super(props);
    this.state = {
      backdropUrl: imageBaseUrl({ size: BackdropSize.W780, type: 'backdrop' }, props.imagesConfig),
      posterUrl: imageBaseUrl({ size: PosterSize.W342, type: 'poster' }, props.imagesConfig),
      selectedVideo: null,
      transformSide: '',
    };
  }

  getTransformSide = (event: React.MouseEvent): string => {
    const { clientX: x, clientY: y } = event;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const distances = {
      left: x,
      right: viewportWidth - x,
      top: y,
      bottom: viewportHeight - y,
    };

    const closestSide = Object.entries(distances).reduce(
      (min, [side, distance]) => (distance < min.distance ? { side, distance } : min),
      { side: 'left', distance: distances.left },
    ).side;

    return closestSide;
  };

  handleCardClick = (video: TMDBVideo, event: React.MouseEvent) => {
    this.setState({ selectedVideo: video, transformSide: this.getTransformSide(event) });
  };

  handleCloseDetail = () => {
    this.setState({ selectedVideo: null });
  };

  render() {
    return (
      <>
        <div className={styles.cardGrid}>
          {this.props.results.map((item, index) => (
            <Card
              key={index}
              index={index + 1}
              video={item}
              backdropUrl={this.state.backdropUrl}
              posterUrl={this.state.posterUrl}
              onClick={this.handleCardClick}
            />
          ))}
        </div>
        {this.state.selectedVideo && (
          <Detail
            video={this.state.selectedVideo}
            backdropUrl={this.state.backdropUrl}
            posterUrl={this.state.posterUrl}
            onClose={this.handleCloseDetail}
            transformSide={this.state.transformSide}
          />
        )}
      </>
    );
  }
}

export default CardList;
