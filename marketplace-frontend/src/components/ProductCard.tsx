'use client';

import Image from 'next/image';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { useCartIconRef } from '@/context/CartIconRefContext';
import { useTranslation } from 'react-i18next';
import { getImageUrl } from '@/lib/getImageUrl';
import { getProductImage } from '@/lib/productImages';

const CURRENCY = '£';

interface ProductCardProps {
    product: {
        id: number;
        name: string;
        price: number;
        stockQuantity: number;
        imageUrl?: string;
        nameAr?: string;
        nameEn?: string;
        rating?: number;
        discount?: number;
    };
    onCardClick?: (productId: number) => void;
}

export default function ProductCard({ product, onCardClick }: ProductCardProps) {
    const { i18n } = useTranslation();
    const [isAdding, setIsAdding] = useState(false);
    const [imgSrc, setImgSrc] = useState(
        product.imageUrl
            ? getImageUrl(product.imageUrl)
            : getProductImage(product.name || product.nameAr || product.nameEn || '')
    );
    const cardRef = useRef<HTMLDivElement>(null);
    const { user } = useAuth();
    const { toggleFavorite, isFavorite } = useWishlist();
    const { addToCart } = useCart();
    const { cartIconRef } = useCartIconRef();

    const isWishlist = isFavorite(product.id);
    const hasDiscount = product.discount !== undefined && product.discount > 0;
    const discountPrice = hasDiscount ? product.price * (1 - (product.discount ?? 0) / 100) : null;

    const handleImageError = useCallback(() => {
        setImgSrc('/images/placeholder.jpg');
    }, []);

    const handleWishlistToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(product.id);
    };

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            alert('يرجى تسجيل الدخول لإضافة المنتجات إلى السلة');
            return;
        }

        setIsAdding(true);
        await addToCart(product.id, 1);
        setIsAdding(false);
    };

    const handleCardClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (onCardClick) {
            onCardClick(product.id);
        }
    };

    const lang = i18n.language || 'en';
    const displayName = lang === 'en'
        ? (product.nameEn || product.name || product.nameAr || `Product #${product.id}`)
        : (product.nameAr || product.name || product.nameEn || `Product #${product.id}`);

    const renderStars = () => {
        if (!product.rating) return null;
        const fullStars = Math.round(product.rating);
        return (
            <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        className={`w-3 h-3 ${i < fullStars
                                ? 'fill-[#F5A623] text-[#F5A623]'
                                : 'text-[#D1D5DB] fill-[#D1D5DB]'
                            }`}
                    />
                ))}
                <span className="text-xs font-medium text-text-muted ml-1">
                    {product.rating.toFixed(1)}
                </span>
            </div>
        );
    };

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ y: -8 }}
            className="bg-card-bg border border-card-border rounded-2xl shadow-soft hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer group relative"
            onClick={handleCardClick}
        >
            <div className="relative">
                {/* Wishlist heart */}
                <motion.button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.8 }}
                    onClick={handleWishlistToggle}
                    className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md z-10 hover:bg-white transition"
                >
                    <Heart
                        className={`w-4 h-4 transition ${isWishlist ? 'fill-red-500 text-red-500' : 'text-text-muted'
                            }`}
                    />
                </motion.button>

                {/* Discount badge */}
                {hasDiscount && (
                    <span className="absolute top-3 right-3 bg-[#ff4e00] text-white text-xs font-bold px-2.5 py-1 rounded-full z-10 shadow-md">
                        -{product.discount}%
                    </span>
                )}

                {/* Image */}
                <div className="relative w-full aspect-square bg-background overflow-hidden">
                    <Image
                        src={imgSrc}
                        alt={displayName}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        onError={handleImageError}
                    />
                </div>

                {/* Content */}
                <div className="p-3 md:p-4">
                    <h3 className="font-semibold text-text text-sm md:text-base line-clamp-1">
                        {displayName}
                    </h3>

                    {product.rating && (
                        <div className="mt-1">{renderStars()}</div>
                    )}

                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-lg md:text-xl font-bold text-primary">
                            {CURRENCY}{(discountPrice ?? product.price).toFixed(2)}
                        </span>
                        {hasDiscount && (
                            <span className="text-xs text-text-muted line-through">
                                {CURRENCY}{product.price.toFixed(2)}
                            </span>
                        )}
                    </div>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(e);
                        }}
                        disabled={isAdding || product.stockQuantity === 0}
                        className="w-full mt-3 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 bg-primary hover:bg-primary-dark text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <ShoppingBag className="w-4 h-4" />
                        {isAdding
                            ? 'جاري الإضافة...'
                            : product.stockQuantity === 0
                                ? 'غير متوفر'
                                : 'إضافة إلى السلة'}
                    </button>
                </div>
            </div>
        </motion.div>
    );
}