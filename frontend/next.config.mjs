/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    RECIPE_SERVICE_URL: process.env.RECIPE_SERVICE_URL,
    AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL,
    AUTH_SERVICE_PROVIDER: process.env.AUTH_SERVICE_PROVIDER,
  }
};

export default nextConfig;
