/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ hostname: "images.pexels.com" }],
  },
  redirects: async () => [
    // I have added this temporarly to redirect to the teachers page
    { source: "/", destination: "/list/teachers", permanent: true },
  ],
};

export default nextConfig;
