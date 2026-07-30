'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, Star, ShoppingBag } from 'lucide-react';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { useCartIconRef } from '@/context/CartIconRefContext';

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
        category?: string; // ✅ from database – no hard‑coding
    };
}

export default function ProductCard({ product }: ProductCardProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [imgSrc, setImgSrc] = useState(product.imageUrl || '/images/placeholder.jpg');
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
                addToCart(product.id, 1).finally(() => setIsAdding(false));
            }, 800);
        } else {
            setIsAdding(true);
            await addToCart(product.id, 1);
            setIsAdding(false);
        }
    };

    const handleImageError = () => {
        setImgSrc('/images/placeholder.jpg');
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
                className="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft hover:shadow-strong transition-all duration-500 overflow-hidden border border-gray-100/50 hover:border-[#0F5C45]/20"
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

                        {/* Discount Badge */}
                        {product.discount && product.discount > 0 && (
                            <motion.span
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg z-10"
                            >
                                -{product.discount}%
                            </motion.span>
                        )}

                        {/* Wishlist Button */}
                        <motion.button
                            whileHover={{ scale: 1.2, rotate: 10 }}
                            whileTap={{ scale: 0.8 }}
                            onClick={handleWishlistToggle}
                            className={`absolute top-3 left-3 p-2 rounded-full shadow-md transition-all duration-300 z-10 ${isWishlist
                                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-red-200'
                                : 'bg-white/90 backdrop-blur-sm text-gray-600 hover:text-red-500 hover:bg-white'
                                }`}
                            aria-label="إضافة إلى المفضلة"
                        >
                            <Heart
                                className={`w-5 h-5 transition ${isWishlist ? 'fill-white' : 'fill-transparent'}`}
                                strokeWidth={isWishlist ? 0 : 2}
                            />
                        </motion.button>

                        {/* Vendor Badge */}
                        <div className="absolute bottom-3 left-3 right-3">
                            <span className="inline-block bg-white/90 backdrop-blur-sm text-[#0F5C45] text-xs font-medium px-3 py-1 rounded-full shadow-md border border-white/20">
                                {product.vendorName || 'متجر Prime'}
                            </span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 text-right">
                        <h3 className="font-semibold text-gray-800 text-base line-clamp-1">
                            {product.name}
                        </h3>

                        <p className="text-sm text-gray-500 line-clamp-2 mt-1 min-h-[40px]">
                            {product.description}
                        </p>

                        {/* ✅ Category Link – fully dynamic from database */}
                        {product.category && (
                            <Link
                                href={`/${product.category}`}
                                className="inline-block mt-1 text-xs text-[#0F5C45] hover:underline bg-[#0F5C45]/5 px-2 py-0.5 rounded-full transition"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {product.category}
                            </Link>
                        )}

                        {/* Rating */}
                        {product.rating && (
                            <div className="flex items-center justify-end gap-1 mt-2">
                                <div className="flex items-center gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-3.5 h-3.5 ${i < Math.round(product.rating!)
                                                ? 'fill-[#D4A54A] text-[#D4A54A]'
                                                : 'text-gray-300 fill-gray-300'
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm font-semibold text-gray-700 mr-1">
                                    {product.rating.toFixed(1)}
                                </span>
                                {product.reviews && (
                                    <span className="text-xs text-gray-400">({product.reviews})</span>
                                )}
                            </div>
                        )}

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
                    </div>
                </Link>

                {/* Add to Cart Button */}
                <div className="px-4 pb-4">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleAddToCart}
                        disabled={isAdding || product.stockQuantity === 0}
                        className={`w-full py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${product.stockQuantity === 0
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : isAdding
                                ? 'bg-[#0F5C45]/70 text-white cursor-wait'
                                : 'bg-gradient-to-r from-[#0F5C45] to-[#1A7A5C] text-white hover:shadow-lg hover:shadow-[#0F5C45]/20 hover:scale-105'
                            }`}
                    >
                        <ShoppingBag className="w-4 h-4" />
                        {isAdding
                            ? 'جاري الإضافة...'
                            : product.stockQuantity === 0
                                ? 'غير متوفر'
                                : 'إضافة إلى السلة'}
                    </motion.button>
                </div>
            </motion.div>

            {/* Flying item animation */}
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