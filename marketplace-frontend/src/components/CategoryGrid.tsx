'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '@/lib/api';

// Map category slugs to translation keys (already in common.json)
// This is just a fallback in case the translation key is missing.
const getCategoryDisplayName = (slug: string, t: (key: string) => string): string => {
    // Try to get translation from common.json
    const translationKey = `categories.${slug}`;
    const translated = t(translationKey);
    // If translation returns the key itself (not found), fallback to slug
    if (translated === translationKey) {
        return slug.replace(/-/g, ' ');
    }
    return translated;
};

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

    const handleCategoryClick = (category: string) => {
        console.log(`🔗 Navigating to /${category}`);
        window.location.href = `/${category}`;
    };

    if (loading) {
        return (
            <section className="container mx-auto px-4 py-12">
                <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0F5C45]" />
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
                <span className="text-[#0F5C45] font-medium">
                    {t('categories.viewAll')} ←
                </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => handleCategoryClick(cat)}
                        className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition p-5 text-center hover:-translate-y-1 duration-300 border border-gray-50 cursor-pointer w-full"
                    >
                        <div className="text-4xl mb-2">
                            {/* ✅ Use translation for the category name */}
                            {getCategoryDisplayName(cat, t)}
                        </div>
                        <h3 className="font-semibold text-gray-800 text-sm">
                            {getCategoryDisplayName(cat, t)}
                        </h3>
                    </button>
                ))}
            </div>
        </section>
    );
}