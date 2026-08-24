'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Menu, X } from 'lucide-react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Redirect if not logged in or not admin
    useEffect(() => {
        if (isLoading) return;
        if (!user) {
            router.push('/auth/login');
            return;
        }
        if (user.role !== 'Admin') {
            router.push('/');
            return;
        }
    }, [user, isLoading, router]);

    // Close sidebar on route change (mobile)
    useEffect(() => {
        const handleRouteChange = () => setSidebarOpen(false);
        window.addEventListener('popstate', handleRouteChange);
        return () => window.removeEventListener('popstate', handleRouteChange);
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F5C45]" />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-[#F8F9FA] overflow-x-hidden">
            {/* Mobile hamburger – fixed on top left */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md lg:hidden"
                aria-label="Toggle sidebar"
            >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Overlay – covers everything when sidebar is open on mobile */}
            <div
                className={`fixed inset-0 bg-black/50 z-40 transition-opacity lg:hidden ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar – fixed, with max-width to prevent overflow */}
            <aside
                className={`fixed top-0 left-0 h-full w-64 max-w-[85vw] bg-gradient-to-b from-gray-900 to-gray-800 p-4 flex flex-col z-50 transition-transform duration-300 lg:static lg:translate-x-0 overflow-y-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                style={{ paddingTop: 'env(safe-area-inset-top, 1rem)' }}
            >
                <AdminSidebar onLinkClick={() => setSidebarOpen(false)} />
            </aside>

            {/* Main content – with proper padding to prevent overflow */}
            <main className="flex-1 p-4 md:p-8 overflow-x-hidden max-w-[calc(100vw-1rem)] lg:max-w-full">
                {children}
            </main>
        </div>
    );
}