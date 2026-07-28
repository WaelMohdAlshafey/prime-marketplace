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

// ============================================================
// TOP BAR
// ============================================================
const TopBar = () => {
    const { t } = useTranslation('common');
    return (
        <div className="bg-[#0F5C45] text-white text-xs py-1.5">
            <div className="container mx-auto px-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5">
                        <span className="text-yellow-400">✦</span> {t('freeShipping')}
                    </span>
                    <span className="text-white/30">|</span>
                    <Link href="/tracking" className="hover:text-yellow-400 transition">
                        {t('trackOrder')}
                    </Link>
                </div>
                <div className="flex items-center gap-3">
                    <LanguageSwitcher />
                    <button className="flex items-center gap-1 hover:text-yellow-400 transition">
                        <CurrencyDollarIcon className="w-3.5 h-3.5" /> {t('currency')}
                    </button>
                    <button className="hover:text-yellow-400 transition">{t('support')}</button>
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
    const { totalItems } = useCart();
    const { totalFavorites } = useWishlist();
    const { cartIconRef } = useCartIconRef();
    const [isAnimating, setIsAnimating] = useState(false);
    const prevTotalRef = useRef(totalItems);

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
        <div className="bg-white border-b border-gray-100 shadow-header py-3">
            <div className="container mx-auto px-4 flex items-center gap-4">
                <Logo />

                <form onSubmit={handleSearch} className="flex-1 max-w-2xl relative">
                    <input
                        type="text"
                        placeholder={t('searchPlaceholder')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-5 py-3 pr-12 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0F5C45]/30 focus:border-[#0F5C45] transition bg-gray-50 hover:bg-white text-right"
                    />
                    <MagnifyingGlassIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <button
                        type="submit"
                        className="absolute left-1.5 top-1/2 -translate-y-1/2 bg-[#0F5C45] text-white px-5 py-1.5 rounded-xl text-sm font-medium hover:bg-[#0A4735] transition shadow-soft"
                    >
                        {t('search')}
                    </button>
                </form>

                <div className="flex items-center gap-4 flex-shrink-0">
                    {/* FAVORITES */}
                    <button className="text-gray-600 hover:text-[#0F5C45] transition relative">
                        <HeartIcon className="w-6 h-6" />
                        <span className="absolute -top-1 -right-1 bg-[#0F5C45] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                            {totalFavorites}
                        </span>
                    </button>

                    {/* CART with ref – proper casting */}
                    <Link
                        href="/cart"
                        ref={(el) => {
                            // Cast to HTMLElement to match the context type
                            cartIconRef.current = el as HTMLElement;
                        }}
                        className="text-gray-600 hover:text-[#0F5C45] transition relative group"
                    >
                        <ShoppingCartIcon className="w-6 h-6" />
                        <span
                            className={`absolute -top-1 -right-1 bg-[#0F5C45] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center transition-transform duration-300 ${isAnimating ? 'scale-150 bg-[#0A4735]' : 'scale-100'
                                }`}
                        >
                            {totalItems}
                        </span>
                        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                            {totalItems} {totalItems === 1 ? 'item' : 'items'}
                        </span>
                    </Link>

                    {user ? (
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">{user.username}</span>
                            <UserIcon className="w-5 h-5 text-gray-600" />
                        </div>
                    ) : (
                        <Link href="/auth/login" className="text-gray-600 hover:text-[#0F5C45] transition">
                            <UserIcon className="w-6 h-6" />
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

// ============================================================
// NAVIGATION MENU
// ============================================================
const NavMenu = () => {
    const { t } = useTranslation('common');
    const categories = [
        { key: 'software', label: t('software') },
        { key: 'hair-care', label: t('hairCare') },
        { key: 'skin-care', label: t('skinCare') },
        { key: 'fashion', label: t('fashion') },
        { key: 'accessories', label: t('accessories') },
        { key: 'electronics', label: t('electronics') },
        { key: 'supplements', label: t('supplements') },
        { key: 'home', label: t('homeCategory') },
    ];

    return (
        <div className="bg-white border-b border-gray-100 shadow-sm">
            <div className="container mx-auto px-4">
                <div className="flex items-center gap-6 py-2.5 overflow-x-auto whitespace-nowrap text-sm">
                    <Link href="/" className="text-[#0F5C45] font-semibold hover:text-[#0A4735] transition border-b-2 border-[#0F5C45] pb-1">
                        {t('home')}
                    </Link>
                    {categories.map((cat) => (
                        <Link key={cat.key} href={`/${cat.key}`} className="text-gray-600 hover:text-[#0F5C45] transition pb-1">
                            {cat.label}
                        </Link>
                    ))}
                    <Link href="/stores" className="text-gray-600 hover:text-[#0F5C45] transition pb-1">
                        {t('stores')}
                    </Link>
                    <Link href="/offers" className="text-orange-500 font-medium hover:text-orange-600 transition pb-1">
                        🔥 {t('offers')}
                    </Link>
                    <Link href="/contact" className="text-gray-600 hover:text-[#0F5C45] transition pb-1">
                        {t('contact')}
                    </Link>
                </div>
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
        <div className="bg-[#0F5C45] text-white text-sm py-2">
            <div className="container mx-auto px-4 flex justify-between items-center">
                <div className="flex items-center gap-6">
                    <Link href="/cart" className="hover:text-yellow-300 transition flex items-center gap-2">
                        <ShoppingCartIcon className="w-4 h-4" /> {t('cart')}
                    </Link>
                    <Link href="/orders" className="hover:text-yellow-300 transition flex items-center gap-2">
                        <span>📋 {t('orders')}</span>
                    </Link>
                    {isVendor && (
                        <Link href="/vendor/dashboard" className="hover:text-yellow-300 transition flex items-center gap-2">
                            <span>📊 {t('dashboard')}</span>
                        </Link>
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
                </div>
                <div className="flex items-center gap-4">
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

    if (isLoading) {
        return <div className="bg-white shadow-md py-4 text-center text-gray-500">{t('loading')}</div>;
    }

    return (
        <header className="sticky top-0 z-50 bg-white shadow-header">
            <TopBar />
            <MainHeader user={user} />
            <NavMenu />
            {user && <UserNav user={user} logout={logout} />}
        </header>
    );
}