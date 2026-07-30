'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function SuggestProductPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    const [form, setForm] = useState({
        name: '',
        description: '',
        category: '',
        vendorId: '',
        suggestedPrice: '',
        estimatedCostPrice: '',
        suggestedStockQuantity: '',
        notes: ''
    });
    const [image, setImage] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F5C45]"></div>
            </div>
        );
    }

    if (!user) {
        router.push('/auth/login');
        return null;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        const data = new FormData();
        data.append('name', form.name);
        data.append('description', form.description);
        data.append('category', form.category);
        if (form.vendorId) data.append('vendorId', form.vendorId);
        if (form.suggestedPrice) data.append('suggestedPrice', form.suggestedPrice);
        if (form.estimatedCostPrice) data.append('estimatedCostPrice', form.estimatedCostPrice);
        if (form.suggestedStockQuantity) data.append('suggestedStockQuantity', form.suggestedStockQuantity);
        if (form.notes) data.append('notes', form.notes);
        if (image) data.append('image', image);

        try {
            await api.post('/api/ProductSuggestions', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setMessage('✅ Suggestion submitted successfully!');
            setForm({
                name: '',
                description: '',
                category: '',
                vendorId: '',
                suggestedPrice: '',
                estimatedCostPrice: '',
                suggestedStockQuantity: '',
                notes: ''
            });
            setImage(null);
        } catch (error) {
            console.error('Submit error:', error);
            let errorMessage = '❌ Failed to submit suggestion. Please try again.';
            if (error && typeof error === 'object' && 'response' in error) {
                const err = error as { response?: { data?: { message?: string } } };
                if (err.response?.data?.message) {
                    errorMessage = `❌ ${err.response.data.message}`;
                }
            }
            setMessage(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-2xl">
            <h1 className="text-3xl font-bold text-gray-800 mb-2 text-right">Suggest a Product</h1>
            <p className="text-gray-500 text-right mb-6 text-sm">
                Submit your idea for a new product. Admin will review and approve if suitable.
            </p>

            {message && (
                <div className={`p-3 rounded-lg mb-4 text-center ${message.startsWith('✅') ? 'bg-green-50 text-green-700 border border-green-200' :
                        'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 space-y-4 text-right">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C45] focus:border-transparent"
                        placeholder="e.g. Wireless Headphones"
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
                        placeholder="Describe the product and its features"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C45] focus:border-transparent"
                    >
                        <option value="">- Select -</option>
                        <option value="Software">Software</option>
                        <option value="Hair Care">Hair Care</option>
                        <option value="Skin Care">Skin Care</option>
                        <option value="Fashion">Fashion</option>
                        <option value="Accessories">Accessories</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Supplements">Supplements</option>
                        <option value="Home">Home</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Suggested Vendor</label>
                    <select
                        name="vendorId"
                        value={form.vendorId}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C45] focus:border-transparent"
                    >
                        <option value="">- Select Vendor -</option>
                        <option value="1">Software Store</option>
                        <option value="2">Beauty Store</option>
                        <option value="3">Fashion Store</option>
                        <option value="4">Electronics Store</option>
                        <option value="5">Home Store</option>
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Suggested Price (£)</label>
                        <input
                            type="number"
                            step="0.01"
                            name="suggestedPrice"
                            value={form.suggestedPrice}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C45] focus:border-transparent"
                            placeholder="99.99"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Cost Price (£)</label>
                        <input
                            type="number"
                            step="0.01"
                            name="estimatedCostPrice"
                            value={form.estimatedCostPrice}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C45] focus:border-transparent"
                            placeholder="45.00"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Suggested Stock Quantity</label>
                    <input
                        type="number"
                        name="suggestedStockQuantity"
                        value={form.suggestedStockQuantity}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C45] focus:border-transparent"
                        placeholder="50"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#0F5C45] file:text-white hover:file:bg-[#0A4735]"
                    />
                    {image && <p className="text-sm text-green-600 mt-1">Image selected: {image.name}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reason for suggestion</label>
                    <textarea
                        name="notes"
                        rows={2}
                        value={form.notes}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C45] focus:border-transparent"
                        placeholder="Why should this product be added? Any market demand, competitor info, etc."
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-[#0F5C45] text-white font-semibold rounded-lg hover:bg-[#0A4735] transition disabled:opacity-50"
                >
                    {loading ? 'Submitting...' : 'Submit Suggestion'}
                </button>
            </form>
        </div>
    );
}