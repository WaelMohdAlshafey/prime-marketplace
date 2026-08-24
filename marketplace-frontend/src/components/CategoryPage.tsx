'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import api from '@/lib/api';
import { Product, PagedResult } from '@/types';
import ProductCard from '@/components/ProductCard';
import FilterSidebar from '@/components/Filters/FilterSidebar';
import { Sparkles } from 'lucide-react';

// Category mapping – SLUG → DATABASE NAME
const categoryNameMap: Record<string, string> = {
    software: 'Software',
    'hair-care': 'Hair Care',
    'skin-care': 'Skin Care',
    fashion: 'Fashion',
    accessories: 'Accessories',
    electronics: 'Electronics',
    supplements: 'Supplements',
    home: 'Home',
};

const categoryEmojis: Record<string, string> = {
    software: '💻',
    'hair-care': '💇',
    'skin-care': '🧴',
    fashion: '👗',
    accessories: '💎',
    electronics: '📱',
    supplements: '💊',
    home: '🏠',
};

const getCategoryDisplayName = (slug: string, t: (key: string) => string): string => {
    const key = `categories.${slug}`;
    const translated = t(key);
    return translated === key ? slug.replace(/-/g, ' ') : translated;
};

interface CategoryPageProps {
    category: string;
}

export default function CategoryPage({ category }: CategoryPageProps) {
    const { t } = useTranslation('common');
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<{
        minPrice?: number;
        maxPrice?: number;
        inStock?: boolean;
        rating?: number;
    }>({});

    const normalizedCategory = category.toLowerCase();
    const dbCategory = categoryNameMap[normalizedCategory];
    const displayName = getCategoryDisplayName(normalizedCategory, t);
    const emoji = categoryEmojis[normalizedCategory] || '📂';

    const fetchProducts = async (filterOverrides?: typeof filters) => {
        setLoading(true);
        setError(null);
        try {
            const finalFilters = filterOverrides || filters;
            let url = '';

            if (Object.keys(finalFilters).length > 0) {
                const params = new URLSearchParams();
                if (finalFilters.minPrice !== undefined) params.append('minPrice', finalFilters.minPrice.toString());
                if (finalFilters.maxPrice !== undefined) params.append('maxPrice', finalFilters.maxPrice.toString());
                if (finalFilters.inStock !== undefined) params.append('inStock', finalFilters.inStock.toString());
                if (finalFilters.rating !== undefined) params.append('rating', finalFilters.rating.toString());
                url = `/api/Products/filter?${params.toString()}&page=1&pageSize=100`;
            } else {
                const categoryName = dbCategory || normalizedCategory;
                url = `/api/Products/category/${encodeURIComponent(categoryName)}?page=1&pageSize=100`;
            }

            const response = await api.get<PagedResult<Product>>(url);
            setProducts(response.data.items || []);
        } catch (err) {
            console.error('❌ Failed to fetch products:', err);
            setError('فشل تحميل المنتجات، حاول مرة أخرى.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (category) {
            fetchProducts();
        }
    }, [category]);

    const handleApplyFilters = (newFilters: typeof filters) => {
        setFilters(newFilters);
        fetchProducts(newFilters);
    };

    const handleResetFilters = () => {
        setFilters({});
        fetchProducts({});
    };

    if (!dbCategory) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h1 className="text-3xl font-bold text-text mb-4">⚠️ القسم غير موجود</h1>
                <p className="text-text-muted">عذراً، القسم "{category}" غير مدعوم حالياً.</p>
                <button
                    onClick={() => window.location.href = '/'}
                    className="mt-6 bg-primary text-white px-6 py-3 rounded-pill hover:bg-primary-dark transition"
                >
                    العودة إلى الرئيسية
                </button>
            </div>
        );
    }

    return (
        <div className="bg-background min-h-screen">
            {/* Category Hero */}
            <section className="bg-gradient-to-br from-primary-bg to-background py-12 md:py-16">
                <div className="container mx-auto px-4 text-center">
                    <div className="text-5xl md:text-6xl mb-4">{emoji}</div>
                    <h1 className="text-3xl md:text-5xl font-bold text-text">{displayName}</h1>
                    <p className="text-text-muted mt-3 text-lg">
                        {t('categories.discover', { category: displayName })}
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-72 flex-shrink-0">
                        <FilterSidebar
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
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
                                <p className="text-text-muted">{t('categories.noProducts')}</p>
                                <button
                                    onClick={handleResetFilters}
                                    className="mt-4 bg-primary text-white px-6 py-2 rounded-pill hover:bg-primary-dark transition"
                                >
                                    إعادة تعيين الفلاتر
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