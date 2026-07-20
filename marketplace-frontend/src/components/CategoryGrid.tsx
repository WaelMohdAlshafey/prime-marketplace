'use client';

import Link from 'next/link';
import {
    Monitor,
    Sparkles,
    Droplet,
    Shirt,
    Gem,
    Smartphone,
    Pill,
    Home
} from 'lucide-react';

// ============================================================
// Categories with English slugs (match your page files)
// ============================================================
const categories = [
    {
        name: 'برامج',
        icon: Monitor,
        color: 'from-indigo-500 to-indigo-700',
        count: '1,234',
        slug: 'software'
    },
    {
        name: 'العناية بالشعر',
        icon: Sparkles,
        color: 'from-pink-500 to-pink-700',
        count: '856',
        slug: 'hair-care'
    },
    {
        name: 'العناية بالبشرة',
        icon: Droplet,
        color: 'from-amber-400 to-amber-600',
        count: '723',
        slug: 'skin-care'
    },
    {
        name: 'أزياء',
        icon: Shirt,
        color: 'from-rose-400 to-rose-600',
        count: '2,104',
        slug: 'fashion'
    },
    {
        name: 'إكسسوارات',
        icon: Gem,
        color: 'from-yellow-400 to-yellow-600',
        count: '1,502',
        slug: 'accessories'
    },
    {
        name: 'إلكترونيات',
        icon: Smartphone,
        color: 'from-blue-500 to-blue-700',
        count: '945',
        slug: 'electronics'
    },
    {
        name: 'مكملات غذائية',
        icon: Pill,
        color: 'from-green-500 to-green-700',
        count: '678',
        slug: 'supplements'
    },
    {
        name: 'المنزل',
        icon: Home,
        color: 'from-gray-400 to-gray-600',
        count: '432',
        slug: 'home'
    },
];

export default function CategoryGrid() {
    return (
        <section className="container mx-auto px-4 py-12">
            <div className="flex justify-between items-center mb-6">
                <div className="text-right">
                    <h2 className="text-3xl font-bold text-gray-900">تسوق حسب الفئة</h2>
                    <p className="text-sm text-gray-500 mt-1">ابحث بالضبط عما تبحث عنه</p>
                </div>
                <Link href="/categories" className="text-[#0F5C45] font-medium hover:underline">
                    عرض الكل ←
                </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {categories.map((cat) => {
                    const Icon = cat.icon;
                    return (
                        <Link
                            key={cat.name}
                            href={`/${cat.slug}`}  // ← NOW LINKS TO ENGLISH SLUGS
                            className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition p-5 text-center hover:-translate-y-1 duration-300 border border-gray-50"
                        >
                            <div
                                className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${cat.color} flex items-center justify-center text-white mb-3 shadow-md group-hover:shadow-lg transition`}
                            >
                                <Icon className="w-8 h-8" strokeWidth={1.5} />
                            </div>
                            <h3 className="font-semibold text-gray-800 text-sm">{cat.name}</h3>
                            <p className="text-xs text-gray-500">{cat.count} منتج</p>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}