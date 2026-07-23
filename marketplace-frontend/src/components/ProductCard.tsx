'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { useState } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

interface ProductCardProps {
    product: {
        id: number;
        name: string;
        description: string;
        price: number;
        stockQuantity: number;
        imageUrl?: string;
        vendorName?: string;
        rating?: number;
        reviews?: number;
        discount?: number;
    };
}

// ============================================================
// ARABIC PRODUCT IMAGE MAPPING
// ============================================================
const getProductImage = (name: string): string => {
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

// ============================================================
// STARS RENDER HELPER
// ============================================================
const renderStars = (rating: number | undefined) => {
    if (!rating) return <span className="text-gray-400 text-sm">لا توجد تقييمات</span>;
    const fullStars = Math.round(rating);
    const emptyStars = 5 - fullStars;
    return (
        <span className="text-amber-400">
            {'★'.repeat(fullStars)}
            {'☆'.repeat(emptyStars)}
        </span>
    );
};

export default function ProductCard({ product }: ProductCardProps) {
    const [isWishlist, setIsWishlist] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const { user } = useAuth();
    const [imgSrc, setImgSrc] = useState(getProductImage(product.name));

    const discountPrice = product.discount ? product.price * (1 - product.discount / 100) : null;

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            alert('يرجى تسجيل الدخول لإضافة المنتجات إلى السلة');
            return;
        }

        setIsAdding(true);
        try {
            await api.post('/api/Cart', { productId: product.id, quantity: 1 });
            alert('✅ تمت الإضافة إلى السلة!');
        } catch (error) {
            console.error(error);
            alert('❌ فشلت الإضافة إلى السلة. حاول مرة أخرى.');
        } finally {
            setIsAdding(false);
        }
    };

    const handleImageError = () => {
        setImgSrc('/images/placeholder.jpg');
    };

    return (
        <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1 border border-gray-50">
            {/* Image */}
            <div className="relative aspect-square overflow-hidden bg-gray-50">
                <Image
                    src={imgSrc}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-500"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    priority={false}
                    onError={handleImageError}
                />

                {product.discount && product.discount > 0 && (
                    <span className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md z-10">
                        -{product.discount}%
                    </span>
                )}

                <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsWishlist(!isWishlist); }}
                    className="absolute top-3 left-3 bg-white p-2 rounded-full shadow-md hover:shadow-lg transition z-10"
                    aria-label="إضافة إلى المفضلة"
                >
                    <Heart
                        className={`w-5 h-5 transition ${isWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                        strokeWidth={isWishlist ? 0 : 2}
                    />
                </button>
            </div>

            {/* Content */}
            <div className="p-4 text-right">
                {/* Vendor Badge */}
                <span className="text-xs text-[#0F5C45] bg-[#0F5C45]/10 px-2 py-0.5 rounded-full inline-block mb-2 font-medium">
                    {product.vendorName || 'متجر Prime'}
                </span>

                <Link href={`/products/${product.id}`}>
                    <h3 className="font-semibold text-gray-800 text-base hover:text-[#0F5C45] transition line-clamp-1">
                        {product.name}
                    </h3>
                </Link>

                <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                    {product.description}
                </p>

                {/* ============================================================
             RATING DISPLAY (Stars)
             ============================================================ */}
                <div className="flex items-center justify-end gap-1 mt-2 text-sm">
                    <span className="text-amber-400">{renderStars(product.rating)}</span>
                    {product.rating && (
                        <span className="font-semibold text-gray-700 mr-1">
                            {product.rating.toFixed(1)}
                        </span>
                    )}
                </div>

                {/* Price */}
                <div className="mt-3 flex items-center justify-end gap-2">
                    <span className="text-xl font-bold text-[#0F5C45]">
                        £{(discountPrice || product.price).toFixed(2)}
                    </span>
                    {product.discount && product.discount > 0 && (
                        <span className="text-sm text-gray-400 line-through">
                            £{product.price.toFixed(2)}
                        </span>
                    )}
                </div>

                {/* Add to Cart Button */}
                <button
                    onClick={handleAddToCart}
                    disabled={isAdding || product.stockQuantity === 0}
                    className="w-full mt-3 bg-[#0F5C45] text-white py-2.5 rounded-xl font-medium hover:bg-[#0A4735] transition duration-200 group-hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isAdding
                        ? 'جاري الإضافة...'
                        : product.stockQuantity === 0
                            ? 'غير متوفر'
                            : 'إضافة إلى السلة'}
                </button>
            </div>
        </div>
    );
}