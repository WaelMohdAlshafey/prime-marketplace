'use client';

import Image from 'next/image';
import { Heart, ShoppingBag } from 'lucide-react';
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

        // Fly animation (optional – keep or remove)
        const cardRect = cardRef.current?.getBoundingClientRect();
        const cartRect = cartIconRef.current?.getBoundingClientRect();

        if (cardRect && cartRect) {
            // Fly animation logic can be added here if desired
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

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ y: -4 }}
            className="bg-card-bg border border-card-border rounded-card shadow-soft hover:shadow-card-hover transition-all duration-200 p-3 cursor-pointer"
            onClick={handleCardClick}
        >
            <div className="relative">
                {/* Wishlist heart */}
                <motion.button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.8 }}
                    onClick={handleWishlistToggle}
                    className="absolute top-2 left-2 bg-surface rounded-full p-1.5 shadow-md z-10"
                >
                    <Heart
                        className={`w-4 h-4 transition ${isWishlist ? 'fill-red-500 text-red-500' : 'text-text-muted'}`}
                    />
                </motion.button>

                {/* Product image */}
                <div className="relative w-full h-48 bg-background rounded-sm overflow-hidden">
                    <Image
                        src={imgSrc}
                        alt={displayName}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        onError={handleImageError}
                    />
                </div>

                {/* Product name */}
                <h3 className="font-medium text-text text-base mt-2 line-clamp-1">
                    {displayName}
                </h3>

                {/* Price and Add to Cart */}
                <div className="flex items-center justify-between mt-2">
                    <span className="text-lg font-bold text-primary">
                        {CURRENCY}{product.price.toFixed(2)}
                    </span>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(e);
                        }}
                        disabled={isAdding || product.stockQuantity === 0}
                        className="p-2 rounded-full bg-button-primary-bg hover:bg-button-primary-hover text-button-primary-text transition disabled:opacity-50"
                    >
                        <ShoppingBag className="w-5 h-5" />
                    </button>
                </div>

                {/* Stock status (subtle) */}
                {product.stockQuantity === 0 && (
                    <p className="text-xs text-red-500 mt-1">غير متوفر</p>
                )}
            </div>
        </motion.div>
    );
}