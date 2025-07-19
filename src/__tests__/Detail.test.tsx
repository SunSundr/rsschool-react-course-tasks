import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createMockVideo } from './common';
import Detail from '../components/Detail/Detail';

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

describe('Detail', () => {
  const defaultProps = {
    video: createMockVideo(),
    backdropUrl: 'https://backdrop.url/',
    posterUrl: 'https://poster.url/',
    onClose: vi.fn(),
    transformSide: 'left',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders movie title and original title', () => {
    render(<Detail {...defaultProps} />);
    expect(screen.getByText('Test Movie')).toBeInTheDocument();
    expect(screen.getByText('Original Test Movie')).toBeInTheDocument();
  });

  it('renders movie overview', () => {
    render(<Detail {...defaultProps} />);
    expect(screen.getByText('Test overview')).toBeInTheDocument();
  });

  it('renders mocked image', () => {
    render(<Detail {...defaultProps} />);
    expect(screen.getByTestId('mocked-image')).toBeInTheDocument();
  });

  it('renders metadata chips', () => {
    render(<Detail {...defaultProps} />);
    expect(screen.getByText('EN')).toBeInTheDocument();
    expect(screen.getByText('25/12/2023')).toBeInTheDocument();
    expect(screen.getByText('8.5')).toBeInTheDocument();
    expect(screen.getByText('8.5/8.5')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(<Detail {...defaultProps} />);
    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when overlay is clicked', () => {
    render(<Detail {...defaultProps} />);
    const overlay =
      screen.getByText('Test Movie').parentElement?.parentElement?.parentElement?.parentElement;
    if (overlay) {
      fireEvent.click(overlay);
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    } else {
      throw new Error('Overlay not found');
    }
  });

  it('does not call onClose when dialog content is clicked', () => {
    render(<Detail {...defaultProps} />);
    const dialog = screen.getByText('Test Movie').parentElement?.parentElement;
    if (dialog) {
      fireEvent.click(dialog);
      expect(defaultProps.onClose).not.toHaveBeenCalled();
    }
  });

  it('renders with different transform sides', () => {
    const sides = ['left', 'right', 'top', 'bottom'];
    sides.forEach((side) => {
      const { container, unmount } = render(<Detail {...defaultProps} transformSide={side} />);
      expect(
        container.querySelector(
          `[class*="transform${side.charAt(0).toUpperCase() + side.slice(1)}"]`,
        ),
      ).toBeInTheDocument();
      unmount();
    });
  });
});
