'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Product, PagedResult } from '@/types';
import ProductCard from '@/components/ProductCard';
import HeroBanner from '@/components/HeroBanner';
import CategoryGrid from '@/components/CategoryGrid';

interface HomeContentProps {
    initialQuery: string;
}

export default function HomeContent({ initialQuery }: HomeContentProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState(initialQuery);
    const router = useRouter();

    const fetchProducts = async (searchQuery?: string) => {
        setLoading(true);
        try {
            let url = '/api/Products?page=1&pageSize=12';
            if (searchQuery) {
                url = `/api/Products/search?q=${encodeURIComponent(searchQuery)}&page=1&pageSize=20`;
            }
            const response = await api.get<PagedResult<Product>>(url);
            setProducts(response.data.items);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
        }
    };

    // ============================================================
    // Fetch products when the query changes (ESLint warning suppressed)
    // ============================================================
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchProducts(query);
    }, [query]);

    // Listen for client-side navigation changes
    useEffect(() => {
        const handleRouteChange = () => {
            const params = new URLSearchParams(window.location.search);
            const q = params.get('q') || '';
            setQuery(q);
        };

        window.addEventListener('popstate', handleRouteChange);
        return () => window.removeEventListener('popstate', handleRouteChange);
    }, []);

    return (
        <div className="bg-[#F8F9FA]">
            <HeroBanner />
            <CategoryGrid />

            <section className="container mx-auto px-4 py-12">
                <div className="flex justify-between items-center mb-6">
                    <div className="text-right">
                        <h2 className="text-3xl font-bold text-gray-900">
                            {query ? `نتائج البحث عن "${query}"` : 'منتجات مميزة'}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {query ? `عرض ${products.length} نتيجة` : 'منتجات مختارة خصيصاً لك'}
                        </p>
                    </div>
                    <span className="text-sm text-gray-500">{products.length} منتج</span>
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="bg-gray-100 rounded-2xl h-72 animate-pulse"></div>
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
                        <p className="text-gray-500">
                            {query ? `لا توجد منتجات تطابق "${query}"` : 'لا توجد منتجات. أضف بعض المنتجات من لوحة التحكم.'}
                        </p>
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