'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '@/lib/api';
import Link from 'next/link';
import { FolderOpen } from 'lucide-react';

export default function CategoriesPage() {
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
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <div className="flex items-center gap-3 mb-8">
                <FolderOpen className="w-8 h-8 text-primary" />
                <div>
                    <h1 className="text-3xl font-bold text-text">{t('categories.title')}</h1>
                    <p className="text-text-muted mt-1">{t('categories.subtitle')}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {categories.map((cat) => {
                    const slug = cat.toLowerCase().replace(/\s+/g, '-');
                    return (
                        <Link
                            key={cat}
                            href={`/${slug}`}
                            className="bg-card-bg rounded-2xl shadow-soft hover:shadow-card-hover p-6 text-center transition hover:-translate-y-1 border border-border/50"
                        >
                            <h3 className="font-semibold text-text text-lg">{cat}</h3>
                            <span className="text-sm text-text-muted mt-2 block">استكشف ←</span>
                        </Link>
                    );
                })}
                {categories.length === 0 && (
                    <div className="col-span-full text-center py-12 text-text-muted">
                        لا توجد فئات حالياً.
                    </div>
                )}
            </div>
        </div>
    );
}