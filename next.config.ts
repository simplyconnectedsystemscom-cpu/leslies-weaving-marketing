import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d2xsxph8kpxj0f.cloudfront.net",
      },
    ],
  },
  async redirects() {
    return [
      // Redirect exact /fabric/national to /locations
      {
        source: "/fabric/national",
        destination: "/locations",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;


