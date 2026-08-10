'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

export default function ProfilePage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [generating, setGenerating] = useState(false);
    const [linkData, setLinkData] = useState<{ link: string; expiresAt: string } | null>(null);
    const [expiryDays, setExpiryDays] = useState(7);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/auth/login');
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return <div className="text-center py-12">Loading...</div>;
    }

    if (!user) {
        return null;
    }

    const generateLink = async () => {
        setGenerating(true);
        try {
            const response = await api.post('/api/GoldenLink/generate', { expiryDays });
            setLinkData(response.data);
            setCopied(false);
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to generate golden link.');
        } finally {
            setGenerating(false);
        }
    };

    const copyToClipboard = () => {
        if (linkData) {
            navigator.clipboard.writeText(linkData.link);
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-3xl">
            <div className="bg-white rounded-xl shadow-md p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">👤 My Profile</h1>
                <p className="text-gray-600 mb-6">Welcome, <span className="font-semibold">{user.username}</span>!</p>

                <div className="border-t border-gray-200 pt-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">🔗 Golden Login Link</h2>
                    <p className="text-sm text-gray-600 mb-4">
                        Generate a one‑time login link that you can share with anyone. The link will expire after the set number of days (max 30).
                    </p>

                    <div className="flex flex-wrap items-center gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Expires in (days)</label>
                            <input
                                type="number"
                                min="1"
                                max="30"
                                value={expiryDays}
                                onChange={(e) => setExpiryDays(Math.min(30, Math.max(1, Number(e.target.value) || 1)))}
                                className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <button
                            onClick={generateLink}
                            disabled={generating}
                            className="mt-5 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                        >
                            {generating ? 'Generating...' : 'Generate Link'}
                        </button>
                    </div>

                    {linkData && (
                        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm font-medium text-gray-700 mb-2">Your golden link:</p>
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={linkData.link}
                                    readOnly
                                    className="flex-1 p-2 border border-gray-300 rounded-lg bg-white text-sm text-gray-800"
                                />
                                <button
                                    onClick={copyToClipboard}
                                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium transition"
                                >
                                    {copied ? '✅ Copied!' : '📋 Copy'}
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                Expires: {new Date(linkData.expiresAt).toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">⚠️ This link can only be used once.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}