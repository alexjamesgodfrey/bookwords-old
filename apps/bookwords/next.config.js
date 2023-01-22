/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['ui'],
  images: {
    domains: ['books.google.com', 'upload.wikimedia.org'],
  },
}

module.exports = nextConfig
