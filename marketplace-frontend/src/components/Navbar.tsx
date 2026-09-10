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
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';

const Navbar = () => {
    const { t, i18n } = useTranslation('common');
    const { user, isLoading, logout } = useAuth();
    const { totalItems } = useCart();
    const { totalFavorites } = useWishlist();
    const { cartIconRef } = useCartIconRef();

    const [menuOpen, setMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [supportOpen, setSupportOpen] = useState(false);
    const [currencyOpen, setCurrencyOpen] = useState(false);

    const userMenuRef = useRef(null);
    const supportRef = useRef(null);
    const currencyRef = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
            if (supportRef.current && !supportRef.current.contains(e.target)) setSupportOpen(false);
            if (currencyRef.current && !currencyRef.current.contains(e.target)) setCurrencyOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const toggleLanguage = () => {
        i18n.changeLanguage(i18n.language === 'ar' ? 'en' : 'ar');
    };

    const isRTL = typeof document !== 'undefined' && document.documentElement.dir === 'rtl';

    const dropdownClasses = `absolute top-full mt-1 bg-white text-gray-800 rounded-lg shadow-lg py-1 z-[9999] min-w-[120px] max-w-[calc(100vw-2rem)] ${isRTL ? 'right-1/2 translate-x-1/2' : 'left-1/2 -translate-x-1/2'}`;

    // ✅ Clear, readable top-bar link style
    const topLinkClass = "flex items-center gap-1.5 hover:text-primary transition px-2 py-1 rounded hover:bg-primary/10 text-sm font-medium whitespace-nowrap";

    if (typeof window === 'undefined' || isLoading) {
        return <div className="bg-surface shadow-md py-4 text-center text-text-muted animate-pulse">Loading...</div>;
    }

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-[1000] bg-white shadow-sm">
                <div className="navbar border-b border-border">
                    <div className="container mx-auto px-3 sm:px-4 flex items-center justify-between gap-2 py-2">

                        {/* ============================================
                            LEFT SIDE — Hamburger + Logo
                            ============================================ */}
                        <div className="flex items-center gap-2 flex-shrink-0">

                            {/* ✅ Hamburger — MOVED BEFORE the logo */}
                            <button
                                onClick={() => setMenuOpen(true)}
                                className="p-2 rounded-lg hover:bg-primary/10 transition text-navbar-text"
                                aria-label="Open menu"
                            >
                                <Bars3Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                            </button>

                            {/* Logo — after hamburger */}
                            <Logo />
                        </div>

                        {/* ============================================
                            RIGHT SIDE — Language, Support, Currency, Track, Cart, User
                            ============================================ */}
                        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">

                            {/* Language */}
                            <button
                                onClick={toggleLanguage}
                                className={topLinkClass}
                            >
                                <GlobeAltIcon className="w-5 h-5" />
                                <span className="hidden sm:inline">
                                    {i18n.language === 'ar' ? 'العربية' : 'English'}
                                </span>
                            </button>

                            <span className="text-gray-200 hidden md:inline">|</span>

                            {/* Support */}
                            <div className="relative hidden md:block" ref={supportRef}>
                                <button
                                    onClick={() => setSupportOpen(!supportOpen)}
                                    className={topLinkClass}
                                >
                                    <LifebuoyIcon className="w-5 h-5" />
                                    <span>{t('support')}</span>
                                    <ChevronDownIcon className="w-3.5 h-3.5" />
                                </button>
                                <AnimatePresence>
                                    {supportOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className={dropdownClasses}
                                        >
                                            <Link href="/help" className="block px-4 py-2 hover:bg-gray-100 text-sm" onClick={() => setSupportOpen(false)}>{t('help')}</Link>
                                            <Link href="/faq" className="block px-4 py-2 hover:bg-gray-100 text-sm" onClick={() => setSupportOpen(false)}>{t('footer.faq')}</Link>
                                            <Link href="/returns" className="block px-4 py-2 hover:bg-gray-100 text-sm" onClick={() => setSupportOpen(false)}>{t('footer.returns')}</Link>
                                            <Link href="/shipping" className="block px-4 py-2 hover:bg-gray-100 text-sm" onClick={() => setSupportOpen(false)}>{t('footer.shipping')}</Link>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <span className="text-gray-200 hidden md:inline">|</span>

                            {/* Currency */}
                            <div className="relative hidden md:block" ref={currencyRef}>
                                <button
                                    onClick={() => setCurrencyOpen(!currencyOpen)}
                                    className={topLinkClass}
                                >
                                    <CurrencyDollarIcon className="w-5 h-5" />
                                    <span>{t('currency')}</span>
                                    <ChevronDownIcon className="w-3.5 h-3.5" />
                                </button>
                                <AnimatePresence>
                                    {currencyOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className={`${dropdownClasses} min-w-[100px]`}
                                        >
                                            <button className="block w-full text-right px-4 py-2 hover:bg-gray-100 text-sm">EGP</button>
                                            <button className="block w-full text-right px-4 py-2 hover:bg-gray-100 text-sm">USD</button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <span className="text-gray-200 hidden lg:inline">|</span>

                            {/* Track Order */}
                            <Link href="/tracking" className={`${topLinkClass} hidden lg:flex`}>
                                <TruckIcon className="w-5 h-5" />
                                <span>{t('trackOrder')}</span>
                            </Link>

                            {/* Wishlist */}
                            <button className="text-navbar-text hover:text-primary transition relative p-2">
                                <HeartIcon className="w-6 h-6" />
                                <span className="absolute top-0.5 right-0.5 bg-secondary text-white text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center">
                                    {totalFavorites}
                                </span>
                            </button>

                            {/* Cart */}
                            <span ref={cartIconRef} className="relative inline-flex p-2">
                                <Link href="/cart" className="text-navbar-text hover:text-primary transition">
                                    <ShoppingCartIcon className="w-6 h-6" />
                                    <motion.span
                                        animate={{ scale: totalItems > 0 ? 1.2 : 1 }}
                                        className="absolute -top-0.5 -right-0.5 bg-secondary text-white text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center">
                                        {totalItems}
                                    </motion.span>
                                </Link>
                            </span>

                            {/* User Menu */}
                            <div className="relative" ref={userMenuRef} onClick={(e) => e.stopPropagation()}>
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center gap-1 p-2 rounded-lg hover:bg-primary/10 transition text-navbar-text"
                                >
                                    {user && (
                                        <span className="text-sm font-medium truncate max-w-[80px] hidden sm:inline">
                                            {user.username}
                                        </span>
                                    )}
                                    <UserIcon className="w-6 h-6" />
                                    <ChevronDownIcon className="w-3.5 h-3.5" />
                                </button>

                                <AnimatePresence>
                                    {userMenuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className={`${dropdownClasses} min-w-[180px] max-h-[80vh] overflow-y-auto`}
                                        >
                                            {!user ? (
                                                <>
                                                    <Link href="/auth/login" className="block px-4 py-2 text-sm hover:bg-primary/10" onClick={() => setUserMenuOpen(false)}>{t('loginTitle')}</Link>
                                                    <Link href="/auth/register" className="block px-4 py-2 text-sm hover:bg-primary/10" onClick={() => setUserMenuOpen(false)}>{t('registerTitle')}</Link>
                                                </>
                                            ) : (
                                                <>
                                                    <Link href="/cart" className="block px-4 py-2 text-sm hover:bg-primary/10" onClick={() => setUserMenuOpen(false)}>🛒 {t('cart')}</Link>
                                                    <Link href="/orders" className="block px-4 py-2 text-sm hover:bg-primary/10" onClick={() => setUserMenuOpen(false)}>📋 {t('orders')}</Link>
                                                    <Link href="/suggest" className="block px-4 py-2 text-sm hover:bg-primary/10" onClick={() => setUserMenuOpen(false)}>💡 Suggest</Link>
                                                    {(user.role === 'Vendor' || user.role === 'Admin') && (
                                                        <Link href="/vendor/dashboard" className="block px-4 py-2 text-sm hover:bg-primary/10" onClick={() => setUserMenuOpen(false)}>📊 {t('dashboard')}</Link>
                                                    )}
                                                    {(user.role === 'Vendor' || user.role === 'Admin' || user.role === 'Employee') && (
                                                        <Link href="/admin/orders" className="block px-4 py-2 text-sm hover:bg-primary/10" onClick={() => setUserMenuOpen(false)}>📦 Manage Orders</Link>
                                                    )}
                                                    {user.role === 'Admin' && (
                                                        <>
                                                            <Link href="/admin/users" className="block px-4 py-2 text-sm hover:bg-primary/10" onClick={() => setUserMenuOpen(false)}>👥 {t('users')}</Link>
                                                            <Link href="/admin/products" className="block px-4 py-2 text-sm hover:bg-primary/10" onClick={() => setUserMenuOpen(false)}>📦 Products</Link>
                                                            <Link href="/admin/pages" className="block px-4 py-2 text-sm hover:bg-primary/10" onClick={() => setUserMenuOpen(false)}>📄 Pages</Link>
                                                            <Link href="/admin/stores" className="block px-4 py-2 text-sm hover:bg-primary/10" onClick={() => setUserMenuOpen(false)}>🏪 Stores</Link>
                                                            <Link href="/admin" className="block px-4 py-2 text-sm hover:bg-primary/10" onClick={() => setUserMenuOpen(false)}>⚙️ {t('admin')}</Link>
                                                            <Link href="/admin/golden-links" className="block px-4 py-2 text-sm hover:bg-primary/10" onClick={() => setUserMenuOpen(false)}>🔗 Golden Links</Link>
                                                        </>
                                                    )}
                                                    <Link href="/chat" className="block px-4 py-2 text-sm hover:bg-primary/10" onClick={() => setUserMenuOpen(false)}>💬 Chat</Link>
                                                    <Link href="/profile" className="block px-4 py-2 text-sm hover:bg-primary/10" onClick={() => setUserMenuOpen(false)}>👤 {t('profile')}</Link>
                                                    <hr className="my-1 border-border" />
                                                    <button onClick={() => { logout(); setUserMenuOpen(false); }}
                                                        className="block w-full text-right px-4 py-2 text-red-600 hover:bg-red-50 text-sm">
                                                        {t('logout')}
                                                    </button>
                                                </>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Unified sliding menu */}
            <UnifiedMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
        </>
    );
};

export default Navbar;