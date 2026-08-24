'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
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
    XMarkIcon,
    UserPlusIcon,
    Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import { AuthResponse } from '@/types';
import { motion } from 'framer-motion';
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

    return (
        <div className={`bg-navbar-bg border-b border-navbar-border sticky top-0 z-50 ${isScrolled ? 'shadow-md' : ''}`}>
            <div className="container mx-auto px-4 flex items-center gap-4 py-2">
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

                <div className="flex items-center gap-4 flex-shrink-0">
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

                    {user && user.role === 'Admin' && (
                        <Link href="/admin" className="text-navbar-text hover:text-navbar-hover transition">
                            <Cog6ToothIcon className="w-6 h-6" />
                        </Link>
                    )}

                    {user ? (
                        <div className="hidden sm:flex items-center gap-2 text-text">
                            <span className="font-medium">{user.username}</span>
                            <UserIcon className="w-5 h-5" />
                        </div>
                    ) : (
                        <>
                            <Link href="/auth/register" className="text-sm font-medium text-navbar-text hover:text-navbar-hover transition flex items-center gap-1">
                                <UserPlusIcon className="w-5 h-5" />
                                <span className="hidden sm:inline">{t('registerTitle')}</span>
                            </Link>
                            <Link href="/auth/login" className="hidden sm:block text-navbar-text hover:text-navbar-hover transition">
                                <UserIcon className="w-6 h-6" />
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

// ============================================================
// NAV MENU
// ============================================================
const NavMenu = ({ categories, loading, user, logout }: { categories: string[]; loading: boolean; user: AuthResponse | null; logout: () => void }) => {
    const { t } = useTranslation('common');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="bg-surface border-b border-border shadow-sm">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between gap-6 py-2.5">
                    <div className="flex items-center gap-6 overflow-x-auto whitespace-nowrap text-sm scrollbar-hide">
                        <Link href="/" className="text-navbar-text font-semibold hover:text-navbar-hover transition border-b-2 border-primary pb-1">
                            {t('home')}
                        </Link>
                        {loading ? (
                            <span className="text-text-muted">Loading categories…</span>
                        ) : (
                            categories.map((cat) => (
                                <Link key={cat} href={`/${cat}`} className="text-text-muted hover:text-navbar-hover transition pb-1">
                                    {cat.replace(/-/g, ' ')}
                                </Link>
                            ))
                        )}
                        <Link href="/stores" className="text-text-muted hover:text-navbar-hover transition pb-1">
                            {t('stores')}
                        </Link>
                        <Link href="/offers" className="text-secondary font-medium hover:text-secondary-dark transition pb-1">
                            🔥 {t('offers')}
                        </Link>
                        <Link href="/contact" className="text-text-muted hover:text-navbar-hover transition pb-1">
                            {t('contact')}
                        </Link>
                    </div>

                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="lg:hidden p-1 rounded-md hover:bg-background transition"
                    >
                        {mobileMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
                    </button>
                </div>

                {mobileMenuOpen && (
                    <div className="lg:hidden py-3 space-y-2 text-right border-t border-border">
                        <Link href="/" className="block text-text hover:text-navbar-hover transition py-1" onClick={() => setMobileMenuOpen(false)}>
                            {t('home')}
                        </Link>
                        {categories.map((cat) => (
                            <Link key={cat} href={`/${cat}`} className="block text-text hover:text-navbar-hover transition py-1" onClick={() => setMobileMenuOpen(false)}>
                                {cat.replace(/-/g, ' ')}
                            </Link>
                        ))}
                        <Link href="/stores" className="block text-text hover:text-navbar-hover transition py-1" onClick={() => setMobileMenuOpen(false)}>
                            {t('stores')}
                        </Link>
                        <Link href="/offers" className="block text-secondary hover:text-secondary-dark transition py-1" onClick={() => setMobileMenuOpen(false)}>
                            🔥 {t('offers')}
                        </Link>
                        <Link href="/contact" className="block text-text hover:text-navbar-hover transition py-1" onClick={() => setMobileMenuOpen(false)}>
                            {t('contact')}
                        </Link>
                        {!loading && !user && (
                            <>
                                <Link href="/auth/register" className="block text-primary font-medium hover:underline transition py-1" onClick={() => setMobileMenuOpen(false)}>
                                    {t('registerTitle')}
                                </Link>
                                <Link href="/auth/login" className="block text-primary font-medium hover:underline transition py-1" onClick={() => setMobileMenuOpen(false)}>
                                    {t('loginTitle')}
                                </Link>
                            </>
                        )}
                        {user && (
                            <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="block w-full text-right text-red-500 hover:text-red-700 transition py-1">
                                {t('logout')}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

// ============================================================
// USER NAV
// ============================================================
const UserNav = ({ user, logout }: { user: AuthResponse; logout: () => void }) => {
    const { t } = useTranslation('common');
    const isVendor = user.role === 'Vendor' || user.role === 'Admin';
    const isAdmin = user.role === 'Admin';

    return (
        <div className="bg-footer-bg text-footer-text text-sm py-2">
            <div className="container mx-auto px-4 flex flex-wrap justify-between items-center gap-2">
                <div className="flex flex-wrap items-center gap-4">
                    <Link href="/cart" className="hover:text-white transition flex items-center gap-2 text-xs md:text-sm">
                        <ShoppingCartIcon className="w-4 h-4" /> {t('cart')}
                    </Link>
                    <Link href="/orders" className="hover:text-white transition flex items-center gap-2 text-xs md:text-sm">
                        📋 {t('orders')}
                    </Link>
                    <Link href="/suggest" className="hover:text-white transition flex items-center gap-2 text-xs md:text-sm">
                        💡 Suggest
                    </Link>
                    {isVendor && (
                        <>
                            <Link href="/vendor/dashboard" className="hover:text-white transition flex items-center gap-2 text-xs md:text-sm">
                                📊 {t('dashboard')}
                            </Link>
                            <Link href="/admin/orders" className="hover:text-white transition flex items-center gap-2 text-xs md:text-sm">
                                📦 Manage Orders
                            </Link>
                        </>
                    )}
                    {isAdmin && (
                        <>
                            <Link href="/admin/users" className="hover:text-white transition flex items-center gap-2 text-xs md:text-sm">
                                👥 {t('users')}
                            </Link>
                            <Link href="/admin" className="hover:text-white transition flex items-center gap-2 text-xs md:text-sm">
                                ⚙️ {t('admin')}
                            </Link>
                            <Link href="/admin/golden-links" className="hover:text-white transition flex items-center gap-2 text-xs md:text-sm">
                                🔗 Golden Links
                            </Link>
                        </>
                    )}
                    <Link href="/chat" className="hover:text-white transition flex items-center gap-2 text-xs md:text-sm">
                        💬 Chat
                    </Link>
                    <Link href="/profile" className="hover:text-white transition flex items-center gap-2 text-xs md:text-sm">
                        👤 {t('profile')}
                    </Link>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs text-footer-text/70">{t('welcome')}، {user.username}</span>
                    <button onClick={logout} className="text-xs bg-white/10 px-3 py-1 rounded-pill hover:bg-white/20 transition">
                        {t('logout')}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ============================================================
// MAIN EXPORT
// ============================================================
export default function Navbar() {
    const { user, logout, isLoading } = useAuth();
    const { t } = useTranslation('common');
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
        return <div className="bg-surface shadow-md py-4 text-center text-text-muted animate-pulse">{t('loading')}</div>;
    }

    return (
        <header className="sticky top-0 z-50">
            <TopBar />
            <MainHeader user={user} />
            <NavMenu categories={categories} loading={loadingCategories} user={user} logout={logout} />
            {user && <UserNav user={user} logout={logout} />}
        </header>
    );
}