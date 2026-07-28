'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/lib/api';
import { useAuth } from './AuthContext';

interface WishlistContextType {
    wishlistIds: number[];
    totalFavorites: number;
    toggleFavorite: (productId: number) => Promise<void>;
    isFavorite: (productId: number) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
    const { user, isLoading } = useAuth();
    const [wishlistIds, setWishlistIds] = useState<number[]>([]);
    const [totalFavorites, setTotalFavorites] = useState(0);

    // Load wishlist from server when user is authenticated
    const fetchWishlist = async () => {
        if (!user) {
            setWishlistIds([]);
            setTotalFavorites(0);
            return;
        }
        try {
            const response = await api.get<number[]>('/api/Wishlist');
            setWishlistIds(response.data);
            setTotalFavorites(response.data.length);
        } catch (error) {
            console.error('Failed to fetch wishlist:', error);
        }
    };

    useEffect(() => {
        if (!isLoading) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            fetchWishlist();
        }
    }, [user, isLoading]);

    const toggleFavorite = async (productId: number) => {
        if (!user) {
            // Optionally redirect to login
            window.location.href = '/auth/login';
            return;
        }

        const isCurrentlyFavorite = wishlistIds.includes(productId);

        // Optimistic update
        setWishlistIds(prev =>
            isCurrentlyFavorite
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
        setTotalFavorites(prev => isCurrentlyFavorite ? prev - 1 : prev + 1);

        try {
            if (isCurrentlyFavorite) {
                await api.delete(`/api/Wishlist/${productId}`);
            } else {
                await api.post(`/api/Wishlist/${productId}`);
            }
        } catch (error) {
            // Revert on error
            console.error('Failed to toggle wishlist:', error);
            await fetchWishlist(); // full sync
        }
    };

    const isFavorite = (productId: number) => wishlistIds.includes(productId);

    return (
        <WishlistContext.Provider
            value={{ wishlistIds, totalFavorites, toggleFavorite, isFavorite }}
        >
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
}