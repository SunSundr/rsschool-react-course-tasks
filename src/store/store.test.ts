import { configureStore } from '@reduxjs/toolkit';
import { describe, expect, it } from 'vitest';
import formReducer from './formSlice';
import { type AppDispatch, type RootState, store } from './store';

describe('Redux Store Configuration', () => {
  it('should create store with form reducer', () => {
    expect(store.getState()).toEqual({
      form: formReducer(undefined, { type: '@@INIT' }),
    });
  });

  it('should have correct RootState type', () => {
    const state: RootState = store.getState();
    expect(state).toHaveProperty('form');
  });

  it('should have correct AppDispatch type', () => {
    const dispatch: AppDispatch = store.dispatch;
    expect(typeof dispatch).toBe('function');
  });

  it('should configure store with correct reducer structure', () => {
    const testStore = configureStore({
      reducer: {
        form: formReducer,
      },
    });

    expect(testStore.getState()).toHaveProperty('form');
  });
});
