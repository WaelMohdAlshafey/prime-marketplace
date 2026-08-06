'use client';

import { useTranslation } from 'react-i18next';
import { GlobeAltIcon } from '@heroicons/react/24/outline';

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'ar' ? 'en' : 'ar';
        i18n.changeLanguage(newLang);
        // The I18nProvider will automatically:
        // - Save the language to localStorage
        // - Update the <html> dir and lang attributes
        // - Force a re‑render via the key prop
    };

    return (
        <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 hover:text-yellow-400 transition text-xs"
        >
            <GlobeAltIcon className="w-3.5 h-3.5" />
            {i18n.language === 'ar' ? 'English' : 'العربية'}
        </button>
    );
}