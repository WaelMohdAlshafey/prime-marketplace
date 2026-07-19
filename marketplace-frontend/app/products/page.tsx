'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function AdminProducts() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [form, setForm] = useState({
        name: '',
        description: '',
        price: 0,
        costPrice: 0,
        stockQuantity: 0,
    });
    const [image, setImage] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    if (isLoading) return <div className="text-center py-12">Loading...</div>;
    if (!user) {
        router.push('/auth/login');
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        const data = new FormData();
        data.append('name', form.name);
        data.append('description', form.description);
        data.append('price', form.price.toString());
        data.append('costPrice', form.costPrice.toString());
        data.append('stockQuantity', form.stockQuantity.toString());
        if (image) data.append('image', image);

        try {
            await api.post('/api/Products', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setMessage('✅ Product added successfully!');
            setForm({ name: '', description: '', price: 0, costPrice: 0, stockQuantity: 0 });
            setImage(null);
        } catch (error) {
            console.error('Failed to add product:', error);
            setMessage('❌ Failed to add product. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-2xl">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">📦 Add New Product</h1>

            {message && (
                <div className={`p-3 rounded-lg mb-4 ${message.startsWith('✅') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                    <input
                        type="text"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sales Price *</label>
                        <input
                            type="number"
                            step="0.01"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            value={form.price || ''}
                            onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cost Price (Hidden) *</label>
                        <input
                            type="number"
                            step="0.01"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            value={form.costPrice || ''}
                            onChange={(e) => setForm({ ...form, costPrice: parseFloat(e.target.value) || 0 })}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity *</label>
                    <input
                        type="number"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        value={form.stockQuantity || ''}
                        onChange={(e) => setForm({ ...form, stockQuantity: parseInt(e.target.value) || 0 })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        className="w-full"
                        onChange={(e) => setImage(e.target.files?.[0] || null)}
                    />
                    {image && <p className="text-sm text-green-600 mt-1">📷 {image.name} selected</p>}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                    {loading ? 'Adding...' : '➕ Add Product'}
                </button>
            </form>
        </div>
    );
}