'use client';

import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { useCartIconRef } from '@/context/CartIconRefContext';
import { useTheme } from '@/context/ThemeContext';
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
    onCardClick?: () => void; // ✅ explicit prop
}

export default function ProductCard({ product, onCardClick }: ProductCardProps) {
    const { template = 'standard' } = useTheme();
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

    const handleImageError = () => {
        setImgSrc('/images/placeholder.jpg');
    };

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

    const renderStars = (rating: number) => {
        const fullStars = Math.round(rating);
        return (
            <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < fullStars
                            ? 'fill-[#FFB400] text-[#FFB400]'
                            : 'text-[#E0E0E0] fill-[#E0E0E0]'
                            }`}
                    />
                ))}
                <span className="text-xs font-medium text-[#757575] mr-1">
                    {rating.toFixed(1)}
                </span>
                {product.reviews && (
                    <span className="text-xs text-[#9E9E9E]">({product.reviews})</span>
                )}
            </div>
        );
    };

    const handleCardClick = (e: React.MouseEvent) => {
        e.preventDefault();
        console.log('🖱️ ProductCard clicked, productId:', product.id);
        console.log('📦 onCardClick is:', onCardClick ? 'provided ✅' : '❌ NOT provided');
        if (onCardClick) {
            onCardClick();
        } else {
            console.warn('⚠️ onCardClick not provided for product:', product.id);
        }
    };

    const displayName = product.name || product.nameAr || product.nameEn || `Product #${product.id}`;
    const displayDescription = product.description || product.descriptionAr || product.descriptionEn || '';

    return (
        <>
            <motion.div
                ref={cardRef}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                whileHover={{ y: -8 }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                className="product-card cursor-pointer border border-gray-200 rounded-lg p-3 hover:shadow-lg transition"
                onClick={handleCardClick}
            >
                <div className="block">
                    <motion.button
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.8 }}
                        onClick={handleWishlistToggle}
                        className="wishlist-btn absolute top-2 left-2 bg-white rounded-full p-1.5 shadow"
                    >
                        <Heart
                            className={`w-4 h-4 transition ${isWishlist ? 'fill-red-500 text-red-500' : 'text-gray-500'}`}
                        />
                    </motion.button>

                    {hasDiscount && (
                        <span className="discount-badge absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                            -{product.discount}%
                        </span>
                    )}

                    <div className="relative w-full h-48 bg-gray-50 rounded-md overflow-hidden">
                        <Image
                            src={imgSrc}
                            alt={displayName}
                            fill
                            className={`object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                            priority={false}
                            onError={handleImageError}
                        />
                    </div>

                    <h3 className="product-title font-bold text-lg text-gray-800 mt-2">{displayName}</h3>
                    {displayDescription && (
                        <p className="product-desc text-gray-600 text-sm line-clamp-2">{displayDescription}</p>
                    )}

                    {product.rating && (
                        <div className="product-rating">
                            {renderStars(product.rating)}
                        </div>
                    )}

                    <div className="price-row">
                        <span className="current-price text-xl font-bold text-[#0F5C45]">
                            {CURRENCY}{(discountPrice || product.price).toFixed(2)}
                        </span>
                        {hasDiscount && (
                            <>
                                <span className="old-price text-gray-400 line-through">{CURRENCY}{product.price.toFixed(2)}</span>
                                <span className="discount-tag bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">-{product.discount}%</span>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2 mt-3" onClick={(e) => e.stopPropagation()}>
                    {product.stockQuantity > 0 && (
                        <div className="flex items-center gap-1 bg-[#F8F9FA] rounded-lg p-0.5 border border-[#E0E0E0] flex-shrink-0">
                            <button
                                onClick={decrement}
                                disabled={quantity <= 1}
                                className="w-7 h-7 rounded-md flex items-center justify-center text-[#757575] hover:bg-white hover:shadow-sm transition disabled:opacity-30 disabled:cursor-not-allowed text-lg font-bold"
                            >
                                −
                            </button>
                            <span className="w-6 text-center text-sm font-medium text-[#1A1A1A]">
                                {quantity}
                            </span>
                            <button
                                onClick={increment}
                                disabled={quantity >= product.stockQuantity}
                                className="w-7 h-7 rounded-md flex items-center justify-center text-[#757575] hover:bg-white hover:shadow-sm transition disabled:opacity-30 disabled:cursor-not-allowed text-lg font-bold"
                            >
                                +
                            </button>
                        </div>
                    )}

                    <button
                        onClick={(e) => handleAddToCart(e, quantity)}
                        disabled={isAdding || product.stockQuantity === 0}
                        className="add-to-cart-btn flex-1 bg-[#0F5C45] text-white py-2 rounded-lg hover:bg-[#0A4735] transition disabled:opacity-50"
                    >
                        <ShoppingBag className="w-4 h-4 inline mr-1" />
                        {isAdding
                            ? 'جاري الإضافة...'
                            : product.stockQuantity === 0
                                ? 'غير متوفر'
                                : `إضافة (${quantity})`}
                    </button>
                </div>
            </motion.div>

            <AnimatePresence>
                {fly && (
                    <motion.div
                        initial={{ x: flyStart.x, y: flyStart.y, scale: 1, opacity: 1 }}
                        animate={{ x: flyEnd.x - 32, y: flyEnd.y - 32, scale: 0.3, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: 'easeInOut' }}
                        className="fixed w-16 h-16 rounded-full bg-white shadow-xl z-50 pointer-events-none"
                        style={{ left: -32, top: -32 }}
                    >
                        <Image src={imgSrc} alt={displayName} fill className="object-cover rounded-full" sizes="64px" />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}