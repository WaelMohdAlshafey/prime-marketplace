// @ts-nocheck
'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import FilterSidebar from '@/components/Filters/FilterSidebar';
import { Sparkles } from 'lucide-react';

const fallbackIcons = {
    software: '💻',
    'hair-care': '💇',
    'skin-care': '🧴',
    perfumes: '🌸',
    accessories: '💎',
    electronics: '📱',
    supplements: '💊',
    home: '🏠',
    grocery: '🛒',
    pharmacy: '💊',
    books: '📚',
};

export default function CategoryPage({ category }) {
    const { t, i18n } = useTranslation('common');
    const [products, setProducts] = useState([]);
    const [categoryInfo, setCategoryInfo] = useState(null);
    const [infoLoading, setInfoLoading] = useState(true);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({});

    const lang = (i18n.language || 'ar').startsWith('ar') ? 'ar' : 'en';
    const slug = category.toLowerCase();

    // Load category metadata
    useEffect(() => {
        const fetchCategoryInfo = async () => {
            try {
                const res = await api.get('/api/ProductCategories?onlyActive=true');
                const found = res.data.find(c => c.slug === slug);
                if (found) setCategoryInfo(found);
            } catch (err) {
                console.error('Failed to load category info:', err);
            } finally {
                setInfoLoading(false);
            }
        };
        fetchCategoryInfo();
    }, [slug]);

    const displayName = categoryInfo?.name || slug.replace(/-/g, ' ');
    const icon = categoryInfo?.icon || fallbackIcons[slug] || '📂';
    const apiCategoryName = categoryInfo?.name || slug;

    const fetchProducts = async (filterOverrides) => {
        setLoading(true);
        setError(null);
        try {
            const finalFilters = filterOverrides || filters;

            // If no filters → use simple category endpoint
            if (!finalFilters || Object.keys(finalFilters).length === 0) {
                const url = `/api/Products/category/${encodeURIComponent(apiCategoryName)}?page=1&pageSize=100`;
                const response = await api.get(url);
                setProducts(response.data.items || []);
                return;
            }

            // Otherwise use the filter endpoint, then filter client-side by category
            const params = new URLSearchParams();
            if (finalFilters.minPrice !== undefined) params.append('minPrice', finalFilters.minPrice.toString());
            if (finalFilters.maxPrice !== undefined) params.append('maxPrice', finalFilters.maxPrice.toString());
            if (finalFilters.inStock !== undefined) params.append('inStock', finalFilters.inStock.toString());
            if (finalFilters.sortBy) params.append('sortBy', finalFilters.sortBy);

            const url = `/api/Products/filter?${params.toString()}&page=1&pageSize=100`;
            const response = await api.get(url);
            const items = (response.data.items || []).filter(
                (p) => p.category === apiCategoryName
            );
            setProducts(items);
        } catch (err) {
            console.error('❌ Failed to fetch products:', err);
            setError('فشل تحميل المنتجات، حاول مرة أخرى.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!infoLoading) {
            fetchProducts();
        }
    }, [infoLoading, apiCategoryName]);

    const handleApplyFilters = (newFilters) => {
        setFilters(newFilters);
        fetchProducts(newFilters);
    };

    const handleResetFilters = () => {
        setFilters({});
        fetchProducts({});
    };

    if (!infoLoading && categoryInfo === null) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h1 className="text-3xl font-bold text-text mb-4">⚠️ Category not found</h1>
                <p className="text-text-muted">The category "{category}" is not available.</p>
                <button
                    onClick={() => window.location.href = '/'}
                    className="mt-6 bg-primary text-white px-6 py-3 rounded-pill hover:bg-primary-dark transition"
                >
                    Back to Home
                </button>
            </div>
        );
    }

    return (
        <div className="bg-background min-h-screen">
            {/* Category Hero */}
            <section className="bg-gradient-to-br from-primary-bg to-background py-12 md:py-16">
                <div className="container mx-auto px-4 text-center">
                    <div className="text-6xl md:text-7xl mb-4 flex justify-center">{icon}</div>
                    <h1 className="text-3xl md:text-5xl font-bold text-text">{displayName}</h1>
                    {categoryInfo?.description && (
                        <p className="text-text-muted mt-3 text-lg">{categoryInfo.description}</p>
                    )}
                </div>
            </section>

            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Sidebar — always mounted */}
                    <div className="md:w-72 flex-shrink-0">
                        <FilterSidebar
                            initialFilters={filters}
                            onApplyFilters={handleApplyFilters}
                            onResetFilters={handleResetFilters}
                        />
                    </div>

                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-text flex items-center gap-2">
                                    <Sparkles className="w-6 h-6 text-primary" />
                                    {displayName}
                                </h2>
                                <p className="text-sm text-text-muted mt-1">
                                    {products.length} {t('productCount')}
                                </p>
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex justify-center items-center min-h-[40vh]">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F5C45]"></div>
                            </div>
                        ) : error ? (
                            <div className="text-center py-12 bg-white rounded-2xl shadow-soft">
                                <p className="text-red-500">{error}</p>
                                <button
                                    onClick={() => fetchProducts()}
                                    className="mt-4 bg-primary text-white px-6 py-2 rounded-pill hover:bg-primary-dark transition"
                                >
                                    Retry
                                </button>
                            </div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-2xl shadow-soft">
                                <p className="text-text-muted">
                                    {lang === 'ar'
                                        ? 'لا توجد منتجات في هذا القسم بعد.'
                                        : 'No products in this category yet.'}
                                </p>
                                <button
                                    onClick={handleResetFilters}
                                    className="mt-4 bg-primary text-white px-6 py-2 rounded-pill hover:bg-primary-dark transition"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
                                {products.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}