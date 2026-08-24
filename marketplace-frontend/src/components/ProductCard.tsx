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

    const renderStars = (rating: number) => {
        const fullStars = Math.round(rating);
        return (
            <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < fullStars
                            ? 'fill-[#FFB400] text-[#FFB400]'
                            : 'text-text-muted fill-text-muted'
                            }`}
                    />
                ))}
                <span className="text-xs font-medium text-text-muted mr-1">
                    {rating.toFixed(1)}
                </span>
                {product.reviews && (
                    <span className="text-xs text-text-muted">({product.reviews})</span>
                )}
            </div>
        );
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
            whileHover={{ y: -8 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className="bg-card-bg border border-card-border rounded-card hover:shadow-card-hover shadow-card transition-all duration-300 p-3 cursor-pointer"
            onClick={handleCardClick}
        >
            <div className="block relative">
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

                {hasDiscount && (
                    <span className="absolute top-2 right-2 bg-secondary text-white text-xs px-2 py-0.5 rounded-pill z-10">
                        -{product.discount}%
                    </span>
                )}

                <div className="relative w-full h-48 bg-background rounded-sm overflow-hidden">
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

                <h3 className="font-semibold text-text text-lg mt-2 line-clamp-1">{displayName}</h3>
                {displayDescription && (
                    <p className="text-text-muted text-sm line-clamp-2">{displayDescription}</p>
                )}

                {product.rating && (
                    <div className="product-rating">{renderStars(product.rating)}</div>
                )}

                <div className="flex items-center gap-2 flex-wrap mt-2">
                    <span className="text-xl font-bold text-primary">
                        {CURRENCY}{(discountPrice || product.price).toFixed(2)}
                    </span>
                    {hasDiscount && (
                        <>
                            <span className="text-text-muted line-through text-sm">{CURRENCY}{product.price.toFixed(2)}</span>
                            <span className="bg-secondary text-white text-xs px-2 py-0.5 rounded-pill">-{product.discount}%</span>
                        </>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2 mt-3" onClick={(e) => e.stopPropagation()}>
                {product.stockQuantity > 0 && (
                    <div className="flex items-center gap-1 bg-background rounded-lg p-0.5 border border-border flex-shrink-0">
                        <button
                            onClick={decrement}
                            disabled={quantity <= 1}
                            className="w-7 h-7 rounded-md flex items-center justify-center text-text-muted hover:bg-surface hover:shadow-sm transition disabled:opacity-30 disabled:cursor-not-allowed text-lg font-bold"
                        >
                            −
                        </button>
                        <span className="w-6 text-center text-sm font-medium text-text">
                            {quantity}
                        </span>
                        <button
                            onClick={increment}
                            disabled={quantity >= product.stockQuantity}
                            className="w-7 h-7 rounded-md flex items-center justify-center text-text-muted hover:bg-surface hover:shadow-sm transition disabled:opacity-30 disabled:cursor-not-allowed text-lg font-bold"
                        >
                            +
                        </button>
                    </div>
                )}

                <button
                    onClick={(e) => handleAddToCart(e, quantity)}
                    disabled={isAdding || product.stockQuantity === 0}
                    className="flex-1 py-2 rounded-lg transition disabled:opacity-50 bg-button-primary-bg hover:bg-button-primary-hover text-button-primary-text flex items-center justify-center gap-2"
                >
                    <ShoppingBag className="w-4 h-4" />
                    {isAdding
                        ? 'جاري الإضافة...'
                        : product.stockQuantity === 0
                            ? 'غير متوفر'
                            : `إضافة (${quantity})`}
                </button>
            </div>
        </motion.div>
    );
}