'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import api from '@/lib/api';

export default function CategoryGrid() {
    const { t } = useTranslation('common');
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/api/Categories');
                setCategories(response.data);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    if (loading) {
        return (
            <section className="container mx-auto px-4 py-12">
                <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0F5C45]"></div>
                </div>
            </section>
        );
    }

    return (
        <section className="container mx-auto px-4 py-12">
            <div className="flex justify-between items-center mb-6">
                <div className="text-right">
                    <h2 className="text-3xl font-bold text-gray-900">{t('categories.title')}</h2>
                    <p className="text-sm text-gray-500 mt-1">{t('categories.subtitle')}</p>
                </div>
                <Link href="/categories" className="text-[#0F5C45] font-medium hover:underline">
                    {t('categories.viewAll')} ←
                </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {categories.map((cat) => (
                    <Link
                        key={cat}
                        href={`/${cat}`}
                        className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition p-5 text-center hover:-translate-y-1 duration-300 border border-gray-50"
                    >
                        <div className="text-4xl mb-2">{cat.replace(/-/g, ' ')}</div>
                        <h3 className="font-semibold text-gray-800 text-sm">{cat.replace(/-/g, ' ')}</h3>
                    </Link>
                ))}
            </div>
        </section>
    );
}