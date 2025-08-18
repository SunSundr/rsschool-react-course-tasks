'use client';

import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ITEMS_PER_PAGE, MAX_PAGES, PAGE_KEY } from '~/constants';
import { useStore } from '~/store/store';
import { BackdropSize, ImageConfiguration, PosterSize, QueryType, TMDBVideo } from '~/types';
import { imageBaseUrl } from '~/utils/imageBaseUrl';
import { Card } from '../Card/Card';
import { DetailPage } from '../DetailPage/DetailPage';
import { Empty } from '../Empty/Empty';
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner';
import { Pagination } from '../Pagination/Pagination';
import styles from './CardList.module.css';

interface CardListNextProps {
  results: TMDBVideo[];
  imagesConfig: ImageConfiguration;
  currentPage: number;
  totalPages: number;
  totalResults: number;
  cache: { query: string; page: number; defaultQuery: QueryType };
  loading?: boolean;
  id?: string;
}

export const CardList: React.FC<CardListNextProps> = ({
  results,
  currentPage,
  totalPages,
  imagesConfig,
  totalResults,
  cache,
  loading,
  id,
}) => {
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [backdropUrl] = useState(
    imageBaseUrl({ size: BackdropSize.W780, type: 'backdrop' }, imagesConfig),
  );
  const [posterUrl] = useState(
    imageBaseUrl({ size: PosterSize.W342, type: 'poster' }, imagesConfig),
  );

  const selectedRef = useRef<HTMLDivElement>(null);
  const { videos, addVideo, removeVideo } = useStore();
  const { pending, setCachedResult } = useStore();

  useEffect(() => {
    if (loading) return;
    setCachedResult(
      {
        page: currentPage,
        results,
        total_pages: totalPages,
        total_results: totalResults,
      },
      cache,
      imagesConfig,
    );
  }, [results]);

  const handleCheckboxChange = useCallback((video: TMDBVideo, isChecked: boolean) => {
    isChecked ? addVideo(video) : removeVideo(video.id);
  }, []);

  const routeWithParams = (route: string, params?: URLSearchParams) => {
    if (!params) params = new URLSearchParams(searchParams);
    startTransition(() => {
      router.push(`${route}?${params.toString()}`);
    });
  };

  const handleCardClick = (video: TMDBVideo) => {
    const targetRoute = id === video.id.toString() ? '/' : `../detailed/${video.id}`;
    router.prefetch(targetRoute);
    routeWithParams(targetRoute);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set(PAGE_KEY, page.toString());
    routeWithParams('/', params);
  };

  const handleBackdropClick = async () => {
    routeWithParams('/');
  };

  const pageOffset = (currentPage - 1) * ITEMS_PER_PAGE;
  const ids = videos.map((v) => v.id);

  if ((pending || isPending) && !id) return <LoadingSpinner />;

  if (results.length === 0) {
    return <Empty />;
  }

  //  if (!hasDetail) {
  //     setTimeout(() => ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 1100);
  //   }

  return (
    <div
      className={`${styles.container} ${id ? styles.withDetail : ''} ${id ? styles.withDetailFill : ''}`}
    >
      {id && <div className={styles.backdrop} onClick={handleBackdropClick} />}
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
              isActive={false}
              isSelected={ids.includes(item.id)}
              onCheckboxChange={(e) => handleCheckboxChange(item, e.target.checked)}
              scrolRef={id === item.id.toString() ? selectedRef : undefined}
            />
          ))}
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages < MAX_PAGES ? totalPages : MAX_PAGES}
          onPageChange={handlePageChange}
        />
      </div>
      {id && (
        <div
          className={`${styles.detailOutlet} ${styles.scaleOne}`}
          onClick={(e) => e.stopPropagation()}
        >
          <DetailPage
            imagesConfig={imagesConfig}
            video={results.find((v) => v.id === Number(id))}
            onClose={handleBackdropClick}
            loading={loading}
          />
        </div>
      )}
    </div>
  );
};
