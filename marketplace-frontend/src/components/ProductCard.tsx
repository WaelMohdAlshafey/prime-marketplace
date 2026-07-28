'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
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
    };
}

// Helper: fallback image – now uses a reliable external placeholder
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

    // ✅ FIXED: Use a reliable external placeholder (avoids 400 errors)
    return 'https://via.placeholder.com/300x300/e0e0e0/666666?text=No+Image';
};

export default function ProductCard({ product }: ProductCardProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [imgSrc, setImgSrc] = useState(
        product.imageUrl || getProductImage(product.name)
    );
    const [fly, setFly] = useState(false);
    const [flyStart, setFlyStart] = useState({ x: 0, y: 0 });
    const [flyEnd, setFlyEnd] = useState({ x: 0, y: 0 });
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
                addToCart(product.id, 1)
                    .finally(() => setIsAdding(false));
            }, 800);
        } else {
            setIsAdding(true);
            await addToCart(product.id, 1);
            setIsAdding(false);
        }
    };

    const handleImageError = () => {
        // If the image fails, use the external placeholder
        setImgSrc('https://via.placeholder.com/300x300/e0e0e0/666666?text=No+Image');
    };

    return (
        <>
            <div
                ref={cardRef}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1 border border-gray-50"
            >
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
                        onClick={handleWishlistToggle}
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
                    <span className="text-xs text-[#0F5C45] bg-[#0F5C45]/10 px-2 py-0.5 rounded-full inline-block mb-2 font-medium">
                        {product.vendorName || 'متجر Prime'}
                    </span>
                    <Link href={`/products/${product.id}`}>
                        <h3 className="font-semibold text-gray-800 text-base hover:text-[#0F5C45] transition line-clamp-1">
                            {product.name}
                        </h3>
                    </Link>
                    <p className="text-sm text-gray-500 line-clamp-2 mt-1">{product.description}</p>
                    {product.rating && (
                        <div className="flex items-center justify-end gap-1 mt-2 text-sm">
                            <span className="text-amber-400">
                                {'★'.repeat(Math.round(product.rating))}
                                {'☆'.repeat(5 - Math.round(product.rating))}
                            </span>
                            <span className="font-semibold text-gray-700 mr-1">{product.rating.toFixed(1)}</span>
                        </div>
                    )}
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

            {/* Flying item */}
            {fly && (
                <motion.div
                    initial={{
                        x: flyStart.x,
                        y: flyStart.y,
                        scale: 1,
                        opacity: 1,
                    }}
                    animate={{
                        x: flyEnd.x - 32,
                        y: flyEnd.y - 32,
                        scale: 0.3,
                        opacity: 0,
                    }}
                    transition={{
                        duration: 0.8,
                        ease: 'easeInOut',
                    }}
                    className="fixed w-16 h-16 rounded-full bg-white shadow-xl z-50 pointer-events-none"
                    style={{ left: -32, top: -32 }}
                >
                    <Image
                        src={imgSrc}
                        alt={product.name}
                        fill
                        className="object-cover rounded-full"
                        sizes="64px"
                    />
                </motion.div>
            )}
        </>
    );
}