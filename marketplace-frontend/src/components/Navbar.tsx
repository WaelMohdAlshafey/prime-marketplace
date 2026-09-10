// @ts-nocheck
'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useTranslation } from 'react-i18next';
import { useCartIconRef } from '@/context/CartIconRefContext';
import Logo from './Logo';
import UnifiedMenu from './UnifiedMenu';
import {
    ShoppingCartIcon,
    UserIcon,
    HeartIcon,
    CurrencyDollarIcon,
    Bars3Icon,
    ChevronDownIcon,
    GlobeAltIcon,
    LifebuoyIcon,
    TruckIcon,
    X,
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { t, i18n } = useTranslation('common');
    const { user, isLoading, logout } = useAuth();
    const { totalItems } = useCart();
    const { totalFavorites } = useWishlist();
    const { cartIconRef } = useCartIconRef();

    const [menuOpen, setMenuOpen] = useState(false);
    const [userOpen, setUserOpen] = useState(false);          // desktop dropdown
    const [mobileUserOpen, setMobileUserOpen] = useState(false); // mobile bottom sheet
    const userRef = useRef(null);

    // ✅ Robust RTL from DOM
    const [isRTL, setIsRTL] = useState(false);
    useEffect(() => {
        setIsRTL(document.documentElement.dir === 'rtl');
    }, [i18n.language]);

    // Close desktop dropdown on outside click
    useEffect(() => {
        const handler = (e) => {
            if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const toggleLanguage = () => {
        i18n.changeLanguage((i18n.language || '').startsWith('ar') ? 'en' : 'ar');
    };

    const handleUserClick = () => {
        if (typeof window !== 'undefined' && window.innerWidth < 768) {
            setMobileUserOpen(true);
        } else {
            setUserOpen(!userOpen);
        }
    };

    const closeUser = () => {
        setUserOpen(false);
        setMobileUserOpen(false);
    };

    const handleLogout = () => {
        closeUser();
        logout();
    };

    // ✅ User icon label: username if logged, "Welcome back / Register" if not
    const userLabel = user?.username || (isRTL ? 'تسجيل' : 'Sign in');

    const topLinkClass = "flex items-center gap-2 px-3 py-2 rounded-lg font-bold text-[15px] text-white hover:text-[#D4A54A] hover:bg-white/15 transition whitespace-nowrap drop-shadow-sm";
    const dropdownPos = isRTL ? 'left-0' : 'right-0';
    const desktopDropdownClass = `absolute top-full mt-1 bg-white text-gray-800 rounded-lg shadow-lg py-1 z-[9999] min-w-[220px] max-h-[80vh] overflow-y-auto ${dropdownPos}`;

    if (typeof window === 'undefined' || isLoading) {
        return <div className="bg-surface shadow-md py-4 text-center text-text-muted animate-pulse">Loading...</div>;
    }

    // ============================================================
    // USER MENU LINKS — all the links (used in both desktop & mobile)
    // ============================================================
    const userLinks = (
        <>
            {!user ? (
                <>
                    <Link href="/auth/login" className="block px-4 py-3 hover:bg-primary/10 text-sm" onClick={closeUser}>
                        {t('loginTitle')}
                    </Link>
                    <Link href="/auth/register" className="block px-4 py-3 hover:bg-primary/10 text-sm" onClick={closeUser}>
                        {t('registerTitle')}
                    </Link>
                </>
            ) : (
                <>
                    <Link href="/cart" className="block px-4 py-3 hover:bg-primary/10 text-sm" onClick={closeUser}>🛒 {t('cart')}</Link>
                    <Link href="/orders" className="block px-4 py-3 hover:bg-primary/10 text-sm" onClick={closeUser}>📋 {t('orders')}</Link>
                    <Link href="/suggest" className="block px-4 py-3 hover:bg-primary/10 text-sm" onClick={closeUser}>💡 {isRTL ? 'اقترح منتج' : 'Suggest'}</Link>
                    <Link href="/chat" className="block px-4 py-3 hover:bg-primary/10 text-sm" onClick={closeUser}>💬 {isRTL ? 'المحادثة' : 'Chat'}</Link>
                    <Link href="/profile" className="block px-4 py-3 hover:bg-primary/10 text-sm" onClick={closeUser}>👤 {t('profile')}</Link>
                    {(user.role === 'Vendor' || user.role === 'Admin') && (
                        <Link href="/vendor/dashboard" className="block px-4 py-3 hover:bg-primary/10 text-sm" onClick={closeUser}>📊 {t('dashboard')}</Link>
                    )}
                    {(user.role === 'Vendor' || user.role === 'Admin' || user.role === 'Employee') && (
                        <Link href="/admin/orders" className="block px-4 py-3 hover:bg-primary/10 text-sm" onClick={closeUser}>📦 {isRTL ? 'إدارة الطلبات' : 'Manage Orders'}</Link>
                    )}
                    {user.role === 'Admin' && (
                        <>
                            <hr className="my-1 border-gray-200" />
                            <Link href="/admin" className="block px-4 py-3 hover:bg-red-50 text-sm font-bold text-red-600" onClick={closeUser}>
                                ⚙️ {isRTL ? 'لوحة التحكم' : 'Admin Panel'}
                            </Link>
                            <Link href="/admin/users" className="block px-4 py-3 hover:bg-primary/10 text-sm" onClick={closeUser}>👥 {t('users')}</Link>
                            <Link href="/admin/products" className="block px-4 py-3 hover:bg-primary/10 text-sm" onClick={closeUser}>📦 {isRTL ? 'المنتجات' : 'Products'}</Link>
                            <Link href="/admin/pages" className="block px-4 py-3 hover:bg-primary/10 text-sm" onClick={closeUser}>📄 {isRTL ? 'الصفحات' : 'Pages'}</Link>
                            <Link href="/admin/stores" className="block px-4 py-3 hover:bg-primary/10 text-sm" onClick={closeUser}>🏪 {isRTL ? 'المتاجر' : 'Stores'}</Link>
                            <Link href="/admin/golden-links" className="block px-4 py-3 hover:bg-primary/10 text-sm" onClick={closeUser}>🔗 Golden Links</Link>
                        </>
                    )}
                    <hr className="my-1 border-gray-200" />
                    <button onClick={handleLogout}
                        className="block w-full text-right px-4 py-3 text-red-600 hover:bg-red-50 text-sm font-semibold">
                        {t('logout')}
                    </button>
                </>
            )}
        </>
    );

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-[1000] bg-white shadow-md">
                <div className="navbar border-b border-border bg-[#0F5C45]">
                    <div className="container mx-auto px-3 sm:px-4 flex items-center justify-between gap-2 py-2.5">

                        {/* LEFT — hamburger + logo */}
                        <div className="flex items-center gap-3 flex-shrink-0">
                            <button onClick={() => setMenuOpen(true)}
                                className="p-2 rounded-lg hover:bg-white/15 transition text-white" aria-label="Open menu">
                                <Bars3Icon className="w-7 h-7 sm:w-8 sm:h-8" />
                            </button>
                            <Logo />
                        </div>

                        {/* RIGHT */}
                        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">

                            {/* DESKTOP Language */}
                            <button onClick={toggleLanguage} className={`${topLinkClass} hidden md:flex`}>
                                <GlobeAltIcon className="w-5 h-5" />
                                <span>{(i18n.language || '').startsWith('ar') ? 'English' : 'العربية'}</span>
                            </button>

                            {/* DESKTOP Support */}
                            <Link href="/help" className={`${topLinkClass} hidden md:flex`}>
                                <LifebuoyIcon className="w-5 h-5" />
                                <span>{t('support')}</span>
                            </Link>

                            {/* DESKTOP Currency */}
                            <span className={`${topLinkClass} hidden md:flex`}>
                                <CurrencyDollarIcon className="w-5 h-5" />
                                <span>{t('currency')}</span>
                            </span>

                            {/* DESKTOP Track */}
                            <Link href="/tracking" className={`${topLinkClass} hidden lg:flex`}>
                                <TruckIcon className="w-5 h-5" />
                                <span>{t('trackOrder')}</span>
                            </Link>

                            {/* Wishlist */}
                            <button className="text-white hover:text-[#D4A54A] transition relative p-2">
                                <HeartIcon className="w-6 h-6" />
                                <span className="absolute top-1 right-1 bg-[#D4A54A] text-[#0F5C45] text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center">
                                    {totalFavorites}
                                </span>
                            </button>

                            {/* Cart */}
                            <span ref={cartIconRef} className="relative inline-flex p-2">
                                <Link href="/cart" className="text-white hover:text-[#D4A54A] transition">
                                    <ShoppingCartIcon className="w-6 h-6" />
                                    <motion.span animate={{ scale: totalItems > 0 ? 1.2 : 1 }}
                                        className="absolute -top-1 -right-1 bg-[#D4A54A] text-[#0F5C45] text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center">
                                        {totalItems}
                                    </motion.span>
                                </Link>
                            </span>

                            {/* USER ICON — ALWAYS shows username (or "Sign in") */}
                            <div className="relative" ref={userRef}>
                                <button onClick={handleUserClick}
                                    className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-white/15 transition text-white">
                                    <UserIcon className="w-6 h-6" />
                                    <span className="text-xs sm:text-sm font-semibold whitespace-nowrap max-w-[80px] truncate">
                                        {userLabel}
                                    </span>
                                    <ChevronDownIcon className="w-4 h-4 hidden md:inline" />
                                </button>

                                {/* DESKTOP dropdown — hidden on mobile */}
                                <AnimatePresence>
                                    {userOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                            className={`${desktopDropdownClass} hidden md:block`}
                                        >
                                            {userLinks}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    {/* MOBILE STRIP */}
                    <div className="md:hidden border-t border-white/10 bg-[#0F5C45]">
                        <div className="grid grid-cols-4 divide-x divide-white/10">
                            <button onClick={toggleLanguage}
                                className="flex items-center justify-center gap-1 px-1 py-2 text-[11px] font-bold text-white hover:bg-white/15">
                                <GlobeAltIcon className="w-4 h-4" />
                                <span className="truncate">{(i18n.language || '').startsWith('ar') ? 'EN' : 'عربي'}</span>
                            </button>
                            <Link href="/help"
                                className="flex items-center justify-center gap-1 px-1 py-2 text-[11px] font-bold text-white hover:bg-white/15">
                                <LifebuoyIcon className="w-4 h-4" />
                                <span className="truncate">{t('support')}</span>
                            </Link>
                            <span className="flex items-center justify-center gap-1 px-1 py-2 text-[11px] font-bold text-white">
                                <CurrencyDollarIcon className="w-4 h-4" />
                                <span className="truncate">{t('currency')}</span>
                            </span>
                            <Link href="/tracking"
                                className="flex items-center justify-center gap-1 px-1 py-2 text-[11px] font-bold text-white hover:bg-white/15">
                                <TruckIcon className="w-4 h-4" />
                                <span className="truncate">{t('trackOrder')}</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* MOBILE USER BOTTOM SHEET — slides up from bottom, always inside screen */}
            <AnimatePresence>
                {mobileUserOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 z-[9998] md:hidden"
                            onClick={closeUser} />
                        <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-[9999] md:hidden max-h-[80vh] overflow-y-auto">
                            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
                                <div>
                                    <p className="text-xs text-gray-500">{user ? (isRTL ? 'مرحباً بعودتك' : 'Welcome back') : (isRTL ? 'مرحباً' : 'Welcome')}</p>
                                    <h3 className="text-lg font-bold text-gray-900">{user?.username || (isRTL ? 'تسجيل الدخول / حساب جديد' : 'Sign in / Register')}</h3>
                                </div>
                                <button onClick={closeUser} className="p-1 hover:bg-gray-100 rounded-lg">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-2">{userLinks}</div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <UnifiedMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
        </>
    );
};

export default Navbar;