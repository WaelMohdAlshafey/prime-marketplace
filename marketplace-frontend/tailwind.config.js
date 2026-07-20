/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#0F5C45',
                    light: '#1A7A5C',
                    dark: '#093B2D',
                    soft: '#DDEFE7',
                },
                background: {
                    DEFAULT: '#F8F9FA',
                    white: '#FFFFFF',
                    warm: '#FDF7F2',
                },
                border: '#E9ECEF',
                text: {
                    primary: '#1F2937',
                    secondary: '#6B7280',
                },
                gold: '#D4AF37',
                orange: '#F59E0B',
                red: '#DC3545',
            },
            fontFamily: {
                sans: ['Inter', 'Cairo', 'sans-serif'],
            },
            borderRadius: {
                'xl': '18px',
                '2xl': '24px',
            },
            boxShadow: {
                'soft': '0 4px 15px rgba(15,92,69,0.25)',
                'card': '0 8px 30px rgba(0,0,0,0.08)',
                'hover': '0 15px 40px rgba(0,0,0,0.12)',
                'header': '0 2px 10px rgba(0,0,0,0.05)',
            },
        },
    },
    plugins: [],
}