import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
         protocol: "https",
      hostname: "ik.imagekit.io",
      pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "zeechat-kunal-singh-2025.s3.ap-south-1.amazonaws.com",
        pathname: "/**", 
      },
    ], 
  },
};

export default nextConfig;
