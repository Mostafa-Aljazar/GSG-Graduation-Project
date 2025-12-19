import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/**/*": ["./node_modules/.prisma/client/**/*"],
    "/app/**/*": ["./node_modules/.prisma/client/**/*"]
  },
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
