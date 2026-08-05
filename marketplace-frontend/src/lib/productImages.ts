// lib/productImages.ts
// ============================================================
// This helper provides a fallback image based on the product name.
// It is used when a product does not have an imageUrl in the database.
// The images should exist in: public/images/products/
// ============================================================

/**
 * Returns a fallback product image based on the product name
 * @param name - The product name (e.g., 'لابتوب احترافي للبرمجة')
 * @returns The path to a fallback image
 *
 * Examples:
 *   getProductImage('لابتوب احترافي')
 *   -> '/images/products/laptop.jpg'
 *
 *   getProductImage('شامبو طبيعي')
 *   -> '/images/products/haircare.jpg'
 *
 *   getProductImage('Unknown Product')
 *   -> '/images/placeholder.jpg'
 */
export const getProductImage = (name: string): string => {
    const lower = name.toLowerCase();

    // Electronics / Laptops / Software
    if (
        lower.includes('لابتوب') ||
        lower.includes('laptop') ||
        lower.includes('برمجيات') ||
        lower.includes('برمجة') ||
        lower.includes('software') ||
        lower.includes('برنامج') ||
        lower.includes('تطبيق') ||
        lower.includes('development') ||
        lower.includes('تحليل')
    ) {
        return '/images/products/laptop.jpg';
    }

    // Books / Software / Programming
    if (
        lower.includes('كتاب') ||
        lower.includes('book') ||
        lower.includes('clean code') ||
        lower.includes('pragmatic') ||
        lower.includes('design') ||
        lower.includes('جرافيك') ||
        lower.includes('graphic')
    ) {
        return '/images/products/book.jpg';
    }

    // Headphones / Audio
    if (
        lower.includes('سماعة') ||
        lower.includes('headphone') ||
        lower.includes('sony') ||
        lower.includes('bose') ||
        lower.includes('audio') ||
        lower.includes('sound')
    ) {
        return '/images/products/headphones.jpg';
    }

    // Hair Care
    if (
        lower.includes('شعر') ||
        lower.includes('hair') ||
        lower.includes('شامبو') ||
        lower.includes('بلسم') ||
        lower.includes('زيت') ||
        lower.includes('زيوت') ||
        lower.includes('conditioner') ||
        lower.includes('shampoo') ||
        lower.includes('argan') ||
        lower.includes('مغربي')
    ) {
        return '/images/products/haircare.jpg';
    }

    // Skin Care
    if (
        lower.includes('بشرة') ||
        lower.includes('skin') ||
        lower.includes('كريم') ||
        lower.includes('ترطيب') ||
        lower.includes('مرطب') ||
        lower.includes('غسول') ||
        lower.includes('مصل') ||
        lower.includes('vitamin c') ||
        lower.includes('فيتامين') ||
        lower.includes('moisturizer')
    ) {
        return '/images/products/skincare.jpg';
    }

    // Fashion / Clothing
    if (
        lower.includes('تي شيرت') ||
        lower.includes('tshirt') ||
        lower.includes('fashion') ||
        lower.includes('قطني') ||
        lower.includes('فستان') ||
        lower.includes('dress') ||
        lower.includes('ملابس') ||
        lower.includes('قميص') ||
        lower.includes('shirt')
    ) {
        return '/images/products/tshirt.jpg';
    }

    // Shoes / Sneakers
    if (
        lower.includes('حذاء') ||
        lower.includes('shoe') ||
        lower.includes('sneaker') ||
        lower.includes('رياضي') ||
        lower.includes('running') ||
        lower.includes('sport') ||
        lower.includes('boot')
    ) {
        return '/images/products/shoes.jpg';
    }

    // Watches / Jewelry / Accessories
    if (
        lower.includes('ساعة') ||
        lower.includes('watch') ||
        lower.includes('اكسسوارات') ||
        lower.includes('كلاسيكية') ||
        lower.includes('قلادة') ||
        lower.includes('ذهبية') ||
        lower.includes('jewelry') ||
        lower.includes('accessory') ||
        lower.includes('bracelet')
    ) {
        return '/images/products/watch.jpg';
    }

    // Supplements / Vitamins
    if (
        lower.includes('مكمل') ||
        lower.includes('supplement') ||
        lower.includes('فيتامين') ||
        lower.includes('vitamin') ||
        lower.includes('nutrition') ||
        lower.includes('mineral')
    ) {
        return '/images/products/supplements.jpg';
    }

    // Home / Kitchen
    if (
        lower.includes('أواني') ||
        lower.includes('منزل') ||
        lower.includes('مطبخ') ||
        lower.includes('طقم') ||
        lower.includes('قدور') ||
        lower.includes('غلاية') ||
        lower.includes('خلاط') ||
        lower.includes('مقلاة') ||
        lower.includes('home') ||
        lower.includes('kitchen') ||
        lower.includes('cookware') ||
        lower.includes('pot') ||
        lower.includes('pan')
    ) {
        return '/images/products/home.jpg';
    }

    // Default fallback
    return '/images/placeholder.jpg';
};