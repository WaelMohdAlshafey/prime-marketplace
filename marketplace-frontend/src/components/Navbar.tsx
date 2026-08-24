'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useTranslation } from 'react-i18next';
import { useCartIconRef } from '@/context/CartIconRefContext';
import Logo from './Logo';
import LanguageSwitcher from './LanguageSwitcher';
import {
    ShoppingCartIcon,
    UserIcon,
    HeartIcon,
    MagnifyingGlassIcon,
    CurrencyDollarIcon,
    Bars3Icon,
    ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { AuthResponse } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';

// ============================================================
// TOP BAR
// ============================================================
const TopBar = () => {
    const { t } = useTranslation('common');
    return (
        <div className="bg-primary-dark text-white text-xs py-1.5">
            <div className="container mx-auto px-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <span>🚚 {t('freeShipping')}</span>
                    <span className="text-white/30">|</span>
                    <Link href="/tracking" className="hover:opacity-70 transition">
                        {t('trackOrder')}
                    </Link>
                </div>
                <div className="flex items-center gap-3">
                    <LanguageSwitcher />
                    <span className="text-white/30">|</span>
                    <button className="hover:opacity-70 transition">
                        <CurrencyDollarIcon className="w-4 h-4 inline" /> {t('currency')}
                    </button>
                    <span className="text-white/30">|</span>
                    <button className="hover:opacity-70 transition">{t('support')}</button>
                </div>
            </div>
        </div>
    );
};

// ============================================================
// MAIN HEADER
// ============================================================
const MainHeader = ({ user }: { user: AuthResponse | null }) => {
    const { t } = useTranslation('common');
    const [searchTerm, setSearchTerm] = useState('');
    const [isScrolled, setIsScrolled] = useState(false);
    const { totalItems } = useCart();
    const { totalFavorites } = useWishlist();
    const { cartIconRef } = useCartIconRef();
    const [leftMenuOpen, setLeftMenuOpen] = useState(false);
    const [rightMenuOpen, setRightMenuOpen] = useState(false);
    const { logout } = useAuth();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            window.location.href = `/?q=${encodeURIComponent(searchTerm.trim())}`;
        }
    };

    // Close menus on outside click
    useEffect(() => {
        const closeMenus = () => { setLeftMenuOpen(false); setRightMenuOpen(false); };
        window.addEventListener('click', closeMenus);
        return () => window.removeEventListener('click', closeMenus);
    }, []);

    return (
        <div className={`bg-navbar-bg border-b border-navbar-border sticky top-0 z-50 ${isScrolled ? 'shadow-md' : ''}`}>
            <div className="container mx-auto px-4 flex items-center gap-4 py-2">
                {/* Left hamburger menu */}
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                    <button
                        onClick={() => setLeftMenuOpen(!leftMenuOpen)}
                        className="p-2 rounded-md hover:bg-background transition text-navbar-text"
                        aria-label="Main menu"
                    >
                        <Bars3Icon className="w-6 h-6" />
                    </button>
                    <AnimatePresence>
                        {leftMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                // ✅ FIX: prevent overflow
                                className="absolute left-0 top-full mt-2 w-56 max-w-[calc(100vw-2rem)] max-h-[80vh] overflow-y-auto bg-surface rounded-xl shadow-strong border border-border py-2 z-50"
                            >
                                <Link href="/" className="block px-4 py-2 text-text hover:bg-background transition" onClick={() => setLeftMenuOpen(false)}>
                                    {t('home')}
                                </Link>
                                <Link href="/stores" className="block px-4 py-2 text-text hover:bg-background transition" onClick={() => setLeftMenuOpen(false)}>
                                    {t('stores')}
                                </Link>
                                <Link href="/offers" className="block px-4 py-2 text-text hover:bg-background transition" onClick={() => setLeftMenuOpen(false)}>
                                    🔥 {t('offers')}
                                </Link>
                                <Link href="/contact" className="block px-4 py-2 text-text hover:bg-background transition" onClick={() => setLeftMenuOpen(false)}>
                                    {t('contact')}
                                </Link>
                                <Link href="/help" className="block px-4 py-2 text-text hover:bg-background transition" onClick={() => setLeftMenuOpen(false)}>
                                    📘 {t('help')}
                                </Link>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <Logo />

                <form onSubmit={handleSearch} className="flex-1 flex items-center bg-background border border-border rounded-pill h-11 px-1 max-w-[600px] focus-within:border-primary focus-within:shadow-[0_0_0_3px_rgba(78,140,158,0.15)] transition">
                    <input
                        type="text"
                        placeholder={t('searchPlaceholder')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 border-none outline-none px-4 text-text bg-transparent placeholder-text-muted text-sm"
                    />
                    <button type="submit" className="bg-button-primary-bg hover:bg-button-primary-hover text-button-primary-text border-none rounded-pill px-6 h-9 font-semibold transition flex items-center gap-2 text-sm">
                        <MagnifyingGlassIcon className="w-4 h-4" />
                        <span>{t('search')}</span>
                    </button>
                </form>

                <div className="flex items-center gap-3 flex-shrink-0">
                    <motion.button whileHover={{ scale: 1.1 }} className="text-navbar-text hover:text-navbar-hover transition relative hidden sm:block">
                        <HeartIcon className="w-6 h-6" />
                        <span className="absolute -top-1.5 -right-1.5 bg-secondary text-white text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center">
                            {totalFavorites}
                        </span>
                    </motion.button>

                    <Link href="/cart" ref={(el) => { cartIconRef.current = el as HTMLElement; }} className="text-navbar-text hover:text-navbar-hover transition relative">
                        <ShoppingCartIcon className="w-6 h-6" />
                        <motion.span animate={{ scale: totalItems > 0 ? 1.2 : 1 }} className="absolute -top-1.5 -right-1.5 bg-secondary text-white text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center">
                            {totalItems}
                        </motion.span>
                    </Link>

                    {/* Right user menu - FIXED: added max-width & overflow */}
                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setRightMenuOpen(!rightMenuOpen)}
                            className="flex items-center gap-1 p-2 rounded-md hover:bg-background transition text-navbar-text"
                            aria-label="User menu"
                        >
                            {user ? (
                                <>
                                    <span className="hidden sm:inline text-sm font-medium">{user.username}</span>
                                    <UserIcon className="w-6 h-6" />
                                </>
                            ) : (
                                <UserIcon className="w-6 h-6" />
                            )}
                            <ChevronDownIcon className="w-4 h-4" />
                        </button>

                        <AnimatePresence>
                            {rightMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    // ✅ FIX: prevent overflow & keep within screen
                                    className="absolute right-0 top-full mt-2 w-56 max-w-[calc(100vw-2rem)] max-h-[80vh] overflow-y-auto bg-surface rounded-xl shadow-strong border border-border py-2 z-50"
                                >
                                    {!user ? (
                                        <>
                                            <Link href="/auth/login" className="block px-4 py-2 text-text hover:bg-background transition" onClick={() => setRightMenuOpen(false)}>
                                                {t('loginTitle')}
                                            </Link>
                                            <Link href="/auth/register" className="block px-4 py-2 text-text hover:bg-background transition" onClick={() => setRightMenuOpen(false)}>
                                                {t('registerTitle')}
                                            </Link>
                                        </>
                                    ) : (
                                        <>
                                            <Link href="/cart" className="block px-4 py-2 text-text hover:bg-background transition" onClick={() => setRightMenuOpen(false)}>
                                                🛒 {t('cart')}
                                            </Link>
                                            <Link href="/orders" className="block px-4 py-2 text-text hover:bg-background transition" onClick={() => setRightMenuOpen(false)}>
                                                📋 {t('orders')}
                                            </Link>
                                            <Link href="/suggest" className="block px-4 py-2 text-text hover:bg-background transition" onClick={() => setRightMenuOpen(false)}>
                                                💡 Suggest
                                            </Link>
                                            {(user.role === 'Vendor' || user.role === 'Admin') && (
                                                <Link href="/vendor/dashboard" className="block px-4 py-2 text-text hover:bg-background transition" onClick={() => setRightMenuOpen(false)}>
                                                    📊 {t('dashboard')}
                                                </Link>
                                            )}
                                            {(user.role === 'Vendor' || user.role === 'Admin' || user.role === 'Employee') && (
                                                <Link href="/admin/orders" className="block px-4 py-2 text-text hover:bg-background transition" onClick={() => setRightMenuOpen(false)}>
                                                    📦 Manage Orders
                                                </Link>
                                            )}
                                            {user.role === 'Admin' && (
                                                <>
                                                    <Link href="/admin/users" className="block px-4 py-2 text-text hover:bg-background transition" onClick={() => setRightMenuOpen(false)}>
                                                        👥 {t('users')}
                                                    </Link>
                                                    <Link href="/admin" className="block px-4 py-2 text-text hover:bg-background transition" onClick={() => setRightMenuOpen(false)}>
                                                        ⚙️ {t('admin')}
                                                    </Link>
                                                    <Link href="/admin/golden-links" className="block px-4 py-2 text-text hover:bg-background transition" onClick={() => setRightMenuOpen(false)}>
                                                        🔗 Golden Links
                                                    </Link>
                                                </>
                                            )}
                                            <Link href="/chat" className="block px-4 py-2 text-text hover:bg-background transition" onClick={() => setRightMenuOpen(false)}>
                                                💬 Chat
                                            </Link>
                                            <Link href="/profile" className="block px-4 py-2 text-text hover:bg-background transition" onClick={() => setRightMenuOpen(false)}>
                                                👤 {t('profile')}
                                            </Link>
                                            <hr className="my-2 border-border" />
                                            <button
                                                onClick={() => { logout(); setRightMenuOpen(false); }}
                                                className="block w-full text-right px-4 py-2 text-red-600 hover:bg-red-50 transition"
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

    if (isLoading) {
        return <div className="bg-surface shadow-md py-4 text-center text-text-muted animate-pulse">Loading...</div>;
    }

    return (
        <header className="sticky top-0 z-50">
            <TopBar />
            <MainHeader user={user} />
        </header>
    );
}