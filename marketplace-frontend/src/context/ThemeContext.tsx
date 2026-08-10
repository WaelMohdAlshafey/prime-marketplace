// E:\prime-marketplace\marketplace-frontend\src\context\ThemeContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getStoreSettings, updateStoreSettings } from '@/lib/storeApi';
import { StoreSettings } from '@/types';

export type Template = 'standard' | 'simple' | 'colored' | 'blue';

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
    const [template, setTemplate] = useState<Template>('standard');
    const [settings, setSettings] = useState<StoreSettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const applyTheme = (themeSettings: StoreSettings) => {
        const root = document.documentElement;
        const templateVal = (themeSettings.template as Template) || 'standard';

        // Set data-theme on both html and body
        root.setAttribute('data-theme', templateVal);
        document.body.setAttribute('data-theme', templateVal);

        // Apply all CSS variables from settings
        const cssVars: Record<string, string | undefined> = {
            '--color-primary': themeSettings.primaryColor,
            '--color-primary-light': themeSettings.primaryLight,
            '--color-primary-dark': themeSettings.primaryDark,
            '--color-secondary': themeSettings.secondaryColor,
            '--color-secondary-light': themeSettings.secondaryLight,
            '--color-background': themeSettings.backgroundColor,
            '--color-surface': themeSettings.surfaceColor,
            '--color-text': themeSettings.textColor,
            '--color-text-muted': themeSettings.textMuted,
            '--color-navbar-bg': themeSettings.navbarBg,
            '--color-navbar-text': themeSettings.navbarText,
            '--color-navbar-hover': themeSettings.navbarHover,
            '--color-footer-bg': themeSettings.footerBg,
            '--color-footer-text': themeSettings.footerText,
            '--color-button-primary-bg': themeSettings.buttonPrimaryBg,
            '--color-button-primary-hover': themeSettings.buttonPrimaryHover,
            '--color-button-primary-text': themeSettings.buttonPrimaryText,
            '--color-button-secondary-bg': themeSettings.buttonSecondaryBg,
            '--color-button-secondary-hover': themeSettings.buttonSecondaryHover,
            '--color-button-secondary-text': themeSettings.buttonSecondaryText,
            '--color-card-bg': themeSettings.cardBg,
            '--color-card-border': themeSettings.cardBorder,
            '--shadow-card': themeSettings.cardShadow,
            '--shadow-card-hover': themeSettings.cardHoverShadow,
            '--radius-card': themeSettings.cardBorderRadius,
            '--font-family': themeSettings.fontFamily,
            '--font-heading': themeSettings.headingFont,
            '--font-body': themeSettings.bodyFont,
            '--emoji-site': themeSettings.siteEmoji,
            '--emoji-favicon': themeSettings.faviconEmoji,
        };

        Object.entries(cssVars).forEach(([key, value]) => {
            if (value) {
                root.style.setProperty(key, value);
            }
        });

        // Custom CSS
        const customStyleId = 'custom-theme-css';
        let customStyle = document.getElementById(customStyleId) as HTMLStyleElement;
        if (!customStyle) {
            customStyle = document.createElement('style');
            customStyle.id = customStyleId;
            document.head.appendChild(customStyle);
        }
        customStyle.textContent = themeSettings.customCss || '';

        // Update state
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
                    template: 'standard',
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