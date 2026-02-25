const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['sanity', '@sanity/vision', 'next-sanity', '@sanity/icons'],
  images: {
    domains: ['cdn.sanity.io'],
  },
  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@sanity/icons': path.resolve(__dirname, 'node_modules/@sanity/icons'),
    }
    return config
  },
}

module.exports = nextConfig
