'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Filter, X } from 'lucide-react';

interface FilterSidebarProps {
    vendorId?: number;
    onApplyFilters: (filters: {
        minPrice?: number;
        maxPrice?: number;
        inStock?: boolean;
        rating?: number;
    }) => void;
    onResetFilters: () => void;
}

const renderStars = (count: number, selected: boolean) => {
    return (
        <span className={`${selected ? 'text-[#FFB400]' : 'text-[#E0E0E0]'}`}>
            {'★'.repeat(count)}{'★'.repeat(5 - count)}
        </span>
    );
};

export default function FilterSidebar({
    onApplyFilters,
    onResetFilters,
}: FilterSidebarProps) {
    const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
    const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
    const [inStock, setInStock] = useState<boolean | undefined>(undefined);
    const [rating, setRating] = useState<number | undefined>(undefined);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const [openSections, setOpenSections] = useState<Set<string>>(
        new Set(['نطاق السعر', 'التقييم', 'التوفر'])
    );

    const toggleSection = (title: string) => {
        const newSet = new Set(openSections);
        if (newSet.has(title)) {
            newSet.delete(title);
        } else {
            newSet.add(title);
        }
        setOpenSections(newSet);
    };

    const handleApply = () => {
        onApplyFilters({ minPrice, maxPrice, inStock, rating });
        if (window.innerWidth < 768) setIsMobileOpen(false);
    };

    const handleReset = () => {
        setMinPrice(undefined);
        setMaxPrice(undefined);
        setInStock(undefined);
        setRating(undefined);
        onResetFilters();
    };

    const FilterContent = () => (
        <>
            {/* Price Range */}
            <div className="border-b border-[#E0E0E0] py-4">
                <button
                    onClick={() => toggleSection('نطاق السعر')}
                    className="flex justify-between items-center w-full text-right font-semibold text-[#1A1A1A] hover:text-[#0A6C44] transition"
                >
                    <span>نطاق السعر</span>
                    {openSections.has('نطاق السعر') ? (
                        <ChevronUp className="w-5 h-5" />
                    ) : (
                        <ChevronDown className="w-5 h-5" />
                    )}
                </button>

                {openSections.has('نطاق السعر') && (
                    <div className="mt-3">
                        <div className="flex gap-2 items-center">
                            <input
                                type="number"
                                placeholder="الحد الأدنى"
                                value={minPrice ?? ''}
                                onChange={(e) =>
                                    setMinPrice(e.target.value ? Number(e.target.value) : undefined)
                                }
                                min="0"
                                step="1"
                                className="w-1/2 px-3 py-2 border border-[#E0E0E0] rounded-button text-sm focus:ring-2 focus:ring-[#0A6C44] focus:border-transparent"
                            />
                            <span className="text-[#9E9E9E]">—</span>
                            <input
                                type="number"
                                placeholder="الحد الأقصى"
                                value={maxPrice ?? ''}
                                onChange={(e) =>
                                    setMaxPrice(e.target.value ? Number(e.target.value) : undefined)
                                }
                                min="0"
                                step="1"
                                className="w-1/2 px-3 py-2 border border-[#E0E0E0] rounded-button text-sm focus:ring-2 focus:ring-[#0A6C44] focus:border-transparent"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Rating */}
            <div className="border-b border-[#E0E0E0] py-4">
                <button
                    onClick={() => toggleSection('التقييم')}
                    className="flex justify-between items-center w-full text-right font-semibold text-[#1A1A1A] hover:text-[#0A6C44] transition"
                >
                    <span>التقييم</span>
                    {openSections.has('التقييم') ? (
                        <ChevronUp className="w-5 h-5" />
                    ) : (
                        <ChevronDown className="w-5 h-5" />
                    )}
                </button>

                {openSections.has('التقييم') && (
                    <div className="mt-3 space-y-2">
                        {[5, 4, 3, 2, 1].map((stars) => (
                            <label
                                key={stars}
                                className="flex items-center gap-2 text-sm text-[#757575] hover:text-[#1A1A1A] cursor-pointer justify-end"
                            >
                                <span className={`${rating === stars ? 'text-[#FFB400]' : 'text-[#E0E0E0]'}`}>
                                    {'★'.repeat(stars)}{'★'.repeat(5 - stars)}
                                </span>
                                <input
                                    type="radio"
                                    name="rating"
                                    value={stars}
                                    checked={rating === stars}
                                    onChange={() => setRating(stars)}
                                    className="w-4 h-4 accent-[#0A6C44]"
                                />
                            </label>
                        ))}
                        <label className="flex items-center gap-2 text-sm text-[#757575] hover:text-[#1A1A1A] cursor-pointer justify-end">
                            <span>الكل</span>
                            <input
                                type="radio"
                                name="rating"
                                value={0}
                                checked={rating === undefined}
                                onChange={() => setRating(undefined)}
                                className="w-4 h-4 accent-[#0A6C44]"
                            />
                        </label>
                    </div>
                )}
            </div>

            {/* Availability */}
            <div className="border-b border-[#E0E0E0] py-4">
                <button
                    onClick={() => toggleSection('التوفر')}
                    className="flex justify-between items-center w-full text-right font-semibold text-[#1A1A1A] hover:text-[#0A6C44] transition"
                >
                    <span>التوفر</span>
                    {openSections.has('التوفر') ? (
                        <ChevronUp className="w-5 h-5" />
                    ) : (
                        <ChevronDown className="w-5 h-5" />
                    )}
                </button>

                {openSections.has('التوفر') && (
                    <div className="mt-3">
                        <label className="flex items-center gap-2 text-sm text-[#757575] hover:text-[#1A1A1A] cursor-pointer justify-end">
                            <span>متوفر فقط</span>
                            <input
                                type="checkbox"
                                checked={inStock === true}
                                onChange={(e) => setInStock(e.target.checked ? true : undefined)}
                                className="w-4 h-4 accent-[#0A6C44]"
                            />
                        </label>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-col gap-3">
                <button
                    onClick={handleApply}
                    className="w-full bg-[#0A6C44] text-white py-3 rounded-button font-medium hover:bg-[#06452A] transition"
                >
                    تطبيق الفلاتر
                </button>
                <button
                    onClick={handleReset}
                    className="w-full text-[#757575] text-sm hover:text-[#1A1A1A] transition"
                >
                    إعادة تعيين
                </button>
            </div>
        </>
    );

    // Mobile: Floating Filter Button
    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                onClick={() => setIsMobileOpen(true)}
                className="md:hidden fixed bottom-6 left-6 z-40 bg-[#0A6C44] text-white p-4 rounded-full shadow-lg hover:bg-[#06452A] transition flex items-center gap-2"
            >
                <Filter className="w-5 h-5" />
                <span className="text-sm font-medium">فلتر</span>
            </button>

            {/* Desktop Sidebar */}
            <aside className="hidden md:block bg-white rounded-card shadow-card p-6 sticky top-24 h-fit text-right">
                <div className="flex items-center gap-2 mb-4">
                    <Filter className="w-5 h-5 text-[#0A6C44]" />
                    <h2 className="text-xl font-bold text-[#1A1A1A]">الفلاتر</h2>
                </div>
                <FilterContent />
            </aside>

            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div
                        className="fixed inset-0 bg-black/50"
                        onClick={() => setIsMobileOpen(false)}
                    />
                    <div className="fixed inset-y-0 left-0 w-80 bg-white shadow-xl p-6 overflow-y-auto animate-slide-in-right">
                        <div className="flex justify-between items-center mb-6">
                            <button
                                onClick={() => setIsMobileOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition"
                            >
                                <X className="w-6 h-6" />
                            </button>
                            <h2 className="text-xl font-bold text-[#1A1A1A]">الفلاتر</h2>
                        </div>
                        <FilterContent />
                    </div>
                </div>
            )}
        </>
    );
}