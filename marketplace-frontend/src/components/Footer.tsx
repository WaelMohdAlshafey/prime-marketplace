'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '@/lib/api';

// ✅ Define a proper type for API error responses
interface ApiError {
    response?: {
        data?: {
            message?: string;
        };
    };
    message?: string;
}

export default function Footer() {
    const { t } = useTranslation('common');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            setMessage({ type: 'error', text: 'Please enter your email.' });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            await api.post('/api/Newsletter/subscribe', { email });
            setMessage({ type: 'success', text: '✅ Subscription successful!' });
            setEmail('');
        } catch (err: unknown) {
            // ✅ Proper type handling – no `any`
            let errorMsg = 'Something went wrong. Please try again.';
            if (err && typeof err === 'object') {
                const error = err as ApiError;
                if (error.response?.data?.message) {
                    errorMsg = error.response.data.message;
                } else if (error.message) {
                    errorMsg = error.message;
                }
            }
            setMessage({ type: 'error', text: errorMsg });
        } finally {
            setLoading(false);
            setTimeout(() => setMessage(null), 5000);
        }
    };

    return (
        <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-white mt-16 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')]"></div>
            </div>

            <div className="container mx-auto px-4 py-12 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-right">
                    {/* Company */}
                    <div>
                        <div className="flex items-center gap-2.5 mb-4 justify-end">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#0F5C45] to-[#1A7A5C] rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                P
                            </div>
                            <span className="text-xl font-bold text-white">Prime</span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            {t('footer.companyDescription')}
                        </p>
                        <div className="flex gap-3 mt-4 justify-end">
                            <span className="text-gray-500">❤️</span>
                            <span className="text-gray-500">🛍️</span>
                            <span className="text-gray-500">✨</span>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold mb-4 text-white text-lg">{t('footer.quickLinks')}</h4>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li>
                                <Link href="/" className="hover:text-[#D4A54A] transition duration-300 hover:translate-x-1 inline-block">
                                    {t('footer.home')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/" className="hover:text-[#D4A54A] transition duration-300 hover:translate-x-1 inline-block">
                                    {t('footer.products')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/stores" className="hover:text-[#D4A54A] transition duration-300 hover:translate-x-1 inline-block">
                                    {t('footer.stores')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/offers" className="hover:text-[#D4A54A] transition duration-300 hover:translate-x-1 inline-block">
                                    {t('footer.offers')}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h4 className="font-semibold mb-4 text-white text-lg">{t('footer.customerService')}</h4>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li>
                                <Link href="/contact" className="hover:text-[#D4A54A] transition duration-300 hover:translate-x-1 inline-block">
                                    {t('footer.contact')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/faq" className="hover:text-[#D4A54A] transition duration-300 hover:translate-x-1 inline-block">
                                    {t('footer.faq')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/returns" className="hover:text-[#D4A54A] transition duration-300 hover:translate-x-1 inline-block">
                                    {t('footer.returns')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/shipping" className="hover:text-[#D4A54A] transition duration-300 hover:translate-x-1 inline-block">
                                    {t('footer.shipping')}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="font-semibold mb-4 text-white text-lg">{t('footer.newsletter')}</h4>
                        <p className="text-gray-400 text-sm mb-3">
                            {t('footer.newsletterDescription')}
                        </p>

                        {message && (
                            <div className={`mb-3 p-2 rounded text-sm ${message.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                                }`}>
                                {message.text}
                            </div>
                        )}

                        <form onSubmit={handleSubscribe} className="flex flex-row-reverse">
                            <input
                                type="email"
                                placeholder={t('footer.emailPlaceholder')}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="flex-1 px-3 py-2 rounded-l-none rounded-r-lg bg-gray-800/50 border border-gray-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5C45] focus:border-transparent"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-gradient-to-r from-[#0F5C45] to-[#1A7A5C] px-4 py-2 rounded-l-lg rounded-r-none text-sm font-medium hover:shadow-lg hover:shadow-[#0F5C45]/20 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? '...' : t('footer.subscribe')}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-500 text-xs">
                    <p>{t('footer.copyright')}</p>
                    <p className="mt-1 flex items-center justify-center gap-1">
                        {t('footer.madeWith')} <Heart className="w-3 h-3 text-red-500 fill-red-500 animate-pulse" /> by Prime Team
                    </p>
                </div>
            </div>
        </footer>
    );
}