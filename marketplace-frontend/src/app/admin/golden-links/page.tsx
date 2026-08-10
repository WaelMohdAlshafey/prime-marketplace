'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { UserDto } from '@/types';
import { Copy, Check, Link as LinkIcon } from 'lucide-react';

export default function AdminGoldenLinks() {
    const { user, isLoading } = useAuth();
    const [users, setUsers] = useState<UserDto[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [expiryDays, setExpiryDays] = useState(7);
    const [link, setLink] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await api.get('/api/Users');
                setUsers(res.data);
            } catch (err) {
                console.error('Failed to fetch users', err);
            }
        };
        if (!isLoading && user?.role === 'Admin') fetchUsers();
    }, [user, isLoading]);

    const generateLink = async () => {
        if (!selectedUserId) return;
        setGenerating(true);
        try {
            const res = await api.post('/api/GoldenLink/generate', {
                userId: selectedUserId,
                expiryDays,
            });
            setLink(res.data.link);
            setCopied(false);
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to generate link.');
            console.error(err);
        } finally {
            setGenerating(false);
        }
    };

    const copyToClipboard = () => {
        if (link) {
            navigator.clipboard.writeText(link);
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
        }
    };

    if (isLoading) return <div className="text-center py-12">Loading…</div>;
    if (user?.role !== 'Admin') return <div className="text-center py-12 text-red-600">Access denied.</div>;

    return (
        <div className="container mx-auto px-4 py-12 max-w-2xl">
            <div className="flex items-center gap-3 mb-8">
                <LinkIcon className="w-8 h-8 text-[#0F5C45]" />
                <h1 className="text-3xl font-bold text-gray-800">Generate Golden Links</h1>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select User</label>
                    <select
                        value={selectedUserId || ''}
                        onChange={(e) => setSelectedUserId(Number(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C45]"
                    >
                        <option value="">— Choose a user —</option>
                        {users.map((u) => (
                            <option key={u.id} value={u.id}>
                                {u.username} ({u.role})
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry (days)</label>
                    <input
                        type="number"
                        min="1"
                        max="30"
                        value={expiryDays}
                        onChange={(e) => setExpiryDays(Math.min(30, Math.max(1, Number(e.target.value) || 1)))}
                        className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C45]"
                    />
                </div>

                <button
                    onClick={generateLink}
                    disabled={!selectedUserId || generating}
                    className="px-6 py-2 bg-[#0F5C45] text-white rounded-lg hover:bg-[#0A4735] transition disabled:opacity-50"
                >
                    {generating ? 'Generating…' : 'Generate Link'}
                </button>

                {link && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm font-medium text-gray-700 mb-2">Golden Link:</p>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={link}
                                readOnly
                                className="flex-1 p-2 border border-gray-300 rounded-lg bg-white text-sm text-gray-800"
                            />
                            <button
                                onClick={copyToClipboard}
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg flex items-center gap-2 transition"
                            >
                                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                                {copied ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">⚠️ One‑time use only. Expires after {expiryDays} day(s).</p>
                    </div>
                )}
            </div>
        </div>
    );
}