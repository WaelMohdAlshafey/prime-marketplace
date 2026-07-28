'use client';

import { createContext, useContext, useRef, MutableRefObject, ReactNode } from 'react';

interface CartIconRefContextType {
    // Use HTMLElement (parent of HTMLAnchorElement, HTMLButtonElement, etc.)
    cartIconRef: MutableRefObject<HTMLElement | null>;
}

const CartIconRefContext = createContext<CartIconRefContextType | undefined>(undefined);

export function CartIconRefProvider({ children }: { children: ReactNode }) {
    const cartIconRef = useRef<HTMLElement | null>(null);
    return (
        <CartIconRefContext.Provider value={{ cartIconRef }}>
            {children}
        </CartIconRefContext.Provider>
    );
}

export function useCartIconRef() {
    const context = useContext(CartIconRefContext);
    if (!context) throw new Error('useCartIconRef must be used within CartIconRefProvider');
    return context;
}