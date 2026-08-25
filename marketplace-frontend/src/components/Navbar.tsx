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
} from '@heroicons/react/24/outline';
import { AuthResponse } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';

// ============================================================
// TOP BAR – All items in ONE LINE, no wrap
// ============================================================
const TopBar = () => {
    const { t, i18n } = useTranslation('common');
    const [langOpen, setLangOpen] = useState(false);
    const [supportOpen, setSupportOpen] = useState(false);
    const [currencyOpen, setCurrencyOpen] = useState(false);
    const langRef = useRef<HTMLDivElement>(null);
    const supportRef = useRef<HTMLDivElement>(null);
    const currencyRef = useRef<HTMLDivElement>(null);

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (langRef.current && !langRef.current.contains(event.target as Node)) setLangOpen(false);
            if (supportRef.current && !supportRef.current.contains(event.target as Node)) setSupportOpen(false);
            if (currencyRef.current && !currencyRef.current.contains(event.target as Node)) setCurrencyOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        setLangOpen(false);
    };

    return (
        <div className="bg-primary-dark text-white text-[10px] md:text-xs py-1 relative z-50">
            <div className="container mx-auto px-2 md:px-4 flex items-center justify-between gap-1 md:gap-3 flex-nowrap overflow-x-auto">
                {/* Left: free shipping + track order */}
                <div className="flex items-center gap-1 md:gap-3 flex-shrink-0 whitespace-nowrap">
                    <span className="hidden sm:inline">🚚</span>
                    <span className="hidden xs:inline">{t('freeShipping')}</span>
                    <span className="text-white/30 hidden xs:inline">|</span>
                    <Link href="/tracking" className="hover:opacity-70 transition whitespace-nowrap">
                        {t('trackOrder')}
                    </Link>
                </div>

                {/* Right: three dropdown menus in one line */}
                <div className="flex items-center gap-1 md:gap-3 flex-shrink-0">
                    {/* Language Dropdown */}
                    <div className="relative" ref={langRef}>
                        <button
                            onClick={() => setLangOpen(!langOpen)}
                            onMouseEnter={() => setLangOpen(true)}
                            className="flex items-center gap-0.5 md:gap-1 hover:text-yellow-400 transition px-1 md:px-2 py-0.5 rounded-md hover:bg-white/10 whitespace-nowrap"
                        >
                            <GlobeAltIcon className="w-3 h-3 md:w-3.5 md:h-3.5" />
                            <span className="hidden xs:inline">{i18n.language === 'ar' ? 'العربية' : 'English'}</span>
                            <ChevronDownIcon className="w-2.5 h-2.5 md:w-3 md:h-3" />
                        </button>
                        <AnimatePresence>
                            {langOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute right-0 top-full mt-1 bg-white text-gray-800 rounded-lg shadow-lg py-1 w-28 md:w-32 z-50"
                                >
                                    <button onClick={() => toggleLanguage('ar')} className="block w-full text-right px-3 md:px-4 py-1.5 md:py-2 hover:bg-gray-100 transition text-xs md:text-sm">
                                        العربية
                                    </button>
                                    <button onClick={() => toggleLanguage('en')} className="block w-full text-right px-3 md:px-4 py-1.5 md:py-2 hover:bg-gray-100 transition text-xs md:text-sm">
                                        English
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <span className="text-white/30 hidden xs:inline">|</span>

                    {/* Support Dropdown */}
                    <div className="relative" ref={supportRef}>
                        <button
                            onClick={() => setSupportOpen(!supportOpen)}
                            onMouseEnter={() => setSupportOpen(true)}
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

                    {/* Currency Dropdown */}
                    <div className="relative" ref={currencyRef}>
                        <button
                            onClick={() => setCurrencyOpen(!currencyOpen)}
                            onMouseEnter={() => setCurrencyOpen(true)}
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
                </div>
            </div>
        </div>
    );
};

