import { Component } from 'react';
import { BackdropSize, ImageConfiguration, PosterSize, TMDBVideo } from '~/types';
import { imageBaseUrl } from '~/utils/imageBaseUrl';
import Card from '../Card/Card';

interface CardListProps {
  results?: TMDBVideo[];
  imagesConfig: ImageConfiguration;
}

interface CardListState {
  backdropUrl: string;
  posterUrl: string;
}

class CardList extends Component<CardListProps, CardListState> {
  constructor(props: CardListProps) {
    super(props);
    this.state = {
      backdropUrl: imageBaseUrl({ size: BackdropSize.W780, type: 'backdrop' }, props.imagesConfig),
      posterUrl: imageBaseUrl({ size: PosterSize.W154, type: 'poster' }, props.imagesConfig),
    };
  }

  render() {
    return (
      <div>
        {this.props.results?.map((item, index) => (
          <Card
            key={index}
            index={index + 1}
            video={item}
            backdropUrl={this.state.backdropUrl}
            posterUrl={this.state.posterUrl}
          />
        ))}
      </div>
    );
  }
}

export default CardList;
