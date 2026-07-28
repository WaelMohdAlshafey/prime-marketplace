'use client';

import { useTranslation } from 'react-i18next';
import { GlobeAltIcon } from '@heroicons/react/24/outline';

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'ar' ? 'en' : 'ar';
        i18n.changeLanguage(newLang);
        // localStorage will be updated automatically by the I18nProvider listener
        // but we also update it here directly for immediate persistence
        localStorage.setItem('i18nextLng', newLang);
        // Optionally, you can reload the page to refresh server-rendered content
        // but if you use client-side i18n only, you don't need to reload.
        // For consistency, we reload to ensure all components re-render with the new language.
        window.location.reload();
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