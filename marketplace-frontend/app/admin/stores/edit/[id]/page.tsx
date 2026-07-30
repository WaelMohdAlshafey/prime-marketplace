'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function EditStorePage() {
    const { id } = useParams();
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [form, setForm] = useState({
        name: '',
        description: '',
        logoUrl: '',
        isActive: true,
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    // ✅ Move fetchStore BEFORE useEffect
    const fetchStore = async () => {
        try {
            const response = await api.get(`/api/Stores/${id}`);
            const store = response.data;
            setForm({
                name: store.name || '',
                description: store.description || '',
                logoUrl: store.logoUrl || '',
                isActive: store.isActive !== undefined ? store.isActive : true,
            });
        } catch (error) {
            console.error('Failed to fetch store:', error);
            setError('Store not found.');
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
        if (user.role !== 'Admin') {
            router.push('/');
            return;
        }
        // ✅ fetchStore is now defined
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchStore();
    }, [id, user, isLoading, fetchStore]); // ✅ add fetchStore to deps

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const target = e.target;
        const value = target.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value;
        setForm({ ...form, [target.name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            await api.put(`/api/Stores/${id}`, form);
            router.push('/admin/stores');
        } catch (error) {
            console.error('Update failed:', error);
            setError('Failed to update store.');
        } finally {
            setSaving(false);
        }
    };

    if (isLoading || loading) {
        return <div className="text-center py-12">Loading...</div>;
    }

    if (error) {
        return <div className="text-center py-12 text-red-600">{error}</div>;
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-2xl">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Edit Store</h1>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Store Name *</label>
                    <input
                        type="text"
                        name="name"
                        required
                        value={form.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C45] focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        name="description"
                        rows={3}
                        value={form.description}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C45] focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
                    <input
                        type="url"
                        name="logoUrl"
                        value={form.logoUrl}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C45] focus:border-transparent"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        name="isActive"
                        checked={form.isActive}
                        onChange={handleChange}
                        className="w-4 h-4 accent-[#0F5C45]"
                    />
                    <label className="text-sm font-medium text-gray-700">Active</label>
                </div>

                <button
                    type="submit"
                    disabled={saving}
                    className="w-full py-3 bg-[#0F5C45] text-white font-semibold rounded-lg hover:bg-[#0A4735] transition disabled:opacity-50"
                >
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </form>
        </div>
    );
}