import { create } from 'zustand';
import { createThemeSlice, ThemeSlice } from './themeSlice';
import { createVideoSlice, VideoSlice } from './videoSlice';

type StoreState = VideoSlice & ThemeSlice;

export const useStore = create<StoreState>()((...args) => ({
  ...createVideoSlice(...args),
  ...createThemeSlice(...args),
}));
