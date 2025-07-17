import { describe, expect, it } from 'vitest';
import { BackdropSize, LogoSize, PosterSize, ProfileSize, StillSize } from '../../types';
import { imageBaseUrl } from '../../utils/imageBaseUrl';
import { mockImageConfig } from '../common';

describe('imageBaseUrl', () => {
  it('returns secure base URL by default', () => {
    const result = imageBaseUrl({}, mockImageConfig);
    expect(result).toBe(`${mockImageConfig.secure_base_url}original`);
  });

  it('returns non-secure base URL when useSecure is false', () => {
    const result = imageBaseUrl({ useSecure: false }, mockImageConfig);
    expect(result).toBe(`${mockImageConfig.base_url}original`);
  });

  it('uses original size by default', () => {
    const result = imageBaseUrl({}, mockImageConfig);
    expect(result).toBe(`${mockImageConfig.secure_base_url}original`);
  });

  it('uses poster type by default', () => {
    const result = imageBaseUrl({ size: PosterSize.W342 }, mockImageConfig);
    expect(result).toBe(`${mockImageConfig.secure_base_url}${PosterSize.W342}`);
  });

  it('handles backdrop type with valid size', () => {
    const result = imageBaseUrl({ type: 'backdrop', size: BackdropSize.W780 }, mockImageConfig);
    expect(result).toBe(`${mockImageConfig.secure_base_url}${BackdropSize.W780}`);
  });

  it('handles logo type with valid size', () => {
    const result = imageBaseUrl({ type: 'logo', size: LogoSize.W92 }, mockImageConfig);
    expect(result).toBe(`${mockImageConfig.secure_base_url}${LogoSize.W92}`);
  });

  it('handles profile type with valid size', () => {
    const result = imageBaseUrl({ type: 'profile', size: ProfileSize.W185 }, mockImageConfig);
    expect(result).toBe(`${mockImageConfig.secure_base_url}${ProfileSize.W185}`);
  });

  it('handles still type with valid size', () => {
    const result = imageBaseUrl({ type: 'still', size: StillSize.W185 }, mockImageConfig);
    expect(result).toBe(`${mockImageConfig.secure_base_url}${StillSize.W185}`);
  });

  it('falls back to original when size is not available', () => {
    const result = imageBaseUrl({ type: 'poster', size: 'w999' as PosterSize }, mockImageConfig);
    expect(result).toBe(`${mockImageConfig.secure_base_url}original`);
  });

  it('falls back to original when invalid size for backdrop', () => {
    const result = imageBaseUrl({ type: 'backdrop', size: PosterSize.W154 }, mockImageConfig);
    expect(result).toBe(`${mockImageConfig.secure_base_url}original`);
  });

  it('combines all parameters correctly', () => {
    const result = imageBaseUrl(
      {
        type: 'backdrop',
        size: BackdropSize.W300,
        useSecure: false,
      },
      mockImageConfig,
    );
    expect(result).toBe(`${mockImageConfig.base_url}${BackdropSize.W300}`);
  });
});
