// M:\Marketplace\marketplace-frontend\app\layout.tsx

import type { Metadata, Viewport } from 'next';
import { Cairo, Inter } from 'next/font/google';
import './globals.css';
import { I18nProvider } from '@/providers/I18nProvider';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { CartIconRefProvider } from '@/context/CartIconRefContext';
import { ThemeProvider } from '@/context/ThemeContext';
import ClientAuthWrapper from '@/components/ClientAuthWrapper';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const cairo = Cairo({
    subsets: ['arabic'],
    weight: ['300', '400', '500', '600', '700'],
    variable: '--font-cairo',
});

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
});

export const metadata: Metadata = {
    title: 'Prime | Premium Marketplace',
    description: 'The best marketplace for premium products.',
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ar" dir="rtl" className={`${cairo.variable} ${inter.variable}`}>
            <body className={cairo.className}>
                <I18nProvider>
                    <ClientAuthWrapper>
                        <CartProvider>
                            <WishlistProvider>
                                <CartIconRefProvider>
                                    <ThemeProvider>
                                        <Navbar />
                                        <main className="min-h-screen bg-[#F8F9FA]">{children}</main>
                                        <Footer />
                                    </ThemeProvider>
                                </CartIconRefProvider>
                            </WishlistProvider>
                        </CartProvider>
                    </ClientAuthWrapper>
                </I18nProvider>
            </body>
        </html>
    );
}