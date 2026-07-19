'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ShoppingCartIcon, UserIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
    const { user, logout, isLoading } = useAuth();

    if (isLoading) {
        return (
            <nav className="bg-white shadow-md">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <span className="text-2xl font-bold text-blue-600">🛒 Prime</span>
                    <span className="text-gray-400">Loading...</span>
                </div>
            </nav>
        );
    }

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                    🛒 Prime
                </Link>

                <div className="flex items-center gap-6">
                    <Link href="/cart" className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1">
                        <ShoppingCartIcon className="w-5 h-5" />
                        <span>Cart</span>
                    </Link>

                    <Link href="/contact" className="text-gray-600 hover:text-blue-600 transition-colors">
                        📞 Contact
                    </Link>

                    <Link href="/about" className="text-gray-600 hover:text-blue-600 transition-colors">
                        ℹ️ About
                    </Link>

                    {user ? (
                        <>
                            <Link href="/orders" className="text-gray-600 hover:text-blue-600 transition-colors">
                                📋 Orders
                            </Link>
                            <Link href="/vendor/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors">
                                Dashboard
                            </Link>
                            <button
                                onClick={logout}
                                className="text-gray-600 hover:text-red-600 transition-colors"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/auth/login" className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1">
                                <UserIcon className="w-5 h-5" />
                                <span>Login</span>
                            </Link>
                            <Link href="/auth/register" className="btn-primary">
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}