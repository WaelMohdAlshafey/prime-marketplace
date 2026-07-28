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

// Try to get saved language from localStorage
const getSavedLanguage = (): string => {
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('i18nextLng');
        if (saved === 'ar' || saved === 'en') return saved;
    }
    return 'ar'; // Default to Arabic
};

i18n
    .use(initReactI18next)
    .use(LanguageDetector)
    .init({
        resources,
        lng: getSavedLanguage(), // Use saved language if available
        fallbackLng: 'ar',
        defaultNS: 'common',
        interpolation: {
            escapeValue: false,
        },
    });

export function I18nProvider({ children }: { children: React.ReactNode }) {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        // Update localStorage when language changes
        const handleLanguageChanged = (lng: string) => {
            localStorage.setItem('i18nextLng', lng);
        };
        i18n.on('languageChanged', handleLanguageChanged);

        // Set initial language from localStorage
        const saved = localStorage.getItem('i18nextLng');
        if (saved && (saved === 'ar' || saved === 'en')) {
            i18n.changeLanguage(saved);
        }

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsReady(true);

        return () => {
            i18n.off('languageChanged', handleLanguageChanged);
        };
    }, []);

    if (!isReady) {
        return <div className="bg-white shadow-md py-4 text-center text-gray-500">جاري التحميل...</div>;
    }

    return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}