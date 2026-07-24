'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function AdminDashboard() {
    const { user, isLoading } = useAuth();
    const router = useRouter();

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
    }, [user, isLoading]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F5C45]"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 text-right">⚙️ لوحة تحكم المدير</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Card: User Management */}
                <Link
                    href="/admin/users"
                    className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6 text-center hover:-translate-y-1"
                >
                    <div className="text-5xl mb-4">👥</div>
                    <h3 className="text-xl font-semibold text-gray-800">إدارة المستخدمين</h3>
                    <p className="text-gray-500 text-sm mt-2">عرض، تعديل، حذف المستخدمين والأدوار</p>
                </Link>

                {/* Card: System Settings (placeholder) */}
                <div className="bg-white rounded-2xl shadow-md p-6 text-center opacity-60 cursor-not-allowed">
                    <div className="text-5xl mb-4">⚙️</div>
                    <h3 className="text-xl font-semibold text-gray-800">إعدادات النظام</h3>
                    <p className="text-gray-500 text-sm mt-2">قريباً...</p>
                </div>

                {/* Card: Reports (placeholder) */}
                <div className="bg-white rounded-2xl shadow-md p-6 text-center opacity-60 cursor-not-allowed">
                    <div className="text-5xl mb-4">📊</div>
                    <h3 className="text-xl font-semibold text-gray-800">التقارير</h3>
                    <p className="text-gray-500 text-sm mt-2">قريباً...</p>
                </div>
            </div>
        </div>
    );
}