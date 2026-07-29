'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { ConversationDto } from '@/types';
import { useRouter } from 'next/navigation';

interface ChatSidebarProps {
    onSelectConversation: (id: number) => void;
    selectedId?: number;
}

export default function ChatSidebar({ onSelectConversation, selectedId }: ChatSidebarProps) {
    const [conversations, setConversations] = useState<ConversationDto[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchConversations = async () => {
        try {
            const response = await api.get('/api/Chat/conversations');
            setConversations(response.data);
        } catch (err) {
            console.error('Failed to fetch conversations:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchConversations();
    }, []);

    if (loading) return <div className="p-4">Loading conversations...</div>;

    return (
        <div className="h-full overflow-y-auto">
            {conversations.length === 0 ? (
                <div className="text-center text-gray-500 p-4">No conversations yet.</div>
            ) : (
                conversations.map((conv) => (
                    <div
                        key={conv.id}
                        onClick={() => onSelectConversation(conv.id)}
                        className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition ${selectedId === conv.id ? 'bg-[#0F5C45]/5' : ''
                            }`}
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-semibold text-gray-800">{conv.otherUserName}</p>
                                <p className="text-xs text-gray-500">{conv.otherUserRole}</p>
                            </div>
                            {conv.lastMessageAt && (
                                <span className="text-xs text-gray-400">
                                    {new Date(conv.lastMessageAt).toLocaleDateString()}
                                </span>
                            )}
                        </div>
                        {conv.lastMessageContent && (
                            <p className="text-sm text-gray-600 truncate mt-1">{conv.lastMessageContent}</p>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}