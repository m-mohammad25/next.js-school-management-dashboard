/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ hostname: "images.pexels.com" }],
  },
  redirects: async () => [
    // I have added this temporarly to redirect to the teachers page
    { source: "/", destination: "/admin", permanent: false },
  ],
};

export default nextConfig;
