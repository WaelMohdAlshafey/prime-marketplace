/** @type {import('next').NextConfig} */
const nextConfig = {
    // Enable React strict mode for better development
    reactStrictMode: true,

    // Image configuration – allow loading images from your backend
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'prime-marketplace-8hut.onrender.com',
                port: '',
                pathname: '/**',
            },
            // Allow local images (for development)
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '5000',
                pathname: '/**',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '5019',
                pathname: '/**',
            },
        ],
        // If you don't want Next.js to optimize images (faster but less features)
        // uncomment the line below:
        // unoptimized: true,
    },

    // Enable trailing slashes if needed (optional)
    // trailingSlash: false,

    // Add environment variables that should be available in the browser
    env: {
        NEXT_PUBLIC_API_URL: 'https://prime-marketplace-8hut.onrender.com',
    },

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