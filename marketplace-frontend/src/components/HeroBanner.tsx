'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, ShoppingBag, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '@/lib/api';
import type { ProductCategory } from '@/types';

interface HeroSlide {
    id: string;
    badge: string;
    title: string;
    subtitle: string;
    description: string;
    cta: string;
    link: string;
    icon: string;
    isPage?: boolean;
}

interface SimplePage {
    id: number;
    title: string;
    slug: string;
    displayOrder?: number;
    showInNavbar?: boolean;
}

const pageArabicTitles: Record<string, string> = {
    'about us': 'من نحن',
    'about': 'من نحن',
    'contact us': 'اتصل بنا',
    'contact': 'اتصل بنا',
    'privacy policy': 'سياسة الخصوصية',
    'privacy': 'سياسة الخصوصية',
    'terms & conditions': 'الشروط والأحكام',
    'terms and conditions': 'الشروط والأحكام',
    'terms': 'الشروط والأحكام',
    'faq': 'الأسئلة الشائعة',
    'return policy': 'سياسة الإرجاع',
    'returns': 'سياسة الإرجاع',
    'shipping & delivery': 'الشحن والتوصيل',
    'shipping': 'الشحن والتوصيل',
};

const categoryArabicNames: Record<string, string> = {
    'software': 'برامج',
    'hair care': 'العناية بالشعر',
    'hair-care': 'العناية بالشعر',
    'skin care': 'العناية بالبشرة',
    'skin-care': 'العناية بالبشرة',
    'perfumes': 'عطور',
    'accessories': 'إكسسوارات',
    'electronics': 'إلكترونيات',
    'supplements': 'مكملات غذائية',
    'home': 'المنزل',
    'grocery': 'بقالة',
    'pharmacy': 'صيدلية',
    'books': 'كتب',
    'fashion': 'أزياء',
};

const localizePageTitle = (title: string, lang: string): string => {
    if (lang !== 'ar' || !title) return title;
    const key = title.trim().toLowerCase();
    return pageArabicTitles[key] || title;
};

const localizeCategoryName = (name: string, lang: string): string => {
    if (lang !== 'ar' || !name) return name;
    const key = name.trim().toLowerCase();
    return categoryArabicNames[key] || name;
};

