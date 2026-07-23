'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { Product } from '@/types';
import { useAuth } from '@/context/AuthContext';

export default function VendorDashboard() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        if (isLoading) return;

        if (!user) {
            router.push('/auth/login');
            return;
        }

        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchProducts();
    }, [user, isLoading]);

    if (isLoading || loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F5C45]"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 text-right">📊 لوحة تحكم البائع</h1>

            <div className="mb-6 text-right">
                <button
                    onClick={() => alert('إضافة منتج جديد (سيتم فتح نموذج الإضافة قريباً)')}
                    className="btn-primary"
                >
                    + إضافة منتج جديد
                </button>
            </div>

            {products.length === 0 ? (
                <div className="text-center py-20 text-gray-500 bg-white rounded-xl shadow-md p-8">
                    <p className="text-lg">لا توجد منتجات مضافة بعد.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="bg-white rounded-xl shadow-md p-4 flex justify-between items-center hover:shadow-lg transition text-right"
                        >
                            <div>
                                <h3 className="font-semibold text-gray-800">{product.name}</h3>
                                <p className="text-gray-600">£{product.price.toFixed(2)} | المخزون: {product.stockQuantity}</p>
                                {product.imageUrl && (
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className="w-16 h-16 object-cover rounded-lg mt-2"
                                    />
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                                <Link
                                    href={`/vendor/products/edit/${product.id}`}
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                >
                                    تعديل
                                </Link>
                                <button
                                    onClick={async () => {
                                        if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
                                            try {
                                                await api.delete(`/api/Products/${product.id}`);
                                                setProducts(products.filter((p) => p.id !== product.id));
                                                alert('✅ تم حذف المنتج بنجاح!');
                                            } catch (error) {
                                                console.error('Delete failed:', error);
                                                alert('❌ فشل الحذف. حاول مرة أخرى.');
                                            }
                                        }
                                    }}
                                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                                >
                                    حذف
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}