/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  turbopack: {
    // Prevent evaluation of Supabase during static generation
    resolveAlias: {
      '@supabase/supabase-js': false,
      '@supabase/ssr': false,
    },
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push({
        '@supabase/supabase-js': '@supabase/supabase-js',
        '@supabase/ssr': '@supabase/ssr',
      })
    }
    return config
  },
}

export default nextConfig
