'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { StoreResponseDto } from '@/types';
import { Pencil, Trash2, Plus, Eye } from 'lucide-react';

export default function AdminStores() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [stores, setStores] = useState<StoreResponseDto[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchStores = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/Stores?page=1&pageSize=50');
            setStores(response.data.items);   // ✅ Use .items
        } catch (error) {
            console.error('Failed to fetch stores:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isLoading) return;
        if (!user) {
            router.push('/auth/login');
            return;
        }
        if (user.role !== 'Admin') {
            router.push('/');
            return;
        }
        // ✅ Suppress ESLint warning – standard data‑fetching pattern
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchStores();
    }, [user, isLoading, router, fetchStores]);

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this store?')) return;
        try {
            await api.delete(`/api/Stores/${id}`);
            await fetchStores();
        } catch (error) {
            console.error('Delete failed:', error);
            alert('Failed to delete store.');
        }
    };

    if (isLoading || loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F5C45]"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Stores Management</h1>
                <Link
                    href="/admin/stores/create"
                    className="flex items-center gap-2 bg-[#0F5C45] text-white px-4 py-2 rounded-xl hover:bg-[#0A4735] transition"
                >
                    <Plus className="w-5 h-5" /> Add Store
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase">ID</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Name</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Vendor</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Products</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Status</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {stores.map((store) => (
                                <tr key={store.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 text-sm text-gray-900">{store.id}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{store.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{store.vendorUsername}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{store.productCount}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${store.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {store.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm space-x-2 rtl:space-x-reverse">
                                        <Link
                                            href={`/admin/stores/edit/${store.id}`}
                                            className="text-blue-600 hover:text-blue-800 font-medium"
                                        >
                                            <Pencil className="w-4 h-4 inline" /> Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(store.id)}
                                            className="text-red-600 hover:text-red-800 font-medium"
                                        >
                                            <Trash2 className="w-4 h-4 inline" /> Delete
                                        </button>
                                        <Link
                                            href={`/stores/${store.id}`}
                                            target="_blank"
                                            className="text-[#0F5C45] hover:text-[#0A4735] font-medium"
                                        >
                                            <Eye className="w-4 h-4 inline" /> View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {stores.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                        No stores found. Create your first store!
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