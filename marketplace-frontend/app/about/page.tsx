'use client';

import { useEffect, useState } from 'react';
import { getStoreSettings } from '@/lib/storeApi';
import { StoreSettings } from '@/types';

export default function About() {
    const [settings, setSettings] = useState<StoreSettings | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getStoreSettings()
            .then(setSettings)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <div className="text-center py-12">Loading company information...</div>;
    }

    if (!settings) {
        return <div className="text-center py-12">Unable to load company information.</div>;
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">🏢 About {settings.storeName}</h1>

            <div className="bg-white rounded-xl shadow-md p-8 space-y-6">
                <div className="border-b border-gray-200 pb-4">
                    <h2 className="text-2xl font-bold text-blue-600">{settings.storeName}</h2>
                    <p className="text-gray-600 mt-2">{settings.address}</p>
                    <p className="text-gray-500 text-sm">{settings.location}</p>
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">👤 Owners</h3>
                    <ul className="grid grid-cols-2 gap-2">
                        {settings.owners.map((owner, idx) => (
                            <li key={idx} className="text-gray-600">• {owner.name}</li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">📱 Mobile Wallet Numbers</h3>
                    <ul className="space-y-1">
                        {settings.mobileNumbers.map((num, idx) => (
                            <li key={idx} className="text-gray-600 font-mono">{num}</li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">📧 Emails</h3>
                    <ul className="space-y-1">
                        {settings.emails.map((email, idx) => (
                            <li key={idx} className="text-gray-600">{email}</li>
                        ))}
                    </ul>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">📞 Landline</h3>
                        <p className="text-gray-600 font-mono">{settings.landline}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <h3 className="text-lg font-semibold text-green-700 mb-2">💬 WhatsApp</h3>
                        <p className="text-gray-600 font-mono">{settings.whatsapp}</p>
                    </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-4">
                    <p className="text-sm text-blue-800">
                        📌 Our customer service is available from 9 AM to 9 PM, 7 days a week.
                    </p>
                </div>
            </div>
        </div>
    );
}