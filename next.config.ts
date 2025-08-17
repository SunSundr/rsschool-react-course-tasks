import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import { IgnorePlugin } from 'webpack';

const withNextIntl = createNextIntlPlugin();
const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },
  webpack: (config) => {
    config.plugins.push(
      new IgnorePlugin({
        resourceRegExp: /^\.\/src\/(App|index)\.tsx$/,
      }),
    );
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },
};

export default withNextIntl(nextConfig);
