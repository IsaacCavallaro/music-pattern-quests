/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: process.env.NODE_ENV === 'production' ? '/music-pattern-quests' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/music-pattern-quests/' : '',
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig