import { Component } from 'react';
import { TMDBVideo } from '~/types';

export interface CardProps {
  index: number;
  video: TMDBVideo;
}

class Card extends Component<CardProps> {
  render() {
    return (
      <article>
        <div>
          <h3>{this.props.index}</h3>
        </div>
        <h3>{this.props.video.title}</h3>
        <p>{this.props.video.overview}</p>
      </article>
    );
  }
}

export default Card;
