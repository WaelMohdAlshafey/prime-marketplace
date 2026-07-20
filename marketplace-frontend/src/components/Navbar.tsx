'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Logo from './Logo';
import {
    ShoppingCartIcon,
    UserIcon,
    HeartIcon,
    MagnifyingGlassIcon,
    GlobeAltIcon,
    CurrencyDollarIcon,
    ClipboardDocumentListIcon,   // ✅ For Orders
    ChartBarIcon,               // ✅ For Dashboard
} from '@heroicons/react/24/outline';
import { AuthResponse } from '@/types';

// ============================================================
// TYPES
// ============================================================
interface MainHeaderProps {
    user: AuthResponse | null;
}

// ============================================================
// TOP BAR – Arabic
// ============================================================
const TopBar = () => (
    <div className="bg-[#0F5C45] text-white text-xs py-1.5">
        <div className="container mx-auto px-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                    <span className="text-yellow-400">✦</span> شحن مجاني للطلبات فوق 500 جنيه
                </span>
                <span className="text-white/30">|</span>
                <span>📦 تتبع الطلب</span>
            </div>
            <div className="flex items-center gap-3">
                <button className="flex items-center gap-1 hover:text-yellow-400 transition">
                    <GlobeAltIcon className="w-3.5 h-3.5" /> العربية
                </button>
                <button className="flex items-center gap-1 hover:text-yellow-400 transition">
                    <CurrencyDollarIcon className="w-3.5 h-3.5" /> بالجنيه
                </button>
                <button className="hover:text-yellow-400 transition">الدعم</button>
            </div>
        </div>
    </div>
);

// ============================================================
// MAIN HEADER (with functional search)
// ============================================================
const MainHeader = ({ user }: MainHeaderProps) => {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            router.push(`/?q=${encodeURIComponent(searchTerm.trim())}`);
        } else {
            router.push('/');
        }
    };

    return (
        <div className="bg-white border-b border-gray-100 shadow-header py-3">
            <div className="container mx-auto px-4 flex items-center gap-4">
                <Logo />

                <form onSubmit={handleSearch} className="flex-1 max-w-2xl relative">
                    <input
                        type="text"
                        placeholder="ابحث عن منتجات، علامات تجارية، ومتاجر..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-5 py-3 pr-12 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0F5C45]/30 focus:border-[#0F5C45] transition bg-gray-50 hover:bg-white text-right"
                    />
                    <MagnifyingGlassIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <button
                        type="submit"
                        className="absolute left-1.5 top-1/2 -translate-y-1/2 bg-[#0F5C45] text-white px-5 py-1.5 rounded-xl text-sm font-medium hover:bg-[#0A4735] transition shadow-soft"
                    >
                        بحث
                    </button>
                </form>

                <div className="flex items-center gap-4 flex-shrink-0">
                    <button className="text-gray-600 hover:text-[#0F5C45] transition relative">
                        <HeartIcon className="w-6 h-6" />
                        <span className="absolute -top-1 -right-1 bg-[#0F5C45] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                            0
                        </span>
                    </button>
                    <Link href="/cart" className="text-gray-600 hover:text-[#0F5C45] transition relative">
                        <ShoppingCartIcon className="w-6 h-6" />
                        <span className="absolute -top-1 -right-1 bg-[#0F5C45] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                            0
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
// NAVIGATION MENU – Arabic Categories
// ============================================================
const NavMenu = () => (
    <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4">
            <div className="flex items-center gap-6 py-2.5 overflow-x-auto whitespace-nowrap text-sm">
                <Link href="/" className="text-[#0F5C45] font-semibold hover:text-[#0A4735] transition border-b-2 border-[#0F5C45] pb-1">
                    الرئيسية
                </Link>
                <Link href="/software" className="text-gray-600 hover:text-[#0F5C45] transition pb-1">
                    برامج
                </Link>
                <Link href="/hair-care" className="text-gray-600 hover:text-[#0F5C45] transition pb-1">
                    العناية بالشعر
                </Link>
                <Link href="/skin-care" className="text-gray-600 hover:text-[#0F5C45] transition pb-1">
                    العناية بالبشرة
                </Link>
                <Link href="/fashion" className="text-gray-600 hover:text-[#0F5C45] transition pb-1">
                    أزياء
                </Link>
                <Link href="/accessories" className="text-gray-600 hover:text-[#0F5C45] transition pb-1">
                    إكسسوارات
                </Link>
                <Link href="/electronics" className="text-gray-600 hover:text-[#0F5C45] transition pb-1">
                    إلكترونيات
                </Link>
                <Link href="/supplements" className="text-gray-600 hover:text-[#0F5C45] transition pb-1">
                    مكملات غذائية
                </Link>
                <Link href="/home" className="text-gray-600 hover:text-[#0F5C45] transition pb-1">
                    المنزل
                </Link>
                <Link href="/stores" className="text-gray-600 hover:text-[#0F5C45] transition pb-1">
                    المتاجر
                </Link>
                <Link href="/offers" className="text-orange-500 font-medium hover:text-orange-600 transition pb-1">
                    🔥 عروض
                </Link>
                <Link href="/contact" className="text-gray-600 hover:text-[#0F5C45] transition pb-1">
                    تواصل معنا
                </Link>
            </div>
        </div>
    </div>
);

// ============================================================
// SECONDARY NAVBAR (Logged-in user only) – with REAL ICONS
// ============================================================
const UserNav = ({ user, logout }: { user: AuthResponse; logout: () => void }) => (
    <div className="bg-[#0F5C45] text-white text-sm py-2">
        <div className="container mx-auto px-4 flex justify-between items-center">
            <div className="flex items-center gap-6">
                {/* 🛍️ Cart – real icon */}
                <Link href="/cart" className="hover:text-yellow-300 transition flex items-center gap-2">
                    <ShoppingCartIcon className="w-4 h-4" /> سلتي
                </Link>
                {/* 📋 Orders – real icon */}
                <Link href="/orders" className="hover:text-yellow-300 transition flex items-center gap-2">
                    <ClipboardDocumentListIcon className="w-4 h-4" /> طلباتي
                </Link>
                {/* 📊 Dashboard – real icon */}
                <Link href="/vendor/dashboard" className="hover:text-yellow-300 transition flex items-center gap-2">
                    <ChartBarIcon className="w-4 h-4" /> لوحة التحكم
                </Link>
            </div>
            <div className="flex items-center gap-4">
                <span className="text-xs text-white/70">مرحباً، {user.username}</span>
                <button
                    onClick={logout}
                    className="text-xs bg-white/10 px-3 py-1 rounded-full hover:bg-white/20 transition"
                >
                    تسجيل الخروج
                </button>
            </div>
        </div>
    </div>
);

// ============================================================
// MAIN NAVBAR EXPORT
// ============================================================
export default function Navbar() {
    const { user, logout, isLoading } = useAuth();

    if (isLoading) {
        return <div className="bg-white shadow-md py-4 text-center text-gray-500">جاري التحميل...</div>;
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