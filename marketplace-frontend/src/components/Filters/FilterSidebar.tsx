'use client';

import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

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

// ============================================================
// STARS RENDER HELPER
// ============================================================
const renderStars = (count: number) => {
    return '★'.repeat(count) + '☆'.repeat(5 - count);
};

export default function FilterSidebar({
    onApplyFilters,
    onResetFilters,
}: FilterSidebarProps) {
    const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
    const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
    const [inStock, setInStock] = useState<boolean | undefined>(undefined);
    const [rating, setRating] = useState<number | undefined>(undefined);

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
        onApplyFilters({
            minPrice,
            maxPrice,
            inStock,
            rating,
        });
    };

    const handleReset = () => {
        setMinPrice(undefined);
        setMaxPrice(undefined);
        setInStock(undefined);
        setRating(undefined);
        onResetFilters();
    };

    return (
        <aside className="bg-white rounded-2xl shadow-sm p-6 sticky top-24 h-fit text-right">
            <h2 className="text-xl font-bold text-gray-900 mb-4">🧹 الفلاتر</h2>

            {/* Price Range */}
            <div className="border-b border-gray-200 py-4">
                <button
                    onClick={() => toggleSection('نطاق السعر')}
                    className="flex justify-between items-center w-full text-left font-semibold text-gray-800 hover:text-[#0F5C45] transition"
                >
                    <span>نطاق السعر</span>
                    {openSections.has('نطاق السعر') ? (
                        <ChevronUpIcon className="w-5 h-5" />
                    ) : (
                        <ChevronDownIcon className="w-5 h-5" />
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
                                className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0F5C45] focus:border-transparent"
                            />
                            <span className="text-gray-400">—</span>
                            <input
                                type="number"
                                placeholder="الحد الأقصى"
                                value={maxPrice ?? ''}
                                onChange={(e) =>
                                    setMaxPrice(e.target.value ? Number(e.target.value) : undefined)
                                }
                                className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0F5C45] focus:border-transparent"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* ============================================================
          RATING FILTER (With proper stars)
          ============================================================ */}
            <div className="border-b border-gray-200 py-4">
                <button
                    onClick={() => toggleSection('التقييم')}
                    className="flex justify-between items-center w-full text-left font-semibold text-gray-800 hover:text-[#0F5C45] transition"
                >
                    <span>التقييم</span>
                    {openSections.has('التقييم') ? (
                        <ChevronUpIcon className="w-5 h-5" />
                    ) : (
                        <ChevronDownIcon className="w-5 h-5" />
                    )}
                </button>

                {openSections.has('التقييم') && (
                    <div className="mt-3 space-y-2">
                        {[5, 4, 3, 2, 1].map((stars) => (
                            <label
                                key={stars}
                                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 cursor-pointer justify-end"
                            >
                                <span className="text-amber-400">{renderStars(stars)}</span>
                                <span className="text-xs text-gray-400">وأعلى</span>
                                <input
                                    type="radio"
                                    name="rating"
                                    value={stars}
                                    checked={rating === stars}
                                    onChange={() => setRating(stars)}
                                    className="w-4 h-4 accent-[#0F5C45]"
                                />
                            </label>
                        ))}
                        <label className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 cursor-pointer justify-end">
                            <span>الكل</span>
                            <input
                                type="radio"
                                name="rating"
                                value={0}
                                checked={rating === undefined}
                                onChange={() => setRating(undefined)}
                                className="w-4 h-4 accent-[#0F5C45]"
                            />
                        </label>
                    </div>
                )}
            </div>

            {/* Availability */}
            <div className="border-b border-gray-200 py-4">
                <button
                    onClick={() => toggleSection('التوفر')}
                    className="flex justify-between items-center w-full text-left font-semibold text-gray-800 hover:text-[#0F5C45] transition"
                >
                    <span>التوفر</span>
                    {openSections.has('التوفر') ? (
                        <ChevronUpIcon className="w-5 h-5" />
                    ) : (
                        <ChevronDownIcon className="w-5 h-5" />
                    )}
                </button>

                {openSections.has('التوفر') && (
                    <div className="mt-3 space-y-2">
                        <label className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 cursor-pointer justify-end">
                            <span>متوفر فقط</span>
                            <input
                                type="checkbox"
                                checked={inStock === true}
                                onChange={(e) => setInStock(e.target.checked ? true : undefined)}
                                className="w-4 h-4 accent-[#0F5C45]"
                            />
                        </label>
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col gap-3">
                <button
                    onClick={handleApply}
                    className="w-full bg-[#0F5C45] text-white py-2.5 rounded-xl font-medium hover:bg-[#0A4735] transition"
                >
                    تطبيق الفلاتر
                </button>
                <button
                    onClick={handleReset}
                    className="w-full text-gray-500 text-sm hover:text-gray-700 transition"
                >
                    إعادة تعيين
                </button>
            </div>
        </aside>
    );
}