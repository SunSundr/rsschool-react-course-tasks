import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { useLocalStorage } from '~/hooks/useLocalStorage';
import { localStorageMock } from '../common';

describe('useLocalStorage', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      configurable: true,
    });
  });

  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return initial value if localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 'default'));
    expect(result.current[0]).toBe('default');
    expect(localStorageMock.getItem).toHaveBeenCalledWith('testKey');
  });

  it('should save and retrieve string value', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 'default'));
    act(() => result.current[1]('newValue'));
    expect(result.current[0]).toBe('newValue');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('testKey', JSON.stringify('newValue'));
  });

  it('should handle object values correctly', () => {
    const obj = { name: 'John', age: 30 };
    const { result } = renderHook(() => useLocalStorage('testObj', obj));
    act(() => result.current[1]({ ...obj, age: 31 }));
    expect(result.current[0]).toEqual({ name: 'John', age: 31 });
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'testObj',
      JSON.stringify({ name: 'John', age: 31 }),
    );
  });

  it('should remove item when value is empty and deleteIfEmpty=true', () => {
    localStorageMock.getItem.mockImplementationOnce(() => JSON.stringify('default'));
    const { result } = renderHook(() => useLocalStorage('testKey', 'default', true));
    vi.clearAllMocks();
    act(() => result.current[1](''));
    expect(result.current[0]).toBe('');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('testKey');
    expect(localStorageMock.setItem).not.toHaveBeenCalled();
  });

  it('should keep empty value when deleteIfEmpty=false', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 'default', false));
    act(() => result.current[1](''));
    expect(result.current[0]).toBe('');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('testKey', JSON.stringify(''));
    expect(localStorageMock.removeItem).not.toHaveBeenCalled();
  });

  it('should handle JSON parse error', () => {
    localStorageMock.getItem.mockImplementationOnce(() => '{invalid json}');
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { result } = renderHook(() => useLocalStorage('brokenKey', 'default'));
    expect(result.current[0]).toBe('default');
    expect(errorSpy).toHaveBeenCalledWith('Error reading from localStorage', expect.any(Error));
    errorSpy.mockRestore();
  });

  it('should handle localStorage setItem error', () => {
    localStorageMock.setItem.mockImplementationOnce(() => {
      throw new Error('Mock storage error');
    });
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { result } = renderHook(() => useLocalStorage('testKey', 'value'));
    act(() => result.current[1]('newValue'));
    expect(errorSpy).toHaveBeenCalledWith('Error writing to localStorage', expect.any(Error));
    errorSpy.mockRestore();
  });

  it('should handle functional updates', () => {
    const { result } = renderHook(() => useLocalStorage('counter', 0));
    act(() => result.current[1]((prev) => (prev as number) + 1));
    expect(result.current[0]).toBe(1);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('counter', '1');
  });
});
