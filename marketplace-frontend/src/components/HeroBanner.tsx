// marketplace-frontend/components/HeroBanner.tsx

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, ShoppingBag } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function HeroBanner() {
    const { t } = useTranslation('common');
    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(0);

    const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop';

    const slides = [
        {
            id: 1,
            badge: '🛍️ وجهة التسوق الأولى',
            title: 'اكتشف متعة التسوق في برايم',
            subtitle: 'وجهتك الأولى للمنتجات الأصلية',
            description:
                'من البرامج والتقنية إلى التجميل، الأزياء، والإلكترونيات. كل ما تحتاجه في مكان واحد، بأسعار تنافسية وشحن سريع لجميع المحافظات.',
            cta: 'تسوق الآن',
            link: '/products',
            image: '/images/hero/slide1.jpg',
        },
        {
            id: 2,
            badge: '💻 تقنية متطورة',
            title: 'أحدث البرامج والتطبيقات التقنية',
            subtitle: 'إصدارات 2025 بأسعار خاصة',
            description:
                'احصل على أدوات التطوير، برامج التصميم الجرافيكي، حلول الأمن السيبراني، والذكاء الاصطناعي. تراخيص أصلية ودعم فني متواصل.',
            cta: 'استكشف البرامج',
            link: '/software',
            image: '/images/hero/slide2.jpg',
        },
        {
            id: 3,
            badge: '✨ عناية فائقة',
            title: 'الجمال والعناية الفاخرة',
            subtitle: 'منتجات طبيعية لبشرتك وشعرك',
            description:
                'شامبو عضوي، كريمات مرطبة للبشرة الحساسة، زيوت مغربية أصلية. منتجات معتمدة من أفضل الماركات العالمية، مناسبة لجميع أنواع البشرة.',
            cta: 'تسوق التجميل',
            link: '/hair-care',
            image: '/images/hero/slide3.jpg',
        },
        {
            id: 4,
            badge: '👗 ستايل عصري',
            title: 'أحدث صيحات الموضة والأزياء',
            subtitle: 'أزياء وإكسسوارات لكل الأذواق',
            description:
                'تشكيلة مميزة من الملابس القطنية، الأحذية الرياضية، الساعات الكلاسيكية، والمجوهرات. نناسب جميع المناسبات بأفضل جودة وأسعار لا تقبل المنافسة.',
            cta: 'تسوق الأزياء',
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
        <div className="hero relative overflow-hidden">
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
                            className="hero-content"
                        >
                            <span className="badge">{slide.badge}</span>
                            <h1>{slide.title}</h1>
                            <p className="subtitle">{slide.subtitle}</p>
                            <p className="description">{slide.description}</p>
                            <Link href={slide.link} className="hero-btn">
                                <ShoppingBag className="w-5 h-5" />
                                {slide.cta}
                            </Link>
                        </motion.div>
                    )
                ))}
            </AnimatePresence>

            <div className="hero-visual">
                <Image
                    src={slides[current].image}
                    alt={slides[current].title}
                    width={400}
                    height={400}
                    className="hero-image object-contain"
                    priority
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
                    }}
                />
            </div>

            <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-300 hover:scale-110"
            >
                <ArrowLeft className="w-5 h-5 text-[#2F5A6B]" />
            </button>
            <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-300 hover:scale-110"
            >
                <ArrowRight className="w-5 h-5 text-[#2F5A6B]" />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            setDirection(index > current ? 1 : -1);
                            setCurrent(index);
                        }}
                        className={`transition-all duration-300 rounded-full ${current === index
                            ? 'w-8 h-2.5 bg-[#4E8C9E]'
                            : 'w-2.5 h-2.5 bg-gray-300 hover:bg-[#4E8C9E]/50'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}