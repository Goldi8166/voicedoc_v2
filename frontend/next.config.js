/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,        // ← Ye line add kar do (react-leaflet ke liye zaroori hai)

  env: {
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000',
  },
}

module.exports = nextConfig