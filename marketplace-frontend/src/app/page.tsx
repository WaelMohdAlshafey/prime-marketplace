'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '@/lib/api';
import { Product } from '@/types';
import HeroBanner from '@/components/HeroBanner';
import CategoryGrid from '@/components/CategoryGrid';
import FilterSidebar from '@/components/Filters/FilterSidebar';
import ProductCard from '@/components/ProductCard';
import ProductDetailModal from '@/components/ProductDetailModal';
import { ShoppingBag, Shield, Truck, Headphones } from 'lucide-react';

export default function Home() {
    const { t } = useTranslation('common');
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<{
        minPrice?: number;
        maxPrice?: number;
        inStock?: boolean;
        rating?: number;
    }>({});
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchProducts = async (filterOverrides?: typeof filters) => {
        setLoading(true);
        setError(null);
        try {
            const finalFilters = filterOverrides || filters;
            let url = '/api/Products?page=1&pageSize=12';

            if (Object.keys(finalFilters).length > 0) {
                const params = new URLSearchParams();
                if (finalFilters.minPrice !== undefined) params.append('minPrice', finalFilters.minPrice.toString());
                if (finalFilters.maxPrice !== undefined) params.append('maxPrice', finalFilters.maxPrice.toString());
                if (finalFilters.inStock !== undefined) params.append('inStock', finalFilters.inStock.toString());
                if (finalFilters.rating !== undefined) params.append('rating', finalFilters.rating.toString());
                url = `/api/Products/filter?${params.toString()}&page=1&pageSize=12`;
            }

            const response = await api.get<{ items: Product[] }>(url);
            setProducts(response.data.items || []);
        } catch (err) {
            console.error('❌ Error fetching products:', err);
            setError('Failed to load products. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleApplyFilters = (newFilters: typeof filters) => {
        setFilters(newFilters);
        fetchProducts(newFilters);
    };

    const handleResetFilters = () => {
        setFilters({});
        fetchProducts({});
    };

    // ✅ Alert to confirm click
    const handleCardClick = (productId: number) => {
        alert(`🖱️ Card clicked! Product ID: ${productId}`); // ← debug
        console.log('🖱️ handleCardClick called with productId:', productId);
        setSelectedProductId(productId);
        setIsModalOpen(true);
    };

    const services = [
        { icon: <Truck className="w-8 h-8" />, title: 'شحن سريع', subtitle: 'توصيل خلال 2-5 أيام' },
        { icon: <Shield className="w-8 h-8" />, title: 'ضمان الجودة', subtitle: 'منتجات أصلية 100%' },
        { icon: <Headphones className="w-8 h-8" />, title: 'دعم على مدار الساعة', subtitle: 'خدمة عملاء 24/7' },
        { icon: <ShoppingBag className="w-8 h-8" />, title: 'توصيل مجاني', subtitle: 'للطلبات فوق 100$' },
    ];

    return (
        <div className="container">
            <HeroBanner />
            <CategoryGrid />

            <div className="service-banners">
                {services.map((service, index) => (
                    <div key={index} className="service-banner">
                        <span className="icon">{service.icon}</span>
                        <h3 className="title">{service.title}</h3>
                        <p className="subtitle">{service.subtitle}</p>
                    </div>
                ))}
            </div>

            <div className="main-layout">
                <FilterSidebar
                    onApplyFilters={handleApplyFilters}
                    onResetFilters={handleResetFilters}
                />

                <div className="flex-1">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-[#1A1A1A] flex items-center gap-2">
                            <ShoppingBag className="w-6 h-6 text-[#0A6C44]" />
                            {t('featuredProducts')}
                        </h2>
                        <span className="text-sm text-[#757575]">
                            {products.length} {t('productCount')}
                        </span>
                    </div>

                    {loading ? (
                        <div className="product-grid">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="bg-white rounded-card shadow-card p-4 animate-pulse">
                                    <div className="w-full h-48 bg-gray-200 rounded-md"></div>
                                    <div className="h-4 bg-gray-200 rounded mt-3 w-3/4"></div>
                                    <div className="h-3 bg-gray-200 rounded mt-2 w-1/2"></div>
                                    <div className="h-6 bg-gray-200 rounded mt-3 w-1/3"></div>
                                </div>
                            ))}
                        </div>
                    ) : error ? (
                        <div className="text-center py-20 bg-white rounded-card shadow-card">
                            <p className="text-red-500">{error}</p>
                            <button
                                onClick={() => fetchProducts()}
                                className="mt-4 bg-[#0A6C44] text-white px-6 py-2 rounded-button hover:bg-[#06452A] transition"
                            >
                                إعادة المحاولة
                            </button>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-card shadow-card">
                            <p className="text-[#757575]">لا توجد منتجات تطابق الفلاتر المحددة</p>
                            <button
                                onClick={handleResetFilters}
                                className="mt-4 bg-[#0A6C44] text-white px-6 py-2 rounded-button hover:bg-[#06452A] transition"
                            >
                                إعادة تعيين الفلاتر
                            </button>
                        </div>
                    ) : (
                        <div className="product-grid">
                            {products.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onCardClick={() => handleCardClick(product.id)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <ProductDetailModal
                productId={selectedProductId || 0}
                isOpen={isModalOpen}
                onClose={() => {
                    console.log('🔒 Modal closed');
                    setIsModalOpen(false);
                }}
            />
        </div>
    );
}