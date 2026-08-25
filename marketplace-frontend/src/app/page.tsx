'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '@/lib/api';
import { Product } from '@/types';
import HeroBanner from '@/components/HeroBanner';
import FilterSidebar from '@/components/Filters/FilterSidebar';
import ProductCard from '@/components/ProductCard';
import ProductDetailModal from '@/components/ProductDetailModal';
import { ShoppingBag, Sparkles } from 'lucide-react';

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

    const handleCardClick = (productId: number) => {
        setSelectedProductId(productId);
        setIsModalOpen(true);
    };

    return (
        <div className="bg-background min-h-screen">
            {/* Hero Banner – kept */}
            <HeroBanner />

            {/* Categories are REMOVED from here – only in menu */}

            {/* Main Content with Filters */}
            <div className="container mx-auto px-4 py-6 md:py-10">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Sidebar */}
                    <div className="md:w-72 flex-shrink-0">
                        <FilterSidebar
                            onApplyFilters={handleApplyFilters}
                            onResetFilters={handleResetFilters}
                        />
                    </div>

                    {/* Products */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold text-text flex items-center gap-2">
                                    <Sparkles className="w-6 h-6 text-primary" />
                                    {t('featuredProducts')}
                                </h2>
                                <p className="text-sm text-text-muted mt-1">{t('featuredProductsSub')}</p>
                            </div>
                            <span className="text-sm text-primary font-medium bg-primary/10 px-4 py-1 rounded-pill">
                                {products.length} {t('productCount')}
                            </span>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="bg-white rounded-2xl shadow-soft p-4 animate-pulse">
                                        <div className="w-full aspect-square bg-gray-200 rounded-xl"></div>
                                        <div className="h-4 bg-gray-200 rounded mt-3 w-3/4"></div>
                                        <div className="h-6 bg-gray-200 rounded mt-2 w-1/3"></div>
                                    </div>
                                ))}
                            </div>
                        ) : error ? (
                            <div className="text-center py-12 bg-white rounded-2xl shadow-soft">
                                <p className="text-red-500">{error}</p>
                                <button
                                    onClick={() => fetchProducts()}
                                    className="mt-4 bg-primary text-white px-6 py-2 rounded-pill hover:bg-primary-dark transition"
                                >
                                    إعادة المحاولة
                                </button>
                            </div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-2xl shadow-soft">
                                <ShoppingBag className="w-12 h-12 text-text-muted mx-auto mb-3" />
                                <p className="text-text-muted">لا توجد منتجات تطابق الفلاتر المحددة</p>
                                <button
                                    onClick={handleResetFilters}
                                    className="mt-4 bg-primary text-white px-6 py-2 rounded-pill hover:bg-primary-dark transition"
                                >
                                    إعادة تعيين الفلاتر
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
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
            </div>

            {/* Product Detail Modal */}
            <ProductDetailModal
                productId={selectedProductId || 0}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}