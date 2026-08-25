import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // A stray yarn.lock in the home directory otherwise makes Turbopack infer the
  // workspace root as ~/ and pull the whole home tree into the file watcher.
  turbopack: { root: import.meta.dirname },

  // Next 16: opt into the component-level cache directives ("use cache",
  // cacheTag, cacheLife) that the Contentful data layer is built on.
  cacheComponents: true,

  env: {
    // Resolved once at build so the footer's copyright year never forces a
    // cached page to render dynamically.
    NEXT_PUBLIC_BUILD_YEAR: String(new Date().getFullYear()),
  },

  images: {
    // A custom loader hits Contentful's Images API directly, so Vercel's
    // optimizer is bypassed entirely — but the quality allowlist still applies.
    loader: 'custom',
    loaderFile: './src/lib/image-loader.ts',
    qualities: [20, 75],
    formats: ['image/avif', 'image/webp'],
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ],
      },
    ]
  },
}

export default nextConfig
