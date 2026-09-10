// @ts-nocheck
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Heart, Mail, Phone, MapPin, ShoppingBag } from 'lucide-react';
import api from '@/lib/api';
import { getStoreSettings } from '@/lib/storeApi';

export default function Footer() {
    const { t, i18n } = useTranslation('common');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [settings, setSettings] = useState(null);
    const lang = i18n.language || 'ar';

    // Fetch store settings + dynamic footer pages (from admin Pages)
    const [footerPages, setFooterPages] = useState([]);

    useEffect(() => {
        getStoreSettings().then(setSettings).catch(() => { });
        api.get('/api/Pages/navigation')
            .then(res => setFooterPages(res.data.footerPages || []))
            .catch(() => { });
    }, []);

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!email) {
            setMessage({ type: 'error', text: lang === 'ar' ? 'يرجى إدخال بريدك الإلكتروني.' : 'Please enter your email.' });
            return;
        }
        setLoading(true);
        setMessage(null);
        try {
            await api.post('/api/Newsletter/subscribe', { email });
            setMessage({ type: 'success', text: lang === 'ar' ? '✅ تم الاشتراك بنجاح!' : '✅ Subscribed successfully!' });
            setEmail('');
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || (lang === 'ar' ? 'حدث خطأ، حاول مرة أخرى.' : 'Something went wrong.') });
        } finally {
            setLoading(false);
            setTimeout(() => setMessage(null), 5000);
        }
    };

    // Extract contact info safely
    const whatsapp = settings?.whatsapp || '';
    const landline = settings?.landline || '';
    const emailContact = settings?.emails?.[0] || '';
    const address = settings?.address || '';
    const location = settings?.location || '';

    return (
        <footer className="bg-footer-bg text-footer-text mt-12 pt-12 pb-6">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

                    {/* 1. Brand + Newsletter */}
                    <div className="md:col-span-2">
                        <h4 className="font-bold text-footer-heading text-lg mb-4 flex items-center gap-2">
                            <ShoppingBag className="w-5 h-5" />
                            {settings?.storeName || 'Prime'}
                        </h4>
                        <p className="text-footer-text text-sm leading-relaxed mb-6 max-w-lg">
                            {lang === 'ar'
                                ? 'منصة تسوق فاخرة تقدم أفضل المنتجات من برامج، تجميل، أزياء، وإكسسوارات.'
                                : 'A premium marketplace offering the best products in software, beauty, fashion, and accessories.'}
                        </p>

                        <h4 className="font-bold text-footer-heading text-base mb-3">
                            {lang === 'ar' ? '📬 اشترك في النشرة البريدية' : '📬 Join our newsletter'}
                        </h4>
                        <p className="text-footer-text text-sm mb-3">
                            {lang === 'ar' ? 'اشترك لتحصل على أحدث العروض والمنتجات.' : 'Get the latest offers and products in your inbox.'}
                        </p>

                        {message && (
                            <div className={`mb-3 p-2 rounded text-sm ${message.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                                {message.text}
                            </div>
                        )}

                        <form onSubmit={handleSubscribe} className="flex rounded-lg overflow-hidden border border-white/20 max-w-md">
                            <input
                                type="email"
                                placeholder={lang === 'ar' ? 'بريدك الإلكتروني' : 'Your email'}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="flex-1 px-4 py-2.5 bg-transparent text-footer-text placeholder:text-footer-text/50 outline-none"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-5 py-2.5 bg-secondary text-white font-medium hover:bg-secondary-dark transition disabled:opacity-50"
                            >
                                {loading ? '...' : (lang === 'ar' ? 'اشتراك' : 'Subscribe')}
                            </button>
                        </form>
                    </div>

                    {/* 2. Contact + Dynamic footer pages (from Admin Pages) */}
                    <div>
                        <h4 className="font-bold text-footer-heading text-base mb-4">
                            {lang === 'ar' ? 'تواصل معنا' : 'Contact Us'}
                        </h4>

                        <ul className="space-y-3 text-sm">
                            {landline && (
                                <li className="flex items-start gap-2">
                                    <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                    <span className="font-mono" dir="ltr">{landline}</span>
                                </li>
                            )}
                            {whatsapp && (
                                <li className="flex items-start gap-2">
                                    <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                    <span className="font-mono" dir="ltr">WhatsApp: {whatsapp}</span>
                                </li>
                            )}
                            {emailContact && (
                                <li className="flex items-start gap-2">
                                    <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                    <span>{emailContact}</span>
                                </li>
                            )}
                            {(address || location) && (
                                <li className="flex items-start gap-2">
                                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                    <span>{address}{address && location ? ' — ' : ''}{location}</span>
                                </li>
                            )}
                        </ul>

                        {/* Dynamic footer pages from admin Pages manager */}
                        {footerPages.length > 0 && (
                            <div className="mt-6">
                                <h4 className="font-bold text-footer-heading text-base mb-3">
                                    {lang === 'ar' ? 'روابط' : 'Links'}
                                </h4>
                                <ul className="space-y-2 text-sm">
                                    {footerPages.map(p => (
                                        <li key={p.id}>
                                            <Link href={`/${p.slug}`} className="text-footer-text hover:text-white transition">
                                                {p.title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-white/10 mt-10 pt-5 text-center text-footer-text text-sm">
                    <p>
                        © {new Date().getFullYear()} {settings?.storeName || 'Prime'}.{' '}
                        {lang === 'ar' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
                    </p>
                    <p className="flex items-center justify-center gap-1 mt-1 text-xs opacity-70">
                        {lang === 'ar' ? 'صُنع بـ' : 'Made with'}{' '}
                        <Heart className="w-3 h-3 text-red-500 fill-red-500 animate-pulse" />{' '}
                        {lang === 'ar' ? 'فريق برايم' : 'by Prime Team'}
                    </p>
                </div>
            </div>
        </footer>
    );
}