'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next'; // ✅ FIXED: space after 'from'
import api from '@/lib/api';
import { Product } from '@/types';
import { Edit, Trash2, Eye, EyeOff, Plus } from 'lucide-react';
import Link from 'next/link';

// Define proper error type
interface ApiError {
    response?: {
        data?: {
            message?: string;
        };
        status?: number;
    };
    message?: string;
}

export default function AdminProducts() {
    const { t } = useTranslation('common');
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/api/Products/admin/all?page=1&pageSize=100');
            setProducts(response.data.items);
        } catch (err) {
            console.error('Admin products endpoint failed:', err);
            let errorMessage = 'Failed to load products.';
            if (err && typeof err === 'object') {
                const error = err as ApiError;
                if (error.response?.data?.message) {
                    errorMessage = error.response.data.message;
                } else if (error.message) {
                    errorMessage = error.message;
                }
            }

            try {
                const fallbackResponse = await api.get('/api/Products?page=1&pageSize=100');
                setProducts(fallbackResponse.data.items);
                setError('Showing all products (admin view limited)');
            } catch (fallbackErr) {
                console.error('Fallback products endpoint failed:', fallbackErr);
                let fallbackMessage = 'Failed to load products.';
                if (fallbackErr && typeof fallbackErr === 'object') {
                    const fbError = fallbackErr as ApiError;
                    if (fbError.response?.data?.message) {
                        fallbackMessage = fbError.response.data.message;
                    } else if (fbError.message) {
                        fallbackMessage = fbError.message;
                    }
                }
                setError(fallbackMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchProducts();
    }, []);

    const handleToggleActive = async (productId: number, currentStatus: boolean) => {
        try {
            await api.put(`/api/Products/${productId}`, { isActive: !currentStatus });
            await fetchProducts();
        } catch (err) {
            console.error('Failed to toggle product status:', err);
            let message = 'Failed to update product status.';
            if (err && typeof err === 'object') {
                const error = err as ApiError;
                if (error.response?.data?.message) {
                    message = error.response.data.message;
                } else if (error.message) {
                    message = error.message;
                }
            }
            alert(message);
        }
    };

    const handleDelete = async (productId: number) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        try {
            await api.delete(`/api/Products/${productId}`);
            await fetchProducts();
        } catch (err) {
            console.error('Failed to delete product:', err);
            let message = 'Failed to delete product.';
            if (err && typeof err === 'object') {
                const error = err as ApiError;
                if (error.response?.data?.message) {
                    message = error.response.data.message;
                } else if (error.message) {
                    message = error.message;
                }
            }
            alert(message);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F5C45]"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Products</h1>
                    <p className="text-gray-500 mt-1">Manage all products</p>
                    {error && (
                        <p className="text-sm text-yellow-600 mt-1">⚠️ {error}</p>
                    )}
                </div>
                <Link
                    href="/vendor/products/create"
                    className="flex items-center gap-2 bg-[#0F5C45] text-white px-4 py-2 rounded-xl hover:bg-[#0A4735] transition"
                >
                    <Plus className="w-4 h-4" /> Add Product
                </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase">ID</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Name</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Price</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Stock</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Vendor</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Status</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {products.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 text-sm text-gray-900">{product.id}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{product.name}</td>
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                                        £{product.price.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{product.stockQuantity}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{product.vendorName || 'N/A'}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.isActive !== false
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {product.isActive !== false ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm space-x-2 rtl:space-x-reverse">
                                        <Link
                                            href={`/vendor/products/edit/${product.id}`}
                                            className="text-blue-600 hover:text-blue-800 font-medium"
                                        >
                                            <Edit className="w-4 h-4 inline" /> Edit
                                        </Link>
                                        <button
                                            onClick={() => handleToggleActive(product.id, product.isActive !== false)}
                                            className="text-yellow-600 hover:text-yellow-800 font-medium"
                                        >
                                            {product.isActive !== false ? <EyeOff className="w-4 h-4 inline" /> : <Eye className="w-4 h-4 inline" />}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="text-red-600 hover:text-red-800 font-medium"
                                        >
                                            <Trash2 className="w-4 h-4 inline" /> Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {products.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                        No products found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}