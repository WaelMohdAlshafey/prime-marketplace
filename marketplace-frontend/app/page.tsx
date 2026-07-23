'use client';

import { useEffect, useState } from 'react';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stockQuantity: number;
    imageUrl?: string;
    vendorName?: string;
}

export default function Home() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch('http://localhost:8080/api/Products?page=1&pageSize=20')
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })
            .then((data) => {
                setProducts(data.items || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error('❌ Error fetching products:', err);
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F5C45] mx-auto"></div>
                    <p className="mt-4 text-gray-600">جاري تحميل المنتجات...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center text-red-600">
                    <p className="text-xl font-bold">⚠️ خطأ</p>
                    <p>{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 bg-[#0F5C45] text-white px-4 py-2 rounded-xl"
                    >
                        إعادة المحاولة
                    </button>
                </div>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center text-gray-600">
                    <p className="text-xl">📦 لا توجد منتجات حالياً.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">🛍️ منتجاتنا</h1>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-4 text-right border border-gray-50"
                    >
                        <div className="w-full h-40 bg-gray-100 rounded-xl overflow-hidden mb-3">
                            {product.imageUrl ? (
                                <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-4xl text-gray-300">
                                    📦
                                </div>
                            )}
                        </div>
                        <h3 className="font-semibold text-gray-800">{product.name}</h3>
                        <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
                        <p className="text-xl font-bold text-[#0F5C45] mt-2">£{product.price}</p>
                        {product.vendorName && (
                            <p className="text-xs text-[#0F5C45] bg-[#0F5C45]/10 px-2 py-0.5 rounded-full inline-block mt-1">
                                {product.vendorName}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}