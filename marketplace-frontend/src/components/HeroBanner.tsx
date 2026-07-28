'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const slides = [
    {
        id: 1,
        title: 'اكتشف متعة التسوق في برايم',
        subtitle: 'وجهتك الأولى للعديد من المنتجات الأصلية',
        description: 'من البرامج والتقنية إلى التجميل، الأزياء، والإلكترونيات. كل ما تحتاجه في مكان واحد، بأسعار تنافسية وشحن سريع لجميع المحافظات.',
        cta: 'تسوق الآن',
        link: '/products',
        image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=600&fit=crop',
        badge: '🛍️ وجهة التسوق الأولى',
        gradient: 'from-[#0F5C45]/5 via-transparent to-[#D4A54A]/5',
    },
    {
        id: 2,
        title: 'أحدث البرامج والتطبيقات التقنية',
        subtitle: 'إصدارات 2025 بأسعار خاصة',
        description: 'احصل على أدوات التطوير، برامج التصميم الجرافيكي، حلول الأمن السيبراني، والذكاء الاصطناعي. تراخيص أصلية ودعم فني متواصل.',
        cta: 'استكشف البرامج',
        link: '/software',
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop',
        badge: '💻 تقنية متطورة',
        gradient: 'from-purple-500/5 via-transparent to-pink-500/5',
    },
    {
        id: 3,
        title: 'الجمال والعناية الفاخرة',
        subtitle: 'منتجات طبيعية لبشرتك وشعرك',
        description: 'شامبو عضوي، كريمات مرطبة للبشرة الحساسة، زيوت مغربية أصلية. منتجات معتمدة من أفضل الماركات العالمية، مناسبة لجميع أنواع البشرة.',
        cta: 'تسوق التجميل',
        link: '/hair-care',
        image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=600&fit=crop',
        badge: '✨ عناية فائقة',
        gradient: 'from-rose-500/5 via-transparent to-orange-500/5',
    },
    {
        id: 4,
        title: 'أحدث صيحات الموضة والأزياء',
        subtitle: 'أزياء وإكسسوارات لكل الأذواق',
        description: 'تشكيلة مميزة من الملابس القطنية، الأحذية الرياضية، الساعات الكلاسيكية، والمجوهرات. نناسب جميع المناسبات بأفضل جودة وأسعار لا تقبل المنافسة.',
        cta: 'تسوق الأزياء',
        link: '/fashion',
        image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&h=600&fit=crop',
        badge: '👗 ستايل عصري',
        gradient: 'from-yellow-500/5 via-transparent to-amber-500/5',
    },
];

export default function HeroBanner() {
    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setDirection(1);
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(interval);
    }, []);

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
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 1000 : -1000,
            opacity: 0,
        }),
    };

    return (
        <section className="container mx-auto px-4 mt-6">
            <div className="relative bg-white/50 backdrop-blur-sm rounded-3xl overflow-hidden shadow-soft border border-gray-100/50">
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
                                className={`bg-gradient-to-br ${slide.gradient} p-8 md:p-16`}
                            >
                                <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-8">
                                    {/* Text Content */}
                                    <div className="flex-1 text-right">
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 }}
                                            className="inline-block bg-[#0F5C45]/10 text-[#0F5C45] text-sm font-semibold px-4 py-1.5 rounded-full mb-4 border border-[#0F5C45]/20"
                                        >
                                            {slide.badge}
                                        </motion.div>
                                        <motion.h1
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 }}
                                            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-3"
                                        >
                                            {slide.title}
                                        </motion.h1>
                                        <motion.h2
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.4 }}
                                            className="text-xl md:text-2xl text-gray-700 mb-3 font-medium"
                                        >
                                            {slide.subtitle}
                                        </motion.h2>
                                        <motion.p
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.5 }}
                                            className="text-base md:text-lg text-gray-600 mb-6 max-w-lg"
                                        >
                                            {slide.description}
                                        </motion.p>
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.6 }}
                                        >
                                            <Link
                                                href={slide.link}
                                                className="inline-block bg-gradient-to-r from-[#0F5C45] to-[#1A7A5C] text-white px-6 md:px-8 py-3 rounded-2xl text-base md:text-lg font-semibold hover:shadow-lg hover:shadow-[#0F5C45]/20 hover:scale-105 transition-all duration-300"
                                            >
                                                ← {slide.cta}
                                            </Link>
                                        </motion.div>
                                    </div>

                                    {/* Image */}
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.3 }}
                                        className="flex-1 flex justify-center"
                                    >
                                        <div className="w-56 h-56 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-2xl overflow-hidden shadow-strong border-2 border-white/50">
                                            <Image
                                                src={slide.image}
                                                alt={slide.title}
                                                width={800}
                                                height={600}
                                                className="w-full h-full object-cover"
                                                priority={slide.id === 1}
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src =
                                                        'https://placehold.co/800x600/e0e0e0/666666?text=Prime';
                                                }}
                                            />
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>
                        )
                    ))}
                </AnimatePresence>

                {/* Navigation Arrows */}
                <button
                    onClick={handlePrev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-300 hover:scale-110"
                    aria-label="السابق"
                >
                    <ArrowLeft className="w-5 h-5 text-[#0F5C45]" />
                </button>
                <button
                    onClick={handleNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-300 hover:scale-110"
                    aria-label="التالي"
                >
                    <ArrowRight className="w-5 h-5 text-[#0F5C45]" />
                </button>

                {/* Dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setDirection(index > current ? 1 : -1);
                                setCurrent(index);
                            }}
                            className={`transition-all duration-300 rounded-full ${current === index
                                    ? 'w-8 h-2.5 bg-[#0F5C45]'
                                    : 'w-2.5 h-2.5 bg-gray-300 hover:bg-[#0F5C45]/50'
                                }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}