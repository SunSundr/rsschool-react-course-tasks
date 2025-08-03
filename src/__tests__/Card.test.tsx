import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { createMockVideo } from './common';
import { Card } from '../components/Card/Card';

vi.mock('../helpers/renderImage', () => ({
  renderImage: () => <img data-testid="mocked-image" alt="Mocked image" />,
}));

vi.mock('../utils/formatReleaseDate', () => ({
  formatReleaseDate: () => '25/12/2023',
}));

vi.mock('../utils/safeCall', () => ({
  safeCall: (_value: unknown, action: string, _args: unknown[] = [], defaultValue?: unknown) => {
    switch (action) {
      case 'toLocaleUpperCase':
        return 'EN';
      case 'toFixed':
        return '8.5';
      default:
        return defaultValue;
    }
  },
}));

describe('Card', () => {
  const defaultProps = {
    index: 1,
    video: createMockVideo(),
    backdropUrl: 'https://backdrop.url/',
    posterUrl: 'https://poster.url/',
    onClick: vi.fn(),
    isActive: false,
    onCheckboxChange: vi.fn(),
    isSelected: false,
  };

  it('renders card with movie title', () => {
    render(<Card {...defaultProps} />);
    expect(screen.getByText('Test Movie')).toBeInTheDocument();
  });

  it('renders card with original title', () => {
    render(<Card {...defaultProps} />);
    expect(screen.getByText('Original Test Movie')).toBeInTheDocument();
  });

  it('renders card number', () => {
    render(<Card {...defaultProps} />);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('renders mocked image', () => {
    render(<Card {...defaultProps} />);
    expect(screen.getByTestId('mocked-image')).toBeInTheDocument();
  });

  it('renders metadata chips', () => {
    render(<Card {...defaultProps} />);
    expect(screen.getByText('EN')).toBeInTheDocument();
    expect(screen.getByText('25/12/2023')).toBeInTheDocument();
    expect(screen.getByText('8.5')).toBeInTheDocument();
    expect(screen.getByText('8.5/8.5')).toBeInTheDocument();
  });

  it('calls onClick with video, event, and ref when clicked', () => {
    render(<Card {...defaultProps} />);
    const card = screen.getByRole('article');
    fireEvent.click(card);
    expect(defaultProps.onClick).toHaveBeenCalledWith(
      defaultProps.video,
      expect.any(Object),
      expect.any(Object),
    );
  });

  it('renders with different index', () => {
    render(<Card {...defaultProps} index={42} />);
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('renders with different video data', () => {
    const customVideo = createMockVideo({
      title: 'Custom Movie',
      original_title: 'Custom Original',
    });
    render(<Card {...defaultProps} video={customVideo} />);
    expect(screen.getByText('Custom Movie')).toBeInTheDocument();
    expect(screen.getByText('Custom Original')).toBeInTheDocument();
  });
});
