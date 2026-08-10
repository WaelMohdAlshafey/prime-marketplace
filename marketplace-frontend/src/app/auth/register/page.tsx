'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

export default function Register() {
    const { t } = useTranslation('common');
    const router = useRouter();
    const { register } = useAuth();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('⚠️ Passwords do not match.');
            return;
        }

        if (password.length < 6) {
            setError('⚠️ Password must be at least 6 characters.');
            return;
        }

        setLoading(true);
        try {
            await register({ username, email, password });
            router.push('/');
        } catch (err: unknown) {
            let message = t('registerError');
            if (err && typeof err === 'object' && 'response' in err) {
                const response = (err as { response: { data?: { message?: string; title?: string } } }).response;
                message = response.data?.message || response.data?.title || message;
            } else if (err instanceof Error) {
                message = err.message;
            }
            setError(message);
            console.error('Registration Error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-800">{t('registerTitle')}</h1>
                    <p className="text-gray-500 mt-2">{t('registerSubtitle')}</p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-200 text-right">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 text-right">{t('registerUsername')}</label>
                        <input
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-right"
                            placeholder="johndoe"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 text-right">{t('registerEmail')}</label>
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
                        <label className="block text-sm font-medium text-gray-700 mb-1 text-right">{t('registerPassword')}</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                minLength={6}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-right pr-4"
                                placeholder="Min 6 characters"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 text-right">Confirm Password</label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                required
                                minLength={6}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-right pr-4"
                                placeholder="Confirm your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50"
                    >
                        {loading ? t('registerLoading') : t('registerButton')}
                    </button>

                    <p className="text-center text-sm text-gray-600">
                        {t('registerLogin')}{' '}
                        <Link href="/auth/login" className="text-blue-600 hover:underline font-medium">
                            {t('loginTitle')}
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}