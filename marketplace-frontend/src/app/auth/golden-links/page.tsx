'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function GoldenLoginPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const token = searchParams?.get('token');

        if (!token) {
            setError('No token provided. The link may be malformed.');
            setLoading(false);
            return;
        }

        if (token.length < 10) {
            setError('Invalid token format. Please check your link.');
            setLoading(false);
            return;
        }

        const loginWithToken = async () => {
            try {
                const response = await api.post('/api/Auth/golden-login', { token });
                const userData = response.data;

                // Store authentication data
                localStorage.setItem('token', userData.token);
                localStorage.setItem('user', JSON.stringify(userData));

                // Redirect to homepage
                router.push('/');
            } catch (err: any) {
                console.error('Golden login failed:', err);
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