'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Heart, ShoppingBag, Star, Store } from 'lucide-react';
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
        isVerified?: boolean;
    };
}

export default function ProductCard({ product }: ProductCardProps) {
    const { template } = useTheme();
    const pathname = usePathname();
    const [isAdding, setIsAdding] = useState(false);
    const [quantity, setQuantity] = useState(1);

    const initialImage = product.imageUrl
        ? getImageUrl(product.imageUrl)
        : getProductImage(product.name);

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
    const isStorePage = pathname?.startsWith('/stores/');

    const handleImageError = () => {
        setImgSrc('/images/placeholder.jpg');
    };

    // ----- SIMPLE / COLORED / BLUE templates (minimal card) -----
    if (template === 'simple' || template === 'colored' || template === 'blue') {
        const showRating = template !== 'simple' && product.rating;
        const isColored = template === 'colored';
        const isBlue = template === 'blue';
        const primaryColor = isColored ? '#D97706' : isBlue ? '#1D4ED8' : '#0A6C44';

        return (
            <Link href={`/products/${product.id}`} className="block">
                <div className="bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden">
                    <div className="aspect-square bg-gray-50 overflow-hidden relative">
                        <img
                            src={imgSrc}
                            alt={product.name}
                            className="w-full h-full object-cover hover:scale-105 transition duration-500"
                            onError={handleImageError}
                        />
                        {hasDiscount && (
                            <span className="absolute top-2 right-2 bg-[#4CAF50] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                -{product.discount}%
                            </span>
                        )}
                    </div>
                    <div className="p-3">
                        <h3 className="text-sm font-medium text-[#1A1A1A] line-clamp-1">{product.name}</h3>
                        {showRating && product.rating && (
                            <div className="flex items-center gap-1 mt-1">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-3.5 h-3.5 ${i < Math.round(product.rating!)
                                                ? 'fill-[#FFB400] text-[#FFB400]'
                                                : 'text-[#E0E0E0] fill-[#E0E0E0]'
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-xs font-medium text-[#757575] mr-1">
                                    {product.rating?.toFixed(1)}
                                </span>
                            </div>
                        )}
                        <p className={`text-lg font-bold mt-1`} style={{ color: primaryColor }}>
                            {CURRENCY}{product.price.toFixed(2)}
                        </p>
                    </div>
                </div>
            </Link>
        );
    }

    // ----- STANDARD TEMPLATE (Full Prime Design) -----
    const primaryBadge = isStorePage
        ? product.category || 'Category'
        : product.vendorName || 'Vendor';

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

    const handleCategoryClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (product.category) {
            window.location.href = `/${product.category}`;
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

    // Render rating stars
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
                className="group bg-white rounded-card shadow-card hover:shadow-card-hover transition-all duration-500 overflow-hidden border border-[#E0E0E0]/50 hover:border-[#0A6C44]/20"
            >
                <Link href={`/products/${product.id}`} className="block">
                    {/* Image */}
                    <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                        <Image
                            src={imgSrc}
                            alt={product.name}
                            fill
                            className={`object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                            priority={false}
                            onError={handleImageError}
                        />

                        {hasDiscount && (
                            <span className="absolute top-3 right-3 bg-[#4CAF50] text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg z-10">
                                -{product.discount}%
                            </span>
                        )}

                        {product.isVerified && (
                            <span className="absolute top-3 left-3 bg-[#2196F3] text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg z-10 flex items-center gap-1">
                                <Store className="w-3 h-3" /> Verified
                            </span>
                        )}

                        <motion.button
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.8 }}
                            onClick={handleWishlistToggle}
                            className={`absolute top-3 left-3 p-2 rounded-full shadow-md transition-all duration-300 z-10 ${isWishlist
                                ? 'bg-red-500 text-white shadow-red-200'
                                : 'bg-white/90 backdrop-blur-sm text-[#757575] hover:text-red-500 hover:bg-white'
                                }`}
                            aria-label="Add to wishlist"
                        >
                            <Heart
                                className={`w-5 h-5 transition ${isWishlist ? 'fill-white' : 'fill-transparent'}`}
                                strokeWidth={isWishlist ? 0 : 2}
                            />
                        </motion.button>

                        <div className="absolute bottom-3 left-3 right-3">
                            <span className="inline-block bg-white/90 backdrop-blur-sm text-[#0A6C44] text-xs font-medium px-3 py-1 rounded-full shadow-md border border-white/20">
                                {primaryBadge}
                            </span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 text-right">
                        <h3 className="font-semibold text-[#1A1A1A] text-base line-clamp-1">
                            {product.name}
                        </h3>

                        <p className="text-sm text-[#757575] line-clamp-2 mt-1 min-h-[40px]">
                            {product.description}
                        </p>

                        {product.category && (
                            <span
                                className="inline-block mt-1 text-xs text-[#0A6C44] hover:underline bg-[#0A6C44]/5 px-2 py-0.5 rounded-full transition cursor-pointer"
                                onClick={handleCategoryClick}
                            >
                                {product.category}
                            </span>
                        )}

                        {/* Rating */}
                        {product.rating && (
                            <div className="mt-2 flex items-center justify-end">
                                {renderStars(product.rating)}
                            </div>
                        )}

                        {/* Price + Quantity Controls */}
                        <div className="mt-3 flex items-center justify-between gap-2">
                            {/* Quantity Controls */}
                            {product.stockQuantity > 0 && (
                                <div
                                    className="flex items-center gap-1 bg-[#F8F9FA] rounded-lg p-1 border border-[#E0E0E0]"
                                    onClick={(e) => e.stopPropagation()}
                                >
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

                            <div className="flex items-center gap-2">
                                <span className="text-xl font-bold text-[#0A6C44]">
                                    {CURRENCY}{(discountPrice || product.price).toFixed(2)}
                                </span>
                                {hasDiscount && (
                                    <span className="text-sm text-[#9E9E9E] line-through">
                                        {CURRENCY}{product.price.toFixed(2)}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </Link>

                {/* Add to Cart */}
                <div className="px-4 pb-4">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={(e) => handleAddToCart(e, quantity)}
                        disabled={isAdding || product.stockQuantity === 0}
                        className={`w-full py-2.5 rounded-button font-medium transition-all duration-300 flex items-center justify-center gap-2 ${product.stockQuantity === 0
                                ? 'bg-gray-100 text-[#9E9E9E] cursor-not-allowed'
                                : isAdding
                                    ? 'bg-[#0A6C44]/70 text-white cursor-wait'
                                    : 'bg-[#0A6C44] text-white hover:bg-[#06452A] hover:shadow-lg hover:shadow-[#0A6C44]/20 hover:scale-105'
                            }`}
                    >
                        <ShoppingBag className="w-4 h-4" />
                        {isAdding
                            ? 'جاري الإضافة...'
                            : product.stockQuantity === 0
                                ? 'غير متوفر'
                                : `إضافة (${quantity}) إلى السلة`}
                    </motion.button>
                </div>
            </motion.div>

            {/* Fly animation */}
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
                        <Image src={imgSrc} alt={product.name} fill className="object-cover rounded-full" sizes="64px" />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}