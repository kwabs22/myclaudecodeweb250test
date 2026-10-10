/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // `STATIC_EXPORT=1 npm run build` writes plain files to out/ (used by the Session Atlas site build).
  // NEXT_BASE_PATH is the URL folder the export is served from. Normal dev and build are unchanged.
  ...(process.env.STATIC_EXPORT
    ? {
        output: 'export',
        trailingSlash: true,
        images: { unoptimized: true },
        basePath: process.env.NEXT_BASE_PATH || '',
      }
    : {}),
}

module.exports = nextConfig
