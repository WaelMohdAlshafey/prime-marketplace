// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function CreateStorePage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [vendors, setVendors] = useState([]);
    const [form, setForm] = useState({
        name: '',
        description: '',
        vendorId: '',
        isPublic: false,
    });
    const [logoFile, setLogoFile] = useState(null);

    useEffect(() => {
        if (isLoading) return;
        if (!user || user.role !== 'Admin') {
            router.push('/');
            return;
        }
        fetchVendors();
    }, [user, isLoading, router]);

    const fetchVendors = async () => {
        try {
            const res = await api.get('/api/Users');
            const vendorUsers = res.data.filter((u) => u.role === 'Vendor');
            setVendors(vendorUsers);
        } catch (err) {
            console.error('Failed to fetch vendors:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!form.vendorId) {
            setError('Please select a vendor.');
            setLoading(false);
            return;
        }

        try {
            const formData = new FormData();
            formData.append('name', form.name);
            formData.append('description', form.description);
            formData.append('vendorId', form.vendorId);
            formData.append('isPublic', form.isPublic ? 'true' : 'false');
            if (logoFile) formData.append('logo', logoFile);

            await api.post('/api/Stores', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            router.push('/admin/stores');
        } catch (err) {
            setError('Failed to create store. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({
            ...form,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setLogoFile(e.target.files[0]);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F5C45]" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-2xl">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Create New Store</h1>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
                    ⚠️ {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Store Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="name"
                        required
                        value={form.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C45] focus:border-transparent"
                        placeholder="Enter store name"
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
                        placeholder="Store description"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Store Logo</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#0F5C45] file:text-white hover:file:bg-[#0A4735]"
                    />
                    {logoFile && (
                        <p className="text-sm text-green-600 mt-1">📷 {logoFile.name} selected</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Vendor <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="vendorId"
                        required
                        value={form.vendorId}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C45] focus:border-transparent"
                    >
                        <option value="">- Select Vendor -</option>
                        {vendors.map((v) => (
                            <option key={v.id} value={v.id}>
                                {v.username} ({v.email})
                            </option>
                        ))}
                    </select>
                    {vendors.length === 0 && (
                        <p className="text-sm text-yellow-600 mt-1">
                            ⚠️ No vendors found. Create a vendor user first.
                        </p>
                    )}
                </div>

                {/* ✅ Public/Private Toggle */}
                <div className="border-t border-gray-200 pt-4 mt-2">
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            name="isPublic"
                            id="isPublic"
                            checked={form.isPublic}
                            onChange={handleChange}
                            className="w-5 h-5 accent-[#0F5C45] rounded"
                        />
                        <label htmlFor="isPublic" className="text-sm font-medium text-gray-700">
                            Make this store <span className="text-green-600 font-semibold">Public</span>
                        </label>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 ml-8">
                        {form.isPublic
                            ? '✅ Visible to ALL users (including Clients)'
                            : '🔒 Visible ONLY to Admin, Vendor, and Employee'}
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={loading || vendors.length === 0}
                    className="w-full py-3 bg-[#0F5C45] text-white font-semibold rounded-lg hover:bg-[#0A4735] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Creating...' : 'Create Store'}
                </button>
            </form>
        </div>
    );
}