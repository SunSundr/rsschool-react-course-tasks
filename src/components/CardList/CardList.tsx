import { useContext, useEffect, useRef, useState } from 'react';
import { Outlet, useNavigate, useOutlet, useSearchParams } from 'react-router-dom';
import { ITEMS_PER_PAGE, MAX_PAGES } from '~/constants';
import { BackdropSize, ImageConfiguration, PosterSize, TMDBVideo } from '~/types';
import { imageBaseUrl } from '~/utils/imageBaseUrl';
import { Card } from '../Card/Card';
import { RefreshContext } from '../Layout/Layout';
import { Pagination } from '../Pagination/Pagination';
import styles from './CardList.module.css';

interface CardListProps {
  results: TMDBVideo[];
  imagesConfig: ImageConfiguration;
  currentPage: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
}

export const CardList: React.FC<CardListProps> = ({
  results,
  imagesConfig,
  currentPage,
  totalPages,
  handlePageChange,
}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const outlet = useOutlet();
  const hasDetail = !!outlet;
  const { closeTrigger, handleCloseTrigger } = useContext(RefreshContext);
  const [backdropUrl] = useState(
    imageBaseUrl({ size: BackdropSize.W780, type: 'backdrop' }, imagesConfig),
  );
  const [posterUrl] = useState(
    imageBaseUrl({ size: PosterSize.W342, type: 'poster' }, imagesConfig),
  );
  const [showOutlet, setShowOutlet] = useState(false);
  const detailOutletRef = useRef<HTMLDivElement>(null);

  const [selectedDetealId, setelectedDetealId] = useState<null | number>(null);

  const navUrlWithCurrentParams = (url: string) => {
    const paramsString = searchParams.toString();
    return `${url}${paramsString ? `?${paramsString}` : ''}`;
  };

  const navigateHome = () => {
    setShowOutlet(false);
    setTimeout(() => navigate(navUrlWithCurrentParams('/')), 1000);
  };

  const handleBackdropClick = () => {
    navigateHome();
  };

  const handleCardClick = (
    video: TMDBVideo,
    _event: React.MouseEvent,
    ref: React.RefObject<HTMLElement | null>,
  ) => {
    setelectedDetealId(video.id);
    navigate(navUrlWithCurrentParams(`/detailed/${video.id}`), { state: { video } });
    if (!hasDetail) {
      setTimeout(() => ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 1100);
    }
  };

  useEffect(() => {
    setShowOutlet(hasDetail);
  }, [hasDetail]);

  useEffect(() => {
    if (closeTrigger && hasDetail) {
      handleCloseTrigger();
      setelectedDetealId(null);
      navigateHome();
    }
  }, [closeTrigger, hasDetail, navigate]);

  const pageOffset = (currentPage - 1) * ITEMS_PER_PAGE;

  return (
    <div
      className={`${styles.container} ${hasDetail ? styles.withDetail : ''} ${showOutlet ? styles.withDetailFill : styles.withDetailZero}`}
    >
      {hasDetail && <div className={styles.backdrop} onClick={handleBackdropClick} />}
      <div className={styles.cardGridWrapper}>
        <div className={styles.cardGrid}>
          {results.map((item, index) => (
            <Card
              key={`${item.id}-${index}`}
              index={index + 1 + pageOffset}
              video={item}
              backdropUrl={backdropUrl}
              posterUrl={posterUrl}
              onClick={handleCardClick}
              isSelected={selectedDetealId === item.id}
            />
          ))}
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages < MAX_PAGES ? totalPages : MAX_PAGES}
          onPageChange={handlePageChange}
        />
      </div>
      <div
        ref={detailOutletRef}
        className={`${styles.detailOutlet} ${showOutlet ? styles.scaleOne : styles.scaleZero}`}
        onClick={(e) => e.stopPropagation()}
      >
        <Outlet context={{ imagesConfig }} />
      </div>
    </div>
  );
};
