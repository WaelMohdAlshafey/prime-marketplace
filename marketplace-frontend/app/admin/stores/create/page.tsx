'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

interface User {
    id: number;
    username: string;
    email: string;
    role: string;
}

export default function CreateStorePage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [form, setForm] = useState({
        name: '',
        description: '',
        vendorId: '',
    });
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [vendors, setVendors] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [vendorsLoading, setVendorsLoading] = useState(true);

    const fetchVendors = useCallback(async () => {
        try {
            const response = await api.get('/api/Users');
            const allUsers: User[] = response.data;
            const vendorUsers = allUsers.filter((u) => u.role === 'Vendor');
            setVendors(vendorUsers);
        } catch (error) {
            console.error('Failed to fetch vendors:', error);
        } finally {
            setVendorsLoading(false);
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
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchVendors();
    }, [user, isLoading, router, fetchVendors]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setLogoFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
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
            if (logoFile) {
                formData.append('logo', logoFile);
            }

            await api.post('/api/Stores', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            router.push('/admin/stores');
        } catch (error) {
            console.error('Create store failed:', error);
            setError('Failed to create store. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (isLoading || vendorsLoading) {
        return <div className="text-center py-12">Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-2xl">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Create New Store</h1>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
                    {error}
                </div>
            )}

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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Store Logo</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#0F5C45] file:text-white hover:file:bg-[#0A4735]"
                    />
                    {logoFile && <p className="text-sm text-green-600 mt-1">📷 {logoFile.name} selected</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vendor *</label>
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
                            No vendors found. Create a vendor user first.
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={loading || vendors.length === 0}
                    className="w-full py-3 bg-[#0F5C45] text-white font-semibold rounded-lg hover:bg-[#0A4735] transition disabled:opacity-50"
                >
                    {loading ? 'Creating...' : 'Create Store'}
                </button>
            </form>
        </div>
    );
}