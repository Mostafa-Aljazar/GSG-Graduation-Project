import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'affvdhyw60.ufs.sh',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'nbrdqfucz2.ufs.sh',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'another-host.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
