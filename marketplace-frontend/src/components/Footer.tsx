// marketplace-frontend/components/Footer.tsx

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
        <footer className="footer">
            <div className="container">
                <div>
                    <h4 className="footer-title flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5" />
                        Prime
                    </h4>
                    <p className="text-[#C8D8DE] text-sm leading-relaxed mb-4">
                        منصة تسوق فاخرة تقدم أفضل المنتجات من برامج، تجميل، أزياء، وإكسسوارات.
                    </p>
                    <div className="flex gap-2">
                        <Link href="#" className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20 transition text-sm text-white">
                            <Apple className="w-4 h-4" /> App Store
                        </Link>
                        <Link href="#" className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20 transition text-sm text-white">
                            <Smartphone className="w-4 h-4" /> Google Play
                        </Link>
                    </div>
                </div>

                <div>
                    <h4 className="footer-title">روابط سريعة</h4>
                    <Link href="/">{t('footer.home')}</Link>
                    <Link href="/products">{t('footer.products')}</Link>
                    <Link href="/stores">{t('footer.stores')}</Link>
                    <Link href="/offers">{t('footer.offers')}</Link>
                </div>

                <div>
                    <h4 className="footer-title">خدمة العملاء</h4>
                    <Link href="/contact">{t('footer.contact')}</Link>
                    <Link href="/faq">{t('footer.faq')}</Link>
                    <Link href="/returns">{t('footer.returns')}</Link>
                    <Link href="/shipping">{t('footer.shipping')}</Link>
                </div>

                <div>
                    <h4 className="footer-title">{t('footer.newsletter')}</h4>
                    <p className="text-[#C8D8DE] text-sm mb-3">
                        {t('footer.newsletterDescription')}
                    </p>

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
                            className="flex-1 px-4 py-2 bg-transparent text-white placeholder:text-white/50 outline-none"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-[#D27736] text-white font-medium hover:bg-[#B05E2A] transition disabled:opacity-50"
                        >
                            {loading ? '...' : t('footer.subscribe')}
                        </button>
                    </form>
                </div>

                <div className="copyright">
                    {t('footer.copyright')}
                    <span className="flex items-center justify-center gap-1 mt-1">
                        {t('footer.madeWith')} <Heart className="w-3 h-3 text-red-500 fill-red-500 animate-pulse" /> by Prime Team
                    </span>
                </div>
            </div>
        </footer>
    );
}