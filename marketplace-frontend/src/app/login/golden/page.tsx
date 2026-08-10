'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function GoldenLoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login } = useAuth();
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
                // The AuthContext login method expects a LoginRequest, but we have the user data.
                // We'll directly store the token and user in localStorage and update context.
                // To reuse the login method, we could call a custom method, but we'll implement a helper.
                // Simpler: we'll manually set auth state.
                localStorage.setItem('token', userData.token);
                localStorage.setItem('user', JSON.stringify(userData));
                // Force a hard reload or use router to home
                window.location.href = '/';
            } catch (err) {
                console.error('Golden login failed:', err);
                setError('Invalid or expired golden link.');
                setLoading(false);
            } finally {
                setLoading(false);
            }
        };

        loginWithToken();
    }, [searchParams, login]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <p className="text-red-600 text-xl">{error}</p>
                    <a href="/auth/login" className="text-blue-600 underline mt-4 block">Go to login</a>
                </div>
            </div>
        );
    }

    return null;
}