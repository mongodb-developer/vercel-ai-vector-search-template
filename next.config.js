/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        ADMIN_API_KEY: process.env.ADMIN_API_KEY,
    },
};

module.exports = nextConfig;
