'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import api from '@/lib/api';
import { Product, PagedResult } from '@/types';
import ProductCard from './ProductCard';
import FilterSidebar from './Filters/FilterSidebar';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import {
    Monitor,
    Sparkles,
    Droplet,
    Shirt,
    Gem,
    Smartphone,
    Pill,
    Home
} from 'lucide-react';

interface CategoryPageProps {
    category: string;
}

// Map frontend slugs to actual database category names
const categoryNameMap: Record<string, string> = {
    'software': 'Software',
    'hair-care': 'Hair Care',
    'skin-care': 'Skin Care',
    'fashion': 'Fashion',
    'accessories': 'Accessories',
    'electronics': 'Electronics',
    'supplements': 'Supplements',
    'home': 'Home'
};

// Map to icons and colors
const categoryMap: Record<string, { titleKey: string; icon: React.ReactNode; color: string; vendorId: number }> = {
    software: {
        titleKey: 'Software',
        icon: <Monitor className="w-16 h-16 text-indigo-600" strokeWidth={1.5} />,
        color: 'from-indigo-500 to-indigo-700',
        vendorId: 1
    },
    'hair-care': {
        titleKey: 'Hair Care',
        icon: <Sparkles className="w-16 h-16 text-pink-600" strokeWidth={1.5} />,
        color: 'from-pink-500 to-pink-700',
        vendorId: 2
    },
    'skin-care': {
        titleKey: 'Skin Care',
        icon: <Droplet className="w-16 h-16 text-amber-600" strokeWidth={1.5} />,
        color: 'from-amber-400 to-amber-600',
        vendorId: 2
    },
    fashion: {
        titleKey: 'Fashion',
        icon: <Shirt className="w-16 h-16 text-rose-600" strokeWidth={1.5} />,
        color: 'from-rose-400 to-rose-600',
        vendorId: 3
    },
    accessories: {
        titleKey: 'Accessories',
        icon: <Gem className="w-16 h-16 text-yellow-600" strokeWidth={1.5} />,
        color: 'from-yellow-400 to-yellow-600',
        vendorId: 3
    },
    electronics: {
        titleKey: 'Electronics',
        icon: <Smartphone className="w-16 h-16 text-blue-600" strokeWidth={1.5} />,
        color: 'from-blue-500 to-blue-700',
        vendorId: 4
    },
    supplements: {
        titleKey: 'Supplements',
        icon: <Pill className="w-16 h-16 text-green-600" strokeWidth={1.5} />,
        color: 'from-green-500 to-green-700',
        vendorId: 2
    },
    home: {
        titleKey: 'Home',
        icon: <Home className="w-16 h-16 text-gray-600" strokeWidth={1.5} />,
        color: 'from-gray-400 to-gray-600',
        vendorId: 5
    },
};

export default function CategoryPage({ category }: CategoryPageProps) {
    const { t } = useTranslation('common');
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const catInfo = categoryMap[category];
    const dbCategory = categoryNameMap[category]; // actual category name in DB

    const [activeFilters, setActiveFilters] = useState<{
        minPrice?: number;
        maxPrice?: number;
        inStock?: boolean;
        rating?: number;
    }>({});

    const fetchProducts = async (q?: string, filters?: typeof activeFilters) => {
        setLoading(true);
        try {
            const finalFilters = filters || activeFilters;
            let url = '';

            if (q) {
                url = `/api/Products/search?q=${encodeURIComponent(q)}&page=1&pageSize=20`;
            }
            else if (finalFilters && Object.keys(finalFilters).length > 0) {
                const params = new URLSearchParams();
                if (catInfo) params.append('vendorId', catInfo.vendorId.toString());
                if (finalFilters.minPrice !== undefined) params.append('minPrice', finalFilters.minPrice.toString());
                if (finalFilters.maxPrice !== undefined) params.append('maxPrice', finalFilters.maxPrice.toString());
                if (finalFilters.inStock !== undefined) params.append('inStock', finalFilters.inStock.toString());
                if (finalFilters.rating !== undefined) params.append('rating', finalFilters.rating.toString());
                url = `/api/Products/filter?${params.toString()}&page=1&pageSize=20`;
            }
            else {
                // Use the mapped category name
                url = `/api/Products/category/${encodeURIComponent(dbCategory || category)}?page=1&pageSize=20`;
            }

            const response = await api.get<PagedResult<Product>>(url);
            setProducts(response.data.items);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!catInfo || !dbCategory) {
            router.push('/');
            return;
        }
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchProducts(undefined, {});
    }, [category, dbCategory, catInfo]);

    const handleApplyFilters = (filters: { minPrice?: number; maxPrice?: number; inStock?: boolean; rating?: number }) => {
        setActiveFilters(filters);
        fetchProducts(undefined, filters);
    };

    const handleResetFilters = () => {
        setActiveFilters({});
        fetchProducts(undefined, {});
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (search.trim()) {
            fetchProducts(search, {});
        } else {
            fetchProducts(undefined, activeFilters);
        }
    };

    if (!catInfo) return null;

    return (
        <div>
            {/* Category Hero */}
            <section className="bg-gradient-to-r from-[#0F5C45]/10 to-[#0F5C45]/5 py-16">
                <div className="container mx-auto px-4 text-center">
                    <div className="flex justify-center mb-4">
                        <div className={`p-4 rounded-2xl bg-gradient-to-br ${catInfo.color} text-white shadow-lg`}>
                            {catInfo.icon}
                        </div>
                    </div>
                    <h1 className="text-5xl font-bold text-gray-900">{t(catInfo.titleKey)}</h1>
                    <p className="text-gray-600 mt-4 text-lg">
                        {t('categories.discover', { category: t(catInfo.titleKey) })}
                    </p>
                    <form onSubmit={handleSearch} className="max-w-2xl mx-auto mt-6 flex gap-2">
                        <div className="relative flex-1">
                            <MagnifyingGlassIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder={t('categories.searchPlaceholder', { category: t(catInfo.titleKey) })}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pr-10 pl-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0F5C45] text-right"
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-8 py-3 bg-[#0F5C45] text-white rounded-xl font-medium hover:bg-[#0A4735] transition"
                        >
                            {t('search')}
                        </button>
                    </form>
                </div>
            </section>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-1/4">
                        <FilterSidebar
                            vendorId={catInfo.vendorId}
                            onApplyFilters={handleApplyFilters}
                            onResetFilters={handleResetFilters}
                        />
                    </div>
                    <div className="md:w-3/4">
                        {loading ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="bg-gray-200 rounded-2xl h-72 animate-pulse"></div>
                                ))}
                            </div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-20 text-gray-500 bg-white rounded-2xl shadow-sm">
                                <p className="text-lg">{t('categories.noProducts')}</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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