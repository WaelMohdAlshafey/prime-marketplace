// @ts-nocheck
'use client';

import Link from 'next/link';
import { X, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function UnifiedMenu({ isOpen, onClose }) {
    const { i18n } = useTranslation('common');
    const [categories, setCategories] = useState([]);
    const [navPages, setNavPages] = useState([]);
    const [stores, setStores] = useState([]);

    const lang = (i18n.language || 'ar').startsWith('ar') ? 'ar' : 'en';
    const [isRTL, setIsRTL] = useState(true);

    useEffect(() => {
        if (typeof document !== 'undefined') {
            setIsRTL(document.documentElement.dir === 'rtl');
        }
    }, [isOpen, i18n.language]);

    useEffect(() => {
        if (!isOpen) return;
        api.get('/api/ProductCategories?onlyActive=true')
            .then(r => setCategories(r.data || []))
            .catch(() => { });
        api.get('/api/Pages/navigation')
            .then(r => setNavPages(r.data.navbarPages || []))
            .catch(() => { });
        api.get('/api/Stores?page=1&pageSize=20')
            .then(r => setStores(r.data.items || []))
            .catch(() => { });
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape' && isOpen) onClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [isOpen, onClose]);

    const panelPositionClass = isRTL ? 'right-0' : 'left-0';
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
                        className={`fixed top-0 bottom-0 w-full sm:w-[440px] max-w-[92vw] bg-white z-[2001] overflow-y-auto shadow-2xl ${panelPositionClass}`}
                    >
                        <div className="sticky top-0 bg-[#0F5C45] text-white px-5 py-4 flex items-center justify-between z-10 shadow-md">
                            <h2 className="text-xl font-bold">
                                {lang === 'ar' ? 'القائمة الرئيسية' : 'Main Menu'}
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/10 rounded-lg transition"
                                aria-label="Close"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-5 space-y-7">
                            {/* 1. Popular */}
                            <Section title={lang === 'ar' ? 'الأكثر شيوعاً' : 'Most Popular'}>
                                <MenuLink href="/products" onClick={onClose} isRTL={isRTL}>
                                    {lang === 'ar' ? 'المنتجات الأكثر مبيعاً' : 'Best Sellers'}
                                </MenuLink>
                                <MenuLink href="/products?filter=new" onClick={onClose} isRTL={isRTL}>
                                    {lang === 'ar' ? 'الإصدارات الحديثة' : 'New Arrivals'}
                                </MenuLink>
                                <MenuLink href="/offers" onClick={onClose} isRTL={isRTL}>
                                    {lang === 'ar' ? 'العروض' : 'Offers'}
                                </MenuLink>
                            </Section>

                            {/* 2. Categories — DYNAMIC */}
                            <Section title={lang === 'ar' ? 'تسوق حسب القسم' : 'Shop by Category'}>
                                {categories.map(cat => (
                                    <MenuLink key={cat.id} href={`/${cat.slug}`} onClick={onClose} isRTL={isRTL}>
                                        <span className="flex items-center gap-3">
                                            <span className="w-7 h-7 flex items-center justify-center text-lg">
                                                {cat.icon || '📦'}
                                            </span>
                                            <span>{cat.name}</span>
                                        </span>
                                    </MenuLink>
                                ))}
                                {categories.length === 0 && (
                                    <p className="px-3 py-2 text-sm text-gray-400">
                                        {lang === 'ar' ? 'لا توجد أقسام' : 'No categories'}
                                    </p>
                                )}
                            </Section>

                            {/* 3. Stores */}
                            {stores.length > 0 && (
                                <Section title={lang === 'ar' ? 'المتاجر' : 'Stores'}>
                                    {stores.map(s => (
                                        <MenuLink key={s.id} href={`/stores/${s.id}`} onClick={onClose} isRTL={isRTL}>
                                            {s.name}
                                        </MenuLink>
                                    ))}
                                </Section>
                            )}

                            {/* 4. Dynamic Pages */}
                            {navPages.length > 0 && (
                                <Section title={lang === 'ar' ? 'صفحات' : 'Pages'}>
                                    {navPages.map(p => (
                                        <MenuLink key={p.id} href={`/${p.slug}`} onClick={onClose} isRTL={isRTL}>
                                            {p.title}
                                        </MenuLink>
                                    ))}
                                </Section>
                            )}

                            {/* 5. Support */}
                            <Section title={lang === 'ar' ? 'الدعم' : 'Support'}>
                                <MenuLink href="/help" onClick={onClose} isRTL={isRTL}>
                                    {lang === 'ar' ? 'دليل المستخدم' : 'Help Center'}
                                </MenuLink>
                                <MenuLink href="/contact" onClick={onClose} isRTL={isRTL}>
                                    {lang === 'ar' ? 'اتصل بنا' : 'Contact Us'}
                                </MenuLink>
                                <MenuLink href="/tracking" onClick={onClose} isRTL={isRTL}>
                                    {lang === 'ar' ? 'تتبع الطلب' : 'Track Order'}
                                </MenuLink>
                            </Section>

                            {/* 6. Account */}
                            <Section title={lang === 'ar' ? 'حسابي' : 'My Account'}>
                                <MenuLink href="/profile" onClick={onClose} isRTL={isRTL}>
                                    {lang === 'ar' ? 'الملف الشخصي' : 'Profile'}
                                </MenuLink>
                                <MenuLink href="/orders" onClick={onClose} isRTL={isRTL}>
                                    {lang === 'ar' ? 'طلباتي' : 'My Orders'}
                                </MenuLink>
                                <MenuLink href="/cart" onClick={onClose} isRTL={isRTL}>
                                    {lang === 'ar' ? 'السلة' : 'Cart'}
                                </MenuLink>
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
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">
                {title}
            </h3>
            <div className="space-y-0.5">{children}</div>
        </div>
    );
}

function MenuLink({ href, onClick, children, isRTL }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-[#0F5C45]/10 text-gray-800 hover:text-[#0F5C45] transition"
        >
            <span className="font-medium text-sm">{children}</span>
            <ChevronLeft className={`w-4 h-4 opacity-40 ${isRTL ? '' : 'rotate-180'}`} />
        </Link>
    );
}