import { describe, expect, it } from 'vitest';
import { safeCall } from '../../utils/safeCall';

describe('safeCall', () => {
  it('returns null for null value', () => {
    expect(safeCall(null, 'toString')).toBeNull();
  });

  it('returns null for undefined value', () => {
    expect(safeCall(undefined, 'toString')).toBeNull();
  });

  it('returns default value for null when provided', () => {
    expect(safeCall(null, 'toString', [], 'default')).toBe('default');
  });

  it('calls method on object and returns result', () => {
    const obj = { getValue: () => 'test' };
    expect(safeCall(obj, 'getValue')).toBe('test');
  });

  it('calls method with arguments', () => {
    const obj = { add: (a: number, b: number) => a + b };
    expect(safeCall(obj, 'add', [2, 3])).toBe(5);
  });

  it('calls method on primitive values', () => {
    expect(safeCall('hello', 'toUpperCase')).toBe('HELLO');
    expect(safeCall(123, 'toString')).toBe('123');
  });

  it('returns null when method does not exist', () => {
    const obj = {};
    expect(safeCall(obj, 'nonExistent')).toBeNull();
  });

  it('returns default value when method does not exist', () => {
    const obj = {};
    expect(safeCall(obj, 'nonExistent', [], 'default')).toBe('default');
  });

  it('returns null when property is not a function', () => {
    const obj = { prop: 'not a function' };
    expect(safeCall(obj, 'prop')).toBeNull();
  });

  it('returns null when method throws error', () => {
    const obj = {
      throwError: () => {
        throw new Error('test error');
      },
    };
    expect(safeCall(obj, 'throwError')).toBeNull();
  });

  it('returns default value when method throws error', () => {
    const obj = {
      throwError: () => {
        throw new Error('test error');
      },
    };
    expect(safeCall(obj, 'throwError', [], 'fallback')).toBe('fallback');
  });

  it('handles array methods', () => {
    const arr = [1, 2, 3];
    expect(safeCall(arr, 'join', ['-'])).toBe('1-2-3');
  });
});
