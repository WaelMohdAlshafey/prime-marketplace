'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AddProductPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        costPrice: '',
        stockQuantity: '',
    });
    const [image, setImage] = useState<File | null>(null);

    // Redirect if not logged in or not a vendor
    if (!user) {
        router.push('/auth/login');
        return null;
    }
    if (user.role !== 'Vendor' && user.role !== 'Admin') {
        router.push('/');
        return null;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('price', formData.price);
        data.append('costPrice', formData.costPrice);
        data.append('stockQuantity', formData.stockQuantity);
        data.append('isActive', 'true');
        if (image) {
            data.append('image', image);
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('https://prime-marketplace-8hut.onrender.com/api/Products', {
                method: 'POST',
                body: data,
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                // Do NOT set Content-Type manually; fetch will set it with boundary for FormData
            });

            if (response.ok) {
                setMessage('✅ تم إضافة المنتج بنجاح!');
                setFormData({ name: '', description: '', price: '', costPrice: '', stockQuantity: '' });
                setImage(null);
                setTimeout(() => router.push('/vendor/dashboard'), 2000);
            } else {
                const error = await response.json();
                setMessage(`❌ فشل الإضافة: ${error.message || 'خطأ غير معروف'}`);
            }
        } catch (error) {
            setMessage('❌ فشل الاتصال بالخادم');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-2xl">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-right">➕ إضافة منتج جديد</h1>

            {message && (
                <div className={`p-3 rounded-lg mb-4 text-center ${message.startsWith('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-6 space-y-4 text-right">
                <div>
                    <label className="block font-medium mb-1">اسم المنتج *</label>
                    <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0F5C45]"
                        placeholder="مثال: سماعة لاسلكية"
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1">الوصف</label>
                    <textarea
                        name="description"
                        rows={3}
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0F5C45]"
                        placeholder="وصف المنتج..."
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block font-medium mb-1">السعر (بيع) *</label>
                        <input
                            type="number"
                            step="0.01"
                            name="price"
                            required
                            value={formData.price}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0F5C45]"
                            placeholder="99.99"
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-1">سعر التكلفة (داخلي)</label>
                        <input
                            type="number"
                            step="0.01"
                            name="costPrice"
                            value={formData.costPrice}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0F5C45]"
                            placeholder="50.00"
                        />
                    </div>
                </div>

                <div>
                    <label className="block font-medium mb-1">الكمية في المخزون *</label>
                    <input
                        type="number"
                        name="stockQuantity"
                        required
                        value={formData.stockQuantity}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0F5C45]"
                        placeholder="10"
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1">صورة المنتج</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full p-2 border rounded-lg"
                    />
                    {image && <p className="text-sm text-green-600 mt-1">📷 {image.name} تم الاختيار</p>}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-[#0F5C45] text-white font-bold rounded-lg hover:bg-[#0A4735] transition disabled:opacity-50"
                >
                    {loading ? 'جاري الإضافة...' : '➕ إضافة المنتج'}
                </button>
            </form>
        </div>
    );
}