'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getStoreSettings } from '@/lib/storeApi';
import { StoreSettings } from '@/types';

export default function Contact() {
    const { t } = useTranslation('common');
    const [settings, setSettings] = useState<StoreSettings | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getStoreSettings()
            .then(setSettings)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <div className="text-center py-12">{t('contactLoading')}</div>;
    }

    if (!settings) {
        return <div className="text-center py-12">{t('contactError')}</div>;
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-3xl">
            <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
                {t('contactTitle', { storeName: settings.storeName })}
            </h1>

            <div className="bg-white rounded-xl shadow-md p-8 space-y-6">
                <div className="border-b border-gray-200 pb-4">
                    <h2 className="text-2xl font-bold text-[#0F5C45]">{settings.storeName}</h2>
                    <p className="text-gray-600 mt-2">{settings.address}</p>
                    <p className="text-gray-500 text-sm">{settings.location}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">{t('aboutLandline')}</h3>
                        <p className="text-gray-600 font-mono text-lg">{settings.landline}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <h3 className="text-lg font-semibold text-green-700 mb-2">{t('aboutWhatsapp')}</h3>
                        <p className="text-gray-600 font-mono text-lg">{settings.whatsapp}</p>
                    </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-4">
                    <p className="text-sm text-blue-800">{t('contactCustomerService')}</p>
                </div>
            </div>
        </div>
    );
}