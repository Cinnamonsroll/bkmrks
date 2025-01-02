import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/300',
        search: '',
      },
      {
        protocol: "https",
        hostname: "favicone.com",
        port: "",
        pathname: "/nextjs.org",
        search: "?s=256"
      }
    ],
  },
};

export default nextConfig;
