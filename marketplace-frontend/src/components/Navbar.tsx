'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useTranslation } from 'react-i18next';
import { useCartIconRef } from '@/context/CartIconRefContext';
import Logo from './Logo';
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
import { AuthResponse } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';

// ============================================================
// SINGLE HEADER – ONE BAR with ALL menus
// ============================================================
const Navbar = () => {
    const { t, i18n } = useTranslation('common');
    const { user, isLoading, logout } = useAuth();
    const { totalItems } = useCart();
    const { totalFavorites } = useWishlist();
    const { cartIconRef } = useCartIconRef();

    const [mainMenuOpen, setMainMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [supportOpen, setSupportOpen] = useState(false);
    const [currencyOpen, setCurrencyOpen] = useState(false);

    const mainMenuRef = useRef<HTMLDivElement>(null);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const supportRef = useRef<HTMLDivElement>(null);
    const currencyRef = useRef<HTMLDivElement>(null);

    const [categories, setCategories] = useState<string[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(true);

    useEffect(() => {
        api.get('/api/Categories')
            .then((res) => {
                setCategories(res.data);
                setLoadingCategories(false);
            })
            .catch(() => setLoadingCategories(false));
    }, []);

    // Close dropdowns on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (mainMenuRef.current && !mainMenuRef.current.contains(e.target as Node)) setMainMenuOpen(false);
            if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
            if (supportRef.current && !supportRef.current.contains(e.target as Node)) setSupportOpen(false);
            if (currencyRef.current && !currencyRef.current.contains(e.target as Node)) setCurrencyOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const toggleLanguage = () => {
        i18n.changeLanguage(i18n.language === 'ar' ? 'en' : 'ar');
    };

    const isRTL = typeof document !== 'undefined' && document.documentElement.dir === 'rtl';

    // ✅ Highest z-index – dropdowns open ON TOP of everything
    const dropdownClasses = `absolute top-full mt-1 bg-white text-gray-800 rounded-lg shadow-lg py-1 z-[9999] min-w-[120px] max-w-[calc(100vw-2rem)] ${isRTL ? 'right-1/2 translate-x-1/2' : 'left-1/2 -translate-x-1/2'
        }`;

    const navLinks = [
        { href: '/', label: t('home') },
        { href: '/products', label: t('products') },
        ...categories.map((cat) => ({
            href: `/${cat.toLowerCase().replace(/\s+/g, '-')}`,
            label: cat,
        })),
        { href: '/stores', label: t('stores') },
        { href: '/offers', label: t('offers') },
        { href: '/contact', label: t('contact') },
        { href: '/help', label: t('help') },
    ];

    if (typeof window === 'undefined' || isLoading) {
        return <div className="bg-surface shadow-md py-4 text-center text-text-muted animate-pulse">Loading...</div>;
    }

    return (
        <header className="fixed top-0 left-0 right-0 z-[1000] bg-white shadow-sm">
            <div className="navbar border-b border-border">
                <div className="container mx-auto px-2 sm:px-4 flex items-center justify-between gap-1 sm:gap-2 py-1.5 sm:py-2">

                    {/* ============================================
                        LEFT SIDE – Hamburger + ALL Menus
                        ============================================ */}
                    <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 flex-wrap">

                        {/* 1. Language */}
                        <button
                            onClick={toggleLanguage}
                            className="flex items-center gap-0.5 sm:gap-1 hover:text-primary transition px-1 py-0.5 rounded hover:bg-primary/10 text-[10px] sm:text-xs whitespace-nowrap"
                        >
                            <GlobeAltIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            <span>{i18n.language === 'ar' ? 'العربية' : 'English'}</span>
                        </button>

                        <span className="text-gray-300 hidden xs:inline">|</span>

                        {/* 2. Support Dropdown */}
                        <div className="relative" ref={supportRef}>
                            <button
                                onClick={() => setSupportOpen(!supportOpen)}
                                className="flex items-center gap-0.5 sm:gap-1 hover:text-primary transition px-1 py-0.5 rounded hover:bg-primary/10 text-[10px] sm:text-xs whitespace-nowrap"
                            >
                                <LifebuoyIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                <span className="hidden xs:inline">{t('support')}</span>
                                <ChevronDownIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                            </button>
                            <AnimatePresence>
                                {supportOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className={dropdownClasses}
                                    >
                                        <Link href="/help" className="block w-full text-right px-3 py-1.5 hover:bg-gray-100 text-xs" onClick={() => setSupportOpen(false)}>
                                            {t('help')}
                                        </Link>
                                        <Link href="/faq" className="block w-full text-right px-3 py-1.5 hover:bg-gray-100 text-xs" onClick={() => setSupportOpen(false)}>
                                            {t('footer.faq')}
                                        </Link>
                                        <Link href="/returns" className="block w-full text-right px-3 py-1.5 hover:bg-gray-100 text-xs" onClick={() => setSupportOpen(false)}>
                                            {t('footer.returns')}
                                        </Link>
                                        <Link href="/shipping" className="block w-full text-right px-3 py-1.5 hover:bg-gray-100 text-xs" onClick={() => setSupportOpen(false)}>
                                            {t('footer.shipping')}
                                        </Link>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <span className="text-gray-300 hidden xs:inline">|</span>

                        {/* 3. Currency Dropdown */}
                        <div className="relative" ref={currencyRef}>
                            <button
                                onClick={() => setCurrencyOpen(!currencyOpen)}
                                className="flex items-center gap-0.5 sm:gap-1 hover:text-primary transition px-1 py-0.5 rounded hover:bg-primary/10 text-[10px] sm:text-xs whitespace-nowrap"
                            >
                                <CurrencyDollarIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                <span className="hidden xs:inline">{t('currency')}</span>
                                <ChevronDownIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                            </button>
                            <AnimatePresence>
                                {currencyOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className={`${dropdownClasses} min-w-[80px]`}
                                    >
                                        <button className="block w-full text-right px-3 py-1.5 hover:bg-gray-100 text-xs">EGP</button>
                                        <button className="block w-full text-right px-3 py-1.5 hover:bg-gray-100 text-xs">USD</button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <span className="text-gray-300 hidden xs:inline">|</span>

                        {/* 4. Track Order */}
                        <Link
                            href="/tracking"
                            className="flex items-center gap-0.5 sm:gap-1 hover:text-primary transition px-1 py-0.5 rounded hover:bg-primary/10 text-[10px] sm:text-xs whitespace-nowrap"
                        >
                            <TruckIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            <span className="hidden xs:inline">{t('trackOrder')}</span>
                        </Link>

                        <span className="text-gray-300 hidden xs:inline">|</span>

                        {/* 5. Free Shipping (icon only on mobile, text on desktop) */}
                        <span className="text-[10px] sm:text-xs text-gray-500 hidden sm:inline">🚚 {t('freeShipping')}</span>
                    </div>

                    {/* ============================================
                        RIGHT SIDE – Logo + Wishlist + Cart + User
                        ============================================ */}
                    <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">

                        {/* Hamburger Menu */}
                        <div className="relative" ref={mainMenuRef} onClick={(e) => e.stopPropagation()}>
                            <button
                                onClick={() => setMainMenuOpen(!mainMenuOpen)}
                                className="p-1 sm:p-1.5 rounded hover:bg-primary/10 transition text-navbar-text"
                            >
                                <Bars3Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                            </button>
                            <AnimatePresence>
                                {mainMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className={`${dropdownClasses} min-w-[160px] max-h-[80vh] overflow-y-auto`}
                                    >
                                        {navLinks.map((link) => (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                className="block px-4 py-2 text-text hover:bg-primary/10 transition text-sm"
                                                onClick={() => setMainMenuOpen(false)}
                                            >
                                                {link.label}
                                            </Link>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Wishlist */}
                        <button className="text-navbar-text hover:text-primary transition relative">
                            <HeartIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                            <span className="absolute -top-1.5 -right-1.5 bg-secondary text-white text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center">
                                {totalFavorites}
                            </span>
                        </button>

                        {/* Cart */}
                        <span ref={cartIconRef} className="relative inline-flex">
                            <Link href="/cart" className="text-navbar-text hover:text-primary transition">
                                <ShoppingCartIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                                <motion.span
                                    animate={{ scale: totalItems > 0 ? 1.2 : 1 }}
                                    className="absolute -top-1.5 -right-1.5 bg-secondary text-white text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center"
                                >
                                    {totalItems}
                                </motion.span>
                            </Link>
                        </span>

                        {/* User Menu */}
                        <div className="relative" ref={userMenuRef} onClick={(e) => e.stopPropagation()}>
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="flex items-center gap-0.5 sm:gap-1 p-1 sm:p-1.5 rounded hover:bg-primary/10 transition text-navbar-text"
                            >
                                {user ? (
                                    <>
                                        <span className="text-[10px] sm:text-sm font-medium truncate max-w-[50px] sm:max-w-none">
                                            {user.username}
                                        </span>
                                        <UserIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                                    </>
                                ) : (
                                    <UserIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                                )}
                                <ChevronDownIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            </button>

                            <AnimatePresence>
                                {userMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className={`${dropdownClasses} min-w-[160px] max-h-[80vh] overflow-y-auto`}
                                    >
                                        {!user ? (
                                            <>
                                                <Link href="/auth/login" className="block px-4 py-2 text-text hover:bg-primary/10 transition text-sm" onClick={() => setUserMenuOpen(false)}>
                                                    {t('loginTitle')}
                                                </Link>
                                                <Link href="/auth/register" className="block px-4 py-2 text-text hover:bg-primary/10 transition text-sm" onClick={() => setUserMenuOpen(false)}>
                                                    {t('registerTitle')}
                                                </Link>
                                            </>
                                        ) : (
                                            <>
                                                <Link href="/cart" className="block px-4 py-2 text-text hover:bg-primary/10 transition text-sm" onClick={() => setUserMenuOpen(false)}>
                                                    🛒 {t('cart')}
                                                </Link>
                                                <Link href="/orders" className="block px-4 py-2 text-text hover:bg-primary/10 transition text-sm" onClick={() => setUserMenuOpen(false)}>
                                                    📋 {t('orders')}
                                                </Link>
                                                <Link href="/suggest" className="block px-4 py-2 text-text hover:bg-primary/10 transition text-sm" onClick={() => setUserMenuOpen(false)}>
                                                    💡 Suggest
                                                </Link>
                                                {(user.role === 'Vendor' || user.role === 'Admin') && (
                                                    <Link href="/vendor/dashboard" className="block px-4 py-2 text-text hover:bg-primary/10 transition text-sm" onClick={() => setUserMenuOpen(false)}>
                                                        📊 {t('dashboard')}
                                                    </Link>
                                                )}
                                                {(user.role === 'Vendor' || user.role === 'Admin' || user.role === 'Employee') && (
                                                    <Link href="/admin/orders" className="block px-4 py-2 text-text hover:bg-primary/10 transition text-sm" onClick={() => setUserMenuOpen(false)}>
                                                        📦 Manage Orders
                                                    </Link>
                                                )}
                                                {user.role === 'Admin' && (
                                                    <>
                                                        <Link href="/admin/users" className="block px-4 py-2 text-text hover:bg-primary/10 transition text-sm" onClick={() => setUserMenuOpen(false)}>
                                                            👥 {t('users')}
                                                        </Link>
                                                        <Link href="/admin" className="block px-4 py-2 text-text hover:bg-primary/10 transition text-sm" onClick={() => setUserMenuOpen(false)}>
                                                            ⚙️ {t('admin')}
                                                        </Link>
                                                        <Link href="/admin/golden-links" className="block px-4 py-2 text-text hover:bg-primary/10 transition text-sm" onClick={() => setUserMenuOpen(false)}>
                                                            🔗 Golden Links
                                                        </Link>
                                                    </>
                                                )}
                                                <Link href="/chat" className="block px-4 py-2 text-text hover:bg-primary/10 transition text-sm" onClick={() => setUserMenuOpen(false)}>
                                                    💬 Chat
                                                </Link>
                                                <Link href="/profile" className="block px-4 py-2 text-text hover:bg-primary/10 transition text-sm" onClick={() => setUserMenuOpen(false)}>
                                                    👤 {t('profile')}
                                                </Link>
                                                <hr className="my-1 border-border" />
                                                <button
                                                    onClick={() => { logout(); setUserMenuOpen(false); }}
                                                    className="block w-full text-right px-4 py-2 text-red-600 hover:bg-red-50 transition text-sm"
                                                >
                                                    {t('logout')}
                                                </button>
                                            </>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Logo */}
                        <div className="flex-shrink-0 ml-1 sm:ml-2">
                            <Logo />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;