import { describe, expect, it, vi } from 'vitest';
import { errorLog, formatErrorData, getErrorData, ResponseError } from '../../utils/error';

const defaultErrorObj = { message: 'Unknown error' };

describe('ResponseError', () => {
  it('creates error with all properties', () => {
    const error = new ResponseError('Test message', 'TestError', 404, 'stack trace');
    expect(error.message).toBe('Test message');
    expect(error.name).toBe('TestError');
    expect(error.statusCode).toBe(404);
    expect(error.stack).toBe('stack trace');
    expect(error).toBeInstanceOf(Error);
  });

  it('creates error without stack', () => {
    const error = new ResponseError('Test message', 'TestError', 500);
    expect(error.message).toBe('Test message');
    expect(error.name).toBe('TestError');
    expect(error.statusCode).toBe(500);
  });
});

describe('getErrorData', () => {
  it('extracts data from ResponseError', () => {
    const error = new ResponseError('API Error', 'ApiError', 404);
    const result = getErrorData(error);
    expect(result).toEqual({
      message: 'API Error',
      name: 'ApiError',
      statusCode: 404,
    });
  });

  it('extracts data from regular Error', () => {
    const error = new Error('Regular error');
    const result = getErrorData(error);
    expect(result).toEqual({
      message: 'Regular error',
    });
  });

  it('handles object with statusCode but no name', () => {
    const error = { message: 'Test', statusCode: 500 };
    const result = getErrorData(error);
    expect(result).toEqual({
      message: 'Test',
      name: undefined,
      statusCode: 500,
    });
  });

  it('handles object without message', () => {
    const error = { statusCode: 400 };
    const result = getErrorData(error);
    expect(result).toEqual({
      message: 'Unknown error',
      name: undefined,
      statusCode: 400,
    });
  });

  it('handles object without statusCode', () => {
    const error = { message: 'Simple error', name: 'SimpleError' };
    const result = getErrorData(error);
    expect(result).toEqual({
      message: 'Simple error',
    });
  });

  it('handles null input', () => {
    const result = getErrorData(null);
    expect(result).toEqual(defaultErrorObj);
  });

  it('handles undefined input', () => {
    const result = getErrorData(undefined);
    expect(result).toEqual(defaultErrorObj);
  });

  it('handles string input', () => {
    const result = getErrorData('string error');
    expect(result).toEqual(defaultErrorObj);
  });

  it('handles number input', () => {
    const result = getErrorData(123);
    expect(result).toEqual(defaultErrorObj);
  });
});

describe('errorLog', () => {
  it('logs error with prefix', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    errorLog('test message', 'additional info');
    expect(consoleSpy).toHaveBeenCalledWith('[ERROR]', 'test message', 'additional info');
    consoleSpy.mockRestore();
  });
});

describe('formatErrorData', () => {
  it('formats complete error data', () => {
    const errorData = {
      message: 'Test error',
      name: 'TestError',
      statusCode: 404,
    };
    const result = formatErrorData(errorData);
    expect(result).toBe('TestError, code 404, Test error');
  });

  it('formats error data without name', () => {
    const errorData = {
      message: 'Test error',
      statusCode: 500,
    };
    const result = formatErrorData(errorData);
    expect(result).toBe('code 500, Test error');
  });

  it('formats error data without statusCode', () => {
    const errorData = {
      message: 'Test error',
      name: 'TestError',
    };
    const result = formatErrorData(errorData);
    expect(result).toBe('TestError, Test error');
  });

  it('formats error data with only message', () => {
    const errorData = {
      message: 'Test error',
    };
    const result = formatErrorData(errorData);
    expect(result).toBe('Test error');
  });

  it('handles statusCode of 0', () => {
    const errorData = {
      message: 'Test error',
      statusCode: 0,
    };
    const result = formatErrorData(errorData);
    expect(result).toBe('Test error');
  });
});
