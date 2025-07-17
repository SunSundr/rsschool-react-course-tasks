import { beforeEach, describe, expect, it } from 'vitest';
import { getTransformSide } from '../../utils/getTransformSide';

Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 1000,
});

Object.defineProperty(window, 'innerHeight', {
  writable: true,
  configurable: true,
  value: 800,
});

const createMockMouseEvent = (clientX: number, clientY: number): React.MouseEvent =>
  ({
    clientX,
    clientY,
  }) as React.MouseEvent;

describe('getTransformSide', () => {
  beforeEach(() => {
    window.innerWidth = 1000;
    window.innerHeight = 800;
  });

  it('returns left when closest to left edge', () => {
    const event = createMockMouseEvent(50, 400);
    expect(getTransformSide(event)).toBe('left');
  });

  it('returns right when closest to right edge', () => {
    const event = createMockMouseEvent(950, 400);
    expect(getTransformSide(event)).toBe('right');
  });

  it('returns top when closest to top edge', () => {
    const event = createMockMouseEvent(500, 50);
    expect(getTransformSide(event)).toBe('top');
  });

  it('returns bottom when closest to bottom edge', () => {
    const event = createMockMouseEvent(500, 750);
    expect(getTransformSide(event)).toBe('bottom');
  });

  it('returns top when at exact center (equal distances)', () => {
    const event = createMockMouseEvent(500, 400);
    expect(getTransformSide(event)).toBe('top');
  });

  it('handles corner cases - top-left corner', () => {
    const event = createMockMouseEvent(100, 100);
    expect(getTransformSide(event)).toBe('left');
  });

  it('handles corner cases - bottom-right corner', () => {
    const event = createMockMouseEvent(900, 700);
    expect(getTransformSide(event)).toBe('right');
  });

  it('handles edge coordinates', () => {
    const event = createMockMouseEvent(0, 0);
    expect(getTransformSide(event)).toBe('left');
  });

  it('handles maximum coordinates', () => {
    const event = createMockMouseEvent(1000, 800);
    expect(getTransformSide(event)).toBe('right');
  });

  it('works with different viewport dimensions', () => {
    window.innerWidth = 1920;
    window.innerHeight = 1080;
    const event = createMockMouseEvent(1800, 540);
    expect(getTransformSide(event)).toBe('right');
  });
});
