'use client';

import Image from 'next/image';
import { Heart, ShoppingBag } from 'lucide-react';
import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
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
                addToCart(product.id, qty).finally(() => setIsAdding(false));
            }, 800);
        } else {
            setIsAdding(true);
            await addToCart(product.id, qty);
            setIsAdding(false);
        }
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
            className="cursor-pointer"
            onClick={handleCardClick}
        >
            {/* Premium Card – White background with shadow */}
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100/50">

                {/* Image Section */}
                <div className="relative bg-gray-50/80 p-4">
                    {/* Wishlist Heart – top right */}
                    <motion.button
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.8 }}
                        onClick={handleWishlistToggle}
                        className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-sm hover:shadow-md transition"
                    >
                        <Heart
                            className={`w-4 h-4 transition ${isWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                        />
                    </motion.button>

                    {/* Discount Badge */}
                    {hasDiscount && (
                        <span className="absolute top-3 left-3 z-10 bg-[#D27736] text-white text-xs font-bold px-2.5 py-1 rounded-full">
                            -{product.discount}%
                        </span>
                    )}

                    {/* Product Image */}
                    <div className="relative w-full aspect-square max-h-[220px] mx-auto">
                        <Image
                            src={imgSrc}
                            alt={displayName}
                            fill
                            className={`object-contain p-2 transition-transform duration-500 ${isHovered ? 'scale-105' : 'scale-100'}`}
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                            priority={false}
                            onError={handleImageError}
                        />
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-4 space-y-2">
                    {/* Category/Vendor Badge */}
                    {product.category && (
                        <span className="inline-block text-[10px] font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                            {product.category}
                        </span>
                    )}

                    {/* Product Name */}
                    <h3 className="font-semibold text-gray-800 text-base line-clamp-1">
                        {displayName}
                    </h3>

                    {/* Description */}
                    {displayDescription && (
                        <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
                            {displayDescription}
                        </p>
                    )}

                    {/* Price */}
                    <div className="flex items-center gap-2 pt-1">
                        <span className="text-xl font-bold text-gray-900">
                            {CURRENCY}{(discountPrice || product.price).toFixed(2)}
                        </span>
                        {hasDiscount && (
                            <span className="text-sm text-gray-400 line-through">
                                {CURRENCY}{product.price.toFixed(2)}
                            </span>
                        )}
                    </div>

                    {/* Add to Cart Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(e, quantity);
                        }}
                        disabled={isAdding || product.stockQuantity === 0}
                        className={`w-full py-2.5 rounded-xl font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 ${product.stockQuantity === 0
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : isAdding
                                    ? 'bg-primary/70 text-white cursor-wait'
                                    : 'bg-primary text-white hover:bg-primary-dark hover:shadow-md'
                            }`}
                    >
                        <ShoppingBag className="w-4 h-4" />
                        {isAdding
                            ? 'جاري الإضافة...'
                            : product.stockQuantity === 0
                                ? 'غير متوفر'
                                : 'أضف إلى السلة'}
                    </button>

                    {/* Low stock warning */}
                    {product.stockQuantity > 0 && product.stockQuantity <= 5 && (
                        <p className="text-xs text-amber-600 text-center">
                            ⚠️ متبقي {product.stockQuantity} فقط
                        </p>
                    )}
                </div>
            </div>

            {/* Fly animation */}
            {fly && (
                <div
                    className="fixed pointer-events-none z-50 w-14 h-14 bg-primary rounded-full shadow-lg flex items-center justify-center"
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
                    <ShoppingBag className="w-7 h-7 text-white" />
                </div>
            )}
        </motion.div>
    );
}