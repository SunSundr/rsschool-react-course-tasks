import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { callWithDelay } from '../../utils/callWithDelay';

describe('callWithDelay', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('calls callback after default delay', () => {
    const callback = vi.fn();
    callWithDelay(callback);
    expect(callback).not.toHaveBeenCalled();
    vi.advanceTimersByTime(400);
    expect(callback).toHaveBeenCalledOnce();
  });

  it('calls callback after custom delay', () => {
    const callback = vi.fn();
    callWithDelay(callback, 1000);
    expect(callback).not.toHaveBeenCalled();
    vi.advanceTimersByTime(999);
    expect(callback).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalledOnce();
  });

  it('does not call callback before delay expires', () => {
    const callback = vi.fn();
    callWithDelay(callback, 500);
    vi.advanceTimersByTime(499);
    expect(callback).not.toHaveBeenCalled();
  });

  it('calls callback exactly once', () => {
    const callback = vi.fn();
    callWithDelay(callback, 100);
    vi.advanceTimersByTime(200);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
