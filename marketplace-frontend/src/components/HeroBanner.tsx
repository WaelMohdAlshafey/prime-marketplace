'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, ShoppingBag } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '@/lib/api';

export default function HeroBanner() {
    const { t, i18n } = useTranslation('common');
    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(0);
    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(true);

    const lang = i18n.language || 'ar';

    // Fallback if no categories in DB
    const fallbackSlide = {
        id: 0,
        badge: '🛍️ ' + (lang === 'ar' ? 'وجهة التسوق الأولى' : 'Your #1 Shopping Destination'),
        title: lang === 'ar' ? 'اكتشف متعة التسوق في برايم' : 'Discover the Joy of Shopping at Prime',
        subtitle: lang === 'ar' ? 'وجهتك الأولى للعديد من المنتجات الأصلية' : 'Your #1 Destination for Authentic Products',
        description: lang === 'ar'
            ? 'كل ما تحتاجه في مكان واحد، بأسعار تنافسية وشحن سريع.'
            : 'Everything you need in one place, with competitive prices and fast shipping.',
        cta: lang === 'ar' ? 'تسوق الآن' : 'Shop Now',
        link: '/products',
        icon: '🛍️',
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.get('/api/ProductCategories?onlyActive=true');
                const top = (res.data || [])
                    .sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999))
                    .slice(0, 4);

                const built = top.map(c => ({
                    id: c.id,
                    badge: `${c.icon || '🛍️'} ${lang === 'ar' ? 'قسم مميز' : 'Featured Category'}`,
                    title: c.name,
                    subtitle: c.description || (lang === 'ar' ? 'اكتشف منتجاتنا المميزة' : 'Explore our featured products'),
                    description: c.description || (lang === 'ar'
                        ? `تصفح أفضل منتجات ${c.name} من بائعين موثوقين.`
                        : `Browse the best ${c.name} products from trusted vendors.`),
                    cta: lang === 'ar' ? `تسوق ${c.name}` : `Shop ${c.name}`,
                    link: `/${c.slug}`,
                    icon: c.icon || '🛍️',
                }));

                setSlides(built.length > 0 ? built : [fallbackSlide]);
            } catch (err) {
                console.error('Hero banner: failed to load categories', err);
                setSlides([fallbackSlide]);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
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
        enter: (direction) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0,
        }),
        center: { x: 0, opacity: 1 },
        exit: (direction) => ({
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
                                    <ShoppingBag className="w-4 h-4 md:w-5 md:h-5" />
                                    {slide.cta}
                                </Link>
                            </div>

                            {/* Big emoji visual */}
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