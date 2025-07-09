import { Component } from 'react';
import { TMDBVideo } from '~/types';
import Card from '../Card/Card';
import Empty from '../Empty/Empty';

interface CardListProps {
  results?: TMDBVideo[];
}

class CardList extends Component<CardListProps> {
  render() {
    return this.props.results?.length === 0 ? (
      <Empty />
    ) : (
      <div>
        {this.props.results?.map((item, index) => (
          <Card key={index} index={index + 1} video={item} />
        ))}
      </div>
    );
  }
}

export default CardList;
