import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Flyout } from '~/components/Flyout/Flyout';
import { useStore } from '~/store/store';
import { downloadCSV } from '~/utils/downloadCSV';
import { createMockVideo } from './common';

vi.mock('~/store/store');
vi.mock('~/utils/downloadCSV');

vi.hoisted(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

const mockRevokeObjectURL = vi.fn();
global.URL.revokeObjectURL = mockRevokeObjectURL;

const mockClick = vi.fn();
vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(mockClick);

describe('Flyout', () => {
  const mockClearVideos = vi.fn();
  const mockDownloadCSV = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockRevokeObjectURL.mockClear();
    mockClick.mockClear();

    vi.mocked(useStore).mockReturnValue({
      videos: [],
      clearVideos: mockClearVideos,
      addVideo: vi.fn(),
      removeVideo: vi.fn(),
      theme: 'light',
      setTheme: vi.fn(),
    });
    vi.mocked(downloadCSV).mockImplementation(mockDownloadCSV);
  });

  it('should not show flyout when no videos selected', () => {
    render(<Flyout />);
    const flyout = screen.getByText('0 items are selected').closest('div');
    expect(flyout?.className).not.toMatch(/show/);
  });

  it('should show flyout with correct count when videos are selected', () => {
    vi.mocked(useStore).mockReturnValue({
      videos: [createMockVideo({ id: 1 }), createMockVideo({ id: 2 })],
      clearVideos: mockClearVideos,
      addVideo: vi.fn(),
      removeVideo: vi.fn(),
      theme: 'light',
      setTheme: vi.fn(),
    });

    render(<Flyout />);
    expect(screen.getByText('2 items are selected')).toBeInTheDocument();
  });

  it('should call clearVideos when "Unselect all" clicked', () => {
    vi.mocked(useStore).mockReturnValue({
      videos: [createMockVideo({ id: 1 })],
      clearVideos: mockClearVideos,
      addVideo: vi.fn(),
      removeVideo: vi.fn(),
      theme: 'light',
      setTheme: vi.fn(),
    });

    render(<Flyout />);
    fireEvent.click(screen.getByText('Unselect all'));
    expect(mockClearVideos).toHaveBeenCalled();
  });

  it('should call downloadCSV when "Download" clicked', () => {
    const mockVideos = [createMockVideo({ id: 1, title: 'Test' })];
    vi.mocked(useStore).mockReturnValue({
      videos: mockVideos,
      clearVideos: mockClearVideos,
      addVideo: vi.fn(),
      removeVideo: vi.fn(),
      theme: 'light',
      setTheme: vi.fn(),
    });

    render(<Flyout />);
    fireEvent.click(screen.getByText('Download'));
    expect(mockDownloadCSV).toHaveBeenCalledWith(mockVideos, expect.any(Function));
  });

  it('should create download link when downloadUrl is set', async () => {
    const mockVideos = [createMockVideo({ id: 1 })];
    vi.mocked(useStore).mockReturnValue({
      videos: mockVideos,
      clearVideos: mockClearVideos,
      addVideo: vi.fn(),
      removeVideo: vi.fn(),
      theme: 'light',
      setTheme: vi.fn(),
    });

    vi.mocked(downloadCSV).mockImplementation((_, setUrl) => {
      setTimeout(() => setUrl('mock-download-url'), 0);
    });

    const { container } = render(<Flyout />);
    fireEvent.click(screen.getByText('Download'));

    await waitFor(() => {
      const downloadLink = container.querySelector('a[download]');
      expect(downloadLink).not.toBeNull();
      expect(downloadLink).toHaveAttribute('href', 'mock-download-url');
      expect(downloadLink).toHaveAttribute('download', '1_items.csv');
    });
  });

  it('should set correct filename for multiple items', async () => {
    const mockVideos = [createMockVideo({ id: 1 }), createMockVideo({ id: 2 })];
    vi.mocked(useStore).mockReturnValue({
      videos: mockVideos,
      clearVideos: mockClearVideos,
      addVideo: vi.fn(),
      removeVideo: vi.fn(),
      theme: 'light',
      setTheme: vi.fn(),
    });

    vi.mocked(downloadCSV).mockImplementation((_, setUrl) => {
      setTimeout(() => setUrl('mock-download-url-2'), 0);
    });

    const { container } = render(<Flyout />);
    fireEvent.click(screen.getByText('Download'));

    await waitFor(() => {
      const downloadLink = container.querySelector('a[download]');
      expect(downloadLink).not.toBeNull();
      expect(downloadLink).toHaveAttribute('download', '2_items.csv');
    });
  });
});
