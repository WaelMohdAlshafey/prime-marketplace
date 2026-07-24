'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { Product } from '@/types';
import { useAuth } from '@/context/AuthContext';

// ============================================================
// Type for error responses
// ============================================================
interface ApiError {
    response?: {
        data?: {
            message?: string;
        };
    };
    message?: string;
}

export default function VendorDashboard() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/api/Products/vendors/products?page=1&pageSize=100');
            setProducts(response.data.items);
        } catch (err: unknown) {
            console.error('Failed to fetch vendor products:', err);
            let message = 'فشل تحميل المنتجات';
            if (err && typeof err === 'object') {
                const errorObj = err as ApiError;
                if (errorObj.response?.data?.message) {
                    message = errorObj.response.data.message;
                } else if (errorObj.message) {
                    message = errorObj.message;
                }
            }
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isLoading) return;

        if (!user) {
            router.push('/auth/login');
            return;
        }

        if (user.role !== 'Vendor' && user.role !== 'Admin') {
            router.push('/');
            return;
        }

        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchProducts();
    }, [user, isLoading]);

    const handleDelete = async (productId: number) => {
        if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;

        try {
            await api.delete(`/api/Products/${productId}`);
            setProducts(products.filter((p) => p.id !== productId));
            alert('✅ تم حذف المنتج بنجاح!');
        } catch (err: unknown) {
            console.error('Delete failed:', err);
            let message = '❌ فشل الحذف. حاول مرة أخرى.';
            if (err && typeof err === 'object') {
                const errorObj = err as ApiError;
                if (errorObj.response?.data?.message) {
                    message = errorObj.response.data.message;
                } else if (errorObj.message) {
                    message = errorObj.message;
                }
            }
            alert(message);
        }
    };

    if (isLoading || loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F5C45]"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl max-w-md mx-auto">
                    <p className="text-lg font-semibold">⚠️ خطأ</p>
                    <p className="mt-2">{error}</p>
                    <button
                        onClick={fetchProducts}
                        className="mt-4 px-6 py-2 bg-[#0F5C45] text-white rounded-xl hover:bg-[#0A4735] transition"
                    >
                        إعادة المحاولة
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">📊 لوحة تحكم البائع</h1>
                <Link
                    href="/vendor/products/create"
                    className="bg-[#0F5C45] text-white px-6 py-2 rounded-xl hover:bg-[#0A4735] transition"
                >
                    + إضافة منتج جديد
                </Link>
            </div>

            {products.length === 0 ? (
                <div className="text-center py-20 text-gray-500 bg-white rounded-xl shadow-md p-8">
                    <p className="text-lg">لا توجد منتجات مضافة بعد.</p>
                    <Link
                        href="/vendor/products/create"
                        className="inline-block mt-4 text-[#0F5C45] hover:underline"
                    >
                        أضف منتجك الأول
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition text-right"
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex flex-col gap-2">
                                    <Link
                                        href={`/vendor/products/edit/${product.id}`}
                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                    >
                                        تعديل
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                                    >
                                        حذف
                                    </button>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800">{product.name}</h3>
                                    <p className="text-gray-600">£{product.price.toFixed(2)} | المخزون: {product.stockQuantity}</p>
                                    {product.imageUrl && (
                                        <img
                                            src={product.imageUrl}
                                            alt={product.name}
                                            className="w-20 h-20 object-cover rounded-lg mt-2"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}