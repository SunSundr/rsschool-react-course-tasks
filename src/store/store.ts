import { create } from 'zustand';
import { createPendingSlice, PendingSlice } from './pendingSlice';
import { createSearchCacheSlice, SearchCacheSlice } from './searchCacheSlice';
import { createThemeSlice, ThemeSlice } from './themeSlice';
import { createVideoSlice, VideoSlice } from './videoSlice';

type StoreState = VideoSlice & ThemeSlice & PendingSlice & SearchCacheSlice;

export const useStore = create<StoreState>()((...args) => ({
  ...createVideoSlice(...args),
  ...createThemeSlice(...args),
  ...createPendingSlice(...args),
  ...createSearchCacheSlice(...args),
}));
