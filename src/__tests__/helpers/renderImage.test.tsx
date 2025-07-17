import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderImage } from '../../helpers/renderImage';
import { createMockVideo } from '../common';

const mockStyles = {
  image: 'image-class',
  backdropImage: 'backdrop-class',
};

describe('renderImage', () => {
  it('renders poster image when poster_path exists', () => {
    const video = createMockVideo({ poster_path: '/poster.jpg' });
    const { container } = render(
      renderImage(video, 'https://poster.url', 'https://backdrop.url', mockStyles),
    );
    const img = container.querySelector('img');
    expect(img).toHaveAttribute('src', 'https://poster.url/poster.jpg');
    expect(img).toHaveAttribute('alt', 'Test Movie');
    expect(img).toHaveClass('image-class');
  });

  it('renders backdrop image when only backdrop_path exists', () => {
    const video = createMockVideo({ backdrop_path: '/backdrop.jpg', poster_path: null });
    const { container } = render(
      renderImage(video, 'https://poster.url', 'https://backdrop.url', mockStyles),
    );
    const img = container.querySelector('img');
    expect(img).toHaveAttribute('src', 'https://backdrop.url/backdrop.jpg');
    expect(img).toHaveAttribute('alt', 'Test Movie');
    expect(img).toHaveClass('image-class');
    expect(img).toHaveClass('backdrop-class');
  });

  it('renders fallback image when no paths exist', () => {
    const video = createMockVideo({ backdrop_path: null, poster_path: null });
    const { container } = render(
      renderImage(video, 'https://poster.url/', 'https://backdrop.url/', mockStyles),
    );
    const img = container.querySelector('img');
    expect(img).toHaveAttribute('src', '/noImage.png');
    expect(img).toHaveAttribute('alt', 'No image available');
    expect(img).toHaveClass('image-class');
  });

  it('prefers poster over backdrop when both exist', () => {
    const video = createMockVideo();
    const { container } = render(
      renderImage(video, 'https://poster.url', 'https://backdrop.url', mockStyles),
    );
    const img = container.querySelector('img');
    expect(img).toHaveAttribute('src', 'https://poster.url/poster.jpg');
    expect(img).not.toHaveClass('backdrop-class');
  });
});
