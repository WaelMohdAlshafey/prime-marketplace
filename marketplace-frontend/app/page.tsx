// marketplace-frontend/app/page.tsx
'use client';
import ProductCard from '@/components/ProductCard';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '@/lib/api';
import HeroBanner from '@/components/HeroBanner';
import CategoryGrid from '@/components/CategoryGrid';
import { Product } from '@/types';

export default function Home() {
    const { t } = useTranslation('common');
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        api
            .get('/api/Products?page=1&pageSize=200')
            .then((response) => {
                setProducts(response.data.items || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error('❌ Error fetching products:', err);
                setError(err.message || t('loading'));
                setLoading(false);
            });
    }, [t]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F5C45] mx-auto"></div>
                    <p className="mt-4 text-gray-600">{t('loading')}</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center text-red-600">
                    <p className="text-xl font-bold">⚠️ {t('loading')}</p>
                    <p>{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 bg-[#0F5C45] text-white px-4 py-2 rounded-xl"
                    >
                        {t('search')}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#F8F9FA]">
            <HeroBanner />
            <CategoryGrid />

            <section className="container mx-auto px-4 py-12">
                <div className="flex justify-between items-center mb-6">
                    <div className="text-right">
                        <h2 className="text-3xl font-bold text-gray-900">{t('featuredProducts')}</h2>
                        <p className="text-sm text-gray-500 mt-1">{t('featuredProductsSub')}</p>
                    </div>
                    <span className="text-sm text-gray-500">{products.length} {t('productCount')}</span>
                </div>

                {products.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
                        <p className="text-gray-500">{t('noProducts')}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}