// ============================================================
// MAIN HEADER – No search bar
// ============================================================
const MainHeader = ({ user }: { user: AuthResponse | null }) => {
    const { t } = useTranslation('common');
    const { totalItems } = useCart();
    const { totalFavorites } = useWishlist();
    const { cartIconRef } = useCartIconRef();
    const [leftMenuOpen, setLeftMenuOpen] = useState(false);
    const [rightMenuOpen, setRightMenuOpen] = useState(false);
    const { logout } = useAuth();
    const [categories, setCategories] = useState<string[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(true);

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
        const closeMenus = () => { setLeftMenuOpen(false); setRightMenuOpen(false); };
        window.addEventListener('click', closeMenus);
        return () => window.removeEventListener('click', closeMenus);
    }, []);

    const isRTL = typeof document !== 'undefined' && document.documentElement.dir === 'rtl';

    const getCategorySlug = (cat: string) => cat.toLowerCase().replace(/\s+/g, '-');

    return (
        <div className="navbar">
            <div className="container mx-auto px-2 md:px-4 flex items-center justify-between gap-2 md:gap-4 py-2">
                {/* Left hamburger menu */}
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                    <button
                        onClick={() => setLeftMenuOpen(!leftMenuOpen)}
                        className="p-1.5 md:p-2 rounded-md hover:bg-primary-dark/10 transition text-navbar-text"
                        aria-label="Main menu"
                    >
                        <Bars3Icon className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                    <AnimatePresence>
                        {leftMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className={`absolute ${isRTL ? 'right-0' : 'left-0'} top-full mt-2 w-64 max-w-[calc(100vw-2rem)] max-h-[80vh] overflow-y-auto bg-white rounded-xl shadow-strong border border-border py-2 z-[999]`}
                            >
                                <Link href="/" className="block px-4 py-2.5 text-text hover:bg-primary-dark/10 transition" onClick={() => setLeftMenuOpen(false)}>
                                    {t('home')}
                                </Link>

                                {loadingCategories ? (
                                    <span className="block px-4 py-2 text-text-muted text-sm">جاري التحميل...</span>
                                ) : (
                                    categories.map((cat) => {
                                        const slug = getCategorySlug(cat);
                                        return (
                                            <Link
                                                key={cat}
                                                href={`/${slug}`}
                                                className="block px-4 py-2.5 text-text hover:bg-primary-dark/10 transition"
                                                onClick={() => setLeftMenuOpen(false)}
                                            >
                                                {cat}
                                            </Link>
                                        );
                                    })
                                )}

                                <Link href="/stores" className="block px-4 py-2.5 text-text hover:bg-primary-dark/10 transition" onClick={() => setLeftMenuOpen(false)}>
                                    {t('stores')}
                                </Link>
                                <Link href="/offers" className="block px-4 py-2.5 text-text hover:bg-primary-dark/10 transition" onClick={() => setLeftMenuOpen(false)}>
                                    🔥 {t('offers')}
                                </Link>
                                <Link href="/contact" className="block px-4 py-2.5 text-text hover:bg-primary-dark/10 transition" onClick={() => setLeftMenuOpen(false)}>
                                    {t('contact')}
                                </Link>
                                <Link href="/help" className="block px-4 py-2.5 text-text hover:bg-primary-dark/10 transition" onClick={() => setLeftMenuOpen(false)}>
                                    📘 {t('help')}
                                </Link>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <Logo />

                {/* Right icons: wishlist, cart, user menu */}
                <div className="flex items-center gap-1.5 md:gap-3 flex-shrink-0">
                    <motion.button whileHover={{ scale: 1.1 }} className="text-navbar-text hover:text-navbar-hover transition relative hidden sm:block">
                        <HeartIcon className="w-5 h-5 md:w-6 md:h-6" />
                        <span className="absolute -top-1.5 -right-1.5 bg-secondary text-white text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center">
                            {totalFavorites}
                        </span>
                    </motion.button>

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

                    {/* User menu */}
                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setRightMenuOpen(!rightMenuOpen)}
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
                            {rightMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className={`absolute ${isRTL ? 'left-0' : 'right-0'} top-full mt-2 w-56 max-w-[calc(100vw-2rem)] max-h-[80vh] overflow-y-auto bg-white rounded-xl shadow-strong border border-border py-2 z-[999]`}
                                >
                                    {!user ? (
                                        <>
                                            <Link href="/auth/login" className="block px-4 py-2.5 text-text hover:bg-primary-dark/10 transition" onClick={() => setRightMenuOpen(false)}>
                                                {t('loginTitle')}
                                            </Link>
                                            <Link href="/auth/register" className="block px-4 py-2.5 text-text hover:bg-primary-dark/10 transition" onClick={() => setRightMenuOpen(false)}>
                                                {t('registerTitle')}
                                            </Link>
                                        </>
                                    ) : (
                                        <>
                                            <Link href="/cart" className="block px-4 py-2.5 text-text hover:bg-primary-dark/10 transition" onClick={() => setRightMenuOpen(false)}>
                                                🛒 {t('cart')}
                                            </Link>
                                            <Link href="/orders" className="block px-4 py-2.5 text-text hover:bg-primary-dark/10 transition" onClick={() => setRightMenuOpen(false)}>
                                                📋 {t('orders')}
                                            </Link>
                                            <Link href="/suggest" className="block px-4 py-2.5 text-text hover:bg-primary-dark/10 transition" onClick={() => setRightMenuOpen(false)}>
                                                💡 Suggest
                                            </Link>
                                            {(user.role === 'Vendor' || user.role === 'Admin') && (
                                                <Link href="/vendor/dashboard" className="block px-4 py-2.5 text-text hover:bg-primary-dark/10 transition" onClick={() => setRightMenuOpen(false)}>
                                                    📊 {t('dashboard')}
                                                </Link>
                                            )}
                                            {(user.role === 'Vendor' || user.role === 'Admin' || user.role === 'Employee') && (
                                                <Link href="/admin/orders" className="block px-4 py-2.5 text-text hover:bg-primary-dark/10 transition" onClick={() => setRightMenuOpen(false)}>
                                                    📦 Manage Orders
                                                </Link>
                                            )}
                                            {user.role === 'Admin' && (
                                                <>
                                                    <Link href="/admin/users" className="block px-4 py-2.5 text-text hover:bg-primary-dark/10 transition" onClick={() => setRightMenuOpen(false)}>
                                                        👥 {t('users')}
                                                    </Link>
                                                    <Link href="/admin" className="block px-4 py-2.5 text-text hover:bg-primary-dark/10 transition" onClick={() => setRightMenuOpen(false)}>
                                                        ⚙️ {t('admin')}
                                                    </Link>
                                                    <Link href="/admin/golden-links" className="block px-4 py-2.5 text-text hover:bg-primary-dark/10 transition" onClick={() => setRightMenuOpen(false)}>
                                                        🔗 Golden Links
                                                    </Link>
                                                </>
                                            )}
                                            <Link href="/chat" className="block px-4 py-2.5 text-text hover:bg-primary-dark/10 transition" onClick={() => setRightMenuOpen(false)}>
                                                💬 Chat
                                            </Link>
                                            <Link href="/profile" className="block px-4 py-2.5 text-text hover:bg-primary-dark/10 transition" onClick={() => setRightMenuOpen(false)}>
                                                👤 {t('profile')}
                                            </Link>
                                            <hr className="my-2 border-border" />
                                            <button
                                                onClick={() => { logout(); setRightMenuOpen(false); }}
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