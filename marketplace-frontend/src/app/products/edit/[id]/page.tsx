'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
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

export default function EditProductPage() {
    const { id } = useParams();
    const router = useRouter();
    const { user, isLoading } = useAuth();

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);

    const [form, setForm] = useState({
        name: '',
        description: '',
        price: 0,
        costPrice: 0,
        stockQuantity: 0,
        isActive: true,
    });

    useEffect(() => {
        if (isLoading) return;
        if (!user) {
            router.push('/auth/login');
            return;
        }

        const fetchProduct = async () => {
            try {
                const response = await api.get(`/api/Products/${id}`);
                const data = response.data;
                setForm({
                    name: data.name || '',
                    description: data.description || '',
                    price: data.price || 0,
                    costPrice: data.costPrice || 0,
                    stockQuantity: data.stockQuantity || 0,
                    isActive: data.isActive !== undefined ? data.isActive : true,
                });
                setExistingImageUrl(data.imageUrl || null);
            } catch (err) {
                console.error('Failed to fetch product:', err);
                setError('حدث خطأ أثناء تحميل بيانات المنتج.');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchProduct();
    }, [id, user, isLoading]);

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
            } else if (existingImageUrl) {
                formData.append('existingImageUrl', existingImageUrl);
            }

            await api.put(`/api/Products/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            alert('✅ تم تحديث المنتج بنجاح!');
            router.push('/vendor/dashboard');
        } catch (err: unknown) {
            console.error('Update failed:', err);
            // Safe error message extraction
            let message = 'حدث خطأ أثناء التحديث. حاول مرة أخرى.';
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

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F5C45]"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-2xl">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 text-right">✏️ تعديل المنتج</h1>

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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">الحالة</label>
                        <select
                            value={String(form.isActive)}
                            onChange={(e) => setForm({ ...form, isActive: e.target.value === 'true' })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C45] focus:border-transparent"
                        >
                            <option value="true">نشط (معروض)</option>
                            <option value="false">غير نشط (مخفي)</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">الصورة</label>
                    {existingImageUrl && (
                        <div className="mb-2">
                            <img
                                src={existingImageUrl}
                                alt="المنتج"
                                className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                            />
                            <p className="text-xs text-gray-400 mt-1">الصورة الحالية</p>
                        </div>
                    )}
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
                        {submitting ? 'جاري الحفظ...' : '💾 حفظ التغييرات'}
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