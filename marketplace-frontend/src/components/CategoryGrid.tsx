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

const normalizeCategory = (cat: string): string => cat.toLowerCase().replace(/\s+/g, '-');

const getCategoryDisplayName = (cat: string, t: (key: string) => string): string => {
    const key = `categories.${normalizeCategory(cat)}`;
    const translated = t(key);
    return translated === key ? cat : translated;
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
                    const Icon = categoryIcons[key] || Home;
                    const colorClass = categoryColors[key] || 'bg-gray-50 text-gray-600';
                    const displayName = getCategoryDisplayName(cat, t);

                    return (
                        <button
                            key={cat}
                            onClick={() => handleCategoryClick(cat)}
                            className="bg-card-bg rounded-2xl shadow-soft hover:shadow-card-hover transition p-4 md:p-5 text-center hover:-translate-y-1 duration-300 border border-border/50 cursor-pointer w-full group"
                        >
                            <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full ${colorClass} flex items-center justify-center mx-auto mb-2 md:mb-3 group-hover:scale-110 transition-transform duration-300`}>
                                <Icon className="w-6 h-6 md:w-7 md:h-7" />
                            </div>
                            <h3 className="font-semibold text-text text-xs md:text-sm">{displayName}</h3>
                        </button>
                    );
                })}
            </div>
        </section>
    );
}