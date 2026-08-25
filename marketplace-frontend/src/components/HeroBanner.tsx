'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, ShoppingBag } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function HeroBanner() {
    const { t, i18n } = useTranslation('common');
    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(0);

    const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop';
    const lang = i18n.language || 'ar';

    // Slides with translation keys – text will be loaded from i18n
    const slides = [
        {
            id: 1,
            badgeKey: 'hero.slide1.badge',
            titleKey: 'hero.slide1.title',
            subtitleKey: 'hero.slide1.subtitle',
            descriptionKey: 'hero.slide1.description',
            ctaKey: 'hero.slide1.cta',
            link: '/products',
            image: '/images/hero/slide1.jpg',
        },
        {
            id: 2,
            badgeKey: 'hero.slide2.badge',
            titleKey: 'hero.slide2.title',
            subtitleKey: 'hero.slide2.subtitle',
            descriptionKey: 'hero.slide2.description',
            ctaKey: 'hero.slide2.cta',
            link: '/software',
            image: '/images/hero/slide2.jpg',
        },
        {
            id: 3,
            badgeKey: 'hero.slide3.badge',
            titleKey: 'hero.slide3.title',
            subtitleKey: 'hero.slide3.subtitle',
            descriptionKey: 'hero.slide3.description',
            ctaKey: 'hero.slide3.cta',
            link: '/hair-care',
            image: '/images/hero/slide3.jpg',
        },
        {
            id: 4,
            badgeKey: 'hero.slide4.badge',
            titleKey: 'hero.slide4.title',
            subtitleKey: 'hero.slide4.subtitle',
            descriptionKey: 'hero.slide4.description',
            ctaKey: 'hero.slide4.cta',
            link: '/fashion',
            image: '/images/hero/slide4.jpg',
        },
    ];

    useEffect(() => {
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
                            {/* Text content – using translated values */}
                            <div className="flex-1 text-right z-10 w-full md:w-1/2">
                                <span className="inline-block bg-secondary text-white text-xs font-semibold px-3 py-1 rounded-pill mb-2 md:mb-3">
                                    {t(slide.badgeKey)}
                                </span>
                                <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-text mb-1 md:mb-2">
                                    {t(slide.titleKey)}
                                </h1>
                                <p className="text-lg md:text-xl text-text-secondary mb-2">
                                    {t(slide.subtitleKey)}
                                </p>
                                <p className="text-sm md:text-base text-text-muted max-w-lg leading-relaxed mb-3 md:mb-5">
                                    {t(slide.descriptionKey)}
                                </p>
                                <Link
                                    href={slide.link}
                                    className="inline-flex items-center gap-2 bg-button-secondary-bg hover:bg-button-secondary-hover text-button-secondary-text px-4 md:px-6 py-2 md:py-3 rounded-pill font-semibold transition hover:shadow-lg hover:-translate-y-1 text-sm md:text-base"
                                >
                                    <ShoppingBag className="w-4 h-4 md:w-5 md:h-5" />
                                    {t(slide.ctaKey)}
                                </Link>
                            </div>

                            {/* Image */}
                            <div className="hidden md:flex md:w-1/2 justify-center z-10">
                                <Image
                                    src={slide.image}
                                    alt={t(slide.titleKey)}
                                    width={400}
                                    height={400}
                                    className="max-w-[200px] lg:max-w-[320px] h-auto object-contain"
                                    priority
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
                                    }}
                                />
                            </div>
                        </motion.div>
                    )
                ))}
            </AnimatePresence>

            {/* Navigation buttons */}
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

            {/* Dots */}
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
        </div>
    );
}