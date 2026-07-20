'use client';

import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface FilterSection {
    title: string;
    options: { label: string; value: string; count?: number }[];
    type: 'checkbox' | 'radio' | 'range' | 'stars';
}

const filterSections: FilterSection[] = [
    {
        title: 'Category',
        type: 'checkbox',
        options: [
            { label: 'Software', value: 'software', count: 1234 },
            { label: 'Hair Care', value: 'hair-care', count: 856 },
            { label: 'Skin Care', value: 'skin-care', count: 723 },
        ],
    },
    {
        title: 'Price Range',
        type: 'range',
        options: [],
    },
    {
        title: 'Rating',
        type: 'stars',
        options: [
            { label: '★★★★★', value: '5' },
            { label: '★★★★☆', value: '4' },
            { label: '★★★☆☆', value: '3' },
        ],
    },
    {
        title: 'Availability',
        type: 'checkbox',
        options: [
            { label: 'In Stock', value: 'in-stock' },
            { label: 'Out of Stock', value: 'out-of-stock' },
        ],
    },
];

export default function FilterSidebar() {
    const [openSections, setOpenSections] = useState<Set<string>>(new Set(['Category', 'Price Range', 'Rating']));

    const toggleSection = (title: string) => {
        const newSet = new Set(openSections);
        if (newSet.has(title)) {
            newSet.delete(title);
        } else {
            newSet.add(title);
        }
        setOpenSections(newSet);
    };

    return (
        <aside className="bg-white rounded-card shadow-sm p-6 sticky top-24 h-fit">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Filters</h2>

            {filterSections.map((section) => (
                <div key={section.title} className="border-b border-gray-200 py-4">
                    <button
                        onClick={() => toggleSection(section.title)}
                        className="flex justify-between items-center w-full text-left font-semibold text-gray-800 hover:text-primary transition"
                    >
                        <span>{section.title}</span>
                        {openSections.has(section.title) ? (
                            <ChevronUpIcon className="w-5 h-5" />
                        ) : (
                            <ChevronDownIcon className="w-5 h-5" />
                        )}
                    </button>

                    {openSections.has(section.title) && (
                        <div className="mt-3 space-y-2">
                            {section.type === 'checkbox' && section.options.map((option) => (
                                <label key={option.value} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 cursor-pointer">
                                    <input type="checkbox" className="w-4 h-4 accent-primary" />
                                    <span>{option.label}</span>
                                    {option.count && <span className="text-gray-400">({option.count})</span>}
                                </label>
                            ))}

                            {section.type === 'stars' && section.options.map((option) => (
                                <label key={option.value} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 cursor-pointer">
                                    <input type="radio" name="rating" className="w-4 h-4 accent-primary" />
                                    <span className="text-amber-400">{option.label}</span>
                                </label>
                            ))}

                            {section.type === 'range' && (
                                <div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1000"
                                        className="w-full accent-primary"
                                        defaultValue="500"
                                    />
                                    <div className="flex justify-between text-xs text-gray-500">
                                        <span>$0</span>
                                        <span>$1000</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ))}

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col gap-3">
                <button className="w-full bg-primary text-white py-2.5 rounded-lg font-medium hover:bg-primary-dark transition">
                    Apply Filters
                </button>
                <button className="w-full text-gray-500 text-sm hover:text-gray-700 transition">
                    Reset Filters
                </button>
            </div>
        </aside>
    );
}