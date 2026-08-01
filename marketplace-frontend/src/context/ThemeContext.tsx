'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getStoreSettings } from '@/lib/storeApi';

export type Template = 'standard' | 'simple';

interface ThemeContextType {
    template: Template;
    setTemplate: (template: Template) => void;
    isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [template, setTemplate] = useState<Template>('standard');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const settings = await getStoreSettings();
                console.log('📦 Template from API:', settings.template);
                setTemplate((settings.template as Template) || 'standard');
            } catch (error) {
                console.error('Failed to load theme:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSettings();
    }, []);

    return (
        <ThemeContext.Provider value={{ template, setTemplate, isLoading }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}