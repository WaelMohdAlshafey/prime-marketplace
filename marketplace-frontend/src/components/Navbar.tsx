'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useTranslation } from 'react-i18next';
import { useCartIconRef } from '@/context/CartIconRefContext';
import {
    ShoppingCart,
    Heart,
    User,
    Search,
    Menu,
    X,
    Globe,
    Phone,
    Truck,
    Store,
    Package,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
    const { user, logout, isLoading } = useAuth();
    const { t } = useTranslation('common');
    const { totalItems } = useCart();
    const { totalFavorites } = useWishlist();
    const { cartIconRef } = useCartIconRef();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = `/?q=${encodeURIComponent(searchQuery.trim())}`;
        }
    };

    const handleLogout = () => {
        logout();
        window.location.href = '/';
    };

    return (
        <>
            {/* ============================================================
                TOP BAR
                ============================================================ */}
            <div className="top-bar">
                <div className="container">
                    <div className="left">
                        <Link href="/contact">
                            <Phone className="w-4 h-4" />
                            <span>اتصل بنا</span>
                        </Link>
                        <span className="divider">|</span>
                        <Link href="/tracking">
                            <Truck className="w-4 h-4" />
                            <span>{t('trackOrder')}</span>
                        </Link>
                        <span className="divider">|</span>
                        <Link href="/stores">
                            <Store className="w-4 h-4" />
                            <span>{t('stores')}</span>
                        </Link>
                    </div>
                    <div className="right">
                        <Link href="/offers">
                            🔥 {t('offers')}
                        </Link>
                        <span className="divider">|</span>
                        <button className="hover:opacity-80 transition flex items-center gap-1">
                            <Globe className="w-4 h-4" />
                            <span>English</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* ============================================================
                MAIN NAVBAR
                ============================================================ */}
            <nav className={`navbar ${isScrolled ? 'shadow-md' : ''}`}>
                <div className="container">
                    {/* Logo */}
                    <Link href="/" className="logo">
                        <span>🛍️</span>
                        <span>Prime</span>
                    </Link>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="search-bar">
                        <select className="search-dropdown">
                            <option>الكل</option>
                            <option>برامج</option>
                            <option>تجميل</option>
                            <option>أزياء</option>
                        </select>
                        <input
                            type="text"
                            placeholder={t('searchPlaceholder')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button type="submit" className="search-btn">
                            <Search className="w-4 h-4" />
                            <span>{t('search')}</span>
                        </button>
                    </form>

                    {/* Nav Icons */}
                    <div className="nav-icons">
                        <Link href="/wishlist" className="icon-link">
                            <Heart className="w-6 h-6" />
                            {totalFavorites > 0 && (
                                <span className="badge">{totalFavorites}</span>
                            )}
                        </Link>

                        <Link
                            href="/cart"
                            ref={(el) => { cartIconRef.current = el as HTMLElement; }}
                            className="icon-link"
                        >
                            <ShoppingCart className="w-6 h-6" />
                            {totalItems > 0 && (
                                <span className="badge">{totalItems}</span>
                            )}
                        </Link>

                        {isLoading ? (
                            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                        ) : user ? (
                            <div className="user-info">
                                <span>{user.username}</span>
                                <button
                                    onClick={handleLogout}
                                    className="text-sm text-[#757575] hover:text-[#0A6C44] transition"
                                >
                                    {t('logout')}
                                </button>
                            </div>
                        ) : (
                            <Link href="/auth/login" className="icon-link">
                                <User className="w-6 h-6" />
                            </Link>
                        )}

                        {/* Mobile Menu Toggle */}
                        <button
                            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="lg:hidden bg-white border-t border-gray-200 overflow-hidden"
                        >
                            <div className="container py-4 space-y-2">
                                <Link
                                    href="/"
                                    className="block py-2 hover:text-[#0A6C44] transition"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {t('home')}
                                </Link>
                                <Link
                                    href="/products"
                                    className="block py-2 hover:text-[#0A6C44] transition"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {t('products')}
                                </Link>
                                <Link
                                    href="/stores"
                                    className="block py-2 hover:text-[#0A6C44] transition"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {t('stores')}
                                </Link>
                                <Link
                                    href="/offers"
                                    className="block py-2 text-orange-500 hover:text-orange-600 transition"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    🔥 {t('offers')}
                                </Link>
                                <Link
                                    href="/contact"
                                    className="block py-2 hover:text-[#0A6C44] transition"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {t('contact')}
                                </Link>
                                {user && user.role === 'Admin' && (
                                    <Link
                                        href="/admin"
                                        className="block py-2 text-[#0A6C44] font-medium hover:underline transition"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        ⚙️ {t('admin')}
                                    </Link>
                                )}
                                {user && (
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="block w-full text-right py-2 text-red-500 hover:text-red-700 transition"
                                    >
                                        {t('logout')}
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </>
    );
}