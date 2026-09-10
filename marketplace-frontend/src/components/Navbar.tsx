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

    // Mobile strip dropdowns
    const [mobileSupportOpen, setMobileSupportOpen] = useState(false);
    const [mobileCurrencyOpen, setMobileCurrencyOpen] = useState(false);

    const userMenuRef = useRef(null);
    const supportRef = useRef(null);
    const currencyRef = useRef(null);
    const mobileStripRef = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            // Desktop dropdowns
            if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
            if (supportRef.current && !supportRef.current.contains(e.target)) setSupportOpen(false);
            if (currencyRef.current && !currencyRef.current.contains(e.target)) setCurrencyOpen(false);
            // Mobile dropdowns — close if click outside the strip
            if (mobileStripRef.current && !mobileStripRef.current.contains(e.target)) {
                setMobileSupportOpen(false);
                setMobileCurrencyOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const toggleLanguage = () => {
        i18n.changeLanguage(i18n.language === 'ar' ? 'en' : 'ar');
    };

    const isRTL = typeof document !== 'undefined' && document.documentElement.dir === 'rtl';

    const dropdownClasses = `absolute top-full mt-1 bg-white text-gray-800 rounded-lg shadow-lg py-1 z-[9999] min-w-[140px] ${isRTL ? 'right-0' : 'left-0'}`;
    const topLinkClass = "flex items-center gap-2 px-3 py-2 rounded-lg font-bold text-[15px] text-white hover:text-[#D4A54A] hover:bg-white/15 transition whitespace-nowrap drop-shadow-sm";
    const mobileLinkClass = "flex items-center gap-1 px-2 py-1.5 rounded-md text-[12px] font-bold text-white hover:bg-white/15 transition whitespace-nowrap flex-1 justify-center";

    if (typeof window === 'undefined' || isLoading) {
        return <div className="bg-surface shadow-md py-4 text-center text-text-muted animate-pulse">Loading...</div>;
    }

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-[1000] bg-white shadow-md">
                <div className="navbar border-b border-border bg-[#0F5C45]">

                    {/* ============================
                        MAIN ROW
                        ============================ */}
                    <div className="container mx-auto px-3 sm:px-4 flex items-center justify-between gap-2 py-2.5">

                        {/* LEFT — hamburger + logo */}
                        <div className="flex items-center gap-3 flex-shrink-0">
                            <button
                                onClick={() => setMenuOpen(true)}
                                className="p-2 rounded-lg hover:bg-white/15 transition text-white"
                                aria-label="Open menu"
                            >
                                <Bars3Icon className="w-7 h-7 sm:w-8 sm:h-8" />
                            </button>
                            <Logo />
                        </div>

                        {/* RIGHT — desktop links + always-visible icons */}
                        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">

                            {/* ---- DESKTOP-ONLY ---- */}
                            <button onClick={toggleLanguage} className={`${topLinkClass} hidden md:flex`}>
                                <GlobeAltIcon className="w-5 h-5" />
                                <span>{i18n.language === 'ar' ? 'العربية' : 'English'}</span>
                            </button>

                            <span className="text-white/30 hidden md:inline select-none">|</span>

                            <div className="relative hidden md:block" ref={supportRef}>
                                <button onClick={() => setSupportOpen(!supportOpen)} className={topLinkClass}>
                                    <LifebuoyIcon className="w-5 h-5" />
                                    <span>{t('support')}</span>
                                    <ChevronDownIcon className="w-4 h-4" />
                                </button>
                                <AnimatePresence>
                                    {supportOpen && (
                                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                            className={dropdownClasses}>
                                            <Link href="/help" className="block px-4 py-2 hover:bg-gray-100 text-sm" onClick={() => setSupportOpen(false)}>{t('help')}</Link>
                                            <Link href="/faq" className="block px-4 py-2 hover:bg-gray-100 text-sm" onClick={() => setSupportOpen(false)}>{t('footer.faq')}</Link>
                                            <Link href="/returns" className="block px-4 py-2 hover:bg-gray-100 text-sm" onClick={() => setSupportOpen(false)}>{t('footer.returns')}</Link>
                                            <Link href="/shipping" className="block px-4 py-2 hover:bg-gray-100 text-sm" onClick={() => setSupportOpen(false)}>{t('footer.shipping')}</Link>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <span className="text-white/30 hidden md:inline select-none">|</span>

                            <div className="relative hidden md:block" ref={currencyRef}>
                                <button onClick={() => setCurrencyOpen(!currencyOpen)} className={topLinkClass}>
                                    <CurrencyDollarIcon className="w-5 h-5" />
                                    <span>{t('currency')}</span>
                                    <ChevronDownIcon className="w-4 h-4" />
                                </button>
                                <AnimatePresence>
                                    {currencyOpen && (
                                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                            className={`${dropdownClasses} min-w-[100px]`}>
                                            <button className="block w-full text-right px-4 py-2 hover:bg-gray-100 text-sm">EGP</button>
                                            <button className="block w-full text-right px-4 py-2 hover:bg-gray-100 text-sm">USD</button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <span className="text-white/30 hidden lg:inline select-none">|</span>

                            <Link href="/tracking" className={`${topLinkClass} hidden lg:flex`}>
                                <TruckIcon className="w-5 h-5" />
                                <span>{t('trackOrder')}</span>
                            </Link>

                            {/* ---- ALWAYS VISIBLE ---- */}
                            <button className="text-white hover:text-[#D4A54A] transition relative p-2">
                                <HeartIcon className="w-6 h-6" />
                                <span className="absolute top-1 right-1 bg-[#D4A54A] text-[#0F5C45] text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center">
                                    {totalFavorites}
                                </span>
                            </button>

                            <span ref={cartIconRef} className="relative inline-flex p-2">
                                <Link href="/cart" className="text-white hover:text-[#D4A54A] transition">
                                    <ShoppingCartIcon className="w-6 h-6" />
                                    <motion.span
                                        animate={{ scale: totalItems > 0 ? 1.2 : 1 }}
                                        className="absolute -top-1 -right-1 bg-[#D4A54A] text-[#0F5C45] text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center">
                                        {totalItems}
                                    </motion.span>
                                </Link>
                            </span>

                            <div className="relative" ref={userMenuRef} onClick={(e) => e.stopPropagation()}>
                                <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center gap-1 p-2 rounded-lg hover:bg-white/15 transition text-white">
                                    {user && (
                                        <span className="text-sm font-semibold truncate max-w-[80px] hidden sm:inline">{user.username}</span>
                                    )}
                                    <UserIcon className="w-6 h-6" />
                                    <ChevronDownIcon className="w-4 h-4" />
                                </button>

                                <AnimatePresence>
                                    {userMenuOpen && (
                                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                            className={`${dropdownClasses} min-w-[200px] max-h-[80vh] overflow-y-auto`}>
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

                    {/* ============================================================
                        MOBILE-ONLY STRIP — full width, no clipping, dropdowns open below
                        ============================================================ */}
                    <div
                        ref={mobileStripRef}
                        className="md:hidden relative border-t border-white/10 bg-[#0F5C45]"
                    >
                        <div className="px-2 py-1.5 flex items-center justify-between gap-0.5">

                            {/* Language */}
                            <button onClick={toggleLanguage} className={mobileLinkClass}>
                                <GlobeAltIcon className="w-4 h-4" />
                                <span>{i18n.language === 'ar' ? 'العربية' : 'English'}</span>
                            </button>

                            <span className="text-white/20 select-none text-xs">|</span>

                            {/* Support */}
                            <button
                                onClick={() => {
                                    setMobileSupportOpen(!mobileSupportOpen);
                                    setMobileCurrencyOpen(false);
                                }}
                                className={mobileLinkClass}
                            >
                                <LifebuoyIcon className="w-4 h-4" />
                                <span>{t('support')}</span>
                                <ChevronDownIcon className="w-3 h-3" />
                            </button>

                            <span className="text-white/20 select-none text-xs">|</span>

                            {/* Currency */}
                            <button
                                onClick={() => {
                                    setMobileCurrencyOpen(!mobileCurrencyOpen);
                                    setMobileSupportOpen(false);
                                }}
                                className={mobileLinkClass}
                            >
                                <CurrencyDollarIcon className="w-4 h-4" />
                                <span>{t('currency')}</span>
                                <ChevronDownIcon className="w-3 h-3" />
                            </button>

                            <span className="text-white/20 select-none text-xs">|</span>

                            {/* Track */}
                            <Link href="/tracking" className={mobileLinkClass}>
                                <TruckIcon className="w-4 h-4" />
                                <span>{t('trackOrder')}</span>
                            </Link>
                        </div>

                        {/* ---- Full-width dropdown panels — below the strip, inside the screen ---- */}
                        <AnimatePresence>
                            {mobileSupportOpen && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute top-full left-0 right-0 bg-white shadow-xl border-b border-gray-200 overflow-hidden z-[9999]"
                                >
                                    <Link href="/help" className="block px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-800 border-b border-gray-100" onClick={() => setMobileSupportOpen(false)}>{t('help')}</Link>
                                    <Link href="/faq" className="block px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-800 border-b border-gray-100" onClick={() => setMobileSupportOpen(false)}>{t('footer.faq')}</Link>
                                    <Link href="/returns" className="block px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-800 border-b border-gray-100" onClick={() => setMobileSupportOpen(false)}>{t('footer.returns')}</Link>
                                    <Link href="/shipping" className="block px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-800" onClick={() => setMobileSupportOpen(false)}>{t('footer.shipping')}</Link>
                                </motion.div>
                            )}

                            {mobileCurrencyOpen && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute top-full left-0 right-0 bg-white shadow-xl border-b border-gray-200 overflow-hidden z-[9999]"
                                >
                                    <button className="block w-full text-right px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-800 border-b border-gray-100">EGP</button>
                                    <button className="block w-full text-right px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-800">USD</button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </header>

            {/* Unified sliding menu */}
            <UnifiedMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
        </>
    );
};

export default Navbar;