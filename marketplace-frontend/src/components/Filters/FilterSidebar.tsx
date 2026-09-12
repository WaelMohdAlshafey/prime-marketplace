'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronUp, Filter, X } from 'lucide-react';

interface FilterSidebarProps {
    vendorId?: number;
    initialFilters?: {
        minPrice?: number;
        maxPrice?: number;
        inStock?: boolean;
        sortBy?: string;
    };
    onApplyFilters: (filters: {
        minPrice?: number;
        maxPrice?: number;
        inStock?: boolean;
        sortBy?: string;
    }) => void;
    onResetFilters: () => void;
}

export default function FilterSidebar({
    initialFilters,
    onApplyFilters,
    onResetFilters,
}: FilterSidebarProps) {
    const { i18n } = useTranslation('common');
    const lang = (i18n.language || 'ar').startsWith('ar') ? 'ar' : 'en';
    const isAr = lang === 'ar';

    const [minPrice, setMinPrice] = useState<number | undefined>(initialFilters?.minPrice);
    const [maxPrice, setMaxPrice] = useState<number | undefined>(initialFilters?.maxPrice);
    const [inStock, setInStock] = useState<boolean | undefined>(initialFilters?.inStock);
    const [sortBy, setSortBy] = useState<string>(initialFilters?.sortBy || 'default');
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [openSections, setOpenSections] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (initialFilters) {
            setMinPrice(initialFilters.minPrice);
            setMaxPrice(initialFilters.maxPrice);
            setInStock(initialFilters.inStock);
            setSortBy(initialFilters.sortBy || 'default');
        } else {
            setMinPrice(undefined);
            setMaxPrice(undefined);
            setInStock(undefined);
            setSortBy('default');
        }
    }, [initialFilters]);

    const toggleSection = (title: string) => {
        const newSet = new Set(openSections);
        if (newSet.has(title)) newSet.delete(title);
        else newSet.add(title);
        setOpenSections(newSet);
    };

    const handleApply = () => {
        onApplyFilters({
            minPrice,
            maxPrice,
            inStock,
            sortBy: sortBy === 'default' ? undefined : sortBy,
        });
        if (window.innerWidth < 768) setIsMobileOpen(false);
    };

    const handleReset = () => {
        setMinPrice(undefined);
        setMaxPrice(undefined);
        setInStock(undefined);
        setSortBy('default');
        onResetFilters();
    };

    const L = {
        filters: isAr ? 'الفلاتر' : 'Filters',
        sort: isAr ? 'الترتيب' : 'Sort',
        sortDefault: isAr ? 'الافتراضي' : 'Default',
        sortNewest: isAr ? 'الأحدث' : 'Newest',
        sortPriceAsc: isAr ? 'السعر: من الأقل للأعلى' : 'Price: Low to High',
        sortPriceDesc: isAr ? 'السعر: من الأعلى للأقل' : 'Price: High to Low',
        sortRating: isAr ? 'الأعلى تقييماً' : 'Top Rated',
        sortNameAsc: isAr ? 'الاسم: أ - ي' : 'Name: A - Z',
        sortNameDesc: isAr ? 'الاسم: ي - أ' : 'Name: Z - A',
        priceRange: isAr ? 'نطاق السعر' : 'Price Range',
        min: isAr ? 'الحد الأدنى' : 'Min',
        max: isAr ? 'الحد الأقصى' : 'Max',
        availability: isAr ? 'التوفر' : 'Availability',
        inStockOnly: isAr ? 'متوفر فقط' : 'In stock only',
        apply: isAr ? 'تطبيق الفلاتر' : 'Apply Filters',
        reset: isAr ? 'إعادة تعيين' : 'Reset',
        filterBtn: isAr ? 'فلتر' : 'Filter',
    };

    // ✅ Plain render function — NOT a component (no remount = no focus loss)
    const renderFilterContent = () => (
        <div className="space-y-4">
            {/* Sort */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <button
                    onClick={() => toggleSection('sort')}
                    className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition font-semibold text-gray-800 text-sm"
                >
                    <span>{L.sort}</span>
                    {openSections.has('sort') ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openSections.has('sort') && (
                    <div className="p-4">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0F5C45] focus:border-transparent outline-none"
                        >
                            <option value="default">{L.sortDefault}</option>
                            <option value="newest">{L.sortNewest}</option>
                            <option value="price_asc">{L.sortPriceAsc}</option>
                            <option value="price_desc">{L.sortPriceDesc}</option>
                            <option value="rating">{L.sortRating}</option>
                            <option value="name_asc">{L.sortNameAsc}</option>
                            <option value="name_desc">{L.sortNameDesc}</option>
                        </select>
                    </div>
                )}
            </div>

            {/* Price Range */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <button
                    onClick={() => toggleSection('price')}
                    className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition font-semibold text-gray-800 text-sm"
                >
                    <span>{L.priceRange}</span>
                    {openSections.has('price') ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openSections.has('price') && (
                    <div className="p-4">
                        <div className="flex items-center gap-2" dir="ltr">
                            <input
                                type="number"
                                placeholder={L.min}
                                value={minPrice ?? ''}
                                onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : undefined)}
                                min="0"
                                step="1"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-center focus:ring-2 focus:ring-[#0F5C45] focus:border-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            <span className="text-gray-400 flex-shrink-0">—</span>
                            <input
                                type="number"
                                placeholder={L.max}
                                value={maxPrice ?? ''}
                                onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : undefined)}
                                min="0"
                                step="1"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-center focus:ring-2 focus:ring-[#0F5C45] focus:border-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Availability */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <button
                    onClick={() => toggleSection('stock')}
                    className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition font-semibold text-gray-800 text-sm"
                >
                    <span>{L.availability}</span>
                    {openSections.has('stock') ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openSections.has('stock') && (
                    <div className="p-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={inStock === true}
                                onChange={(e) => setInStock(e.target.checked ? true : undefined)}
                                className="w-4 h-4 accent-[#0F5C45]"
                            />
                            <span className="text-sm text-gray-700">{L.inStockOnly}</span>
                        </label>
                    </div>
                )}
            </div>

            {/* Apply / Reset */}
            <button
                onClick={handleApply}
                className="w-full py-2.5 bg-[#0F5C45] text-white font-semibold rounded-xl hover:bg-[#0A4735] transition shadow-sm"
            >
                {L.apply}
            </button>
            <button
                onClick={handleReset}
                className="w-full py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition border border-gray-300"
            >
                {L.reset}
            </button>
        </div>
    );

    return (
        <>
            <button
                onClick={() => setIsMobileOpen(true)}
                className="md:hidden fixed bottom-6 left-6 z-40 bg-[#0F5C45] text-white p-4 rounded-full shadow-lg hover:bg-[#0A4735] transition flex items-center gap-2"
            >
                <Filter className="w-5 h-5" />
                <span className="text-sm font-medium">{L.filterBtn}</span>
            </button>

            <aside className="hidden md:block">
                <div className="flex items-center gap-2 mb-4 px-1">
                    <Filter className="w-5 h-5 text-[#0F5C45]" />
                    <span className="font-bold text-gray-800">{L.filters}</span>
                </div>
                {renderFilterContent()}
            </aside>

            {isMobileOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileOpen(false)} />
                    <div className={`fixed inset-y-0 ${isAr ? 'left-0' : 'right-0'} w-80 bg-gray-50 shadow-xl p-5 overflow-y-auto`}>
                        <div className="flex justify-between items-center mb-5">
                            <h2 className="text-lg font-bold text-gray-800">{L.filters}</h2>
                            <button
                                onClick={() => setIsMobileOpen(false)}
                                className="p-1.5 hover:bg-gray-200 rounded-full transition"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        {renderFilterContent()}
                    </div>
                </div>
            )}
        </>
    );
}   