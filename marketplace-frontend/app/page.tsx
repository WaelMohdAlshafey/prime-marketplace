'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Product, PagedResult } from '@/types';
import Link from 'next/link';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function Home() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchProducts = async (q?: string) => {
        setLoading(true);
        try {
            const url = q
                ? `/api/Products/search?q=${encodeURIComponent(q)}&page=1&pageSize=20`
                : '/api/Products?page=1&pageSize=20';
            const response = await api.get<PagedResult<Product>>(url);
            setProducts(response.data.items);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchProducts();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchProducts(search);
    };

    return (
        <div>
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-5xl font-bold mb-4">Discover Amazing Products</h1>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        Browse thousands of products from trusted sellers. Find what you love.
                    </p>

                    <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex gap-2">
                        <div className="relative flex-1">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search for products..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            Search
                        </button>
                    </form>
                </div>
            </section>

            {/* Products Grid */}
            <section className="container mx-auto px-4 py-12">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {search ? `Results for "${search}"` : 'Featured Products'}
                    </h2>
                    <span className="text-gray-500 text-sm">{products.length} products</span>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">No products found. Try a different search.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <Link key={product.id} href={`/products/${product.id}`} className="group card hover:scale-[1.02] transition-transform duration-300">
                                <div className="p-4">
                                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg h-32 flex items-center justify-center mb-4">
                                        <span className="text-4xl">📦</span>
                                    </div>
                                    <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                                        {product.name}
                                    </h3>
                                    <p className="text-gray-500 text-sm mt-1 line-clamp-2">{product.description}</p>
                                    <div className="mt-3 flex justify-between items-center">
                                        <span className="text-xl font-bold text-blue-600">${product.price.toFixed(2)}</span>
                                        <span className="text-xs text-gray-400">Stock: {product.stockQuantity}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}