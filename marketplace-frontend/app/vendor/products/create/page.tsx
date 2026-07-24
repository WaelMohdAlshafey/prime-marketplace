'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

// ============================================================
// Type for error responses
// ============================================================
interface ApiError {
    response?: {
        data?: {
            message?: string;
        };
    };
    message?: string;
}

export default function CreateProductPage() {
    const router = useRouter();
    const { user, isLoading } = useAuth();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);

    const [form, setForm] = useState({
        name: '',
        description: '',
        price: 0,
        costPrice: 0,
        stockQuantity: 0,
        isActive: true,
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F5C45]"></div>
            </div>
        );
    }

    if (!user || (user.role !== 'Vendor' && user.role !== 'Admin')) {
        router.push('/');
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('name', form.name);
            formData.append('description', form.description);
            formData.append('price', form.price.toString());
            formData.append('costPrice', form.costPrice.toString());
            formData.append('stockQuantity', form.stockQuantity.toString());
            formData.append('isActive', String(form.isActive));

            if (imageFile) {
                formData.append('image', imageFile);
            }

            await api.post('/api/Products', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            alert('✅ تم إضافة المنتج بنجاح!');
            router.push('/vendor/dashboard');
        } catch (err: unknown) {
            console.error('Create failed:', err);
            let message = 'حدث خطأ أثناء إضافة المنتج.';
            if (err && typeof err === 'object') {
                const errorObj = err as ApiError;
                if (errorObj.response?.data?.message) {
                    message = errorObj.response.data.message;
                } else if (errorObj.message) {
                    message = errorObj.message;
                }
            }
            setError(message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-2xl">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 text-right">➕ إضافة منتج جديد</h1>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 text-right">
                    ⚠️ {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 space-y-4 text-right">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">اسم المنتج *</label>
                    <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C45] focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">الوصف</label>
                    <textarea
                        rows={3}
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C45] focus:border-transparent"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">سعر البيع *</label>
                        <input
                            type="number"
                            step="0.01"
                            required
                            value={form.price}
                            onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C45] focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">سعر التكلفة (داخلي) *</label>
                        <input
                            type="number"
                            step="0.01"
                            required
                            value={form.costPrice}
                            onChange={(e) => setForm({ ...form, costPrice: parseFloat(e.target.value) || 0 })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C45] focus:border-transparent"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">الكمية *</label>
                    <input
                        type="number"
                        required
                        value={form.stockQuantity}
                        onChange={(e) => setForm({ ...form, stockQuantity: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C45] focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">الصورة</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#0F5C45] file:text-white hover:file:bg-[#0A4735]"
                    />
                    {imageFile && <p className="text-sm text-green-600 mt-1">📷 تم اختيار: {imageFile.name}</p>}
                </div>

                <div className="flex gap-3 pt-4">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 py-3 bg-[#0F5C45] text-white rounded-xl font-semibold hover:bg-[#0A4735] transition disabled:opacity-50"
                    >
                        {submitting ? 'جاري الإضافة...' : '➕ إضافة المنتج'}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push('/vendor/dashboard')}
                        className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition"
                    >
                        إلغاء
                    </button>
                </div>
            </form>
        </div>
    );
}