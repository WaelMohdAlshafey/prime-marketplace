'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Heart, Mail, Phone, MapPin, Apple, Smartphone, ShoppingBag } from 'lucide-react';
import api from '@/lib/api';

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
            setMessage({ type: 'error', text: 'يرجى إدخال بريدك الإلكتروني.' });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            await api.post('/api/Newsletter/subscribe', { email });
            setMessage({ type: 'success', text: '✅ تم الاشتراك بنجاح!' });
            setEmail('');
        } catch (err: unknown) {
            let errorMsg = 'حدث خطأ، حاول مرة أخرى.';
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
        <footer className="footer">
            <div className="container">
                {/* Column 1: About & App Downloads */}
                <div>
                    <h4 className="footer-title flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5" />
                        Prime
                    </h4>
                    <p className="text-[#9E9E9E] text-sm leading-relaxed mb-4">
                        منصة تسوق فاخرة تقدم أفضل المنتجات من برامج، تجميل، أزياء، وإكسسوارات.
                    </p>
                    <div className="app-badges">
                        <Link href="#" className="app-badge">
                            <Apple className="w-5 h-5" />
                            <span>App Store</span>
                        </Link>
                        <Link href="#" className="app-badge">
                            <Smartphone className="w-5 h-5" />
                            <span>Google Play</span>
                        </Link>
                    </div>
                </div>

                {/* Column 2: Quick Links */}
                <div>
                    <h4 className="footer-title">روابط سريعة</h4>
                    <Link href="/">{t('footer.home')}</Link>
                    <Link href="/products">{t('footer.products')}</Link>
                    <Link href="/stores">{t('footer.stores')}</Link>
                    <Link href="/offers">{t('footer.offers')}</Link>
                </div>

                {/* Column 3: Support */}
                <div>
                    <h4 className="footer-title">خدمة العملاء</h4>
                    <Link href="/contact">{t('footer.contact')}</Link>
                    <Link href="/faq">{t('footer.faq')}</Link>
                    <Link href="/returns">{t('footer.returns')}</Link>
                    <Link href="/shipping">{t('footer.shipping')}</Link>
                </div>

                {/* Column 4: Newsletter */}
                <div>
                    <h4 className="footer-title">{t('footer.newsletter')}</h4>
                    <p className="text-[#9E9E9E] text-sm mb-3">
                        {t('footer.newsletterDescription')}
                    </p>

                    {message && (
                        <div className={`mb-3 p-2 rounded text-sm ${message.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubscribe} className="newsletter-input">
                        <input
                            type="email"
                            placeholder={t('footer.emailPlaceholder')}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <button type="submit" disabled={loading}>
                            {loading ? '...' : t('footer.subscribe')}
                        </button>
                    </form>
                </div>

                {/* Copyright */}
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