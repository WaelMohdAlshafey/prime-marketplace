'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';
import { useAuth } from './AuthContext';
import { Cart } from '@/types';

interface CartContextType {
    cart: Cart | null;
    totalItems: number;
    fetchCart: () => Promise<void>;
    addToCart: (productId: number, quantity?: number) => Promise<void>;
    removeFromCart: (cartItemId: number) => Promise<void>;
    clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth();
    const [cart, setCart] = useState<Cart | null>(null);
    // ✅ Separate state for totalItems – updates instantly
    const [totalItems, setTotalItems] = useState<number>(0);

    const fetchCart = useCallback(async () => {
        if (!user) {
            setCart(null);
            setTotalItems(0);
            return;
        }
        try {
            const response = await api.get<Cart>('/api/Cart');
            setCart(response.data);
            setTotalItems(response.data.totalItems ?? 0);
            console.log('✅ Cart synced:', response.data.totalItems);
        } catch (error) {
            console.error('❌ Failed to fetch cart:', error);
            setCart(null);
            setTotalItems(0);
        }
    }, [user]);

    const addToCart = useCallback(
        async (productId: number, quantity: number = 1) => {
            if (!user) {
                window.location.href = '/auth/login';
                return;
            }

            // 🔥 Instant increment
            setTotalItems((prev) => prev + quantity);
            console.log('🛒 Added, new total:', totalItems + quantity);

            try {
                await api.post('/api/Cart', { productId, quantity });
                await fetchCart();
            } catch (error) {
                console.error('❌ Failed to add:', error);
                await fetchCart(); // revert
            }
        },
        [user, fetchCart]
    );

    const removeFromCart = useCallback(
        async (cartItemId: number) => {
            if (!user) return;

            console.log('🗑️ Removing cart item:', cartItemId);

            // 🔥 Instant decrement (by 1, typical single-item removal)
            setTotalItems((prev) => Math.max(0, prev - 1));
            console.log('📉 New total (optimistic):', totalItems - 1);

            try {
                await api.delete(`/api/Cart/${cartItemId}`);
                await fetchCart(); // sync with server
            } catch (error) {
                console.error('❌ Failed to remove:', error);
                await fetchCart(); // revert
            }
        },
        [user, fetchCart]
    );

    const clearCart = useCallback(async () => {
        if (!user) return;

        setTotalItems(0);
        console.log('🧹 Cart cleared (optimistic)');

        try {
            await api.delete('/api/Cart');
            await fetchCart();
        } catch (error) {
            console.error('❌ Failed to clear:', error);
            await fetchCart();
        }
    }, [user, fetchCart]);

    // Load cart on user change
    useEffect(() => {
        if (!isLoading) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            fetchCart();
        }
    }, [user, isLoading, fetchCart]);

    return (
        <CartContext.Provider
            value={{
                cart,
                totalItems,
                fetchCart,
                addToCart,
                removeFromCart,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}