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
                    DEFAULT: '#0A6C44',
                    dark: '#06452A',
                    light: '#4CAF50',
                    surface: '#F8F9FA',
                },
                secondary: {
                    DEFAULT: '#FFB400',
                },
                text: {
                    DEFAULT: '#1A1A1A',
                    muted: '#757575',
                    light: '#9E9E9E',
                },
                border: {
                    DEFAULT: '#E0E0E0',
                },
            },
            fontFamily: {
                cairo: ['Cairo', 'sans-serif'],
            },
            borderRadius: {
                card: '12px',
                pill: '24px',
                button: '8px',
            },
            boxShadow: {
                card: '0 4px 12px rgba(0, 0, 0, 0.05)',
                'card-hover': '0 8px 24px rgba(0, 0, 0, 0.10)',
                soft: '0 2px 8px rgba(0, 0, 0, 0.04)',
                strong: '0 8px 32px rgba(0, 0, 0, 0.12)',
            },
            maxWidth: {
                container: '1320px',
            },
        },
    },
    plugins: [],
};