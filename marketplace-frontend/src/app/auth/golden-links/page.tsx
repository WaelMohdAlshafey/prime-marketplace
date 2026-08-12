'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { AuthResponse } from '@/types';

export default function GoldenLoginPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        console.log('🔍 GoldenLoginPage: useEffect started');

        // 1. Get token from URL
        const token = searchParams?.get('token');
        console.log('🔑 Token from URL:', token);

        if (!token) {
            console.error('❌ No token found in URL');
            setError('No token provided. The link may be malformed.');
            setLoading(false);
            return;
        }

        if (token.length < 10) {
            console.error('❌ Token too short:', token.length);
            setError('Invalid token format. Please check your link.');
            setLoading(false);
            return;
        }

        console.log('✅ Token looks valid, proceeding to login...');

        const loginWithToken = async () => {
            try {
                console.log('📤 Sending POST to /api/Auth/golden-login');
                const response = await api.post<AuthResponse>('/api/Auth/golden-login', { token });
                console.log('✅ API response status:', response.status);
                console.log('✅ API response data:', response.data);

                const userData = response.data;
                console.log('👤 User data:', userData);

                localStorage.setItem('token', userData.token);
                localStorage.setItem('user', JSON.stringify(userData));

                const redirectPath = userData.redirectPath || '/';
                console.log('🔄 Redirecting to:', redirectPath);
                router.push(redirectPath);
            } catch (err: any) {
                console.error('❌ Golden login failed:', err);
                console.error('📦 Error object:', err);
                console.error('📦 Error response:', err.response);
                console.error('📦 Error response data:', err.response?.data);
                const message = err.response?.data?.message || 'Invalid or expired golden link.';
                setError(message);
                setLoading(false);
            }
        };

        loginWithToken();
    }, [searchParams, router]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#0F5C45]"></div>
                <p className="mt-4 text-gray-600 text-lg">Logging you in...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
                <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
                    <div className="text-7xl mb-6">🔗</div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Invalid or Expired Link</h1>
                    <p className="text-gray-600 mb-6 leading-relaxed">{error}</p>
                    <div className="flex flex-col gap-3">
                        <a
                            href="/auth/login"
                            className="inline-block bg-[#0F5C45] text-white px-6 py-3 rounded-xl hover:bg-[#0A4735] transition duration-200 font-medium"
                        >
                            Go to Login
                        </a>
                        <a
                            href="/"
                            className="inline-block text-[#0F5C45] hover:underline text-sm"
                        >
                            Return to Homepage
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}