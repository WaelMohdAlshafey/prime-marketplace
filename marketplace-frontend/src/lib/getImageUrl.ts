const BACKEND_BASE_URL = 'https://prime-marketplace-8hut.onrender.com';

export const getImageUrl = (path?: string): string => {
    if (!path) {
        return '/images/placeholder.jpg';
    }

    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }

    // Remove any leading/trailing slashes to avoid double slashes
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${BACKEND_BASE_URL}${cleanPath}`;
};