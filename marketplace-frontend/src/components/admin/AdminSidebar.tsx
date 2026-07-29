'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import {
    LayoutDashboard,
    Users,
    Package,
    ShoppingBag,
    Mail,
    Settings,
    LogOut,
    BarChart3,
} from 'lucide-react';

interface NavItem {
    name: string;
    href: string;
    icon: React.ReactNode;
}

export default function AdminSidebar() {
    const { t } = useTranslation('common');
    const pathname = usePathname();

    const navItems: NavItem[] = [
        { name: 'Dashboard', href: '/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
        { name: 'Users', href: '/admin/users', icon: <Users className="w-5 h-5" /> },
        { name: 'Products', href: '/admin/products', icon: <Package className="w-5 h-5" /> },
        { name: 'Orders', href: '/admin/orders', icon: <ShoppingBag className="w-5 h-5" /> },
        { name: 'Newsletter', href: '/admin/newsletter', icon: <Mail className="w-5 h-5" /> },
        { name: 'Analytics', href: '/admin/analytics', icon: <BarChart3 className="w-5 h-5" /> },
        { name: 'Settings', href: '/admin/settings', icon: <Settings className="w-5 h-5" /> },
    ];

    return (
        <aside className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen p-4 flex flex-col sticky top-0">
            {/* Logo */}
            <div className="mb-8 px-2">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#0F5C45] rounded-lg flex items-center justify-center text-white font-bold">P</div>
                    <span className="text-white font-bold text-xl">Prime Admin</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive
                                    ? 'bg-[#0F5C45] text-white shadow-lg shadow-[#0F5C45]/20'
                                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                                }`}
                        >
                            {item.icon}
                            <span className="font-medium">{item.name}</span>
                            {isActive && (
                                <span className="ml-auto w-1.5 h-6 bg-white rounded-full"></span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="border-t border-gray-700 pt-4 mt-4">
                <Link
                    href="/auth/logout"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                </Link>
            </div>
        </aside>
    );
}