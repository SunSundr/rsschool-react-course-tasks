import { useState } from 'react';
import { BackdropSize, ImageConfiguration, PosterSize, TMDBVideo } from '~/types';
import { getTransformSide } from '~/utils/getTransformSide';
import { imageBaseUrl } from '~/utils/imageBaseUrl';
import { Card } from '../Card/Card';
import Detail from '../Detail/Detail';
import styles from './CardList.module.css';

interface CardListProps {
  results: TMDBVideo[];
  imagesConfig: ImageConfiguration;
}

export const CardList: React.FC<CardListProps> = ({ results, imagesConfig }) => {
  const [backdropUrl] = useState(
    imageBaseUrl({ size: BackdropSize.W780, type: 'backdrop' }, imagesConfig),
  );
  const [posterUrl] = useState(
    imageBaseUrl({ size: PosterSize.W342, type: 'poster' }, imagesConfig),
  );
  const [selectedVideo, setSelectedVideo] = useState<TMDBVideo | null>(null);
  const [transformSide, setTransformSide] = useState('');

  const handleCardClick = (video: TMDBVideo, event: React.MouseEvent) => {
    setSelectedVideo(video);
    setTransformSide(getTransformSide(event));
  };

  const handleCloseDetail = () => {
    setSelectedVideo(null);
  };

  return (
    <>
      <div className={styles.cardGrid}>
        {results.map((item, index) => (
          <Card
            key={index}
            index={index + 1}
            video={item}
            backdropUrl={backdropUrl}
            posterUrl={posterUrl}
            onClick={handleCardClick}
          />
        ))}
      </div>
      {selectedVideo && (
        <Detail
          video={selectedVideo}
          backdropUrl={backdropUrl}
          posterUrl={posterUrl}
          onClose={handleCloseDetail}
          transformSide={transformSide}
        />
      )}
    </>
  );
};
