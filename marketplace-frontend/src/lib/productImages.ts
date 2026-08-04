// marketplace-frontend/lib/productImages.ts

export const getProductImage = (name: string): string => {
    const lower = name.toLowerCase();

    if (lower.includes('سماعة') || lower.includes('headphone') || lower.includes('sony'))
        return '/images/products/headphones.jpg';
    if (lower.includes('لابتوب') || lower.includes('laptop') || lower.includes('برمجيات') || lower.includes('برمجة'))
        return '/images/products/laptop.jpg';
    if (lower.includes('كتاب') || lower.includes('book') || lower.includes('clean code') || lower.includes('pragmatic'))
        return '/images/products/book.jpg';
    if (lower.includes('تي شيرت') || lower.includes('tshirt') || lower.includes('fashion') || lower.includes('قطني'))
        return '/images/products/tshirt.jpg';
    if (lower.includes('شعر') || lower.includes('hair') || lower.includes('شامبو'))
        return '/images/products/haircare.jpg';
    if (lower.includes('بشرة') || lower.includes('skin') || lower.includes('كريم') || lower.includes('ترطيب'))
        return '/images/products/skincare.jpg';
    if (lower.includes('ساعة') || lower.includes('watch') || lower.includes('اكسسوارات') || lower.includes('كلاسيكية'))
        return '/images/products/watch.jpg';
    if (lower.includes('حذاء') || lower.includes('shoe') || lower.includes('sneaker'))
        return '/images/products/shoes.jpg';
    if (lower.includes('مكمل') || lower.includes('supplement') || lower.includes('فيتامين') || lower.includes('vitamin'))
        return '/images/products/supplements.jpg';
    if (lower.includes('أواني') || lower.includes('منزل') || lower.includes('مطبخ') || lower.includes('طقم'))
        return '/images/products/home.jpg';

    return '/images/placeholder.jpg';
};