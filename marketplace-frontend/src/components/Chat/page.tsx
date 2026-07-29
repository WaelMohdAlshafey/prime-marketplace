'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ChatSidebar from '@/components/Chat/ChatSidebar';
import ChatWindow from '@/components/Chat/ChatWindow';
import { Users, X } from 'lucide-react';
import api from '@/lib/api';

export default function ChatPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
    const [showNewChat, setShowNewChat] = useState(false);
    const [users, setUsers] = useState<{ id: number; username: string; role: string }[]>([]);
    const [selectedUser, setSelectedUser] = useState<number | null>(null);
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        if (isLoading) return;
        if (!user) {
            router.push('/auth/login');
            return;
        }
        // Fetch users for new chat
        const fetchUsers = async () => {
            try {
                const response = await api.get('/api/Chat/users');
                setUsers(response.data);
            } catch (err) {
                console.error('Failed to fetch users:', err);
            }
        };
        fetchUsers();
    }, [user, isLoading, router]);

    const handleStartNewChat = async () => {
        if (!selectedUser) return;
        setCreating(true);
        try {
            const response = await api.post('/api/Chat/conversations', { userId: selectedUser });
            const conv = response.data;
            setSelectedConversation(conv.id);
            setShowNewChat(false);
            setSelectedUser(null);
        } catch (err) {
            console.error('Failed to start conversation:', err);
            alert('Failed to start conversation.');
        } finally {
            setCreating(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F5C45]"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 h-[80vh]">
            <div className="flex h-full bg-white rounded-2xl shadow-soft overflow-hidden">
                {/* Sidebar */}
                <div className="w-1/3 border-r border-gray-200 flex flex-col">
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-800">💬 Messages</h2>
                        <button
                            onClick={() => setShowNewChat(true)}
                            className="p-2 bg-[#0F5C45] text-white rounded-lg hover:bg-[#0A4735] transition"
                        >
                            <Users className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <ChatSidebar
                            onSelectConversation={(id) => setSelectedConversation(id)}
                            selectedId={selectedConversation || undefined}
                        />
                    </div>
                </div>

                {/* Chat Window */}
                <div className="flex-1 flex flex-col">
                    {selectedConversation ? (
                        <ChatWindow
                            conversationId={selectedConversation}
                            currentUserId={user?.userId || 0}
                        />
                    ) : (
                        <div className="flex justify-center items-center h-full text-gray-500">
                            Select a conversation or start a new one.
                        </div>
                    )}
                </div>
            </div>

            {/* New Chat Modal */}
            {showNewChat && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-gray-900">New Conversation</h2>
                            <button
                                onClick={() => setShowNewChat(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <select
                                value={selectedUser || ''}
                                onChange={(e) => setSelectedUser(Number(e.target.value))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0F5C45] focus:border-transparent"
                            >
                                <option value="">Select a user...</option>
                                {users.map((u) => (
                                    <option key={u.id} value={u.id}>
                                        {u.username} ({u.role})
                                    </option>
                                ))}
                            </select>
                            <button
                                onClick={handleStartNewChat}
                                disabled={!selectedUser || creating}
                                className="w-full py-2 bg-[#0F5C45] text-white rounded-xl hover:bg-[#0A4735] transition disabled:opacity-50"
                            >
                                {creating ? 'Creating...' : 'Start Chat'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}