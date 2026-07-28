'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';

export default function Login() {
    const { t } = useTranslation('common');
    const router = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login({ email, password });
            router.push('/');
        } catch (err: unknown) {
            console.error('Login error:', err);
            let message = t('loginError');
            if (err && typeof err === 'object' && 'response' in err) {
                const response = (err as { response: { data?: { message?: string; title?: string } } }).response;
                message = response.data?.message || response.data?.title || message;
            } else if (err instanceof Error) {
                message = err.message;
            }
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-800">{t('loginTitle')}</h1>
                    <p className="text-gray-500 mt-2">{t('loginSubtitle')}</p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-200 text-right">
                            ⚠️ {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 text-right">{t('loginEmail')}</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-right"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 text-right">{t('loginPassword')}</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-right"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50"
                    >
                        {loading ? t('loginLoading') : t('loginButton')}
                    </button>

                    <p className="text-center text-sm text-gray-600">
                        {t('loginRegister')}{' '}
                        <Link href="/auth/register" className="text-blue-600 hover:underline font-medium">
                            {t('registerTitle')}
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}