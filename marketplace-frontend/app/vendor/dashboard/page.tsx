'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import api from '@/lib/api';
import { Product } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { PlusCircleIcon, ChartBarIcon } from '@heroicons/react/24/outline';

export default function VendorDashboard() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isLoading) return;
        if (!user) {
            router.push('/auth/login');
            return;
        }
        // Check if user is Vendor or Admin
        if (user.role !== 'Vendor' && user.role !== 'Admin') {
            router.push('/');
            return;
        }
        fetchProducts();
    }, [user, isLoading]);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/api/Products/vendors/products?page=1&pageSize=100');
            setProducts(response.data.items);
        } catch (error) {
            console.error('Failed to fetch vendor products:', error);
        } finally {
            setLoading(false);
        }
    };

    if (isLoading || loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                    <ChartBarIcon className="w-8 h-8 text-[#0F5C45]" />
                    <h1 className="text-3xl font-bold text-gray-800">📊 لوحة تحكم البائع</h1>
                </div>

                <Link
                    href="/vendor/products/new"
                    className="flex items-center gap-2 bg-[#0F5C45] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#0A4735] transition shadow-md hover:shadow-lg"
                >
                    <PlusCircleIcon className="w-5 h-5" />
                    إضافة منتج جديد
                </Link>
            </div>

            {products.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-gray-500 text-lg">لا توجد منتجات مضافة حتى الآن.</p>
                    <p className="text-gray-400 text-sm mt-2">
                        اضغط على زر <span className="font-semibold text-[#0F5C45]">إضافة منتج جديد</span> لإضافة منتجك الأول.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <div key={product.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-4 border border-gray-100">
                            <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100 mb-3">
                                {product.imageUrl ? (
                                    <Image
                                        src={product.imageUrl}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-4xl text-gray-300 bg-gray-50">
                                        📦
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold text-gray-800 text-lg">{product.name}</h3>
                                    <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
                                    <p className="text-[#0F5C45] font-bold mt-2">£{product.price.toFixed(2)}</p>
                                    <p className="text-xs text-gray-400">المخزون: {product.stockQuantity}</p>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-full ${product.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {product.isActive ? 'نشط' : 'غير نشط'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}