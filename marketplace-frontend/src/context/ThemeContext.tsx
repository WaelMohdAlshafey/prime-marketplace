// E:\prime-marketplace\marketplace-frontend\src\context\ThemeContext.tsx

'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getStoreSettings, updateStoreSettings } from '@/lib/storeApi';
import { StoreSettings } from '@/types';

export type Template = 'standard' | 'simple' | 'colored' | 'blue' | 'nemocare';

interface ThemeContextType {
    template: Template;
    setTemplate: (template: Template) => void;
    settings: StoreSettings | null;
    isLoading: boolean;
    applyTheme: (settings: StoreSettings) => void;
    saveTemplate: (template: Template) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [template, setTemplate] = useState<Template>('nemocare');
    const [settings, setSettings] = useState<StoreSettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const applyTheme = (themeSettings: StoreSettings) => {
        const root = document.documentElement;
        const templateVal = (themeSettings.template as Template) || 'nemocare';

        root.setAttribute('data-theme', templateVal);
        document.body.setAttribute('data-theme', templateVal);

        // ✅ FIXED: removed 'secondaryDark' – using secondaryColor as fallback for -dark variant
        const cssVars: Record<string, string | undefined> = {
            '--color-primary': themeSettings.primaryColor || '#4E8C9E',
            '--color-primary-dark': themeSettings.primaryDark || '#2F5A6B',
            '--color-primary-light': themeSettings.primaryLight || '#7AB8C9',
            '--color-secondary': themeSettings.secondaryColor || '#D27736',
            '--color-secondary-dark': themeSettings.secondaryColor || '#B05E2A', // ✅ FIXED
            '--color-background': themeSettings.backgroundColor || '#F8F9FA',
            '--color-surface': themeSettings.surfaceColor || '#FFFFFF',
            '--color-text': themeSettings.textColor || '#1A1A2E',
            '--color-text-muted': themeSettings.textMuted || '#8A8A9A',
            '--color-navbar-bg': themeSettings.navbarBg || '#FFFFFF',
            '--color-navbar-text': themeSettings.navbarText || '#2F5A6B',
            '--color-navbar-hover': themeSettings.navbarHover || '#D27736',
            '--color-footer-bg': themeSettings.footerBg || '#2F5A6B',
            '--color-footer-text': themeSettings.footerText || '#C8D8DE',
            '--color-button-primary-bg': themeSettings.buttonPrimaryBg || '#4E8C9E',
            '--color-button-primary-hover': themeSettings.buttonPrimaryHover || '#2F5A6B',
            '--color-button-primary-text': themeSettings.buttonPrimaryText || '#FFFFFF',
            '--color-button-secondary-bg': themeSettings.buttonSecondaryBg || '#D27736',
            '--color-button-secondary-hover': themeSettings.buttonSecondaryHover || '#B05E2A',
            '--color-button-secondary-text': themeSettings.buttonSecondaryText || '#FFFFFF',
            '--color-card-bg': themeSettings.cardBg || '#FFFFFF',
            '--color-card-border': themeSettings.cardBorder || '#E5E7EB',
            '--shadow-card': themeSettings.cardShadow || '0 4px 20px rgba(0,0,0,0.06)',
            '--shadow-card-hover': themeSettings.cardHoverShadow || '0 12px 40px rgba(0,0,0,0.10)',
            '--radius-card': themeSettings.cardBorderRadius || '12px',
            '--font-family': themeSettings.fontFamily || "'Inter', sans-serif",
        };

        Object.entries(cssVars).forEach(([key, value]) => {
            if (value) {
                root.style.setProperty(key, value);
            }
        });

        setTemplate(templateVal);
    };

    const saveTemplate = async (newTemplate: Template) => {
        if (!settings) return;
        const updatedSettings = { ...settings, template: newTemplate };
        try {
            await updateStoreSettings(updatedSettings);
            setSettings(updatedSettings);
            applyTheme(updatedSettings);
        } catch (error) {
            console.error('Failed to save template:', error);
            throw error;
        }
    };

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const data = await getStoreSettings();
                setSettings(data);
                applyTheme(data);
            } catch (error) {
                console.error('❌ Failed to load theme:', error);
                // ✅ FIXED: removed 'secondaryDark' from default object
                const defaultSettings: StoreSettings = {
                    id: 0,
                    storeName: 'Prime',
                    address: '',
                    location: '',
                    owners: [],
                    mobileNumbers: [],
                    emails: [],
                    landline: '',
                    whatsapp: '',
                    template: 'nemocare',
                    primaryColor: '#4E8C9E',
                    primaryDark: '#2F5A6B',
                    primaryLight: '#7AB8C9',
                    secondaryColor: '#D27736',
                    // secondaryDark removed – it doesn't exist in StoreSettings
                    backgroundColor: '#F8F9FA',
                    surfaceColor: '#FFFFFF',
                    textColor: '#1A1A2E',
                    textMuted: '#8A8A9A',
                    navbarBg: '#FFFFFF',
                    navbarText: '#2F5A6B',
                    navbarHover: '#D27736',
                    footerBg: '#2F5A6B',
                    footerText: '#C8D8DE',
                    buttonPrimaryBg: '#4E8C9E',
                    buttonPrimaryHover: '#2F5A6B',
                    buttonPrimaryText: '#FFFFFF',
                    buttonSecondaryBg: '#D27736',
                    buttonSecondaryHover: '#B05E2A',
                    buttonSecondaryText: '#FFFFFF',
                    cardBg: '#FFFFFF',
                    cardBorder: '#E5E7EB',
                    cardShadow: '0 4px 20px rgba(0,0,0,0.06)',
                    cardHoverShadow: '0 12px 40px rgba(0,0,0,0.10)',
                    cardBorderRadius: '12px',
                    fontFamily: "'Inter', sans-serif",
                };
                setSettings(defaultSettings);
                applyTheme(defaultSettings);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSettings();
    }, []);

    return (
        <ThemeContext.Provider
            value={{
                template,
                setTemplate,
                settings,
                isLoading,
                applyTheme,
                saveTemplate
            }}
        >
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