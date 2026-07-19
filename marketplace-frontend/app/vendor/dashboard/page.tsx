'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Vendor Dashboard</h1>

            <div className="mb-6">
                <button
                    onClick={() => alert('Add Product feature coming soon!')}
                    className="btn-primary"
                >
                    + Add New Product
                </button>
            </div>

            {products.length === 0 ? (
                <div className="text-center py-20 text-gray-500 bg-white rounded-xl shadow-md p-8">
                    <p className="text-lg">You haven&apos;t added any products yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((product) => (
                        <div key={product.id} className="bg-white rounded-xl shadow-md p-4 flex justify-between items-center hover:shadow-lg transition">
                            <div>
                                <h3 className="font-semibold text-gray-800">{product.name}</h3>
                                <p className="text-gray-600">${product.price.toFixed(2)} | Stock: {product.stockQuantity}</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</button>
                                <button className="text-red-600 hover:text-red-800 text-sm font-medium">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}