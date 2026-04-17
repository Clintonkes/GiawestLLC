/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  // Enforce trailing slash for consistent serving from FastAPI
  trailingSlash: true,
  // Disable image optimization for static export compatibility if needed later
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
