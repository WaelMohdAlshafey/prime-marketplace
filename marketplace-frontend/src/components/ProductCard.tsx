'use client';

import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { useCartIconRef } from '@/context/CartIconRefContext';
import { useTheme } from '@/context/ThemeContext';
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
    const { template = 'standard' } = useTheme();
    const { i18n } = useTranslation();
    const pathname = usePathname();
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
    const discountPrice = product.discount ? product.price * (1 - product.discount / 100) : null;
    const hasDiscount = product.discount && product.discount > 0;

    const handleImageError = useCallback(() => {
        setImgSrc('/images/placeholder.jpg');
    }, []);

    const handleWishlistToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(product.id);
    };

    const handleAddToCart = async (e: React.MouseEvent, qty: number) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            alert('يرجى تسجيل الدخول لإضافة المنتجات إلى السلة');
            return;
        }

        const cardRect = cardRef.current?.getBoundingClientRect();
        const cartRect = cartIconRef.current?.getBoundingClientRect();

        if (cardRect && cartRect) {
            const startX = cardRect.left + cardRect.width / 2;
            const startY = cardRect.top + cardRect.height / 2;
            const endX = cartRect.left + cartRect.width / 2;
            const endY = cartRect.top + cartRect.height / 2;

            setFlyStart({ x: startX, y: startY });
            setFlyEnd({ x: endX, y: endY });
            setFly(true);

            setTimeout(() => {
                setFly(false);
                setIsAdding(true);
                addToCart(product.id, qty).finally(() => setIsAdding(false));
            }, 800);
        } else {
            setIsAdding(true);
            await addToCart(product.id, qty);
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
        console.log('🖱️ ProductCard clicked, productId:', product.id);
        if (onCardClick) {
            onCardClick(product.id);
        }
    };

    // 🌐 Language-aware display
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
            className="product-card bg-white rounded-xl border border-gray-100 p-4 hover:shadow-lg transition-all duration-300 cursor-pointer"
            onClick={handleCardClick}
        >
            {/* ============================================================
                BLOCK 1: IMAGE + WISHLIST + DISCOUNT BADGE
                ============================================================ */}
            <div className="relative">
                <motion.button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.8 }}
                    onClick={handleWishlistToggle}
                    className="absolute top-2 left-2 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md hover:shadow-lg transition"
                >
                    <Heart
                        className={`w-4 h-4 transition ${isWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                    />
                </motion.button>

                {hasDiscount && (
                    <span className="absolute top-2 right-2 z-10 bg-[#D27736] text-white text-xs font-bold px-2.5 py-1 rounded-full">
                        -{product.discount}%
                    </span>
                )}

                <div className="relative w-full h-52 bg-gray-50 rounded-lg overflow-hidden">
                    <Image
                        src={imgSrc}
                        alt={displayName}
                        fill
                        className={`object-contain p-3 transition-transform duration-500 ${isHovered ? 'scale-105' : 'scale-100'}`}
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        priority={false}
                        onError={handleImageError}
                    />
                </div>
            </div>

            {/* ============================================================
                BLOCK 2: PRODUCT INFO (Title, Description, Price)
                ============================================================ */}
            <div className="mt-3 space-y-1.5">
                <h3 className="font-semibold text-gray-800 text-base line-clamp-1">
                    {displayName}
                </h3>
                {displayDescription && (
                    <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
                        {displayDescription}
                    </p>
                )}

                {/* Price Row */}
                <div className="flex items-center gap-3 pt-1">
                    <span className="text-xl font-bold text-[#2F5A6B]">
                        {CURRENCY}{(discountPrice || product.price).toFixed(2)}
                    </span>
                    {hasDiscount && (
                        <span className="text-sm text-gray-400 line-through">
                            {CURRENCY}{product.price.toFixed(2)}
                        </span>
                    )}
                </div>
            </div>

            {/* ============================================================
                DIVIDER – Subtle line between info and controls
                ============================================================ */}
            <div className="border-t border-gray-100 my-3"></div>

            {/* ============================================================
                BLOCK 3: QUANTITY CONTROLS + ADD TO CART BUTTON
                ============================================================ */}
            <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                {/* Quantity Controls – Always Visible */}
                <div className="flex items-center gap-1 bg-gray-50 rounded-full p-1 border border-gray-200 flex-shrink-0">
                    <button
                        onClick={decrement}
                        disabled={quantity <= 1}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-gray-600 hover:bg-white hover:shadow-sm transition disabled:opacity-30 disabled:cursor-not-allowed text-lg font-bold"
                    >
                        −
                    </button>
                    <span className="w-8 text-center text-sm font-medium text-gray-800">
                        {quantity}
                    </span>
                    <button
                        onClick={increment}
                        disabled={quantity >= product.stockQuantity}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-gray-600 hover:bg-white hover:shadow-sm transition disabled:opacity-30 disabled:cursor-not-allowed text-lg font-bold"
                    >
                        +
                    </button>
                </div>

                {/* Add to Cart Button */}
                <button
                    onClick={(e) => handleAddToCart(e, quantity)}
                    disabled={isAdding || product.stockQuantity === 0}
                    className={`flex-1 py-2.5 rounded-full font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 ${product.stockQuantity === 0
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : isAdding
                                ? 'bg-[#4E8C9E]/70 text-white cursor-wait'
                                : 'bg-[#4E8C9E] text-white hover:bg-[#2F5A6B] hover:shadow-md'
                        }`}
                >
                    <ShoppingBag className="w-4 h-4" />
                    {isAdding
                        ? 'جاري الإضافة...'
                        : product.stockQuantity === 0
                            ? 'غير متوفر'
                            : `إضافة (${quantity})`}
                </button>
            </div>

            {/* Optional: Stock indicator (small text) */}
            {product.stockQuantity > 0 && product.stockQuantity <= 5 && (
                <p className="text-xs text-[#D27736] mt-2 text-center">
                    ⚠️ متبقي {product.stockQuantity} فقط
                </p>
            )}

            {/* Fly animation (hidden) */}
            {fly && (
                <div
                    className="fixed pointer-events-none z-50 w-8 h-8 bg-[#4E8C9E] rounded-full shadow-lg flex items-center justify-center"
                    style={{
                        left: flyStart.x,
                        top: flyStart.y,
                        transform: 'translate(-50%, -50%)',
                        animation: 'flyToCart 0.8s ease-in-out forwards',
                    }}
                >
                    <ShoppingBag className="w-4 h-4 text-white" />
                </div>
            )}
        </motion.div>
    );
}