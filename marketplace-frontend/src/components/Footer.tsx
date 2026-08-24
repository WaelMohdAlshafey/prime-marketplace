'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Heart, Mail, Phone, MapPin, Apple, Smartphone, ShoppingBag } from 'lucide-react';
import api from '@/lib/api';

export default function Footer() {
    const { t } = useTranslation('common');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            setMessage({ type: 'error', text: 'يرجى إدخال بريدك الإلكتروني.' });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            await api.post('/api/Newsletter/subscribe', { email });
            setMessage({ type: 'success', text: '✅ تم الاشتراك بنجاح!' });
            setEmail('');
        } catch (err: any) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'حدث خطأ، حاول مرة أخرى.' });
        } finally {
            setLoading(false);
            setTimeout(() => setMessage(null), 5000);
        }
    };

    return (
        <footer className="bg-footer-bg text-footer-text mt-12 py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                    <div>
                        <h4 className="font-bold text-footer-heading text-lg mb-4 flex items-center gap-2">
                            <ShoppingBag className="w-5 h-5" />
                            Prime
                        </h4>
                        <p className="text-footer-text text-sm leading-relaxed mb-4">
                            منصة تسوق فاخرة تقدم أفضل المنتجات من برامج، تجميل، أزياء، وإكسسوارات.
                        </p>
                        <div className="flex gap-2">
                            <Link href="#" className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20 transition text-sm text-footer-text hover:text-white">
                                <Apple className="w-4 h-4" /> App Store
                            </Link>
                            <Link href="#" className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20 transition text-sm text-footer-text hover:text-white">
                                <Smartphone className="w-4 h-4" /> Google Play
                            </Link>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-footer-heading text-lg mb-4">{t('footer.quickLinks')}</h4>
                        <Link href="/" className="block py-1.5 text-footer-text hover:text-white transition">{t('footer.home')}</Link>
                        <Link href="/products" className="block py-1.5 text-footer-text hover:text-white transition">{t('footer.products')}</Link>
                        <Link href="/stores" className="block py-1.5 text-footer-text hover:text-white transition">{t('footer.stores')}</Link>
                        <Link href="/offers" className="block py-1.5 text-footer-text hover:text-white transition">{t('footer.offers')}</Link>
                    </div>

                    <div>
                        <h4 className="font-bold text-footer-heading text-lg mb-4">{t('footer.customerService')}</h4>
                        <Link href="/contact" className="block py-1.5 text-footer-text hover:text-white transition">{t('footer.contact')}</Link>
                        <Link href="/faq" className="block py-1.5 text-footer-text hover:text-white transition">{t('footer.faq')}</Link>
                        <Link href="/returns" className="block py-1.5 text-footer-text hover:text-white transition">{t('footer.returns')}</Link>
                        <Link href="/shipping" className="block py-1.5 text-footer-text hover:text-white transition">{t('footer.shipping')}</Link>
                    </div>

                    <div>
                        <h4 className="font-bold text-footer-heading text-lg mb-4">{t('footer.newsletter')}</h4>
                        <p className="text-footer-text text-sm mb-3">{t('footer.newsletterDescription')}</p>

                        {message && (
                            <div className={`mb-3 p-2 rounded text-sm ${message.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                                {message.text}
                            </div>
                        )}

                        <form onSubmit={handleSubscribe} className="flex rounded-lg overflow-hidden border border-white/20">
                            <input
                                type="email"
                                placeholder={t('footer.emailPlaceholder')}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="flex-1 px-4 py-2 bg-transparent text-footer-text placeholder:text-footer-text/50 outline-none"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 bg-secondary text-white font-medium hover:bg-secondary-dark transition disabled:opacity-50"
                            >
                                {loading ? '...' : t('footer.subscribe')}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-white/10 mt-8 pt-6 text-center text-footer-text text-sm">
                    {t('footer.copyright')}
                    <span className="flex items-center justify-center gap-1 mt-1">
                        {t('footer.madeWith')} <Heart className="w-3 h-3 text-red-500 fill-red-500 animate-pulse" /> by Prime Team
                    </span>
                </div>
            </div>
        </footer>
    );
}