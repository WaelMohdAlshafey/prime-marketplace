'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import HeroBanner from '@/components/HeroBanner';
import CategoryGrid from '@/components/CategoryGrid';

// ============================================================
// Image mapping function (copied from ProductCard.tsx)
// ============================================================
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

    return '/images/placeholder.jpg'; // fallback
};

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stockQuantity: number;
    imageUrl?: string;
    vendorName?: string;
}

export default function Home() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        api
            .get('/api/Products?page=1&pageSize=20')
            .then((response) => {
                setProducts(response.data.items || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error('❌ Error fetching products:', err);
                setError(err.message || 'حدث خطأ في التحميل');
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F5C45] mx-auto"></div>
                    <p className="mt-4 text-gray-600">جاري تحميل المنتجات...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center text-red-600">
                    <p className="text-xl font-bold">⚠️ خطأ</p>
                    <p>{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 bg-[#0F5C45] text-white px-4 py-2 rounded-xl"
                    >
                        إعادة المحاولة
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#F8F9FA]">
            {/* ============================================================
                HERO BANNER
                ============================================================ */}
            <HeroBanner />

            {/* ============================================================
                CATEGORY GRID
                ============================================================ */}
            <CategoryGrid />

            {/* ============================================================
                PRODUCT LIST (منتجات مميزة)
                ============================================================ */}
            <section className="container mx-auto px-4 py-12">
                <div className="flex justify-between items-center mb-6">
                    <div className="text-right">
                        <h2 className="text-3xl font-bold text-gray-900">🛍️ منتجات مميزة</h2>
                        <p className="text-sm text-gray-500 mt-1">منتجات مختارة خصيصاً لك</p>
                    </div>
                    <span className="text-sm text-gray-500">{products.length} منتج</span>
                </div>

                {products.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
                        <p className="text-gray-500">لا توجد منتجات حالياً.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-4 text-right border border-gray-50"
                            >
                                <div className="w-full h-40 bg-gray-100 rounded-xl overflow-hidden mb-3">
                                    {(() => {
                                        const imgSrc = product.imageUrl || getProductImage(product.name);
                                        return (
                                            <img
                                                src={imgSrc}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                                                }}
                                            />
                                        );
                                    })()}
                                </div>
                                <h3 className="font-semibold text-gray-800">{product.name}</h3>
                                <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
                                <p className="text-xl font-bold text-[#0F5C45] mt-2">£{product.price}</p>
                                {product.vendorName && (
                                    <p className="text-xs text-[#0F5C45] bg-[#0F5C45]/10 px-2 py-0.5 rounded-full inline-block mt-1">
                                        {product.vendorName}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}