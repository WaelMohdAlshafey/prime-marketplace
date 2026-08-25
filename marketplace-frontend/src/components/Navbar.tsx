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
// TOP BAR – all items with text labels
// ============================================================
const TopBar = () => {
    const { t, i18n } = useTranslation('common');
    const [supportOpen, setSupportOpen] = useState(false);
    const [currencyOpen, setCurrencyOpen] = useState(false);
    const supportRef = useRef<HTMLDivElement>(null);
    const currencyRef = useRef<HTMLDivElement>(null);

    // Language toggle – simple click, no dropdown
    const toggleLanguage = () => {
        const nextLang = i18n.language === 'ar' ? 'en' : 'ar';
        i18n.changeLanguage(nextLang);
    };

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (supportRef.current && !supportRef.current.contains(event.target as Node)) setSupportOpen(false);
            if (currencyRef.current && !currencyRef.current.contains(event.target as Node)) setCurrencyOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="bg-primary-dark text-white text-[10px] md:text-xs py-1 relative z-50">
            <div className="container mx-auto px-2 md:px-4 flex items-center justify-between gap-1 md:gap-3 flex-nowrap overflow-x-auto">
                {/* LEFT SIDE (end of bar) – Language toggle + free shipping */}
                <div className="flex items-center gap-1 md:gap-3 flex-shrink-0 whitespace-nowrap">
                    <button
                        onClick={toggleLanguage}
                        className="flex items-center gap-0.5 md:gap-1 hover:text-yellow-400 transition px-1 md:px-2 py-0.5 rounded-md hover:bg-white/10"
                    >
                        <GlobeAltIcon className="w-3 h-3 md:w-3.5 md:h-3.5" />
                        <span>{i18n.language === 'ar' ? 'العربية' : 'English'}</span>
                    </button>
                    <span className="text-white/30 hidden xs:inline">|</span>
                    <span className="hidden xs:inline">🚚 {t('freeShipping')}</span>
                </div>

                {/* RIGHT SIDE (start of bar) – Support, Currency, Track Order with labels */}
                <div className="flex items-center gap-1 md:gap-3 flex-shrink-0">
                    {/* Support Dropdown – click only */}
                    <div className="relative" ref={supportRef}>
                        <button
                            onClick={() => setSupportOpen(!supportOpen)}
                            className="flex items-center gap-0.5 md:gap-1 hover:text-yellow-400 transition px-1 md:px-2 py-0.5 rounded-md hover:bg-white/10 whitespace-nowrap"
                        >
                            <LifebuoyIcon className="w-3 h-3 md:w-3.5 md:h-3.5" />
                            <span className="hidden xs:inline">{t('support')}</span>
                            <ChevronDownIcon className="w-2.5 h-2.5 md:w-3 md:h-3" />
                        </button>
                        <AnimatePresence>
                            {supportOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute right-0 top-full mt-1 bg-white text-gray-800 rounded-lg shadow-lg py-1 w-36 md:w-40 z-50"
                                >
                                    <Link href="/help" className="block w-full text-right px-3 md:px-4 py-1.5 md:py-2 hover:bg-gray-100 transition text-xs md:text-sm" onClick={() => setSupportOpen(false)}>
                                        {t('help')}
                                    </Link>
                                    <Link href="/faq" className="block w-full text-right px-3 md:px-4 py-1.5 md:py-2 hover:bg-gray-100 transition text-xs md:text-sm" onClick={() => setSupportOpen(false)}>
                                        {t('footer.faq')}
                                    </Link>
                                    <Link href="/returns" className="block w-full text-right px-3 md:px-4 py-1.5 md:py-2 hover:bg-gray-100 transition text-xs md:text-sm" onClick={() => setSupportOpen(false)}>
                                        {t('footer.returns')}
                                    </Link>
                                    <Link href="/shipping" className="block w-full text-right px-3 md:px-4 py-1.5 md:py-2 hover:bg-gray-100 transition text-xs md:text-sm" onClick={() => setSupportOpen(false)}>
                                        {t('footer.shipping')}
                                    </Link>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <span className="text-white/30 hidden xs:inline">|</span>

                    {/* Currency Dropdown – click only */}
                    <div className="relative" ref={currencyRef}>
                        <button
                            onClick={() => setCurrencyOpen(!currencyOpen)}
                            className="flex items-center gap-0.5 md:gap-1 hover:text-yellow-400 transition px-1 md:px-2 py-0.5 rounded-md hover:bg-white/10 whitespace-nowrap"
                        >
                            <CurrencyDollarIcon className="w-3 h-3 md:w-3.5 md:h-3.5" />
                            <span className="hidden xs:inline">{t('currency')}</span>
                            <ChevronDownIcon className="w-2.5 h-2.5 md:w-3 md:h-3" />
                        </button>
                        <AnimatePresence>
                            {currencyOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute right-0 top-full mt-1 bg-white text-gray-800 rounded-lg shadow-lg py-1 w-24 md:w-32 z-50"
                                >
                                    <button className="block w-full text-right px-3 md:px-4 py-1.5 md:py-2 hover:bg-gray-100 transition text-xs md:text-sm">
                                        EGP
                                    </button>
                                    <button className="block w-full text-right px-3 md:px-4 py-1.5 md:py-2 hover:bg-gray-100 transition text-xs md:text-sm">
                                        USD
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <span className="text-white/30 hidden xs:inline">|</span>

                    {/* Track Order – simple link with label */}
                    <Link href="/tracking" className="flex items-center gap-0.5 md:gap-1 hover:text-yellow-400 transition px-1 md:px-2 py-0.5 rounded-md hover:bg-white/10 whitespace-nowrap">
                        <TruckIcon className="w-3 h-3 md:w-3.5 md:h-3.5" />
                        <span className="hidden xs:inline">{t('trackOrder')}</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

// ============================================================
// MAIN HEADER – Logo right, hamburger (no label) for main menu
// ============================================================
const MainHeader = ({ user }: { user: AuthResponse | null }) => {
    const { t, i18n } = useTranslation('common');
    const { totalItems } = useCart();
    const { totalFavorites } = useWishlist();
    const { cartIconRef } = useCartIconRef();
    const [mainMenuOpen, setMainMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const { logout } = useAuth();
    const mainMenuRef = useRef<HTMLDivElement>(null);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const [categories, setCategories] = useState<string[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(true);

    // Fetch categories for the main menu
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/api/Categories');
                setCategories(response.data);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            } finally {
                setLoadingCategories(false);
            }
        };
        fetchCategories();
    }, []);

    // Close menus on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (mainMenuRef.current && !mainMenuRef.current.contains(event.target as Node)) setMainMenuOpen(false);
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) setUserMenuOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const isRTL = typeof document !== 'undefined' && document.documentElement.dir === 'rtl';

    // Main navigation links – include categories as separate items
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

    return (
        <div className="navbar">
            <div className="container mx-auto px-2 md:px-4 flex items-center justify-between gap-2 md:gap-4 py-2">
                {/* LEFT SIDE (end of bar) – Wishlist, Cart, User menu */}
                <div className="flex items-center gap-1.5 md:gap-3 flex-shrink-0">
                    {/* Wishlist */}
                    <motion.button whileHover={{ scale: 1.1 }} className="text-navbar-text hover:text-navbar-hover transition relative hidden sm:block">
                        <HeartIcon className="w-5 h-5 md:w-6 md:h-6" />
                        <span className="absolute -top-1.5 -right-1.5 bg-secondary text-white text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center">
                            {totalFavorites}
                        </span>
                    </motion.button>

                    {/* Cart */}
                    <span ref={cartIconRef} className="relative inline-flex">
                        <Link href="/cart" className="text-navbar-text hover:text-navbar-hover transition">
                            <ShoppingCartIcon className="w-5 h-5 md:w-6 md:h-6" />
                            <motion.span
                                animate={{ scale: totalItems > 0 ? 1.2 : 1 }}
                                className="absolute -top-1.5 -right-1.5 bg-secondary text-white text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center"
                            >
                                {totalItems}
                            </motion.span>
                        </Link>
                    </span>

                    {/* User menu – click only */}
                    <div className="relative" ref={userMenuRef} onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setUserMenuOpen(!userMenuOpen)}
                            className="flex items-center gap-0.5 md:gap-1 p-1.5 md:p-2 rounded-md hover:bg-primary-dark/10 transition text-navbar-text"
                            aria-label="User menu"
                        >
                            {user ? (
                                <>
                                    <span className="hidden sm:inline text-xs md:text-sm font-medium">{user.username}</span>
                                    <UserIcon className="w-5 h-5 md:w-6 md:h-6" />
                                </>
                            ) : (
                                <UserIcon className="w-5 h-5 md:w-6 md:h-6" />
                            )}
                            <ChevronDownIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        </button>

                        <AnimatePresence>
                            {userMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className={`absolute ${isRTL ? 'left-0' : 'right-0'} top-full mt-2 w-56 max-w-[calc(100vw-2rem)] max-h-[80vh] overflow-y-auto bg-white rounded-xl shadow-strong border border-border py-2 z-[999]`}
                                >
                                    {!user ? (
                                        <>
                                            <Link href="/auth/login" className="block px-4 py-2.5 text-text hover:bg-primary-dark/10 transition" onClick={() => setUserMenuOpen(false)}>
                                                {t('loginTitle')}
                                            </Link>
                                            <Link href="/auth/register" className="block px-4 py-2.5 text-text hover:bg-primary-dark/10 transition" onClick={() => setUserMenuOpen(false)}>
                                                {t('registerTitle')}
                                            </Link>
                                        </>
                                    ) : (
                                        <>
                                            <Link href="/cart" className="block px-4 py-2.5 text-text hover:bg-primary-dark/10 transition" onClick={() => setUserMenuOpen(false)}>
                                                🛒 {t('cart')}
                                            </Link>
                                            <Link href="/orders" className="block px-4 py-2.5 text-text hover:bg-primary-dark/10 transition" onClick={() => setUserMenuOpen(false)}>
                                                📋 {t('orders')}
                                            </Link>
                                            <Link href="/suggest" className="block px-4 py-2.5 text-text hover:bg-primary-dark/10 transition" onClick={() => setUserMenuOpen(false)}>
                                                💡 Suggest
                                            </Link>
                                            {(user.role === 'Vendor' || user.role === 'Admin') && (
                                                <Link href="/vendor/dashboard" className="block px-4 py-2.5 text-text hover:bg-primary-dark/10 transition" onClick={() => setUserMenuOpen(false)}>
                                                    📊 {t('dashboard')}
                                                </Link>
                                            )}
                                            {(user.role === 'Vendor' || user.role === 'Admin' || user.role === 'Employee') && (
                                                <Link href="/admin/orders" className="block px-4 py-2.5 text-text hover:bg-primary-dark/10 transition" onClick={() => setUserMenuOpen(false)}>
                                                    📦 Manage Orders
                                                </Link>
                                            )}
                                            {user.role === 'Admin' && (
                                                <>
                                                    <Link href="/admin/users" className="block px-4 py-2.5 text-text hover:bg-primary-dark/10 transition" onClick={() => setUserMenuOpen(false)}>
                                                        👥 {t('users')}
                                                    </Link>
                                                    <Link href="/admin" className="block px-4 py-2.5 text-text hover:bg-primary-dark/10 transition" onClick={() => setUserMenuOpen(false)}>
                                                        ⚙️ {t('admin')}
                                                    </Link>
                                                    <Link href="/admin/golden-links" className="block px-4 py-2.5 text-text hover:bg-primary-dark/10 transition" onClick={() => setUserMenuOpen(false)}>
                                                        🔗 Golden Links
                                                    </Link>
                                                </>
                                            )}
                                            <Link href="/chat" className="block px-4 py-2.5 text-text hover:bg-primary-dark/10 transition" onClick={() => setUserMenuOpen(false)}>
                                                💬 Chat
                                            </Link>
                                            <Link href="/profile" className="block px-4 py-2.5 text-text hover:bg-primary-dark/10 transition" onClick={() => setUserMenuOpen(false)}>
                                                👤 {t('profile')}
                                            </Link>
                                            <hr className="my-2 border-border" />
                                            <button
                                                onClick={() => { logout(); setUserMenuOpen(false); }}
                                                className="block w-full text-right px-4 py-2.5 text-red-600 hover:bg-red-50 transition"
                                            >
                                                {t('logout')}
                                            </button>
                                        </>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* RIGHT SIDE (start of bar) – Hamburger (no label) + Logo */}
                <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
                    {/* Main menu – hamburger icon only (no text) */}
                    <div className="relative" ref={mainMenuRef} onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setMainMenuOpen(!mainMenuOpen)}
                            className="p-1.5 md:p-2 rounded-md hover:bg-primary-dark/10 transition text-navbar-text"
                            aria-label="Main menu"
                        >
                            <Bars3Icon className="w-5 h-5 md:w-6 md:h-6" />
                        </button>
                        <AnimatePresence>
                            {mainMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className={`absolute ${isRTL ? 'right-0' : 'left-0'} top-full mt-2 w-56 max-w-[calc(100vw-2rem)] max-h-[80vh] overflow-y-auto bg-white rounded-xl shadow-strong border border-border py-2 z-[999]`}
                                >
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className="block px-4 py-2.5 text-text hover:bg-primary-dark/10 transition"
                                            onClick={() => setMainMenuOpen(false)}
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                    {/* Separator and extra links if needed */}
                                    {loadingCategories && (
                                        <span className="block px-4 py-2 text-text-muted text-sm">جاري التحميل...</span>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Logo */}
                    <Logo />
                </div>
            </div>
        </div>
    );
};

// ============================================================
// MAIN EXPORT
// ============================================================
export default function Navbar() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <div className="bg-surface shadow-md py-4 text-center text-text-muted animate-pulse">Loading...</div>;
    }

    return (
        <header className="fixed top-0 left-0 right-0 z-[1000] bg-white shadow-sm">
            <TopBar />
            <MainHeader user={user} />
        </header>
    );
}