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
} from '@heroicons/react/24/outline';

const Navbar = () => {
    const { t, i18n } = useTranslation('common');
    const { user, isLoading, logout } = useAuth();
    const { totalItems } = useCart();
    const { totalFavorites } = useWishlist();
    const { cartIconRef } = useCartIconRef();

    const [menuOpen, setMenuOpen] = useState(false);
    const [userOpen, setUserOpen] = useState(false);
    const userRef = useRef(null);

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

    const closeUser = () => setUserOpen(false);
    const isAr = (i18n.language || '').startsWith('ar');

    const topLinkClass = "flex items-center gap-2 px-3 py-2 rounded-lg font-bold text-[15px] text-white hover:text-[#D4A54A] hover:bg-white/15 transition whitespace-nowrap drop-shadow-sm";

    if (typeof window === 'undefined' || isLoading) {
        return <div className="bg-surface shadow-md py-4 text-center text-text-muted animate-pulse">Loading...</div>;
    }

    const userLinks = (
        <>
            {!user ? (
                <>
                    <Link href="/auth/login" className="block px-5 py-3 hover:bg-[#0F5C45]/10 text-sm font-medium" onClick={closeUser}>
                        🔑 {isAr ? 'تسجيل الدخول' : 'Sign In'}
                    </Link>
                    <Link href="/auth/register" className="block px-5 py-3 hover:bg-[#0F5C45]/10 text-sm font-medium border-t border-gray-100" onClick={closeUser}>
                        ✨ {isAr ? 'إنشاء حساب جديد' : 'Create New Account'}
                    </Link>
                </>
            ) : (
                <>
                    <Link href="/cart" className="block px-5 py-3 hover:bg-[#0F5C45]/10 text-sm" onClick={closeUser}>🛒 {t('cart')}</Link>
                    <Link href="/orders" className="block px-5 py-3 hover:bg-[#0F5C45]/10 text-sm" onClick={closeUser}>📋 {t('orders')}</Link>
                    <Link href="/suggest" className="block px-5 py-3 hover:bg-[#0F5C45]/10 text-sm" onClick={closeUser}>💡 {isAr ? 'اقترح منتج' : 'Suggest Product'}</Link>
                    <Link href="/chat" className="block px-5 py-3 hover:bg-[#0F5C45]/10 text-sm" onClick={closeUser}>💬 {isAr ? 'المحادثة' : 'Chat'}</Link>
                    <Link href="/profile" className="block px-5 py-3 hover:bg-[#0F5C45]/10 text-sm" onClick={closeUser}>👤 {t('profile')}</Link>

                    {(user.role === 'Vendor' || user.role === 'Admin') && (
                        <Link href="/vendor/dashboard" className="block px-5 py-3 hover:bg-[#0F5C45]/10 text-sm" onClick={closeUser}>📊 {t('dashboard')}</Link>
                    )}
                    {(user.role === 'Vendor' || user.role === 'Admin' || user.role === 'Employee') && (
                        <Link href="/admin/orders" className="block px-5 py-3 hover:bg-[#0F5C45]/10 text-sm" onClick={closeUser}>📦 {isAr ? 'إدارة الطلبات' : 'Manage Orders'}</Link>
                    )}
                    {user.role === 'Admin' && (
                        <>
                            <div className="border-t border-gray-100 my-1" />
                                <Link href="/admin" className="block px-5 py-3 hover:bg-red-50 text-sm font-bold text-red-600" onClick={closeUser}>⚙️ {isAr ? 'لوحة الإدارة' : 'Admin Panel'}</Link>
                            <Link href="/admin/users" className="block px-5 py-3 hover:bg-[#0F5C45]/10 text-sm" onClick={closeUser}>👥 {t('users')}</Link>
                            <Link href="/admin/products" className="block px-5 py-3 hover:bg-[#0F5C45]/10 text-sm" onClick={closeUser}>📦 {isAr ? 'المنتجات' : 'Products'}</Link>
                            <Link href="/admin/pages" className="block px-5 py-3 hover:bg-[#0F5C45]/10 text-sm" onClick={closeUser}>📄 {isAr ? 'الصفحات' : 'Pages'}</Link>
                            <Link href="/admin/stores" className="block px-5 py-3 hover:bg-[#0F5C45]/10 text-sm" onClick={closeUser}>🏪 {isAr ? 'المتاجر' : 'Stores'}</Link>
                            <Link href="/admin/golden-links" className="block px-5 py-3 hover:bg-[#0F5C45]/10 text-sm" onClick={closeUser}>🔗 Golden Links</Link>
                        </>
                    )}

                    <div className="border-t border-gray-100 my-1" />
                    <button onClick={() => { closeUser(); logout(); }}
                        className="block w-full text-right px-5 py-3 text-red-600 hover:bg-red-50 text-sm font-semibold">
                        🚪 {t('logout')}
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

                        {/* LEFT — hamburger + logo + username */}
                        <div className="flex items-center gap-3 flex-shrink-0">
                            <button onClick={() => setMenuOpen(true)}
                                className="p-2 rounded-lg hover:bg-white/15 transition text-white" aria-label="Open menu">
                                <Bars3Icon className="w-7 h-7 sm:w-8 sm:h-8" />
                            </button>
                            <Logo />

                            {/* ✅ Username shown right after the logo */}
                            {user && (
                                <span className="hidden sm:inline-flex items-center gap-1 text-white text-sm font-semibold px-2 py-1 rounded-lg bg-white/10 border border-white/20">
                                    <UserIcon className="w-4 h-4" />
                                    {user.username}
                                </span>
                            )}
                        </div>

                        {/* RIGHT */}
                        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">

                            {/* Language (desktop) */}
                            <button onClick={toggleLanguage} className={`${topLinkClass} hidden md:flex`}>
                                <GlobeAltIcon className="w-5 h-5" />
                                <span>{isAr ? 'English' : 'العربية'}</span>
                            </button>

                            {/* Support (desktop) */}
                            <Link href="/help" className={`${topLinkClass} hidden md:flex`}>
                                <LifebuoyIcon className="w-5 h-5" />
                                <span>{t('support')}</span>
                            </Link>

                            {/* Currency (desktop) */}
                            <span className={`${topLinkClass} hidden md:flex`}>
                                <CurrencyDollarIcon className="w-5 h-5" />
                                <span>{t('currency')}</span>
                            </span>

                            {/* Track (desktop) */}
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
                                    <span className="absolute -top-1 -right-1 bg-[#D4A54A] text-[#0F5C45] text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center">
                                        {totalItems}
                                    </span>
                                </Link>
                            </span>

                            {/* User icon — opens user panel */}
                            <div className="relative" ref={userRef}>
                                <button
                                    onClick={() => setUserOpen(!userOpen)}
                                    className="flex items-center gap-1 p-2 rounded-lg hover:bg-white/15 transition text-white"
                                >
                                    <UserIcon className="w-6 h-6" />
                                    <ChevronDownIcon className={`w-4 h-4 transition-transform ${userOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {userOpen && (
                                    <>
                                        {/* Mobile backdrop */}
                                        <div
                                            className="fixed inset-0 bg-black/50 z-[9998] md:hidden"
                                            onClick={closeUser}
                                        />
                                        {/* Panel — opens directly under the user icon on all screens */}
                                        <div
                                            className={[
                                                'absolute top-full mt-2 z-[9999]',
                                                isAr ? 'left-0' : 'right-0',
                                                'w-64 max-w-[90vw] bg-white rounded-xl shadow-2xl',
                                                'max-h-[80vh] overflow-y-auto',
                                            ].join(' ')}
                                        >
                                            <div>{userLinks}</div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Mobile strip */}
                    <div className="md:hidden border-t border-white/10 bg-[#0F5C45]">
                        <div className="grid grid-cols-4 divide-x divide-white/10">
                            <button onClick={toggleLanguage}
                                className="flex items-center justify-center gap-1 px-1 py-2 text-[11px] font-bold text-white hover:bg-white/15">
                                <GlobeAltIcon className="w-4 h-4" />
                                <span className="truncate">{isAr ? 'EN' : 'عربي'}</span>
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

            <UnifiedMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
        </>
    );
};

export default Navbar;