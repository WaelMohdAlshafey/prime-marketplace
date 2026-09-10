// @ts-nocheck
'use client';

import Link from 'next/link';
import { X, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

import PerfumeIcon from '@/components/icons/PerfumeIcon';
import SoftwareIcon from '@/components/icons/SoftwareIcon';
import HairCareIcon from '@/components/icons/HairCareIcon';
import SkinCareIcon from '@/components/icons/SkinCareIcon';
import AccessoriesIcon from '@/components/icons/AccessoriesIcon';
import ElectronicsIcon from '@/components/icons/ElectronicsIcon';
import SupplementsIcon from '@/components/icons/SupplementsIcon';
import HomeIcon from '@/components/icons/HomeIcon';

const categoryIcons = {
    software: <SoftwareIcon className="w-5 h-5 text-indigo-500" />,
    'hair-care': <HairCareIcon className="w-5 h-5 text-pink-500" />,
    'skin-care': <SkinCareIcon className="w-5 h-5 text-amber-500" />,
    fashion: <PerfumeIcon className="w-5 h-5 text-rose-500" />,
    perfumes: <PerfumeIcon className="w-5 h-5 text-rose-500" />,
    accessories: <AccessoriesIcon className="w-5 h-5 text-yellow-500" />,
    electronics: <ElectronicsIcon className="w-5 h-5 text-blue-500" />,
    supplements: <SupplementsIcon className="w-5 h-5 text-green-500" />,
    home: <HomeIcon className="w-5 h-5 text-gray-500" />,
};

const categoryNameMap = {
    software: 'Software', 'hair-care': 'Hair Care', 'skin-care': 'Skin Care',
    fashion: 'Perfumes', perfumes: 'Perfumes', accessories: 'Accessories',
    electronics: 'Electronics', supplements: 'Supplements', home: 'Home',
};

const categoryNameMapAr = {
    software: 'برامج', 'hair-care': 'العناية بالشعر', 'skin-care': 'العناية بالبشرة',
    fashion: 'عطور', perfumes: 'عطور', accessories: 'إكسسوارات',
    electronics: 'إلكترونيات', supplements: 'مكملات غذائية', home: 'المنزل',
};

const normalizeCategory = (cat) => {
    if (['Fashion', 'fashion', 'Perfumes', 'perfumes'].includes(cat)) return 'perfumes';
    return cat.toLowerCase().replace(/\s+/g, '-');
};

export default function UnifiedMenu({ isOpen, onClose }) {
    const { i18n } = useTranslation('common');
    const [categories, setCategories] = useState([]);
    const [navPages, setNavPages] = useState([]);
    const [stores, setStores] = useState([]);

    // ✅ ROBUST RTL detection — reads the DOM <html dir> attribute
    const [isRTL, setIsRTL] = useState(false);
    const lang = (i18n.language || 'ar').startsWith('ar') ? 'ar' : 'en';

    useEffect(() => {
        if (typeof document !== 'undefined') {
            setIsRTL(document.documentElement.dir === 'rtl');
        }
    }, [isOpen, i18n.language]);

    useEffect(() => {
        if (!isOpen) return;
        api.get('/api/Categories').then(r => setCategories(r.data)).catch(() => { });
        api.get('/api/Pages/navigation').then(r => setNavPages(r.data.navbarPages || [])).catch(() => { });
        api.get('/api/Stores?page=1&pageSize=20').then(r => setStores(r.data.items || [])).catch(() => { });
    }, [isOpen]);

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape' && isOpen) onClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [isOpen, onClose]);

    const getCategoryName = (cat) => {
        const key = normalizeCategory(cat);
        return lang === 'ar' ? (categoryNameMapAr[key] || cat) : (categoryNameMap[key] || cat);
    };

    // ✅ RTL → panel slides from RIGHT. LTR → from LEFT.
    const panelPosition = isRTL ? 'right-0' : 'left-0';
    const slideOffscreen = isRTL ? '100%' : '-100%';

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/60 z-[2000] backdrop-blur-sm"
                        onClick={onClose}
                    />
                    <motion.aside
                        initial={{ x: slideOffscreen }}
                        animate={{ x: 0 }}
                        exit={{ x: slideOffscreen }}
                        transition={{ type: 'spring', damping: 28, stiffness: 220 }}
                        className={`fixed top-0 bottom-0 w-full sm:w-[440px] max-w-[92vw] bg-white z-[2001] overflow-y-auto shadow-2xl ${panelPosition}`}
                    >
                        <div className="sticky top-0 bg-[#0F5C45] text-white px-5 py-4 flex items-center justify-between z-10 shadow-md">
                            <h2 className="text-xl font-bold">
                                {lang === 'ar' ? 'القائمة الرئيسية' : 'Main Menu'}
                            </h2>
                            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg" aria-label="Close">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-5 space-y-7">
                            <Section title={lang === 'ar' ? 'الأكثر شيوعاً' : 'Most Popular'}>
                                <MenuLink href="/products" onClick={onClose} isRTL={isRTL}>{lang === 'ar' ? 'المنتجات الأكثر مبيعاً' : 'Best Sellers'}</MenuLink>
                                <MenuLink href="/products?filter=new" onClick={onClose} isRTL={isRTL}>{lang === 'ar' ? 'الإصدارات الحديثة' : 'New Arrivals'}</MenuLink>
                                <MenuLink href="/offers" onClick={onClose} isRTL={isRTL}>{lang === 'ar' ? 'العروض' : 'Offers'}</MenuLink>
                            </Section>

                            <Section title={lang === 'ar' ? 'تسوق حسب القسم' : 'Shop by Category'}>
                                {categories.map(cat => {
                                    const key = normalizeCategory(cat);
                                    return (
                                        <MenuLink key={cat} href={`/${key}`} onClick={onClose} isRTL={isRTL}>
                                            <span className="flex items-center gap-3">
                                                <span className="w-7 h-7 flex items-center justify-center">{categoryIcons[key] || '📦'}</span>
                                                <span>{getCategoryName(cat)}</span>
                                            </span>
                                        </MenuLink>
                                    );
                                })}
                            </Section>

                            {stores.length > 0 && (
                                <Section title={lang === 'ar' ? 'المتاجر' : 'Stores'}>
                                    {stores.map(s => (
                                        <MenuLink key={s.id} href={`/stores/${s.id}`} onClick={onClose} isRTL={isRTL}>{s.name}</MenuLink>
                                    ))}
                                </Section>
                            )}

                            {navPages.length > 0 && (
                                <Section title={lang === 'ar' ? 'صفحات' : 'Pages'}>
                                    {navPages.map(p => (
                                        <MenuLink key={p.id} href={`/${p.slug}`} onClick={onClose} isRTL={isRTL}>{p.title}</MenuLink>
                                    ))}
                                </Section>
                            )}

                            <Section title={lang === 'ar' ? 'الدعم' : 'Support'}>
                                <MenuLink href="/help" onClick={onClose} isRTL={isRTL}>{lang === 'ar' ? 'دليل المستخدم' : 'Help Center'}</MenuLink>
                                <MenuLink href="/contact" onClick={onClose} isRTL={isRTL}>{lang === 'ar' ? 'اتصل بنا' : 'Contact Us'}</MenuLink>
                                <MenuLink href="/tracking" onClick={onClose} isRTL={isRTL}>{lang === 'ar' ? 'تتبع الطلب' : 'Track Order'}</MenuLink>
                            </Section>

                            <Section title={lang === 'ar' ? 'حسابي' : 'My Account'}>
                                <MenuLink href="/profile" onClick={onClose} isRTL={isRTL}>{lang === 'ar' ? 'الملف الشخصي' : 'Profile'}</MenuLink>
                                <MenuLink href="/orders" onClick={onClose} isRTL={isRTL}>{lang === 'ar' ? 'طلباتي' : 'My Orders'}</MenuLink>
                                <MenuLink href="/cart" onClick={onClose} isRTL={isRTL}>{lang === 'ar' ? 'السلة' : 'Cart'}</MenuLink>
                            </Section>
                        </div>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
}

function Section({ title, children }) {
    return (
        <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">{title}</h3>
            <div className="space-y-0.5">{children}</div>
        </div>
    );
}

function MenuLink({ href, onClick, children, isRTL }) {
    return (
        <Link href={href} onClick={onClick}
            className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-[#0F5C45]/10 text-gray-800 hover:text-[#0F5C45] transition">
            <span className="font-medium text-sm">{children}</span>
            <ChevronLeft className={`w-4 h-4 opacity-40 ${isRTL ? '' : 'rotate-180'}`} />
        </Link>
    );
}