export default function HeroBanner() {
    const { i18n } = useTranslation('common');
    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(0);
    const [slides, setSlides] = useState<HeroSlide[]>([]);
    const [loading, setLoading] = useState(true);

    // ✅ Normalize language — supports en, en-US, ar, ar-EG, etc.
    const lang = (i18n.language || 'ar').startsWith('ar') ? 'ar' : 'en';

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            try {
                const [catRes, pageRes] = await Promise.all([
                    api.get<ProductCategory[]>('/api/ProductCategories?onlyActive=true'),
                    api.get<SimplePage[]>('/api/Pages'),
                ]);

                const cats: ProductCategory[] = (catRes.data || [])
                    .sort((a: ProductCategory, b: ProductCategory) =>
                        (a.displayOrder ?? 999) - (b.displayOrder ?? 999));

                const pages: SimplePage[] = (pageRes.data || [])
                    .filter((p: SimplePage) => p.showInNavbar)
                    .sort((a: SimplePage, b: SimplePage) =>
                        (a.displayOrder ?? 999) - (b.displayOrder ?? 999));

                const catSlides: HeroSlide[] = cats.map((c) => {
                    const localizedName = localizeCategoryName(c.name, lang);
                    const isAr = lang === 'ar';
                    return {
                        id: `cat-${c.id}`,
                        badge: `${c.icon || '🛍️'} ${isAr ? 'قسم مميز' : 'Featured Category'}`,
                        title: localizedName,
                        // ✅ Always generate the subtitle in the correct language
                        subtitle: isAr ? 'اكتشف منتجاتنا المميزة' : 'Explore our featured products',
                        // ✅ Always generate the description in the correct language
                        //    (ignores the DB description which may be in either language)
                        description: isAr
                            ? `تصفح أفضل منتجات ${localizedName} من بائعين موثوقين.`
                            : `Browse the best ${localizedName} products from trusted vendors.`,
                        cta: isAr ? `تسوق ${localizedName}` : `Shop ${localizedName}`,
                        link: `/${c.slug}`,
                        icon: c.icon || '🛍️',
                        isPage: false,
                    };
                });

                const pageSlides: HeroSlide[] = pages.map((p) => {
                    const localizedTitle = localizePageTitle(p.title, lang);
                    const isAr = lang === 'ar';
                    return {
                        id: `page-${p.id}`,
                        badge: `📄 ${isAr ? 'صفحة' : 'Page'}`,
                        title: localizedTitle,
                        subtitle: isAr ? 'تعرف على المزيد' : 'Learn more',
                        description: isAr
                            ? `اكتشف صفحة "${localizedTitle}" لمزيد من التفاصيل.`
                            : `Discover the "${localizedTitle}" page for more details.`,
                        cta: isAr ? 'اقرأ المزيد' : 'Read more',
                        link: `/${p.slug}`,
                        icon: '📄',
                        isPage: true,
                    };
                });

                const all = [...catSlides, ...pageSlides];

                if (all.length > 0) {
                    setSlides(all);
                } else {
                    setSlides([{
                        id: 'fallback',
                        badge: lang === 'ar' ? '🛍️ وجهة التسوق الأولى' : '🛍️ Your #1 Shopping Destination',
                        title: lang === 'ar' ? 'اكتشف متعة التسوق في برايم' : 'Discover the Joy of Shopping at Prime',
                        subtitle: lang === 'ar' ? 'وجهتك الأولى للعديد من المنتجات الأصلية' : 'Your #1 Destination for Authentic Products',
                        description: lang === 'ar'
                            ? 'كل ما تحتاجه في مكان واحد، بأسعار تنافسية وشحن سريع.'
                            : 'Everything you need in one place, with competitive prices and fast shipping.',
                        cta: lang === 'ar' ? 'تسوق الآن' : 'Shop Now',
                        link: '/products',
                        icon: '🛍️',
                    }]);
                }
            } catch (err) {
                console.error('Hero banner: failed to load data', err);
                setSlides([{
                    id: 'fallback',
                    badge: lang === 'ar' ? '🛍️ وجهة التسوق الأولى' : '🛍️ Your #1 Shopping Destination',
                    title: lang === 'ar' ? 'اكتشف متعة التسوق في برايم' : 'Discover the Joy of Shopping at Prime',
                    subtitle: lang === 'ar' ? 'وجهتك الأولى للعديد من المنتجات الأصلية' : '#1 Destination for Authentic Products',
                    description: lang === 'ar'
                        ? 'كل ما تحتاجه في مكان واحد، بأسعار تنافسية وشحن سريع.'
                        : 'Everything you need in one place, with competitive prices and fast shipping.',
                    cta: lang === 'ar' ? 'تسوق الآن' : 'Shop Now',
                    link: '/products',
                    icon: '🛍️',
                }]);
            } finally {
                setLoading(false);
                setCurrent(0); // reset carousel to first slide on language change
            }
        };
        fetchAll();
    }, [lang]);

    useEffect(() => {
        if (slides.length <= 1) return;
        const interval = setInterval(() => {
            setDirection(1);
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [slides.length]);

    const handlePrev = () => {
        setDirection(-1);
        setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const handleNext = () => {
        setDirection(1);
        setCurrent((prev) => (prev + 1) % slides.length);
    };

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0,
        }),
        center: { x: 0, opacity: 1 },
        exit: (direction: number) => ({
            x: direction < 0 ? 1000 : -1000,
            opacity: 0,
        }),
    };

    if (loading || slides.length === 0) {
        return (
            <div className="relative bg-gradient-to-br from-[#E8F4F7] to-[#F8F8F8] rounded-2xl p-4 md:p-8 lg:p-12 my-4 md:my-6 min-h-[280px] md:min-h-[320px] shadow-soft animate-pulse" />
        );
    }

    return (
        <div className="relative bg-gradient-to-br from-[#E8F4F7] to-[#F8F8F8] rounded-2xl p-4 md:p-8 lg:p-12 my-4 md:my-6 overflow-hidden min-h-[280px] md:min-h-[320px] shadow-soft">
            <AnimatePresence mode="wait" custom={direction}>
                {slides.map((slide, index) => (
                    index === current && (
                        <motion.div
                            key={slide.id}
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.6, ease: 'easeInOut' }}
                            className="flex flex-col md:flex-row items-center gap-4 md:gap-8"
                        >
                            <div className="flex-1 text-right z-10 w-full md:w-1/2">
                                <span className="inline-block bg-secondary text-white text-xs font-semibold px-3 py-1 rounded-pill mb-2 md:mb-3">
                                    {slide.badge}
                                </span>
                                <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-text mb-1 md:mb-2">
                                    {slide.title}
                                </h1>
                                <p className="text-lg md:text-xl text-text-secondary mb-2">
                                    {slide.subtitle}
                                </p>
                                <p className="text-sm md:text-base text-text-muted max-w-lg leading-relaxed mb-3 md:mb-5">
                                    {slide.description}
                                </p>
                                <Link
                                    href={slide.link}
                                    className="inline-flex items-center gap-2 bg-button-secondary-bg hover:bg-button-secondary-hover text-button-secondary-text px-4 md:px-6 py-2 md:py-3 rounded-pill font-semibold transition hover:shadow-lg hover:-translate-y-1 text-sm md:text-base"
                                >
                                    {slide.isPage ? (
                                        <FileText className="w-4 h-4 md:w-5 md:h-5" />
                                    ) : (
                                        <ShoppingBag className="w-4 h-4 md:w-5 md:h-5" />
                                    )}
                                    {slide.cta}
                                </Link>
                            </div>

                            <div className="hidden md:flex md:w-1/2 justify-center z-10">
                                <div className="text-[180px] lg:text-[240px] leading-none select-none drop-shadow-lg">
                                    {slide.icon}
                                </div>
                            </div>
                        </motion.div>
                    )
                ))}
            </AnimatePresence>

            {slides.length > 1 && (
                <>
                    <button
                        onClick={handlePrev}
                        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 p-2 md:p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition hover:scale-110"
                    >
                        <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 text-text" />
                    </button>
                    <button
                        onClick={handleNext}
                        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 p-2 md:p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition hover:scale-110"
                    >
                        <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-text" />
                    </button>

                    <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 flex gap-1 md:gap-2 z-20">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    setDirection(index > current ? 1 : -1);
                                    setCurrent(index);
                                }}
                                className={`transition-all duration-300 rounded-full ${current === index
                                    ? 'w-6 md:w-8 h-1.5 md:h-2.5 bg-primary'
                                    : 'w-1.5 md:w-2.5 h-1.5 md:h-2.5 bg-gray-300 hover:bg-primary/50'
                                    }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}