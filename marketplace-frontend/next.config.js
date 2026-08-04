/** @type {import('next').NextConfig} */
/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'prime-marketplace-8hut.onrender.com',
                port: '',
                pathname: '/**',
            },
        ],
    },
    env: {
        NEXT_PUBLIC_API_URL: 'https://prime-marketplace-8hut.onrender.com',
    },


module.exports = nextConfig;,

    // If you're using Next.js 13 with App Router, this is already enabled by default
    // For Next.js 14+, App Router is stable, no flag needed
    // If you're using Next.js 13.x, you might need:
    // experimental: {
    //   appDir: true,
    // },

    // Headers for additional security and CORS (optional)
    async headers() {
        return [
            {
                source: '/api/:path*',
                headers: [
                    { key: 'Access-Control-Allow-Credentials', value: 'true' },
                    { key: 'Access-Control-Allow-Origin', value: '*' },
                    { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
                    { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization' },
                ],
            },
        ];
    },
};

module.exports = nextConfig;