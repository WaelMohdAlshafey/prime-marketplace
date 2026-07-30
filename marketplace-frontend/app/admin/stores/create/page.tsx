'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

// ✅ Define a proper User type (no `any`)
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
        logoUrl: '',
        vendorId: '',
    });
    const [vendors, setVendors] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [vendorsLoading, setVendorsLoading] = useState(true);

    // ✅ Move fetchVendors BEFORE useEffect
    const fetchVendors = async () => {
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
        // ✅ fetchVendors is now defined
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchVendors();
    }, [user, isLoading, fetchVendors]); // ✅ add fetchVendors to deps

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
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
            await api.post('/api/Stores', {
                name: form.name,
                description: form.description,
                logoUrl: form.logoUrl || null,
                vendorId: parseInt(form.vendorId),
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
                    <input
                        type="url"
                        name="logoUrl"
                        value={form.logoUrl}
                        onChange={handleChange}
                        placeholder="https://example.com/logo.png"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C45] focus:border-transparent"
                    />
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