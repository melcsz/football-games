/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/archive",
        destination: "/tenaball/archive",
        permanent: true,
      },
      {
        source: "/puzzle/:id",
        destination: "/tenaball/:id",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
