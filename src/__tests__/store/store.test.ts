import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useStore } from '../../store/store';
import { Theme } from '../../types';
import { createMockVideo, localStorageMock } from '../common';

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

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Store', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
    useStore.setState({ videos: [], theme: Theme.Light });
  });

  describe('VideoSlice', () => {
    it('initializes with empty videos array', () => {
      const { videos } = useStore.getState();
      expect(videos).toEqual([]);
    });

    it('adds a video', () => {
      const mockVideo = createMockVideo({ id: 1, title: 'Test Movie' });
      useStore.getState().addVideo(mockVideo);

      const { videos } = useStore.getState();
      expect(videos).toHaveLength(1);
      expect(videos[0]).toEqual(mockVideo);
    });

    it('does not add duplicate video', () => {
      const mockVideo = createMockVideo({ id: 1, title: 'Test Movie' });
      useStore.getState().addVideo(mockVideo);
      useStore.getState().addVideo(mockVideo);

      const { videos } = useStore.getState();
      expect(videos).toHaveLength(1);
    });

    it('removes a video by id', () => {
      const mockVideo1 = createMockVideo({ id: 1, title: 'Movie 1' });
      const mockVideo2 = createMockVideo({ id: 2, title: 'Movie 2' });

      useStore.getState().addVideo(mockVideo1);
      useStore.getState().addVideo(mockVideo2);
      useStore.getState().removeVideo(1);

      const { videos } = useStore.getState();
      expect(videos).toHaveLength(1);
      expect(videos[0].id).toBe(2);
    });

    it('clears all videos', () => {
      const mockVideo = createMockVideo({ id: 1, title: 'Test Movie' });
      useStore.getState().addVideo(mockVideo);
      useStore.getState().clearVideos();

      const { videos } = useStore.getState();
      expect(videos).toEqual([]);
    });
  });

  describe('ThemeSlice', () => {
    it('initializes with light theme when no saved theme and prefers light', async () => {
      const { theme } = useStore.getState();
      expect(theme).toBe(Theme.Light);
    });

    it('initializes with dark theme when matchMedia prefers dark', async () => {
      vi.mocked(window.matchMedia).mockReturnValue({
        matches: true,
        media: '(prefers-color-scheme: dark)',
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      });
      vi.resetModules();
      const { useStore: newUseStore } = await import('../../store/store');
      const { theme } = newUseStore.getState();
      expect(theme).toBe(Theme.Dark);
    });

    it('sets theme', () => {
      useStore.getState().setTheme(Theme.Dark);

      const { theme } = useStore.getState();
      expect(theme).toBe(Theme.Dark);
    });

    it('loads theme from localStorage', async () => {
      localStorageMock.setItem('theme', JSON.stringify(Theme.Dark));
      vi.resetModules();
      const { useStore: newUseStore } = await import('../../store/store');
      const { theme } = newUseStore.getState();
      expect(theme).toBe(Theme.Dark);
    });

    it('handles invalid localStorage theme data', async () => {
      localStorageMock.setItem('theme', 'invalid-json');
      vi.resetModules();
      const { useStore: newUseStore } = await import('../../store/store');
      const { theme } = newUseStore.getState();
      expect(theme).toBe(Theme.Dark);
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('theme');
    });
  });

  describe('Store Integration', () => {
    it('combines both slices correctly', () => {
      const state = useStore.getState();
      expect(state.videos).toBeDefined();
      expect(state.addVideo).toBeDefined();
      expect(state.removeVideo).toBeDefined();
      expect(state.clearVideos).toBeDefined();
      expect(state.theme).toBeDefined();
      expect(state.setTheme).toBeDefined();
    });

    it('maintains separate state for each slice', () => {
      const mockVideo = createMockVideo({ id: 1, title: 'Test Movie' });
      useStore.getState().addVideo(mockVideo);
      useStore.getState().setTheme(Theme.Dark);
      const { videos, theme } = useStore.getState();
      expect(videos).toHaveLength(1);
      expect(theme).toBe(Theme.Dark);
    });
  });
});
