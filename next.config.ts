import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io', // Para las imágenes de tus productos de Sanity
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Para la foto de perfil de Google
      },
    ],
  },
};

export default nextConfig;