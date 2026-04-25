// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source:      "/api/:path*",
        destination: "https://medical-credential-backend.onrender.com/api/:path*",
      },
    ]
  },
}

export default nextConfig