import { StateCreator } from 'zustand';
import { TMDBVideo } from '~/types';

export interface VideoSlice {
  videos: TMDBVideo[];
  addVideo: (video: TMDBVideo) => void;
  removeVideo: (id: number) => void;
  clearVideos: () => void;
}

export const createVideoSlice: StateCreator<VideoSlice> = (set) => ({
  videos: [],
  addVideo: (video) =>
    set((state) => ({
      videos: state.videos.some((v) => v.id === video.id) ? state.videos : [...state.videos, video],
    })),
  removeVideo: (id) =>
    set((state) => ({
      videos: state.videos.filter((video) => video.id !== id),
    })),
  clearVideos: () => set({ videos: [] }),
});
