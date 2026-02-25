const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['sanity', '@sanity/vision', 'next-sanity', '@sanity/icons'],
  images: {
    domains: ['cdn.sanity.io'],
  },
  webpack: (config, { isServer }) => {
    const frontendModules = path.resolve(__dirname, 'node_modules')
    config.resolve.alias = {
      ...config.resolve.alias,
      // Force all Sanity packages to use frontend's node_modules (single instance = no context error)
      'sanity': path.join(frontendModules, 'sanity'),
      '@sanity/icons': path.join(frontendModules, '@sanity/icons'),
      '@sanity/vision': path.join(frontendModules, '@sanity/vision'),
      '@sanity/color-input': path.join(frontendModules, '@sanity/color-input'),
      'sanity-plugin-media': path.join(frontendModules, 'sanity-plugin-media'),
    }
    return config
  },
}

module.exports = nextConfig
