// @ts-nocheck
'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '@/lib/api';
import PerfumeIcon from '@/components/icons/PerfumeIcon';

// ✅ Category icons - using PerfumeIcon for fashion/perfumes
const categoryIcons = {
    software: '💻',
    'hair-care': '💇',
    'skin-care': '🧴',
    fashion: <PerfumeIcon className="w-6 h-6 text-rose-500" />,
    perfumes: <PerfumeIcon className="w-6 h-6 text-rose-500" />,
    accessories: '💎',
    electronics: '📱',
    supplements: '💊',
    home: '🏠',
};

// ✅ Category colors
const categoryColors = {
    software: 'bg-indigo-50 text-indigo-600',
    'hair-care': 'bg-pink-50 text-pink-600',
    'skin-care': 'bg-amber-50 text-amber-600',
    fashion: 'bg-rose-50 text-rose-600',
    perfumes: 'bg-rose-50 text-rose-600',
    accessories: 'bg-yellow-50 text-yellow-600',
    electronics: 'bg-blue-50 text-blue-600',
    supplements: 'bg-green-50 text-green-600',
    home: 'bg-gray-50 text-gray-600',
};

// ✅ Category mapping - English
const categoryNameMap = {
    software: 'Software',
    'hair-care': 'Hair Care',
    'skin-care': 'Skin Care',
    fashion: 'Perfumes',
    perfumes: 'Perfumes',
    accessories: 'Accessories',
    electronics: 'Electronics',
    supplements: 'Supplements',
    home: 'Home',
};

// ✅ Category mapping - Arabic
const categoryNameMapAr = {
    software: 'برامج',
    'hair-care': 'العناية بالشعر',
    'skin-care': 'العناية بالبشرة',
    fashion: 'عطور',
    perfumes: 'عطور',
    accessories: 'إكسسوارات',
    electronics: 'إلكترونيات',
    supplements: 'مكملات غذائية',
    home: 'المنزل',
};

// ✅ Category emojis - fallback
const categoryEmojis = {
    software: '💻',
    'hair-care': '💇',
    'skin-care': '🧴',
    fashion: '🌸',
    perfumes: '🌸',
    accessories: '💎',
    electronics: '📱',
    supplements: '💊',
    home: '🏠',
};

const normalizeCategory = (cat) => {
    if (cat === 'Fashion' || cat === 'fashion') {
        return 'perfumes';
    }
    return cat.toLowerCase().replace(/\s+/g, '-');
};

const getCategoryDisplayName = (cat, lang) => {
    const key = normalizeCategory(cat);
    if (lang === 'ar') {
        return categoryNameMapAr[key] || cat;
    }
    return categoryNameMap[key] || cat;
};

export default function CategoryGrid() {
    const { t, i18n } = useTranslation('common');
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const lang = i18n.language || 'en';

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

    const handleCategoryClick = (category) => {
        const slug = normalizeCategory(category);
        window.location.href = `/${slug}`;
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
                    const key = normalizeCategory(cat);
                    const icon = categoryIcons[key] || '📂';
                    const colorClass = categoryColors[key] || 'bg-gray-50 text-gray-600';
                    const displayName = getCategoryDisplayName(cat, lang);

                    return (
                        <button
                            key={cat}
                            onClick={() => handleCategoryClick(cat)}
                            className="bg-card-bg rounded-2xl shadow-soft hover:shadow-card-hover transition p-4 md:p-5 text-center hover:-translate-y-1 duration-300 border border-border/50 cursor-pointer w-full group"
                            type="button"
                        >
                            <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full ${colorClass} flex items-center justify-center mx-auto mb-2 md:mb-3 group-hover:scale-110 transition-transform duration-300 text-2xl md:text-3xl`}>
                                {icon}
                            </div>
                            <h3 className="font-semibold text-text text-xs md:text-sm">{displayName}</h3>
                        </button>
                    );
                })}
            </div>
        </section>
    );
}