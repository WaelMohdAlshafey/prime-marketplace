'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '@/lib/api';
import { Download, Trash2, CheckCircle, XCircle } from 'lucide-react';

interface Subscriber {
    id: number;
    email: string;
    subscribedAt: string;
    isActive: boolean;
}

export default function AdminNewsletter() {
    const { t } = useTranslation('common');
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSubscribers = async () => {
        try {
            const response = await api.get('/api/Admin/newsletter');
            setSubscribers(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch subscribers:', err);
            setError('Failed to load subscribers.');
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchSubscribers();
    }, []);

    const handleUnsubscribe = async (email: string) => {
        if (!confirm(`Unsubscribe ${email}?`)) return;
        try {
            await api.delete(`/api/Admin/newsletter/${encodeURIComponent(email)}`);
            await fetchSubscribers();
        } catch (err) {
            console.error('Failed to unsubscribe:', err);
            alert('Failed to unsubscribe user.');
        }
    };

    const handleExportCSV = () => {
        const activeSubscribers = subscribers.filter((s) => s.isActive);
        const csvContent = 'Email,Subscribed At\n' + activeSubscribers
            .map((s) => `${s.email},${new Date(s.subscribedAt).toLocaleString()}`)
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `subscribers_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F5C45]"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-20 text-red-600">
                <p className="text-xl font-bold">⚠️ Error</p>
                <p>{error}</p>
            </div>
        );
    }

    const activeCount = subscribers.filter((s) => s.isActive).length;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Newsletter Subscribers</h1>
                    <p className="text-gray-500 mt-1">Manage your email subscribers</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleExportCSV}
                        className="flex items-center gap-2 bg-[#0F5C45] text-white px-4 py-2 rounded-xl hover:bg-[#0A4735] transition"
                    >
                        <Download className="w-4 h-4" /> Export CSV
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl shadow-soft p-4">
                    <p className="text-sm text-gray-500">Total Subscribers</p>
                    <p className="text-2xl font-bold text-gray-900">{subscribers.length}</p>
                </div>
                <div className="bg-white rounded-xl shadow-soft p-4">
                    <p className="text-sm text-gray-500">Active Subscribers</p>
                    <p className="text-2xl font-bold text-green-600">{activeCount}</p>
                </div>
                <div className="bg-white rounded-xl shadow-soft p-4">
                    <p className="text-sm text-gray-500">Unsubscribed</p>
                    <p className="text-2xl font-bold text-red-600">{subscribers.length - activeCount}</p>
                </div>
            </div>

            {/* Subscriber List */}
            <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase">ID</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Email</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Subscribed At</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Status</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {subscribers.map((sub) => (
                                <tr key={sub.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 text-sm text-gray-900">{sub.id}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{sub.email}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {new Date(sub.subscribedAt).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        {sub.isActive ? (
                                            <span className="flex items-center gap-1 text-green-600">
                                                <CheckCircle className="w-4 h-4" /> Active
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-red-600">
                                                <XCircle className="w-4 h-4" /> Inactive
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        {sub.isActive && (
                                            <button
                                                onClick={() => handleUnsubscribe(sub.email)}
                                                className="text-red-600 hover:text-red-800 font-medium flex items-center gap-1"
                                            >
                                                <Trash2 className="w-4 h-4" /> Unsubscribe
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {subscribers.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        No subscribers yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}