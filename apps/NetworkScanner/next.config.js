/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  assetPrefix: './',
  images: {
    unoptimized: true,
  },
  transpilePackages: ['components']
}

module.exports = nextConfig
