'use client';

import { useEffect, useState, useRef } from 'react';
import api from '@/lib/api';
import { MessageDto } from '@/types';
import { Send } from 'lucide-react';

interface ChatWindowProps {
    conversationId: number;
    currentUserId: number;
}

export default function ChatWindow({ conversationId, currentUserId }: ChatWindowProps) {
    const [messages, setMessages] = useState<MessageDto[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const fetchMessages = async () => {
        try {
            const response = await api.get(`/api/Chat/conversations/${conversationId}/messages`);
            setMessages(response.data);
        } catch (err) {
            console.error('Failed to fetch messages:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchMessages();
        const interval = setInterval(fetchMessages, 5000); // Polling every 5s
        return () => clearInterval(interval);
    }, [conversationId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || sending) return;
        setSending(true);
        try {
            await api.post(`/api/Chat/conversations/${conversationId}/messages`, { content: newMessage });
            setNewMessage('');
            await fetchMessages();
        } catch (err) {
            console.error('Failed to send message:', err);
            alert('Failed to send message.');
        } finally {
            setSending(false);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-full">Loading messages...</div>;

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                    <div className="text-center text-gray-500">No messages yet.</div>
                ) : (
                    messages.map((msg) => {
                        const isMine = msg.senderId === currentUserId;
                        return (
                            <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                                <div
                                    className={`max-w-[70%] rounded-lg px-4 py-2 ${isMine ? 'bg-[#0F5C45] text-white' : 'bg-gray-100 text-gray-800'
                                        }`}
                                >
                                    <p className="text-sm">{msg.content}</p>
                                    <p className="text-xs opacity-70 mt-1">
                                        {new Date(msg.sentAt).toLocaleTimeString()}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSend} className="border-t border-gray-200 p-3 flex gap-2">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F5C45]"
                />
                <button
                    type="submit"
                    disabled={sending || !newMessage.trim()}
                    className="p-2 bg-[#0F5C45] text-white rounded-xl hover:bg-[#0A4735] transition disabled:opacity-50"
                >
                    <Send className="w-5 h-5" />
                </button>
            </form>
        </div>
    );
}