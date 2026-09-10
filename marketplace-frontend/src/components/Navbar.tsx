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
    const [userMenuOpen, setUserMenuOpen] = useState(false);       // mobile bottom sheet
    const [supportOpen, setSupportOpen] = useState(false);         // mobile bottom sheet
    const [currencyOpen, setCurrencyOpen] = useState(false);       // mobile bottom sheet

    // Desktop dropdowns
    const [desktopUserOpen, setDesktopUserOpen] = useState(false);
    const [desktopSupportOpen, setDesktopSupportOpen] = useState(false);
    const [desktopCurrencyOpen, setDesktopCurrencyOpen] = useState(false);

    const desktopUserRef = useRef(null);
    const desktopSupportRef = useRef(null);
    const desktopCurrencyRef = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (desktopUserRef.current && !desktopUserRef.current.contains(e.target)) setDesktopUserOpen(false);
            if (desktopSupportRef.current && !desktopSupportRef.current.contains(e.target)) setDesktopSupportOpen(false);
            if (desktopCurrencyRef.current && !desktopCurrencyRef.current.contains(e.target)) setDesktopCurrencyOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const toggleLanguage = () => {
        i18n.changeLanguage(i18n.language === 'ar' ? 'en' : 'ar');
    };

    const isRTL = typeof document !== 'undefined' && document.documentElement.dir === 'rtl';

    const topLinkClass = "flex items-center gap-2 px-3 py-2 rounded-lg font-bold text-[15px] text-white hover:text-[#D4A54A] hover:bg-white/15 transition whitespace-nowrap drop-shadow-sm";
    const desktopDropdownClass = `absolute top-full mt-1 bg-white text-gray-800 rounded-lg shadow-lg py-1 z-[9999] min-w-[160px] ${isRTL ? 'left-0' : 'right-0'}`;
    // ✅ In RTL, anchor dropdowns to the LEFT so they open toward the center, not off-screen

    if (typeof window === 'undefined' || isLoading) {
        return <div className="bg-surface shadow-md py-4 text-center text-text-muted animate-pulse">Loading...</div>;
    }

    // ============================================================
    // Bottom Sheet Component
    // ============================================================
    const BottomSheet = ({ isOpen, onClose, title, children }) => (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-[9998] md:hidden"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-[9999] md:hidden max-h-[80vh] overflow-y-auto"
                    >
                        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
                            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-2">{children}</div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );

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

                            {/* ---- DESKTOP-ONLY: Language ---- */}
                            <button onClick={toggleLanguage} className={`${topLinkClass} hidden md:flex`}>
                                <GlobeAltIcon className="w-5 h-5" />
                                <span>{i18n.language === 'ar' ? 'العربية' : 'English'}</span>
                            </button>

                            <span className="text-white/30 hidden md:inline select-none">|</span>

                            {/* ---- DESKTOP-ONLY: Support ---- */}
                            <div className="relative hidden md:block" ref={desktopSupportRef}>
                                <button onClick={() => setDesktopSupportOpen(!desktopSupportOpen)} className={topLinkClass}>
                                    <LifebuoyIcon className="w-5 h-5" />
                                    <span>{t('support')}</span>
                                    <ChevronDownIcon className="w-4 h-4" />
                                </button>
                                <AnimatePresence>
                                    {desktopSupportOpen && (
                                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                            className={desktopDropdownClass}>
                                            <Link href="/help" className="block px-4 py-2 hover:bg-gray-100 text-sm" onClick={() => setDesktopSupportOpen(false)}>{t('help')}</Link>
                                            <Link href="/faq" className="block px-4 py-2 hover:bg-gray-100 text-sm" onClick={() => setDesktopSupportOpen(false)}>{t('footer.faq')}</Link>
                                            <Link href="/returns" className="block px-4 py-2 hover:bg-gray-100 text-sm" onClick={() => setDesktopSupportOpen(false)}>{t('footer.returns')}</Link>
                                            <Link href="/shipping" className="block px-4 py-2 hover:bg-gray-100 text-sm" onClick={() => setDesktopSupportOpen(false)}>{t('footer.shipping')}</Link>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <span className="text-white/30 hidden md:inline select-none">|</span>

                            {/* ---- DESKTOP-ONLY: Currency ---- */}
                            <div className="relative hidden md:block" ref={desktopCurrencyRef}>
                                <button onClick={() => setDesktopCurrencyOpen(!desktopCurrencyOpen)} className={topLinkClass}>
                                    <CurrencyDollarIcon className="w-5 h-5" />
                                    <span>{t('currency')}</span>
                                    <ChevronDownIcon className="w-4 h-4" />
                                </button>
                                <AnimatePresence>
                                    {desktopCurrencyOpen && (
                                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                            className={`${desktopDropdownClass} min-w-[120px]`}>
                                            <button className="block w-full text-right px-4 py-2 hover:bg-gray-100 text-sm">EGP</button>
                                            <button className="block w-full text-right px-4 py-2 hover:bg-gray-100 text-sm">USD</button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <span className="text-white/30 hidden lg:inline select-none">|</span>

                            {/* ---- DESKTOP-ONLY: Track Order ---- */}
                            <Link href="/tracking" className={`${topLinkClass} hidden lg:flex`}>
                                <TruckIcon className="w-5 h-5" />
                                <span>{t('trackOrder')}</span>
                            </Link>

                            {/* ---- ALWAYS VISIBLE: Wishlist ---- */}
                            <button className="text-white hover:text-[#D4A54A] transition relative p-2">
                                <HeartIcon className="w-6 h-6" />
                                <span className="absolute top-1 right-1 bg-[#D4A54A] text-[#0F5C45] text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center">
                                    {totalFavorites}
                                </span>
                            </button>

                            {/* ---- ALWAYS VISIBLE: Cart ---- */}
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

                            {/* ---- ALWAYS VISIBLE: User icon ---- */}
                            {/* On mobile: opens bottom sheet. On desktop: opens dropdown. */}
                            <div className="relative" ref={desktopUserRef} onClick={(e) => e.stopPropagation()}>
                                <button
                                    onClick={() => {
                                        // Detect mobile vs desktop
                                        if (window.innerWidth < 768) {
                                            setUserMenuOpen(true);
                                        } else {
                                            setDesktopUserOpen(!desktopUserOpen);
                                        }
                                    }}
                                    className="flex items-center gap-1 p-2 rounded-lg hover:bg-white/15 transition text-white"
                                >
                                    {user && (
                                        <span className="text-sm font-semibold truncate max-w-[80px] hidden sm:inline">{user.username}</span>
                                    )}
                                    <UserIcon className="w-6 h-6" />
                                    <ChevronDownIcon className="w-4 h-4 hidden md:inline" />
                                </button>

                                {/* DESKTOP dropdown only */}
                                <AnimatePresence>
                                    {desktopUserOpen && (
                                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                            className={`${desktopDropdownClass} min-w-[220px] max-h-[80vh] overflow-y-auto hidden md:block`}>
                                            {!user ? (
                                                <>
                                                    <Link href="/auth/login" className="block px-4 py-2 text-sm hover:bg-primary/10" onClick={() => setDesktopUserOpen(false)}>{t('loginTitle')}</Link>
                                                    <Link href="/auth/register" className="block px-4 py-2 text-sm hover:bg-primary/10" onClick={() => setDesktopUserOpen(false)}>{t('registerTitle')}</Link>
                                                </>
                                            ) : (
                                                <>
                                                    <Link href="/cart" className="block px-4 py-2 text-sm hover:bg-primary/10" onClick={() => setDesktopUserOpen(false)}>🛒 {t('cart')}</Link>
                                                    <Link href="/orders" className="block px-4 py-2 text-sm hover:bg-primary/10" onClick={() => setDesktopUserOpen(false)}>📋 {t('orders')}</Link>
                                                    <Link href="/suggest" className="block px-4 py-2 text-sm hover:bg-primary/10" onClick={() => setDesktopUserOpen(false)}>💡 Suggest</Link>
                                                    {(user.role === 'Vendor' || user.role === 'Admin') && (
                                                        <Link href="/vendor/dashboard" className="block px-4 py-2 text-sm hover:bg-primary/10" onClick={() => setDesktopUserOpen(false)}>📊 {t('dashboard')}</Link>
                                                    )}
                                                    {(user.role === 'Vendor' || user.role === 'Admin' || user.role === 'Employee') && (
                                                        <Link href="/admin/orders" className="block px-4 py-2 text-sm hover:bg-primary/10" onClick={() => setDesktopUserOpen(false)}>📦 Manage Orders</Link>
                                                    )}
                                                    {user.role === 'Admin' && (
                                                        <>
                                                            <Link href="/admin/users" className="block px-4 py-2 text-sm hover:bg-primary/10" onClick={() => setDesktopUserOpen(false)}>👥 {t('users')}</Link>
                                                            <Link href="/admin/products" className="block px-4 py-2 text-sm hover:bg-primary/10" onClick={() => setDesktopUserOpen(false)}>📦 Products</Link>
                                                            <Link href="/admin/pages" className="block px-4 py-2 text-sm hover:bg-primary/10" onClick={() => setDesktopUserOpen(false)}>📄 Pages</Link>
                                                            <Link href="/admin/stores" className="block px-4 py-2 text-sm hover:bg-primary/10" onClick={() => setDesktopUserOpen(false)}>🏪 Stores</Link>
                                                            <Link href="/admin" className="block px-4 py-2 text-sm hover:bg-primary/10" onClick={() => setDesktopUserOpen(false)}>⚙️ {t('admin')}</Link>
                                                            <Link href="/admin/golden-links" className="block px-4 py-2 text-sm hover:bg-primary/10" onClick={() => setDesktopUserOpen(false)}>🔗 Golden Links</Link>
                                                        </>
                                                    )}
                                                    <Link href="/chat" className="block px-4 py-2 text-sm hover:bg-primary/10" onClick={() => setDesktopUserOpen(false)}>💬 Chat</Link>
                                                    <Link href="/profile" className="block px-4 py-2 text-sm hover:bg-primary/10" onClick={() => setDesktopUserOpen(false)}>👤 {t('profile')}</Link>
                                                    <hr className="my-1 border-border" />
                                                    <button onClick={() => { logout(); setDesktopUserOpen(false); }}
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
                        MOBILE-ONLY STRIP — 4 compact items in a grid
                        ============================================================ */}
                    <div className="md:hidden border-t border-white/10 bg-[#0F5C45]">
                        <div className="grid grid-cols-4 divide-x divide-white/10">

                            <button onClick={toggleLanguage}
                                className="flex items-center justify-center gap-1 px-1 py-2 text-[11px] font-bold text-white hover:bg-white/15 transition">
                                <GlobeAltIcon className="w-4 h-4 flex-shrink-0" />
                                <span className="truncate">{i18n.language === 'ar' ? 'عربي' : 'EN'}</span>
                            </button>

                            <button onClick={() => setSupportOpen(true)}
                                className="flex items-center justify-center gap-1 px-1 py-2 text-[11px] font-bold text-white hover:bg-white/15 transition">
                                <LifebuoyIcon className="w-4 h-4 flex-shrink-0" />
                                <span className="truncate">{t('support')}</span>
                            </button>

                            <button onClick={() => setCurrencyOpen(true)}
                                className="flex items-center justify-center gap-1 px-1 py-2 text-[11px] font-bold text-white hover:bg-white/15 transition">
                                <CurrencyDollarIcon className="w-4 h-4 flex-shrink-0" />
                                <span className="truncate">{t('currency')}</span>
                            </button>

                            <Link href="/tracking"
                                className="flex items-center justify-center gap-1 px-1 py-2 text-[11px] font-bold text-white hover:bg-white/15 transition">
                                <TruckIcon className="w-4 h-4 flex-shrink-0" />
                                <span className="truncate">{t('trackOrder')}</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* ============================================================
                MOBILE BOTTOM SHEETS
                ============================================================ */}

            {/* Support Bottom Sheet */}
            <BottomSheet isOpen={supportOpen} onClose={() => setSupportOpen(false)} title={t('support')}>
                <Link href="/help" className="block px-4 py-3 hover:bg-gray-50 rounded-lg text-sm text-gray-800" onClick={() => setSupportOpen(false)}>{t('help')}</Link>
                <Link href="/faq" className="block px-4 py-3 hover:bg-gray-50 rounded-lg text-sm text-gray-800" onClick={() => setSupportOpen(false)}>{t('footer.faq')}</Link>
                <Link href="/returns" className="block px-4 py-3 hover:bg-gray-50 rounded-lg text-sm text-gray-800" onClick={() => setSupportOpen(false)}>{t('footer.returns')}</Link>
                <Link href="/shipping" className="block px-4 py-3 hover:bg-gray-50 rounded-lg text-sm text-gray-800" onClick={() => setSupportOpen(false)}>{t('footer.shipping')}</Link>
            </BottomSheet>

            {/* Currency Bottom Sheet */}
            <BottomSheet isOpen={currencyOpen} onClose={() => setCurrencyOpen(false)} title={t('currency')}>
                <button className="block w-full text-right px-4 py-3 hover:bg-gray-50 rounded-lg text-sm text-gray-800" onClick={() => setCurrencyOpen(false)}>EGP — جنيه مصري</button>
                <button className="block w-full text-right px-4 py-3 hover:bg-gray-50 rounded-lg text-sm text-gray-800" onClick={() => setCurrencyOpen(false)}>USD — دولار أمريكي</button>
            </BottomSheet>

            {/* User Menu Bottom Sheet — mobile only */}
            <BottomSheet isOpen={userMenuOpen} onClose={() => setUserMenuOpen(false)} title={user?.username || t('profile')}>
                {!user ? (
                    <>
                        <Link href="/auth/login" className="block px-4 py-3 hover:bg-gray-50 rounded-lg text-sm text-gray-800" onClick={() => setUserMenuOpen(false)}>{t('loginTitle')}</Link>
                        <Link href="/auth/register" className="block px-4 py-3 hover:bg-gray-50 rounded-lg text-sm text-gray-800" onClick={() => setUserMenuOpen(false)}>{t('registerTitle')}</Link>
                    </>
                ) : (
                    <>
                        <Link href="/cart" className="block px-4 py-3 hover:bg-gray-50 rounded-lg text-sm text-gray-800" onClick={() => setUserMenuOpen(false)}>🛒 {t('cart')}</Link>
                        <Link href="/orders" className="block px-4 py-3 hover:bg-gray-50 rounded-lg text-sm text-gray-800" onClick={() => setUserMenuOpen(false)}>📋 {t('orders')}</Link>
                        <Link href="/suggest" className="block px-4 py-3 hover:bg-gray-50 rounded-lg text-sm text-gray-800" onClick={() => setUserMenuOpen(false)}>💡 Suggest</Link>
                        <Link href="/profile" className="block px-4 py-3 hover:bg-gray-50 rounded-lg text-sm text-gray-800" onClick={() => setUserMenuOpen(false)}>👤 {t('profile')}</Link>
                        <Link href="/chat" className="block px-4 py-3 hover:bg-gray-50 rounded-lg text-sm text-gray-800" onClick={() => setUserMenuOpen(false)}>💬 Chat</Link>
                        {(user.role === 'Vendor' || user.role === 'Admin') && (
                            <Link href="/vendor/dashboard" className="block px-4 py-3 hover:bg-gray-50 rounded-lg text-sm text-gray-800" onClick={() => setUserMenuOpen(false)}>📊 {t('dashboard')}</Link>
                        )}
                        {(user.role === 'Vendor' || user.role === 'Admin' || user.role === 'Employee') && (
                            <Link href="/admin/orders" className="block px-4 py-3 hover:bg-gray-50 rounded-lg text-sm text-gray-800" onClick={() => setUserMenuOpen(false)}>📦 Manage Orders</Link>
                        )}
                        {user.role === 'Admin' && (
                            <>
                                <Link href="/admin/users" className="block px-4 py-3 hover:bg-gray-50 rounded-lg text-sm text-gray-800" onClick={() => setUserMenuOpen(false)}>👥 {t('users')}</Link>
                                <Link href="/admin/products" className="block px-4 py-3 hover:bg-gray-50 rounded-lg text-sm text-gray-800" onClick={() => setUserMenuOpen(false)}>📦 Products</Link>
                                <Link href="/admin/pages" className="block px-4 py-3 hover:bg-gray-50 rounded-lg text-sm text-gray-800" onClick={() => setUserMenuOpen(false)}>📄 Pages</Link>
                                <Link href="/admin/stores" className="block px-4 py-3 hover:bg-gray-50 rounded-lg text-sm text-gray-800" onClick={() => setUserMenuOpen(false)}>🏪 Stores</Link>
                                <Link href="/admin" className="block px-4 py-3 hover:bg-gray-50 rounded-lg text-sm text-gray-800" onClick={() => setUserMenuOpen(false)}>⚙️ {t('admin')}</Link>
                                <Link href="/admin/golden-links" className="block px-4 py-3 hover:bg-gray-50 rounded-lg text-sm text-gray-800" onClick={() => setUserMenuOpen(false)}>🔗 Golden Links</Link>
                            </>
                        )}
                        <hr className="my-2 mx-2" />
                        <button onClick={() => { logout(); setUserMenuOpen(false); }}
                            className="block w-full text-right px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg text-sm font-semibold">
                            {t('logout')}
                        </button>
                    </>
                )}
            </BottomSheet>

            {/* Unified sliding menu */}
            <UnifiedMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
        </>
    );
};

export default Navbar;