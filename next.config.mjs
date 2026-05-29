/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/archive",
        destination: "/top-10/archive",
        permanent: true,
      },
      {
        source: "/puzzle/:id",
        destination: "/top-10/:id",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
