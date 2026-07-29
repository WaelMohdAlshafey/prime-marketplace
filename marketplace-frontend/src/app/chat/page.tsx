'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ChatSidebar from '@/components/Chat/ChatSidebar';
import ChatWindow from '@/components/Chat/ChatWindow';
import { useState } from 'react';

export default function ChatPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [selectedConversation, setSelectedConversation] = useState<number | null>(null);

    useEffect(() => {
        if (isLoading) return;
        if (!user) {
            router.push('/auth/login');
            return;
        }
    }, [user, isLoading, router]);

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
                <div className="w-1/3 border-r border-gray-200">
                    <ChatSidebar onSelectConversation={setSelectedConversation} selectedId={selectedConversation || undefined} />
                </div>
                <div className="flex-1">
                    {selectedConversation ? (
                        <ChatWindow conversationId={selectedConversation} currentUserId={user?.userId || 0} />
                    ) : (
                        <div className="flex justify-center items-center h-full text-gray-500">
                            Select a conversation or start a new one.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}