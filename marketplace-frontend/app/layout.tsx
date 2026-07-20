import type { Metadata } from 'next';
import { Cairo, Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
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
    title: 'Prime | سوق برايم ',
    description: 'أفضل سوق للتسوق عبر الإنترنت - منتجات فاخرة، برامج، تجميل، أزياء',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ar" dir="rtl" className={`${cairo.variable} ${inter.variable}`}>
            <body className={cairo.className}>
                <AuthProvider>
                    <Navbar />
                    <main className="min-h-screen bg-[#F8F9FA]">{children}</main>
                    <Footer />
                </AuthProvider>
            </body>
        </html>
    );
}