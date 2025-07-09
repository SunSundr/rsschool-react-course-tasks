import { Component } from 'react';
import { TMDBVideo } from '~/types';

export interface CardProps {
  index: number;
  video: TMDBVideo;
  backdropUrl: string;
  posterUrl: string;
}

class Card extends Component<CardProps> {
  imagePoster = () => {
    if (this.props.video.poster_path) {
      return (
        <img
          src={`${this.props.posterUrl}${this.props.video.poster_path}`}
          alt={this.props.video.title}
          style={{ maxWidth: '80px' }}
        />
      );
    }
  };

  imageBackdrop = () => {
    if (this.props.video.backdrop_path) {
      return (
        <img
          src={`${this.props.backdropUrl}${this.props.video.backdrop_path}`}
          alt={this.props.video.title}
          style={{ maxWidth: '80px' }}
        />
      );
    }
  };

  render() {
    return (
      <article style={{ border: '1px solid white', padding: 5, margin: 10, borderRadius: 5 }}>
        <div>
          <h3>{this.props.index}</h3>
        </div>
        {this.imagePoster()}
        {this.imageBackdrop()}
        <h3>{this.props.video.title}</h3>
        <p>{this.props.video.original_title}</p>
        <p>{this.props.video.overview}</p>
        <p>{this.props.video.original_language}</p>
        <p>{this.props.video.release_date}</p>
        <p>{this.props.video.popularity}</p>
        <p>{this.props.video.vote_count}</p>
      </article>
    );
  }
}

export default Card;
