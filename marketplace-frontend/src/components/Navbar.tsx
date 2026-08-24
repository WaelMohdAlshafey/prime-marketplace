// marketplace-frontend/components/Navbar.tsx

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
        <div className="top-bar">
            <div className="container mx-auto px-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <span>🚚 {t('freeShipping')}</span>
                    <span className="text-white/30">|</span>
                    <Link href="/tracking" className="hover:opacity-70">
                        {t('trackOrder')}
                    </Link>
                </div>
                <div className="flex items-center gap-3">
                    <LanguageSwitcher />
                    <span className="text-white/30">|</span>
                    <button className="hover:opacity-70">
                        <CurrencyDollarIcon className="w-4 h-4 inline" /> {t('currency')}
                    </button>
                    <span className="text-white/30">|</span>
                    <button className="hover:opacity-70">{t('support')}</button>
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
        <div className={`navbar ${isScrolled ? 'shadow-md' : ''}`}>
            <div className="container mx-auto px-4 flex items-center gap-4 py-2">
                <Logo />

                <form onSubmit={handleSearch} className="search-bar">
                    <input
                        type="text"
                        placeholder={t('searchPlaceholder')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button type="submit" className="search-btn">
                        <MagnifyingGlassIcon className="w-4 h-4" />
                        <span>{t('search')}</span>
                    </button>
                </form>

                <div className="nav-icons">
                    <motion.button whileHover={{ scale: 1.1 }} className="icon-link hidden sm:block">
                        <HeartIcon className="w-6 h-6" />
                        <span className="badge">{totalFavorites}</span>
                    </motion.button>

                    <Link href="/cart" ref={(el) => { cartIconRef.current = el as HTMLElement; }} className="icon-link">
                        <ShoppingCartIcon className="w-6 h-6" />
                        <motion.span
                            animate={{ scale: totalItems > 0 ? 1.2 : 1 }}
                            className="badge"
                        >
                            {totalItems}
                        </motion.span>
                    </Link>

                    {user && user.role === 'Admin' && (
                        <Link href="/admin" className="icon-link">
                            <Cog6ToothIcon className="w-6 h-6" />
                        </Link>
                    )}

                    {user ? (
                        <div className="user-info hidden sm:flex">
                            <span className="font-medium">{user.username}</span>
                            <UserIcon className="w-5 h-5" />
                        </div>
                    ) : (
                        <>
                            <Link href="/auth/register" className="icon-link text-sm font-medium">
                                <UserPlusIcon className="w-5 h-5" />
                                <span className="hidden sm:inline">{t('registerTitle')}</span>
                            </Link>
                            <Link href="/auth/login" className="icon-link hidden sm:block">
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
        <div className="bg-white border-b border-gray-100 shadow-sm">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between gap-6 py-2.5">
                    <div className="flex items-center gap-6 overflow-x-auto whitespace-nowrap text-sm scrollbar-hide">
                        <Link href="/" className="text-[#2F5A6B] font-semibold hover:text-[#D27736] transition border-b-2 border-[#4E8C9E] pb-1">
                            {t('home')}
                        </Link>
                        {loading ? (
                            <span className="text-gray-400">Loading categories…</span>
                        ) : (
                            categories.map((cat) => (
                                <Link key={cat} href={`/${cat}`} className="text-gray-600 hover:text-[#D27736] transition pb-1">
                                    {cat.replace(/-/g, ' ')}
                                </Link>
                            ))
                        )}
                        <Link href="/stores" className="text-gray-600 hover:text-[#D27736] transition pb-1">
                            {t('stores')}
                        </Link>
                        <Link href="/offers" className="text-[#D27736] font-medium hover:text-[#B05E2A] transition pb-1">
                            🔥 {t('offers')}
                        </Link>
                        <Link href="/contact" className="text-gray-600 hover:text-[#D27736] transition pb-1">
                            {t('contact')}
                        </Link>
                    </div>

                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="lg:hidden p-1 rounded-md hover:bg-gray-100 transition"
                    >
                        {mobileMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
                    </button>
                </div>

                {mobileMenuOpen && (
                    <div className="lg:hidden py-3 space-y-2 text-right border-t border-gray-100">
                        <Link href="/" className="block text-gray-700 hover:text-[#D27736] transition py-1" onClick={() => setMobileMenuOpen(false)}>
                            {t('home')}
                        </Link>
                        {categories.map((cat) => (
                            <Link key={cat} href={`/${cat}`} className="block text-gray-700 hover:text-[#D27736] transition py-1" onClick={() => setMobileMenuOpen(false)}>
                                {cat.replace(/-/g, ' ')}
                            </Link>
                        ))}
                        <Link href="/stores" className="block text-gray-700 hover:text-[#D27736] transition py-1" onClick={() => setMobileMenuOpen(false)}>
                            {t('stores')}
                        </Link>
                        <Link href="/offers" className="block text-[#D27736] hover:text-[#B05E2A] transition py-1" onClick={() => setMobileMenuOpen(false)}>
                            🔥 {t('offers')}
                        </Link>
                        <Link href="/contact" className="block text-gray-700 hover:text-[#D27736] transition py-1" onClick={() => setMobileMenuOpen(false)}>
                            {t('contact')}
                        </Link>
                        {!loading && !user && (
                            <>
                                <Link href="/auth/register" className="block text-[#4E8C9E] font-medium hover:underline transition py-1" onClick={() => setMobileMenuOpen(false)}>
                                    {t('registerTitle')}
                                </Link>
                                <Link href="/auth/login" className="block text-[#4E8C9E] font-medium hover:underline transition py-1" onClick={() => setMobileMenuOpen(false)}>
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
        <div className="bg-[#2F5A6B] text-white text-sm py-2">
            <div className="container mx-auto px-4 flex flex-wrap justify-between items-center gap-2">
                <div className="flex flex-wrap items-center gap-4">
                    <Link href="/cart" className="hover:text-[#D27736] transition flex items-center gap-2 text-xs md:text-sm">
                        <ShoppingCartIcon className="w-4 h-4" /> {t('cart')}
                    </Link>
                    <Link href="/orders" className="hover:text-[#D27736] transition flex items-center gap-2 text-xs md:text-sm">
                        📋 {t('orders')}
                    </Link>
                    <Link href="/suggest" className="hover:text-[#D27736] transition flex items-center gap-2 text-xs md:text-sm">
                        💡 Suggest
                    </Link>
                    {isVendor && (
                        <>
                            <Link href="/vendor/dashboard" className="hover:text-[#D27736] transition flex items-center gap-2 text-xs md:text-sm">
                                📊 {t('dashboard')}
                            </Link>
                            <Link href="/admin/orders" className="hover:text-[#D27736] transition flex items-center gap-2 text-xs md:text-sm">
                                📦 Manage Orders
                            </Link>
                        </>
                    )}
                    {isAdmin && (
                        <>
                            <Link href="/admin/users" className="hover:text-[#D27736] transition flex items-center gap-2 text-xs md:text-sm">
                                👥 {t('users')}
                            </Link>
                            <Link href="/admin" className="hover:text-[#D27736] transition flex items-center gap-2 text-xs md:text-sm">
                                ⚙️ {t('admin')}
                            </Link>
                            <Link href="/admin/golden-links" className="hover:text-[#D27736] transition flex items-center gap-2 text-xs md:text-sm">
                                🔗 Golden Links
                            </Link>
                        </>
                    )}
                    <Link href="/chat" className="hover:text-[#D27736] transition flex items-center gap-2 text-xs md:text-sm">
                        💬 Chat
                    </Link>
                    <Link href="/profile" className="hover:text-[#D27736] transition flex items-center gap-2 text-xs md:text-sm">
                        👤 {t('profile')}
                    </Link>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs text-white/70">{t('welcome')}، {user.username}</span>
                    <button onClick={logout} className="text-xs bg-white/10 px-3 py-1 rounded-full hover:bg-white/20 transition">
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
        return <div className="bg-white shadow-md py-4 text-center text-gray-500 animate-pulse">{t('loading')}</div>;
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