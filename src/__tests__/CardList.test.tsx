import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createMockVideo, mockImageConfig } from './common';
import CardList from '../components/CardList/CardList';
import { BackdropSize, PosterSize, TMDBVideo } from '../types';
import * as imageBaseUrlUtils from '../utils/imageBaseUrl';

vi.mock('../components/Card/Card', () => ({
  default: ({
    index,
    video,
    onClick,
  }: {
    index: number;
    video: TMDBVideo;
    onClick: (video: TMDBVideo, event: React.MouseEvent) => void;
  }) => (
    <div data-testid={`card-${index}`} onClick={(e) => onClick(video, e)}>
      {video.title}
    </div>
  ),
}));

vi.mock('../components/Detail/Detail', () => ({
  default: ({
    video,
    onClose,
    transformSide,
  }: {
    video: TMDBVideo;
    onClose: () => void;
    transformSide: string;
  }) => (
    <div data-testid="detail-modal">
      <div>Detail: {video.title}</div>
      <div>Transform: {transformSide}</div>
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

vi.mock('../utils/getTransformSide', () => ({
  getTransformSide: vi.fn().mockReturnValue('left'),
}));

vi.mock('../utils/imageBaseUrl', () => ({
  imageBaseUrl: vi.fn((params) => {
    if (params.type === 'backdrop') return 'https://backdrop.url/';
    return 'https://poster.url/';
  }),
}));

const generateMockVideo = (id: number): TMDBVideo =>
  createMockVideo({
    id,
    backdrop_path: `/backdrop${id}.jpg`,
    original_title: `Original Movie ${id}`,
    overview: `Overview ${id}`,
    poster_path: `/poster${id}.jpg`,
    release_date: '2023-12-25',
    title: `Movie ${id}`,
  });

describe('CardList', () => {
  const mockResults = [generateMockVideo(1), generateMockVideo(2), generateMockVideo(3)];

  const defaultProps = {
    results: mockResults,
    imagesConfig: mockImageConfig,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders cards for each result', () => {
    render(<CardList {...defaultProps} />);
    expect(screen.getByTestId('card-1')).toBeInTheDocument();
    expect(screen.getByTestId('card-2')).toBeInTheDocument();
    expect(screen.getByTestId('card-3')).toBeInTheDocument();
    expect(screen.getByText('Movie 1')).toBeInTheDocument();
    expect(screen.getByText('Movie 2')).toBeInTheDocument();
    expect(screen.getByText('Movie 3')).toBeInTheDocument();
  });

  it('initializes with correct image URLs', () => {
    render(<CardList {...defaultProps} />);
    expect(imageBaseUrlUtils.imageBaseUrl).toHaveBeenCalledWith(
      { size: BackdropSize.W780, type: 'backdrop' },
      mockImageConfig,
    );
    expect(imageBaseUrlUtils.imageBaseUrl).toHaveBeenCalledWith(
      { size: PosterSize.W342, type: 'poster' },
      mockImageConfig,
    );
  });

  it('does not show detail initially', () => {
    render(<CardList {...defaultProps} />);
    expect(screen.queryByTestId('detail-modal')).not.toBeInTheDocument();
  });

  it('shows detail when card is clicked', () => {
    render(<CardList {...defaultProps} />);
    fireEvent.click(screen.getByTestId('card-2'));
    expect(screen.getByTestId('detail-modal')).toBeInTheDocument();
    expect(screen.getByText('Detail: Movie 2')).toBeInTheDocument();
  });

  it('closes detail when close button is clicked', () => {
    render(<CardList {...defaultProps} />);
    fireEvent.click(screen.getByTestId('card-1'));
    expect(screen.getByTestId('detail-modal')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Close'));
    expect(screen.queryByTestId('detail-modal')).not.toBeInTheDocument();
  });

  it('renders empty grid when no results', () => {
    render(<CardList {...defaultProps} results={[]} />);
    expect(screen.queryByTestId('card-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('detail-modal')).not.toBeInTheDocument();
  });
});
