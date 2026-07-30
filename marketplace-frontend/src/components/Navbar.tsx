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
} from '@heroicons/react/24/outline';
import { AuthResponse } from '@/types';
import { motion } from 'framer-motion';
import api from '@/lib/api';

// ============================================================
// TOP BAR (unchanged)
// ============================================================
const TopBar = () => {
    const { t } = useTranslation('common');
    return (
        <div className="bg-gradient-to-r from-[#0F5C45] to-[#1A7A5C] text-white text-xs py-1.5 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')]"></div>
            <div className="container mx-auto px-4 flex justify-between items-center relative z-10">
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5">
                        <span className="text-yellow-400 animate-pulse">✦</span>
                        {t('freeShipping')}
                    </span>
                    <span className="text-white/30">|</span>
                    <Link href="/tracking" className="hover:text-yellow-300 transition duration-300">
                        {t('trackOrder')}
                    </Link>
                </div>
                <div className="flex items-center gap-3">
                    <LanguageSwitcher />
                    <button className="flex items-center gap-1 hover:text-yellow-300 transition duration-300">
                        <CurrencyDollarIcon className="w-3.5 h-3.5" />
                        {t('currency')}
                    </button>
                    <button className="hover:text-yellow-300 transition duration-300">
                        {t('support')}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ============================================================
// MAIN HEADER (unchanged)
// ============================================================
const MainHeader = ({ user }: { user: AuthResponse | null }) => {
    const { t } = useTranslation('common');
    const [searchTerm, setSearchTerm] = useState('');
    const [isScrolled, setIsScrolled] = useState(false);
    const { totalItems } = useCart();
    const { totalFavorites } = useWishlist();
    const { cartIconRef } = useCartIconRef();
    const [isAnimating, setIsAnimating] = useState(false);
    const prevTotalRef = useRef(totalItems);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (totalItems > prevTotalRef.current) {
            setIsAnimating(true);
            const timer = setTimeout(() => setIsAnimating(false), 300);
            return () => clearTimeout(timer);
        }
        prevTotalRef.current = totalItems;
    }, [totalItems]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            window.location.href = `/?q=${encodeURIComponent(searchTerm.trim())}`;
        }
    };

    return (
        <div
            className={`sticky top-0 z-40 transition-all duration-500 ${isScrolled
                ? 'bg-white/80 backdrop-blur-xl shadow-lg border-b border-white/20'
                : 'bg-white/60 backdrop-blur-md shadow-sm border-b border-gray-100/50'
                }`}
        >
            <div className="container mx-auto px-4 flex items-center gap-4 py-3">
                <Logo />

                <form onSubmit={handleSearch} className="flex-1 max-w-2xl relative group">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#0F5C45]/5 to-[#D4A54A]/5 opacity-0 group-hover:opacity-100 transition duration-500 blur-xl"></div>
                    <input
                        type="text"
                        placeholder={t('searchPlaceholder')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-5 py-3 pr-12 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0F5C45]/30 focus:border-[#0F5C45] transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-white text-right shadow-soft relative z-10"
                    />
                    <MagnifyingGlassIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-[#0F5C45] transition duration-300" />
                    <button
                        type="submit"
                        className="absolute left-1.5 top-1/2 -translate-y-1/2 bg-gradient-to-r from-[#0F5C45] to-[#1A7A5C] text-white px-5 py-1.5 rounded-xl text-sm font-medium hover:shadow-lg hover:scale-105 transition-all duration-300 shadow-soft"
                    >
                        {t('search')}
                    </button>
                </form>

                <div className="flex items-center gap-4 flex-shrink-0">
                    {/* FAVORITES */}
                    <motion.button
                        whileHover={{ scale: 1.15, rotate: -5 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-gray-600 hover:text-[#0F5C45] transition relative group"
                    >
                        <HeartIcon className="w-6 h-6 group-hover:fill-[#0F5C45]/10 transition" />
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1 -right-1 bg-gradient-to-r from-[#0F5C45] to-[#1A7A5C] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center shadow-md"
                        >
                            {totalFavorites}
                        </motion.span>
                    </motion.button>

                    {/* CART */}
                    <Link
                        href="/cart"
                        ref={(el) => { cartIconRef.current = el as HTMLElement; }}
                        className="text-gray-600 hover:text-[#0F5C45] transition relative group"
                    >
                        <motion.div
                            whileHover={{ scale: 1.15, rotate: 8 }}
                            whileTap={{ scale: 0.9 }}
                            className="relative"
                        >
                            <ShoppingCartIcon className="w-6 h-6 group-hover:fill-[#0F5C45]/10 transition" />
                            <motion.span
                                animate={{
                                    scale: isAnimating ? 1.5 : 1,
                                }}
                                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                                className={`absolute -top-1 -right-1 bg-gradient-to-r from-[#0F5C45] to-[#1A7A5C] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center shadow-md`}
                            >
                                {totalItems}
                            </motion.span>
                            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-900/90 text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap backdrop-blur-sm">
                                {totalItems} {totalItems === 1 ? 'item' : 'items'}
                            </span>
                        </motion.div>
                    </Link>

                    {user ? (
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center gap-2 bg-[#0F5C45]/5 px-3 py-1.5 rounded-full border border-[#0F5C45]/10"
                        >
                            <span className="text-sm text-gray-700 font-medium">{user.username}</span>
                            <UserIcon className="w-4 h-4 text-[#0F5C45]" />
                        </motion.div>
                    ) : (
                        <Link href="/auth/login" className="text-gray-600 hover:text-[#0F5C45] transition">
                            <UserIcon className="w-6 h-6 hover:scale-110 transition duration-300" />
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

// ============================================================
// NAV MENU – Dynamic, fetched from API
// ============================================================
const NavMenu = ({ categories, loading }: { categories: string[]; loading: boolean }) => {
    const { t } = useTranslation('common');

    return (
        <div className="bg-white/70 backdrop-blur-sm border-b border-gray-100/50 shadow-sm">
            <div className="container mx-auto px-4">
                <div className="flex items-center gap-6 py-2.5 overflow-x-auto whitespace-nowrap text-sm">
                    <Link
                        href="/"
                        className="text-[#0F5C45] font-semibold hover:text-[#0A4735] transition border-b-2 border-[#0F5C45] pb-1 relative group"
                    >
                        {t('home')}
                    </Link>
                    {loading ? (
                        <span className="text-gray-400">Loading categories…</span>
                    ) : (
                        categories.map((cat) => (
                            <Link
                                key={cat}
                                href={`/${cat}`}
                                className="text-gray-600 hover:text-[#0F5C45] transition pb-1 relative group"
                            >
                                <span>{cat.replace(/-/g, ' ')}</span>
                            </Link>
                        ))
                    )}
                    <Link
                        href="/stores"
                        className="text-gray-600 hover:text-[#0F5C45] transition pb-1 relative group"
                    >
                        {t('stores')}
                    </Link>
                    <Link
                        href="/offers"
                        className="text-orange-500 font-medium hover:text-orange-600 transition pb-1 relative group"
                    >
                        🔥 {t('offers')}
                    </Link>
                    <Link
                        href="/contact"
                        className="text-gray-600 hover:text-[#0F5C45] transition pb-1 relative group"
                    >
                        {t('contact')}
                    </Link>
                </div>
            </div>
        </div>
    );
};

// ============================================================
// USER NAV – includes chat & suggest links
// ============================================================
const UserNav = ({ user, logout }: { user: AuthResponse; logout: () => void }) => {
    const { t } = useTranslation('common');
    const isVendor = user.role === 'Vendor' || user.role === 'Admin';
    const isAdmin = user.role === 'Admin';

    return (
        <div className="bg-gradient-to-r from-[#0F5C45] to-[#1A7A5C] text-white text-sm py-2">
            <div className="container mx-auto px-4 flex justify-between items-center">
                <div className="flex items-center gap-6">
                    <Link href="/cart" className="hover:text-yellow-300 transition flex items-center gap-2">
                        <ShoppingCartIcon className="w-4 h-4" /> {t('cart')}
                    </Link>
                    <Link href="/orders" className="hover:text-yellow-300 transition flex items-center gap-2">
                        <span>📋 {t('orders')}</span>
                    </Link>
                    <Link href="/suggest" className="hover:text-yellow-300 transition flex items-center gap-2">
                        <span>💡 Suggest</span>
                    </Link>
                    {isVendor && (
                        <>
                            <Link href="/vendor/dashboard" className="hover:text-yellow-300 transition flex items-center gap-2">
                                <span>📊 {t('dashboard')}</span>
                            </Link>
                            <Link href="/admin/orders" className="hover:text-yellow-300 transition flex items-center gap-2">
                                <span>📦 Manage Orders</span>
                            </Link>
                        </>
                    )}
                    {isAdmin && (
                        <>
                            <Link href="/admin/users" className="hover:text-yellow-300 transition flex items-center gap-2">
                                <span>👥 {t('users')}</span>
                            </Link>
                            <Link href="/admin" className="hover:text-yellow-300 transition flex items-center gap-2">
                                <span>⚙️ {t('admin')}</span>
                            </Link>
                        </>
                    )}
                    <Link href="/chat" className="hover:text-yellow-300 transition flex items-center gap-2">
                        <span>💬 Chat</span>
                    </Link>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-xs text-white/70">{t('welcome')}، {user.username}</span>
                    <button onClick={logout} className="text-xs bg-white/10 px-3 py-1 rounded-full hover:bg-white/20 transition duration-300 hover:scale-105">
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
            <NavMenu categories={categories} loading={loadingCategories} />
            {user && <UserNav user={user} logout={logout} />}
        </header>
    );
}