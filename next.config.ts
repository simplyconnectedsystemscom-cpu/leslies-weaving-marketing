import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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


