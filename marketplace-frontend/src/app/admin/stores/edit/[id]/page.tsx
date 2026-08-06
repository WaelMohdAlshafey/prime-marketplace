'use client';

import { useEffect, useState, useCallback } from 'react';
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
        isActive: true,
    });
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [currentLogoUrl, setCurrentLogoUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const fetchStore = useCallback(async () => {
        try {
            const response = await api.get(`/api/Stores/${id}`);
            const store = response.data;
            setForm({
                name: store.name || '',
                description: store.description || '',
                isActive: store.isActive !== undefined ? store.isActive : true,
            });
            setCurrentLogoUrl(store.logoUrl || null);
        } catch (error) {
            console.error('Failed to fetch store:', error);
            setError('Store not found.');
        } finally {
            setLoading(false);
        }
    }, [id]);

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
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchStore();
    }, [id, user, isLoading, router, fetchStore]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const target = e.target;
        const value = target.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value;
        setForm({ ...form, [target.name]: value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setLogoFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('name', form.name);
            formData.append('description', form.description);
            formData.append('isActive', String(form.isActive));
            if (logoFile) {
                formData.append('logo', logoFile);
            }

            await api.put(`/api/Stores/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Logo</label>
                    {currentLogoUrl ? (
                        <div className="mb-2">
                            <img
                                src={currentLogoUrl}
                                alt="Store logo"
                                className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                            />
                        </div>
                    ) : (
                        <p className="text-gray-400 text-sm">No logo uploaded.</p>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#0F5C45] file:text-white hover:file:bg-[#0A4735]"
                    />
                    {logoFile && <p className="text-sm text-green-600 mt-1">📷 New logo: {logoFile.name}</p>}
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