'use client';

import Link from 'next/link';
import Image from 'next/image';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';

interface VendorCardProps {
    vendor: {
        id: number;
        name: string;
        logo?: string;
        rating: number;
        followers: number;
        productsCount: number;
        isVerified: boolean;
    };
}

export default function VendorCard({ vendor }: VendorCardProps) {
    return (
        <div className="bg-white rounded-card shadow-sm hover:shadow-lg transition p-6 text-center group hover:-translate-y-1 duration-300">
            <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden bg-gray-100 border-2 border-primary/20">
                {vendor.logo ? (
                    <Image src={vendor.logo} alt={vendor.name} fill className="object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl bg-primary/10">🏪</div>
                )}
            </div>

            <div className="mt-3 flex items-center justify-center gap-1">
                <h3 className="font-semibold text-gray-800 text-lg">{vendor.name}</h3>
                {vendor.isVerified && (
                    <CheckBadgeIcon className="w-5 h-5 text-primary" />
                )}
            </div>

            <div className="flex items-center justify-center gap-1 text-sm text-amber-400 mt-1">
                <span>★</span>
                <span className="text-gray-700 font-medium">{vendor.rating}</span>
                <span className="text-gray-400">({vendor.followers} followers)</span>
            </div>

            <p className="text-sm text-gray-500 mt-1">{vendor.productsCount} products</p>

            <Link
                href={`/vendors/${vendor.id}`}
                className="inline-block mt-4 text-primary border border-primary px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-primary hover:text-white transition"
            >
                Visit Store
            </Link>
        </div>
    );
}