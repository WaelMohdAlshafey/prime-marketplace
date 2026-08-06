'use client';

import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { useEffect, useState } from 'react';

import arCommon from '@/../public/locales/ar/common.json';
import arProducts from '@/../public/locales/ar/products.json';
import enCommon from '@/../public/locales/en/common.json';
import enProducts from '@/../public/locales/en/products.json';

const resources = {
    ar: {
        common: arCommon,
        products: arProducts,
    },
    en: {
        common: enCommon,
        products: enProducts,
    },
};

const getSavedLanguage = (): string => {
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('i18nextLng');
        if (saved === 'ar' || saved === 'en') return saved;
    }
    return 'ar';
};

if (!i18n.isInitialized) {
    i18n
        .use(initReactI18next)
        .use(LanguageDetector)
        .init({
            resources,
            lng: getSavedLanguage(),
            fallbackLng: 'ar',
            defaultNS: 'common',
            interpolation: { escapeValue: false },
        });
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
    const [lang, setLang] = useState(i18n.language);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const handleLanguageChanged = (lng: string) => {
            localStorage.setItem('i18nextLng', lng);
            setLang(lng);
            document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
            document.documentElement.lang = lng;
        };

        i18n.on('languageChanged', handleLanguageChanged);

        // Initial setup
        const saved = localStorage.getItem('i18nextLng');
        if (saved && (saved === 'ar' || saved === 'en')) {
            i18n.changeLanguage(saved);
        }
        handleLanguageChanged(i18n.language);

        setIsReady(true);

        return () => {
            i18n.off('languageChanged', handleLanguageChanged);
        };
    }, []);

    if (!isReady) {
        return <div className="bg-white shadow-md py-4 text-center text-gray-500">جاري التحميل...</div>;
    }

    // ✅ Force re‑render by using the language as a key on a wrapper
    return (
        <I18nextProvider i18n={i18n}>
            <div key={lang}>
                {children}
            </div>
        </I18nextProvider>
    );
}