import { beforeEach, describe, expect, Mock, test, vi } from 'vitest';
import { getBase64 } from './getBase64';

describe('getBase64', () => {
  let mockFile: File;
  let mockReader: {
    readAsDataURL: Mock;
    onload: () => void;
    onerror: (v?: unknown) => void;
    result: string | null;
  };

  beforeEach(() => {
    mockFile = new File(['test content'], 'test.txt', { type: 'text/plain' });

    mockReader = {
      readAsDataURL: vi.fn(),
      onload: vi.fn(),
      onerror: vi.fn(),
      result: 'data:base64,dGVzdCBjb250ZW50',
    };

    globalThis.FileReader = vi.fn(() => mockReader) as unknown as typeof globalThis.FileReader;
  });

  test('successfully converts file to base64', async () => {
    const promise = getBase64(mockFile);
    mockReader.onload();
    await expect(promise).resolves.toBe(mockReader.result);
    expect(mockReader.readAsDataURL).toHaveBeenCalledWith(mockFile);
  });

  test('handles file read error', async () => {
    const testError = new Error('Read error');
    const promise = getBase64(mockFile);
    mockReader.onerror(testError);

    await expect(promise).rejects.toThrow(testError);
  });

  test('handles null result correctly', async () => {
    mockReader.result = null;
    const promise = getBase64(mockFile);
    mockReader.onload();
    await expect(promise).resolves.toBeNull();
  });
});
