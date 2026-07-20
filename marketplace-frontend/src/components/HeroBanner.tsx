'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

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
        bg: 'from-blue-50 to-indigo-50',
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
        bg: 'from-purple-50 to-pink-50',
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
        bg: 'from-rose-50 to-orange-50',
    },
    {
        id: 4,
        title: 'أحدث صيحات الموضة والأزياء',
        subtitle: 'أزياء وإكسسوارات لكل الأذواق',
        description: 'تشكيلة مميزة من الملابس القطنية، الأحذية الرياضية، الساعات الكلاسيكية، والمجوهرات. نناسب جميع المناسبات بأفضل جودة وأسعار لا تقبل المنافسة.',
        cta: 'تسوق الأزياء',
        link: '/fashion',
        // ============================================================
        // NEW IMAGE: Professional, modern suit (Neutral and Stylish)
        // ============================================================
        image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&h=600&fit=crop',
        badge: '👗 ستايل عصري',
        bg: 'from-yellow-50 to-amber-50',
    },
];

export default function HeroBanner() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="container mx-auto px-4 mt-6">
            <div className="relative bg-gradient-to-r from-[#0F5C45]/10 to-[#0F5C45]/5 rounded-3xl overflow-hidden shadow-sm border border-gray-100">
                <div className="grid grid-cols-1">
                    {slides.map((slide, index) => (
                        <div
                            key={slide.id}
                            className={`col-start-1 row-start-1 transition-opacity duration-700 ease-in-out ${index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
                                }`}
                        >
                            <div className={`bg-gradient-to-br ${slide.bg} p-8 md:p-16`}>
                                <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-8">
                                    {/* Text Content */}
                                    <div className="flex-1 text-right">
                                        <div className="inline-block bg-[#0F5C45]/10 text-[#0F5C45] text-sm font-semibold px-4 py-1.5 rounded-full mb-4 border border-[#0F5C45]/20">
                                            {slide.badge}
                                        </div>
                                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-3">
                                            {slide.title}
                                        </h1>
                                        <h2 className="text-xl md:text-2xl text-gray-700 mb-3 font-medium">
                                            {slide.subtitle}
                                        </h2>
                                        <p className="text-base md:text-lg text-gray-600 mb-6 max-w-lg">
                                            {slide.description}
                                        </p>
                                        <Link
                                            href={slide.link}
                                            className="inline-block bg-[#0F5C45] text-white px-6 md:px-8 py-3 rounded-2xl text-base md:text-lg font-semibold hover:bg-[#0A4735] transition shadow-soft hover:shadow-hover"
                                        >
                                            ← {slide.cta}
                                        </Link>
                                    </div>

                                    {/* Image */}
                                    <div className="flex-1 flex justify-center">
                                        <div className="w-56 h-56 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-2xl overflow-hidden shadow-lg border-2 border-white">
                                            <Image
                                                src={slide.image}
                                                alt={slide.title}
                                                width={800}
                                                height={600}
                                                className="w-full h-full object-cover"
                                                priority={slide.id === 1}
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src =
                                                        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop';
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrent(index)}
                            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${current === index ? 'bg-[#0F5C45] w-8' : 'bg-gray-300'
                                }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}