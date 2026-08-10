'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import api from '@/lib/api';

export default function GoldenLoginPage() {
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const token = searchParams?.get('token');
        if (!token) {
            setError('No token provided.');
            setLoading(false);
            return;
        }

        const loginWithToken = async () => {
            try {
                const response = await api.post('/api/Auth/golden-login', { token });
                const userData = response.data;
                localStorage.setItem('token', userData.token);
                localStorage.setItem('user', JSON.stringify(userData));
                window.location.href = '/';
            } catch (err: any) {
                console.error('Golden login failed:', err);
                setError(err.response?.data?.message || 'Invalid or expired golden link.');
                setLoading(false);
            }
        };

        loginWithToken();
    }, [searchParams]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F5C45]"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center max-w-md p-8 bg-white rounded-xl shadow-md">
                    <div className="text-6xl mb-4">🔗</div>
                    <p className="text-red-600 text-xl font-semibold mb-2">Invalid or Expired Link</p>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <a
                        href="/auth/login"
                        className="inline-block bg-[#0F5C45] text-white px-6 py-2 rounded-lg hover:bg-[#0A4735] transition"
                    >
                        Go to Login
                    </a>
                </div>
            </div>
        );
    }

    return null;
}