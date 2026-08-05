'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

export default function CreateProductPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);

    const [form, setForm] = useState({
        nameAr: '',
        nameEn: '',
        descriptionAr: '',
        descriptionEn: '',
        price: 0,
        costPrice: 0,
        stockQuantity: 0,
        category: '',
        isActive: true,
    });

    if (isLoading) {
        return <div className="text-center py-12">جاري التحميل...</div>;
    }

    if (!user || (user.role !== 'Vendor' && user.role !== 'Admin')) {
        router.push('/');
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('nameAr', form.nameAr);
            formData.append('nameEn', form.nameEn);
            formData.append('descriptionAr', form.descriptionAr);
            formData.append('descriptionEn', form.descriptionEn);
            formData.append('price', form.price.toString());
            formData.append('costPrice', form.costPrice.toString());
            formData.append('stockQuantity', form.stockQuantity.toString());
            formData.append('category', form.category);
            formData.append('isActive', String(form.isActive));
            if (imageFile) {
                formData.append('image', imageFile);
            }

            await api.post('/api/Products', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            alert('✅ تم إضافة المنتج بنجاح!');
            router.push('/vendor/dashboard');
        } catch (err) {
            console.error('Create failed:', err);
            setError('حدث خطأ أثناء إضافة المنتج. حاول مرة أخرى.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-3xl">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 text-right">➕ إضافة منتج جديد</h1>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 text-right">
                    ⚠️ {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 space-y-4 text-right">
                {/* Arabic Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">الاسم (بالعربية) *</label>
                    <input
                        type="text"
                        required
                        value={form.nameAr}
                        onChange={(e) => setForm({ ...form, nameAr: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C45] focus:border-transparent"
                        placeholder="مثال: لابتوب احترافي"
                    />
                </div>

                {/* English Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name (English) *</label>
                    <input
                        type="text"
                        required
                        value={form.nameEn}
                        onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C45] focus:border-transparent"
                        placeholder="e.g. Professional Laptop"
                    />
                </div>

                {/* Arabic Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">الوصف (بالعربية)</label>
                    <textarea
                        rows={3}
                        value={form.descriptionAr}
                        onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C45] focus:border-transparent"
                        placeholder="وصف المنتج بالعربية..."
                    />
                </div>

                {/* English Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description (English)</label>
                    <textarea
                        rows={3}
                        value={form.descriptionEn}
                        onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C45] focus:border-transparent"
                        placeholder="Product description in English..."
                    />
                </div>

                {/* Price and Cost */}
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

                {/* Stock and Category */}
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">الفئة</label>
                        <select
                            value={form.category}
                            onChange={(e) => setForm({ ...form, category: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C45] focus:border-transparent"
                        >
                            <option value="">اختر الفئة</option>
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
                </div>

                {/* Image */}
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

                {/* Active Status */}
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={form.isActive}
                        onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                        className="w-4 h-4 accent-[#0F5C45]"
                    />
                    <label className="text-sm font-medium text-gray-700">نشط (معروض)</label>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-[#0F5C45] text-white rounded-xl font-semibold hover:bg-[#0A4735] transition disabled:opacity-50"
                >
                    {loading ? 'جاري الإضافة...' : '➕ إضافة المنتج'}
                </button>
            </form>
        </div>
    );
}