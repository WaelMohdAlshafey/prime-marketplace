/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,

    images: {
        remotePatterns: [
            // Your backend (Render)
            {
                protocol: 'https',
                hostname: 'prime-marketplace-8hut.onrender.com',
                port: '',
                pathname: '/**',
            },
            // Unsplash (for hero banner images)
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                port: '',
                pathname: '/**',
            },
            // Picsum (for placeholder/fallback images)
            {
                protocol: 'https',
                hostname: 'picsum.photos',
                port: '',
                pathname: '/**',
            },
            // Allow localhost for development
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '',
                pathname: '/**',
            },
        ],
        // If you still have issues, uncomment the line below to disable optimization:
        // unoptimized: true,
    },

    env: {
        NEXT_PUBLIC_API_URL: 'https://prime-marketplace-8hut.onrender.com',
    },
};

module.exports = nextConfig;