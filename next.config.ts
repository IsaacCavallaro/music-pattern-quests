import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: process.env.NODE_ENV === 'production' ? '/music-pattern-quests' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/music-pattern-quests' : '',
  images: {
    unoptimized: true
  },
  // Ensure proper handling of audio files and other assets
  webpack: (config: any) => {
    // Handle audio files and other media
    config.module.rules.push({
      test: /\.(wav|mp3|ogg|webm)$/,
      type: 'asset/resource',
    });

    return config;
  },
  // Headers for CORS and audio loading
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'credentialless'
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin'
          }
        ],
      },
    ]
  }
}

export default nextConfig;