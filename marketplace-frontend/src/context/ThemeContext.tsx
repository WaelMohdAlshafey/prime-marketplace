'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getStoreSettings } from '@/lib/storeApi';
import { StoreSettings } from '@/types';

export type Template = 'standard' | 'simple' | 'colored' | 'blue';

interface ThemeContextType {
    template: Template;
    setTemplate: (template: Template) => void;
    settings: StoreSettings | null;
    isLoading: boolean;
    applyTheme: (settings: StoreSettings) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    // ✅ Always start with 'standard' – safe default
    const [template, setTemplate] = useState<Template>('standard');
    const [settings, setSettings] = useState<StoreSettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const applyTheme = (themeSettings: StoreSettings) => {
        console.log('🎨 Applying theme:', themeSettings.template);
        const root = document.documentElement;
        const templateVal = (themeSettings.template as Template) || 'standard';
        root.setAttribute('data-theme', templateVal);

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
    };

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const data = await getStoreSettings();
                console.log('🏪 Store settings loaded:', data);
                setSettings(data);
                // ✅ Force to 'standard' if template is missing or not recognized
                const templateVal = (data.template as Template) || 'standard';
                if (!['standard', 'simple', 'colored', 'blue'].includes(templateVal)) {
                    console.warn('⚠️ Unknown template, using standard');
                    setTemplate('standard');
                } else {
                    setTemplate(templateVal);
                }
                applyTheme(data);
            } catch (error) {
                console.error('❌ Failed to load theme:', error);
                // Fallback to default theme
                setTemplate('standard');
            } finally {
                setIsLoading(false);
            }
        };
        fetchSettings();
    }, []);

    // Re-apply when template or settings change
    useEffect(() => {
        if (settings) {
            applyTheme(settings);
        }
    }, [template, settings]);

    return (
        <ThemeContext.Provider value={{ template, setTemplate, settings, isLoading, applyTheme }}>
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