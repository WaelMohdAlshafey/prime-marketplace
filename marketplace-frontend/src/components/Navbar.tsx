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
    X,
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { t, i18n } = useTranslation('common');
    const { user, isLoading, logout } = useAuth();
    const { totalItems } = useCart();
    const { totalFavorites } = useWishlist();
    const { cartIconRef } = useCartIconRef();

    const [menuOpen, setMenuOpen] = useState(false);

    // Single state for the user menu — renders dropdown on desktop, bottom sheet on mobile
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = useRef(null);

    // Desktop-only dropdowns for support/currency
    const [supportOpen, setSupportOpen] = useState(false);
    const [currencyOpen, setCurrencyOpen] = useState(false);
    const supportRef = useRef(null);
    const currencyRef = useRef(null);

    // Mobile bottom sheets for support/currency
    const [mobileSupportOpen, setMobileSupportOpen] = useState(false);
    const [mobileCurrencyOpen, setMobileCurrencyOpen] = useState(false);

    useEffect(() => {
        const handler = (e) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
            if (supportRef.current && !supportRef.current.contains(e.target)) setSupportOpen(false);
            if (currencyRef.current && !currencyRef.current.contains(e.target)) setCurrencyOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const toggleLanguage = () => {
        i18n.changeLanguage(i18n.language === 'ar' ? 'en' : 'ar');
    };

    const isRTL = typeof document !== 'undefined' && document.documentElement.dir === 'rtl';

    const topLinkClass = "flex items-center gap-2 px-3 py-2 rounded-lg font-bold text-[15px] text-white hover:text-[#D4A54A] hover:bg-white/15 transition whitespace-nowrap drop-shadow-sm";
    const desktopDropdownClass = `absolute top-full mt-1 bg-white text-gray-800 rounded-lg shadow-lg py-1 z-[9999] min-w-[220px] ${isRTL ? 'left-0' : 'right-0'}`;

    if (typeof window === 'undefined' || isLoading) {
        return <div className="bg-surface shadow-md py-4 text-center text-text-muted animate-pulse">Loading...</div>;
    }

    // ============================================================
    // Reusable user menu links (shown in both desktop dropdown and mobile sheet)
    // ============================================================
    const UserMenuLinks = ({ onAnyClick }) => (
        <>
            {!user ? (
                <>
                    <Link href="/auth/login" className="block px-4 py-2.5 hover:bg-primary/10 text-sm" onClick={onAnyClick}>{t('loginTitle')}</Link>
                    <Link href="/auth/register" className="block px-4 py-2.5 hover:bg-primary/10 text-sm" onClick={onAnyClick}>{t('registerTitle')}</Link>
                </>
            ) : (
                <>
                    <Link href="/cart" className="block px-4 py-2.5 hover:bg-primary/10 text-sm" onClick={onAnyClick}>🛒 {t('cart')}</Link>
                    <Link href="/orders" className="block px-4 py-2.5 hover:bg-primary/10 text-sm" onClick={onAnyClick}>📋 {t('orders')}</Link>
                    <Link href="/suggest" className="block px-4 py-2.5 hover:bg-primary/10 text-sm" onClick={onAnyClick}>💡 Suggest</Link>
                    <Link href="/chat" className="block px-4 py-2.5 hover:bg-primary/10 text-sm" onClick={onAnyClick}>💬 Chat</Link>
                    <Link href="/profile" className="block px-4 py-2.5 hover:bg-primary/10 text-sm" onClick={onAnyClick}>👤 {t('profile')}</Link>

                    {/* Vendor + Admin */}
                    {(user.role === 'Vendor' || user.role === 'Admin') && (
                        <Link href="/vendor/dashboard" className="block px-4 py-2.5 hover:bg-primary/10 text-sm" onClick={onAnyClick}>📊 {t('dashboard')}</Link>
                    )}
                    {(user.role === 'Vendor' || user.role === 'Admin' || user.role === 'Employee') && (
                        <Link href="/admin/orders" className="block px-4 py-2.5 hover:bg-primary/10 text-sm" onClick={onAnyClick}>📦 Manage Orders</Link>
                    )}
                    {user.role === 'Admin' && (
                        <>
                            <hr className="my-1 border-border" />
                            <Link href="/admin" className="block px-4 py-2.5 hover:bg-red-50 text-sm font-semibold text-red-600" onClick={onAnyClick}>⚙️ Admin Panel</Link>
                            <Link href="/admin/users" className="block px-4 py-2.5 hover:bg-primary/10 text-sm" onClick={onAnyClick}>👥 {t('users')}</Link>
                            <Link href="/admin/products" className="block px-4 py-2.5 hover:bg-primary/10 text-sm" onClick={onAnyClick}>📦 Products</Link>
                            <Link href="/admin/pages" className="block px-4 py-2.5 hover:bg-primary/10 text-sm" onClick={onAnyClick}>📄 Pages</Link>
                            <Link href="/admin/stores" className="block px-4 py-2.5 hover:bg-primary/10 text-sm" onClick={onAnyClick}>🏪 Stores</Link>
                            <Link href="/admin/golden-links" className="block px-4 py-2.5 hover:bg-primary/10 text-sm" onClick={onAnyClick}>🔗 Golden Links</Link>
                        </>
                    )}

                    <hr className="my-1 border-border" />
                    <button onClick={() => { logout(); onAnyClick(); }}
                        className="block w-full text-right px-4 py-2.5 text-red-600 hover:bg-red-50 text-sm font-semibold">
                        {t('logout')}
                    </button>
                </>
            )}
        </>
    );

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-[1000] bg-white shadow-md">
                <div className="navbar border-b border-border bg-[#0F5C45]">

                    {/* MAIN ROW */}
                    <div className="container mx-auto px-3 sm:px-4 flex items-center justify-between gap-2 py-2.5">

                        {/* LEFT — hamburger + logo */}
                        <div className="flex items-center gap-3 flex-shrink-0">
                            <button onClick={() => setMenuOpen(true)}
                                className="p-2 rounded-lg hover:bg-white/15 transition text-white" aria-label="Open menu">
                                <Bars3Icon className="w-7 h-7 sm:w-8 sm:h-8" />
                            </button>
                            <Logo />
                        </div>

                        {/* RIGHT */}
                        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">

                            {/* DESKTOP-ONLY: Language */}
                            <button onClick={toggleLanguage} className={`${topLinkClass} hidden md:flex`}>
                                <GlobeAltIcon className="w-5 h-5" />
                                <span>{i18n.language === 'ar' ? 'العربية' : 'English'}</span>
                            </button>

                            <span className="text-white/30 hidden md:inline select-none">|</span>

                            {/* DESKTOP-ONLY: Support */}
                            <div className="relative hidden md:block" ref={supportRef}>
                                <button onClick={() => setSupportOpen(!supportOpen)} className={topLinkClass}>
                                    <LifebuoyIcon className="w-5 h-5" />
                                    <span>{t('support')}</span>
                                    <ChevronDownIcon className="w-4 h-4" />
                                </button>
                                <AnimatePresence>
                                    {supportOpen && (
                                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                            className={desktopDropdownClass}>
                                            <Link href="/help" className="block px-4 py-2 hover:bg-gray-100 text-sm" onClick={() => setSupportOpen(false)}>{t('help')}</Link>
                                            <Link href="/faq" className="block px-4 py-2 hover:bg-gray-100 text-sm" onClick={() => setSupportOpen(false)}>{t('footer.faq')}</Link>
                                            <Link href="/returns" className="block px-4 py-2 hover:bg-gray-100 text-sm" onClick={() => setSupportOpen(false)}>{t('footer.returns')}</Link>
                                            <Link href="/shipping" className="block px-4 py-2 hover:bg-gray-100 text-sm" onClick={() => setSupportOpen(false)}>{t('footer.shipping')}</Link>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <span className="text-white/30 hidden md:inline select-none">|</span>

                            {/* DESKTOP-ONLY: Currency */}
                            <div className="relative hidden md:block" ref={currencyRef}>
                                <button onClick={() => setCurrencyOpen(!currencyOpen)} className={topLinkClass}>
                                    <CurrencyDollarIcon className="w-5 h-5" />
                                    <span>{t('currency')}</span>
                                    <ChevronDownIcon className="w-4 h-4" />
                                </button>
                                <AnimatePresence>
                                    {currencyOpen && (
                                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                            className={`${desktopDropdownClass} min-w-[140px]`}>
                                            <button className="block w-full text-right px-4 py-2 hover:bg-gray-100 text-sm">EGP</button>
                                            <button className="block w-full text-right px-4 py-2 hover:bg-gray-100 text-sm">USD</button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <span className="text-white/30 hidden lg:inline select-none">|</span>

                            {/* DESKTOP-ONLY: Track */}
                            <Link href="/tracking" className={`${topLinkClass} hidden lg:flex`}>
                                <TruckIcon className="w-5 h-5" />
                                <span>{t('trackOrder')}</span>
                            </Link>

                            {/* Wishlist */}
                            <button className="text-white hover:text-[#D4A54A] transition relative p-2">
                                <HeartIcon className="w-6 h-6" />
                                <span className="absolute top-1 right-1 bg-[#D4A54A] text-[#0F5C45] text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center">
                                    {totalFavorites}
                                </span>
                            </button>

                            {/* Cart */}
                            <span ref={cartIconRef} className="relative inline-flex p-2">
                                <Link href="/cart" className="text-white hover:text-[#D4A54A] transition">
                                    <ShoppingCartIcon className="w-6 h-6" />
                                    <motion.span animate={{ scale: totalItems > 0 ? 1.2 : 1 }}
                                        className="absolute -top-1 -right-1 bg-[#D4A54A] text-[#0F5C45] text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center">
                                        {totalItems}
                                    </motion.span>
                                </Link>
                            </span>

                            {/* USER ICON — single state, renders dropdown on desktop & bottom sheet on mobile */}
                            <div className="relative" ref={userMenuRef}>
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center gap-1 p-2 rounded-lg hover:bg-white/15 transition text-white"
                                >
                                    {user && (
                                        <span className="text-sm font-semibold truncate max-w-[100px]">
                                            {user.username}
                                        </span>
                                    )}
                                    <UserIcon className="w-6 h-6" />
                                    <ChevronDownIcon className="w-4 h-4" />
                                </button>

                                {/* DESKTOP DROPDOWN — hidden on mobile via CSS */}
                                <AnimatePresence>
                                    {userMenuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className={`${desktopDropdownClass} max-h-[80vh] overflow-y-auto hidden md:block`}
                                        >
                                            <UserMenuLinks onAnyClick={() => setUserMenuOpen(false)} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    {/* MOBILE-ONLY STRIP */}
                    <div className="md:hidden border-t border-white/10 bg-[#0F5C45]">
                        <div className="grid grid-cols-4 divide-x divide-white/10">
                            <button onClick={toggleLanguage}
                                className="flex items-center justify-center gap-1 px-1 py-2 text-[11px] font-bold text-white hover:bg-white/15">
                                <GlobeAltIcon className="w-4 h-4" />
                                <span className="truncate">{i18n.language === 'ar' ? 'عربي' : 'EN'}</span>
                            </button>
                            <button onClick={() => setMobileSupportOpen(true)}
                                className="flex items-center justify-center gap-1 px-1 py-2 text-[11px] font-bold text-white hover:bg-white/15">
                                <LifebuoyIcon className="w-4 h-4" />
                                <span className="truncate">{t('support')}</span>
                            </button>
                            <button onClick={() => setMobileCurrencyOpen(true)}
                                className="flex items-center justify-center gap-1 px-1 py-2 text-[11px] font-bold text-white hover:bg-white/15">
                                <CurrencyDollarIcon className="w-4 h-4" />
                                <span className="truncate">{t('currency')}</span>
                            </button>
                            <Link href="/tracking"
                                className="flex items-center justify-center gap-1 px-1 py-2 text-[11px] font-bold text-white hover:bg-white/15">
                                <TruckIcon className="w-4 h-4" />
                                <span className="truncate">{t('trackOrder')}</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* ============================================================
                MOBILE BOTTOM SHEET — USER MENU (uses same state as desktop dropdown)
                ============================================================ */}
            <AnimatePresence>
                {userMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 z-[9998] md:hidden"
                            onClick={() => setUserMenuOpen(false)}
                        />
                        <motion.div
                            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-[9999] md:hidden max-h-[80vh] overflow-y-auto"
                        >
                            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
                                <h3 className="text-lg font-bold text-gray-900">
                                    {user?.username || t('loginTitle')}
                                </h3>
                                <button onClick={() => setUserMenuOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-2">
                                <UserMenuLinks onAnyClick={() => setUserMenuOpen(false)} />
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Support bottom sheet */}
            <AnimatePresence>
                {mobileSupportOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 z-[9998] md:hidden"
                            onClick={() => setMobileSupportOpen(false)} />
                        <motion.div
                            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-[9999] md:hidden max-h-[80vh] overflow-y-auto">
                            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                                <h3 className="text-lg font-bold">{t('support')}</h3>
                                <button onClick={() => setMobileSupportOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
                            </div>
                            <div className="p-2">
                                <Link href="/help" className="block px-4 py-3 hover:bg-gray-50 rounded-lg text-sm" onClick={() => setMobileSupportOpen(false)}>{t('help')}</Link>
                                <Link href="/faq" className="block px-4 py-3 hover:bg-gray-50 rounded-lg text-sm" onClick={() => setMobileSupportOpen(false)}>{t('footer.faq')}</Link>
                                <Link href="/returns" className="block px-4 py-3 hover:bg-gray-50 rounded-lg text-sm" onClick={() => setMobileSupportOpen(false)}>{t('footer.returns')}</Link>
                                <Link href="/shipping" className="block px-4 py-3 hover:bg-gray-50 rounded-lg text-sm" onClick={() => setMobileSupportOpen(false)}>{t('footer.shipping')}</Link>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Currency bottom sheet */}
            <AnimatePresence>
                {mobileCurrencyOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 z-[9998] md:hidden"
                            onClick={() => setMobileCurrencyOpen(false)} />
                        <motion.div
                            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-[9999] md:hidden">
                            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                                <h3 className="text-lg font-bold">{t('currency')}</h3>
                                <button onClick={() => setMobileCurrencyOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
                            </div>
                            <div className="p-2">
                                <button className="block w-full text-right px-4 py-3 hover:bg-gray-50 rounded-lg text-sm" onClick={() => setMobileCurrencyOpen(false)}>EGP — جنيه مصري</button>
                                <button className="block w-full text-right px-4 py-3 hover:bg-gray-50 rounded-lg text-sm" onClick={() => setMobileCurrencyOpen(false)}>USD — دولار أمريكي</button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <UnifiedMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
        </>
    );
};

export default Navbar;