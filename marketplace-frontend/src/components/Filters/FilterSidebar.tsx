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

export default function FilterSidebar({
    onApplyFilters,
    onResetFilters,
}: FilterSidebarProps) {
    const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
    const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
    const [inStock, setInStock] = useState<boolean | undefined>(undefined);
    const [rating, setRating] = useState<number | undefined>(undefined);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    // ✅ Start with ALL sections collapsed
    const [openSections, setOpenSections] = useState<Set<string>>(new Set());

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
            <div className="filter-section">
                <button
                    onClick={() => toggleSection('نطاق السعر')}
                    className="filter-header"
                >
                    <span>نطاق السعر</span>
                    {openSections.has('نطاق السعر') ? (
                        <ChevronUp className="w-5 h-5" />
                    ) : (
                        <ChevronDown className="w-5 h-5" />
                    )}
                </button>

                {openSections.has('نطاق السعر') && (
                    <div className="filter-content">
                        <div className="price-inputs">
                            <input
                                type="number"
                                placeholder="الحد الأدنى"
                                value={minPrice ?? ''}
                                onChange={(e) =>
                                    setMinPrice(e.target.value ? Number(e.target.value) : undefined)
                                }
                                min="0"
                                step="1"
                            />
                            <span className="separator">—</span>
                            <input
                                type="number"
                                placeholder="الحد الأقصى"
                                value={maxPrice ?? ''}
                                onChange={(e) =>
                                    setMaxPrice(e.target.value ? Number(e.target.value) : undefined)
                                }
                                min="0"
                                step="1"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Rating */}
            <div className="filter-section">
                <button
                    onClick={() => toggleSection('التقييم')}
                    className="filter-header"
                >
                    <span>التقييم</span>
                    {openSections.has('التقييم') ? (
                        <ChevronUp className="w-5 h-5" />
                    ) : (
                        <ChevronDown className="w-5 h-5" />
                    )}
                </button>

                {openSections.has('التقييم') && (
                    <div className="filter-content space-y-2">
                        {[5, 4, 3, 2, 1].map((stars) => (
                            <label key={stars}>
                                <span className={`${rating === stars ? 'text-[#FFB400]' : 'text-[#E0E0E0]'}`}>
                                    {'★'.repeat(stars)}{'★'.repeat(5 - stars)}
                                </span>
                                <input
                                    type="radio"
                                    name="rating"
                                    value={stars}
                                    checked={rating === stars}
                                    onChange={() => setRating(stars)}
                                />
                            </label>
                        ))}
                        <label>
                            <span>الكل</span>
                            <input
                                type="radio"
                                name="rating"
                                value={0}
                                checked={rating === undefined}
                                onChange={() => setRating(undefined)}
                            />
                        </label>
                    </div>
                )}
            </div>

            {/* Availability */}
            <div className="filter-section">
                <button
                    onClick={() => toggleSection('التوفر')}
                    className="filter-header"
                >
                    <span>التوفر</span>
                    {openSections.has('التوفر') ? (
                        <ChevronUp className="w-5 h-5" />
                    ) : (
                        <ChevronDown className="w-5 h-5" />
                    )}
                </button>

                {openSections.has('التوفر') && (
                    <div className="filter-content">
                        <label>
                            <span>متوفر فقط</span>
                            <input
                                type="checkbox"
                                checked={inStock === true}
                                onChange={(e) => setInStock(e.target.checked ? true : undefined)}
                            />
                        </label>
                    </div>
                )}
            </div>

            {/* Apply Buttons */}
            <button onClick={handleApply} className="filter-apply-btn">
                تطبيق الفلاتر
            </button>
            <button onClick={handleReset} className="filter-reset-btn">
                إعادة تعيين
            </button>
        </>
    );

    return (
        <>
            {/* Mobile Toggle */}
            <button
                onClick={() => setIsMobileOpen(true)}
                className="md:hidden fixed bottom-6 left-6 z-40 bg-[#0A6C44] text-white p-4 rounded-full shadow-lg hover:bg-[#06452A] transition flex items-center gap-2"
            >
                <Filter className="w-5 h-5" />
                <span className="text-sm font-medium">فلتر</span>
            </button>

            {/* Desktop Sidebar */}
            <aside className="sidebar hidden md:block">
                <div className="sidebar-title">
                    <Filter className="w-5 h-5 text-[#0A6C44]" />
                    الفلاتر
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
                    <div className="fixed inset-y-0 left-0 w-80 bg-white shadow-xl p-6 overflow-y-auto">
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