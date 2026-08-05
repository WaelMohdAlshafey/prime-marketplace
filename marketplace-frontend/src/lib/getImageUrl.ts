// lib/getImageUrl.ts
// ============================================================
// This helper constructs the full URL for product and store images.
// It prepends the backend base URL to relative image paths.
// If no path is provided, it returns the placeholder image.
// ============================================================

const BACKEND_BASE_URL = 'https://prime-marketplace-8hut.onrender.com';

/**
 * Builds a full URL for an image
 * @param path - The image path (e.g., '/images/products/laptop.jpg')
 * @returns The full URL to the image
 *
 * Examples:
 *   getImageUrl('/images/products/laptop.jpg')
 *   -> 'https://prime-marketplace-8hut.onrender.com/images/products/laptop.jpg'
 *
 *   getImageUrl('https://cdn.example.com/image.jpg')
 *   -> 'https://cdn.example.com/image.jpg' (unchanged)
 *
 *   getImageUrl(undefined)
 *   -> '/images/placeholder.jpg'
 */
export const getImageUrl = (path?: string | null): string => {
    // If no path, return placeholder
    if (!path) {
        return '/images/placeholder.jpg';
    }

    // If the path is already an absolute URL, return it as-is
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }

    // Otherwise, prepend the backend base URL
    // Ensure there are no double slashes
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${BACKEND_BASE_URL}${cleanPath}`;
};