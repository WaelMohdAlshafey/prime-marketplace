/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './src/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: 'var(--color-primary, #4E8C9E)',
                    dark: 'var(--color-primary-dark, #2F5A6B)',
                    light: 'var(--color-primary-light, #7AB8C9)',
                    bg: 'var(--color-primary-bg, #E8F4F7)',
                },
                secondary: {
                    DEFAULT: 'var(--color-secondary, #D27736)',
                    dark: 'var(--color-secondary-dark, #B05E2A)',
                    light: 'var(--color-secondary-light, #E8B48C)',
                    bg: 'var(--color-secondary-bg, #FDF3E8)',
                },
                background: {
                    DEFAULT: 'var(--color-background, #F8F9FA)',
                    surface: 'var(--color-surface, #FFFFFF)',
                    alt: 'var(--color-surface-alt, #F1F3F5)',
                },
                text: {
                    DEFAULT: 'var(--color-text, #1A1A2E)',
                    secondary: 'var(--color-text-secondary, #4A4A5A)',
                    muted: 'var(--color-text-muted, #8A8A9A)',
                },
                border: {
                    DEFAULT: 'var(--color-border, #E5E7EB)',
                    light: 'var(--color-border-light, #F0F0F0)',
                },
                navbar: {
                    bg: 'var(--color-navbar-bg, #FFFFFF)',
                    text: 'var(--color-navbar-text, #2F5A6B)',
                    hover: 'var(--color-navbar-hover, #D27736)',
                    border: 'var(--color-navbar-border, #E5E7EB)',
                },
                footer: {
                    bg: 'var(--color-footer-bg, #2F5A6B)',
                    text: 'var(--color-footer-text, #C8D8DE)',
                    heading: 'var(--color-footer-heading, #FFFFFF)',
                },
                card: {
                    bg: 'var(--color-card-bg, #FFFFFF)',
                    border: 'var(--color-card-border, #E5E7EB)',
                },
                button: {
                    primary: {
                        bg: 'var(--color-button-primary-bg, #4E8C9E)',
                        hover: 'var(--color-button-primary-hover, #2F5A6B)',
                        text: 'var(--color-button-primary-text, #FFFFFF)',
                    },
                    secondary: {
                        bg: 'var(--color-button-secondary-bg, #D27736)',
                        hover: 'var(--color-button-secondary-hover, #B05E2A)',
                        text: 'var(--color-button-secondary-text, #FFFFFF)',
                    },
                },
                badge: {
                    sale: 'var(--color-badge-sale, #D27736)',
                    new: 'var(--color-badge-new, #4E8C9E)',
                    sold: 'var(--color-badge-sold, #8A8A9A)',
                },
            },
            fontFamily: {
                cairo: ['Cairo', 'sans-serif'],
                body: ['var(--font-family, Inter)', 'sans-serif'],
                heading: ['var(--heading-font, Cairo)', 'sans-serif'],
            },
            borderRadius: {
                card: 'var(--radius-card, 12px)',
                sm: 'var(--radius-sm, 6px)',
                md: 'var(--radius-md, 12px)',
                lg: 'var(--radius-lg, 20px)',
                pill: 'var(--radius-pill, 40px)',
                button: '8px',
            },
            boxShadow: {
                card: 'var(--shadow-card, 0 4px 20px rgba(0, 0, 0, 0.06))',
                'card-hover': 'var(--shadow-card-hover, 0 12px 40px rgba(0, 0, 0, 0.10))',
                soft: 'var(--shadow-soft, 0 4px 20px rgba(0, 0, 0, 0.06))',
                strong: 'var(--shadow-card-hover, 0 12px 40px rgba(0, 0, 0, 0.10))',
                dropdown: 'var(--shadow-dropdown, 0 8px 30px rgba(0, 0, 0, 0.08))',
            },
            maxWidth: {
                container: '1320px',
            },
            keyframes: {
                pulse: {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0.5 },
                },
            },
            animation: {
                pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
        },
    },
    plugins: [],
};