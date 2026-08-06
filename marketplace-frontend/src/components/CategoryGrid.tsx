'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '@/lib/api';
import { Monitor, Sparkles, Droplet, Shirt, Gem, Smartphone, Pill, Home } from 'lucide-react';

const categoryIcons: Record<string, any> = {
    software: Monitor,
    'hair-care': Sparkles,
    'skin-care': Droplet,
    fashion: Shirt,
    accessories: Gem,
    electronics: Smartphone,
    supplements: Pill,
    home: Home,
};

const categoryColors: Record<string, string> = {
    software: 'bg-indigo-50 text-indigo-600',
    'hair-care': 'bg-pink-50 text-pink-600',
    'skin-care': 'bg-amber-50 text-amber-600',
    fashion: 'bg-rose-50 text-rose-600',
    accessories: 'bg-yellow-50 text-yellow-600',
    electronics: 'bg-blue-50 text-blue-600',
    supplements: 'bg-green-50 text-green-600',
    home: 'bg-gray-50 text-gray-600',
};

const getCategoryDisplayName = (slug: string, t: (key: string) => string): string => {
    const key = `categories.${slug}`;
    const translated = t(key);
    if (translated === key) {
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
        window.location.href = `/${category}`;
    };

    if (loading) {
        return (
            <section className="category-section">
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0A6C44]" />
                </div>
            </section>
        );
    }

    return (
        <section className="category-section">
            <div className="section-header">
                <span className="view-all">{t('categories.viewAll')} ←</span>
                <div>
                    <h2>{t('categories.title')}</h2>
                    <p className="text-sm text-[#757575] mt-1">{t('categories.subtitle')}</p>
                </div>
            </div>

            <div className="category-grid">
                {categories.map((cat) => {
                    const Icon = categoryIcons[cat] || Home;
                    const colorClass = categoryColors[cat] || 'bg-gray-50 text-gray-600';
                    const displayName = getCategoryDisplayName(cat, t);

                    return (
                        <button
                            key={cat}
                            onClick={() => handleCategoryClick(cat)}
                            className="category-card hover:border-[#0A6C44]"
                        >
                            <div className={`w-14 h-14 rounded-full ${colorClass} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}>
                                <Icon className="w-7 h-7" />
                            </div>
                            <h3 className="title">{displayName}</h3>
                            <p className="subtitle">+20 منتج</p>
                        </button>
                    );
                })}
            </div>
        </section>
    );
}