/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['sanity', '@sanity/vision', 'next-sanity'],
  images: {
    domains: ['cdn.sanity.io'],
  },
}

module.exports = nextConfig
