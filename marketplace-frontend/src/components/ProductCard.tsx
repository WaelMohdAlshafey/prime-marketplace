'use client';

import Image from 'next/image';
import { Heart, Plus, Minus } from 'lucide-react';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
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
        description: string;
        price: number;
        stockQuantity: number;
        imageUrl?: string;
        vendorName?: string;
        rating?: number;
        reviews?: number;
        discount?: number;
        category?: string;
        nameAr?: string;
        nameEn?: string;
        descriptionAr?: string;
        descriptionEn?: string;
    };
    onCardClick?: (productId: number) => void;
}

export default function ProductCard({ product, onCardClick }: ProductCardProps) {
    const { i18n } = useTranslation();
    const [isAdding, setIsAdding] = useState(false);
    const [quantity, setQuantity] = useState(1);

    const initialImage = product.imageUrl
        ? getImageUrl(product.imageUrl)
        : getProductImage(product.name || product.nameAr || product.nameEn || '');

    const [imgSrc, setImgSrc] = useState(initialImage);
    const [fly, setFly] = useState(false);
    const [flyStart, setFlyStart] = useState({ x: 0, y: 0 });
    const [flyEnd, setFlyEnd] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);
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

        const cardRect = cardRef.current?.getBoundingClientRect();
        const cartRect = cartIconRef.current?.getBoundingClientRect();

        let endX = window.innerWidth - 80;
        let endY = 60;
        if (cartRect) {
            endX = cartRect.left + cartRect.width / 2;
            endY = cartRect.top + cartRect.height / 2;
        }

        if (cardRect) {
            const startX = cardRect.left + cardRect.width / 2;
            const startY = cardRect.top + cardRect.height / 2;

            setFlyStart({ x: startX, y: startY });
            setFlyEnd({ x: endX, y: endY });
            setFly(true);

            setTimeout(() => {
                setFly(false);
                setIsAdding(true);
                addToCart(product.id, quantity).finally(() => setIsAdding(false));
            }, 800);
        } else {
            setIsAdding(true);
            await addToCart(product.id, quantity);
            setIsAdding(false);
        }
    };

    const increment = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (quantity < product.stockQuantity) {
            setQuantity(q => q + 1);
        }
    };

    const decrement = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (quantity > 1) {
            setQuantity(q => q - 1);
        }
    };

    const handleCardClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (onCardClick) onCardClick(product.id);
    };

    const lang = i18n.language || 'en';
    const displayName = lang === 'en'
        ? (product.nameEn || product.name || product.nameAr || `Product #${product.id}`)
        : (product.nameAr || product.name || product.nameEn || `Product #${product.id}`);
    const displayDescription = lang === 'en'
        ? (product.descriptionEn || product.description || product.descriptionAr || '')
        : (product.descriptionAr || product.description || product.descriptionEn || '');

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            whileHover={{ y: -6 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className="cursor-pointer p-1 sm:p-2"
            onClick={handleCardClick}
        >
            {/* Transparent outer card */}
            <div className="border border-gray-200 rounded-2xl overflow-hidden bg-transparent shadow-sm hover:shadow-xl transition-all duration-300">

                {/* BLOCK 1 – Picture + Name + Description (white background) */}
                <div className="bg-white p-3 sm:p-4">
                    <div className="relative bg-gray-50/80 rounded-xl p-2 sm:p-4">
                        {/* Wishlist heart */}
                        <motion.button
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.8 }}
                            onClick={handleWishlistToggle}
                            className="absolute top-1 sm:top-2 right-1 sm:right-2 z-10 bg-white/90 backdrop-blur-sm rounded-full p-1.5 sm:p-2 shadow-sm hover:shadow-md transition"
                        >
                            <Heart
                                className={`w-4 h-4 transition ${isWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                            />
                        </motion.button>

                        {hasDiscount && (
                            <span className="absolute top-1 sm:top-2 left-1 sm:left-2 z-10 bg-red-500 text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full">
                                -{product.discount}%
                            </span>
                        )}

                        <div className="relative w-full aspect-square max-h-[140px] sm:max-h-[200px] mx-auto">
                            <Image
                                src={imgSrc}
                                alt={displayName}
                                fill
                                className={`object-contain p-2 transition-transform duration-500 ${isHovered ? 'scale-105' : 'scale-100'}`}
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                priority={false}
                                onError={handleImageError}
                            />
                        </div>
                    </div>

                    <div className="mt-2 sm:mt-3 space-y-1 text-center">
                        {product.category && (
                            <span className="inline-block text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                {product.category}
                            </span>
                        )}
                        <h3 className="font-semibold text-gray-800 text-sm sm:text-base line-clamp-1">
                            {displayName}
                        </h3>
                        {displayDescription && (
                            <p className="text-gray-500 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                                {displayDescription}
                            </p>
                        )}
                        <div className="flex items-center justify-center gap-2 pt-1">
                            <span className="text-lg sm:text-xl font-bold text-gray-900">
                                {CURRENCY}{(discountPrice || product.price).toFixed(2)}
                            </span>
                            {hasDiscount && (
                                <span className="text-sm text-gray-400 line-through">
                                    {CURRENCY}{product.price.toFixed(2)}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* BLOCK 2 – Controls as "Chocolate Bar" with header cart icon */}
                <div className="bg-[#4E8C9E] p-1.5 sm:p-2 flex items-stretch" onClick={(e) => e.stopPropagation()}>
                    <button
                        onClick={decrement}
                        disabled={quantity <= 1}
                        className="flex-1 py-2 sm:py-3 text-white hover:bg-white/20 transition disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center border-r border-white/20"
                    >
                        <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>

                    <div className="flex-1 py-2 sm:py-3 text-white font-semibold text-center border-r border-white/20 flex items-center justify-center text-sm sm:text-base">
                        {quantity}
                    </div>

                    <button
                        onClick={increment}
                        disabled={quantity >= product.stockQuantity}
                        className="flex-1 py-2 sm:py-3 text-white hover:bg-white/20 transition disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center border-r border-white/20"
                    >
                        <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>

                    {/* Add to Cart – uses SAME icon as header */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(e);
                        }}
                        disabled={isAdding || product.stockQuantity === 0}
                        className="flex-[2] py-2 sm:py-3 bg-white text-[#4E8C9E] hover:bg-white/90 transition disabled:opacity-50 flex items-center justify-center rounded-r-lg"
                    >
                        {isAdding ? (
                            <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-[#4E8C9E] border-t-transparent" />
                        ) : product.stockQuantity === 0 ? (
                            <span className="text-xs sm:text-sm">غير متوفر</span>
                        ) : (
                            <ShoppingCartIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                        )}
                    </button>
                </div>

                {product.stockQuantity > 0 && product.stockQuantity <= 5 && (
                    <p className="text-[10px] sm:text-xs text-amber-600 text-center py-1 bg-white/80">
                        ⚠️ متبقي {product.stockQuantity} فقط
                    </p>
                )}
            </div>

            {/* Fly animation */}
            {fly && (
                <div
                    className="fixed pointer-events-none z-50 w-10 h-10 sm:w-14 sm:h-14 bg-primary rounded-full shadow-lg flex items-center justify-center"
                    style={{
                        left: flyStart.x,
                        top: flyStart.y,
                        transition: 'left 0.8s cubic-bezier(0.2, 0.8, 0.4, 1), top 0.8s cubic-bezier(0.2, 0.8, 0.4, 1), transform 0.8s cubic-bezier(0.2, 0.8, 0.4, 1), opacity 0.8s cubic-bezier(0.2, 0.8, 0.4, 1)',
                        transform: 'translate(-50%, -50%) scale(1)',
                        opacity: 1,
                    }}
                    ref={(el) => {
                        if (el) {
                            void el.offsetHeight;
                            el.style.left = flyEnd.x + 'px';
                            el.style.top = flyEnd.y + 'px';
                            el.style.transform = 'translate(-50%, -50%) scale(0.3)';
                            el.style.opacity = '0';
                        }
                    }}
                >
                    <ShoppingCartIcon className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                </div>
            )}
        </motion.div>
    );
}