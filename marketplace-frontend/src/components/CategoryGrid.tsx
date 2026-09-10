// @ts-nocheck
'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '@/lib/api';

// Fallback icons in case the API returns nothing for a category
const fallbackIcons = {
    software: '💻',
    'hair-care': '💇',
    'skin-care': '🧴',
    perfumes: '🌸',
    accessories: '💎',
    electronics: '📱',
    supplements: '💊',
    home: '🏠',
};

export default function CategoryGrid() {
    const { t, i18n } = useTranslation('common');
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const lang = i18n.language || 'en';

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/api/ProductCategories?onlyActive=true');
                setCategories(response.data);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const handleCategoryClick = (category) => {
        window.location.href = `/${category.slug}`;
    };

    if (loading) {
        return (
            <section className="container mx-auto px-4 py-12">
                <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
            </section>
        );
    }

    return (
        <section className="container mx-auto px-4 py-8 md:py-12">
            <div className="flex justify-between items-center mb-6">
                <div className="text-right">
                    <h2 className="text-2xl md:text-3xl font-bold text-text">{t('categories.title')}</h2>
                    <p className="text-sm text-text-muted mt-1">{t('categories.subtitle')}</p>
                </div>
                <span className="text-primary font-medium bg-primary/10 px-4 py-1 rounded-pill text-sm">
                    {t('categories.viewAll')} ←
                </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
                {categories.map((cat) => {
                    const icon = cat.icon || fallbackIcons[cat.slug] || '📦';
                    const colorClass = cat.colorClass || 'bg-gray-50 text-gray-600';

                    return (
                        <button
                            key={cat.id}
                            onClick={() => handleCategoryClick(cat)}
                            className="bg-card-bg rounded-2xl shadow-soft hover:shadow-card-hover transition p-4 md:p-5 text-center hover:-translate-y-1 duration-300 border border-border/50 cursor-pointer w-full group"
                            type="button"
                        >
                            <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full ${colorClass} flex items-center justify-center mx-auto mb-2 md:mb-3 group-hover:scale-110 transition-transform duration-300 text-2xl md:text-3xl`}>
                                {icon}
                            </div>
                            <h3 className="font-semibold text-text text-xs md:text-sm">{cat.name}</h3>
                        </button>
                    );
                })}
                {categories.length === 0 && (
                    <div className="col-span-full text-center py-12 text-text-muted">
                        No categories yet.
                    </div>
                )}
            </div>
        </section>
    );
}