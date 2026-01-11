/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    staticGenerationRetryCount: 0,
    serverActions: {               // ← ADD THIS!
      bodySizeLimit: '2mb',        // ← ADD THIS!
    },                             // ← ADD THIS!
  },
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 2,
  },
}

export default nextConfig