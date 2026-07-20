'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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

// Arabic title & icon mapping
const categoryMap: Record<string, { title: string; icon: React.ReactNode; color: string; vendorId: number }> = {
    software: {
        title: 'برامج',
        icon: <Monitor className="w-16 h-16 text-indigo-600" strokeWidth={1.5} />,
        color: 'from-indigo-500 to-indigo-700',
        vendorId: 1
    },
    'hair-care': {
        title: 'العناية بالشعر',
        icon: <Sparkles className="w-16 h-16 text-pink-600" strokeWidth={1.5} />,
        color: 'from-pink-500 to-pink-700',
        vendorId: 2
    },
    'skin-care': {
        title: 'العناية بالبشرة',
        icon: <Droplet className="w-16 h-16 text-amber-600" strokeWidth={1.5} />,
        color: 'from-amber-400 to-amber-600',
        vendorId: 2
    },
    fashion: {
        title: 'أزياء',
        icon: <Shirt className="w-16 h-16 text-rose-600" strokeWidth={1.5} />,
        color: 'from-rose-400 to-rose-600',
        vendorId: 3
    },
    accessories: {
        title: 'إكسسوارات',
        icon: <Gem className="w-16 h-16 text-yellow-600" strokeWidth={1.5} />,
        color: 'from-yellow-400 to-yellow-600',
        vendorId: 3
    },
    electronics: {
        title: 'إلكترونيات',
        icon: <Smartphone className="w-16 h-16 text-blue-600" strokeWidth={1.5} />,
        color: 'from-blue-500 to-blue-700',
        vendorId: 4
    },
    supplements: {
        title: 'مكملات غذائية',
        icon: <Pill className="w-16 h-16 text-green-600" strokeWidth={1.5} />,
        color: 'from-green-500 to-green-700',
        vendorId: 2
    },
    home: {
        title: 'المنزل',
        icon: <Home className="w-16 h-16 text-gray-600" strokeWidth={1.5} />,
        color: 'from-gray-400 to-gray-600',
        vendorId: 5
    },
};

export default function CategoryPage({ category }: CategoryPageProps) {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const catInfo = categoryMap[category];

    // ============================================================
    // FIX: Move fetchProducts BEFORE the conditional return
    // so useEffect is ALWAYS called in the same order
    // ============================================================
    const fetchProducts = async (q?: string) => {
        setLoading(true);
        try {
            let url = `/api/Products/category/${category}?page=1&pageSize=20`;
            if (q) {
                url = `/api/Products/search?q=${encodeURIComponent(q)}&page=1&pageSize=20`;
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
    // FIX: useEffect must be called BEFORE any conditional returns
    // ============================================================
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchProducts();
    }, [category]);

    // ============================================================
    // NOW we can do the conditional return (after all hooks)
    // ============================================================
    if (!catInfo) {
        router.push('/');
        return null;
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchProducts(search);
    };

    return (
        <div>
            <section className="bg-gradient-to-r from-[#0F5C45]/10 to-[#0F5C45]/5 py-16">
                <div className="container mx-auto px-4 text-center">
                    <div className="flex justify-center mb-4">
                        <div className={`p-4 rounded-2xl bg-gradient-to-br ${catInfo.color} text-white shadow-lg`}>
                            {catInfo.icon}
                        </div>
                    </div>
                    <h1 className="text-5xl font-bold text-gray-900">{catInfo.title}</h1>
                    <p className="text-gray-600 mt-4 text-lg">
                        اكتشف أفضل منتجات {catInfo.title} من بائعين موثوقين
                    </p>
                    <form onSubmit={handleSearch} className="max-w-2xl mx-auto mt-6 flex gap-2">
                        <div className="relative flex-1">
                            <MagnifyingGlassIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder={`ابحث في ${catInfo.title}...`}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pr-10 pl-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0F5C45] text-right"
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-8 py-3 bg-[#0F5C45] text-white rounded-xl font-medium hover:bg-[#0A4735] transition"
                        >
                            بحث
                        </button>
                    </form>
                </div>
            </section>

            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-1/4">
                        <FilterSidebar />
                    </div>
                    <div className="md:w-3/4">
                        {loading ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="bg-gray-200 rounded-2xl h-72 animate-pulse"></div>
                                ))}
                            </div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-20 text-gray-500">
                                <p>لا توجد منتجات في هذه الفئة</p>
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