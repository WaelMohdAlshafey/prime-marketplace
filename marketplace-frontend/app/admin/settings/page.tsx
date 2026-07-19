'use client';

import { useEffect, useState } from 'react';
import { getStoreSettings, updateStoreSettings } from '@/lib/storeApi';
import { StoreSettings, Owner } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function AdminSettings() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [settings, setSettings] = useState<StoreSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (isLoading) return;
        if (!user) {
            router.push('/auth/login');
            return;
        }

        getStoreSettings()
            .then(setSettings)
            .finally(() => setLoading(false));
    }, [user, isLoading]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!settings) return;

        setSaving(true);
        setMessage('');
        try {
            await updateStoreSettings(settings);
            setMessage('✅ Settings updated successfully!');
        } catch (error) {
            setMessage('❌ Failed to update settings. Please try again.');
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    // ============================================================
    // FIXED: Replaced `any` with proper types using generics
    // ============================================================
    const updateField = <K extends keyof StoreSettings>(field: K, value: StoreSettings[K]) => {
        setSettings(prev => prev ? { ...prev, [field]: value } : null);
    };

    const updateOwners = (value: string) => {
        const names = value.split(',').map(s => s.trim()).filter(Boolean).map(name => ({ name }));
        setSettings(prev => prev ? { ...prev, owners: names } : null);
    };

    const updateMobileNumbers = (value: string) => {
        const numbers = value.split(',').map(s => s.trim()).filter(Boolean);
        setSettings(prev => prev ? { ...prev, mobileNumbers: numbers } : null);
    };

    const updateEmails = (value: string) => {
        const emails = value.split(',').map(s => s.trim()).filter(Boolean);
        setSettings(prev => prev ? { ...prev, emails } : null);
    };

    if (loading || isLoading) {
        return <div className="text-center py-12">Loading...</div>;
    }

    if (!settings) {
        return <div className="text-center py-12 text-red-600">Failed to load settings.</div>;
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-3xl">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">⚙️ Company Settings</h1>

            {message && (
                <div className={`p-3 rounded-lg mb-4 ${message.startsWith('✅') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        value={settings.storeName}
                        onChange={(e) => updateField('storeName', e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        value={settings.address}
                        onChange={(e) => updateField('address', e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        value={settings.location}
                        onChange={(e) => updateField('location', e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Owners (comma separated)</label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        value={settings.owners.map(o => o.name).join(', ')}
                        onChange={(e) => updateOwners(e.target.value)}
                        placeholder="Ahmed, Sara, Youssef, Mona"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Wallet Numbers (comma separated)</label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        value={settings.mobileNumbers.join(', ')}
                        onChange={(e) => updateMobileNumbers(e.target.value)}
                        placeholder="+20 100 123 4567, +20 101 234 5678"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Emails (comma separated)</label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        value={settings.emails.join(', ')}
                        onChange={(e) => updateEmails(e.target.value)}
                        placeholder="support@primemarket.com, info@primemarket.com"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Landline</label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        value={settings.landline}
                        onChange={(e) => updateField('landline', e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        value={settings.whatsapp}
                        onChange={(e) => updateField('whatsapp', e.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    disabled={saving}
                    className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                    {saving ? 'Saving...' : '💾 Save Settings'}
                </button>
            </form>
        </div>
    );
}