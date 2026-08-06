// marketplace-frontend/app/stores/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import api from '@/lib/api';
import { StoreResponseDto } from '@/types';
import { getImageUrl } from '@/lib/getImageUrl';

export default function StoresPage() {
    const [stores, setStores] = useState<StoreResponseDto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/api/Stores?page=1&pageSize=50')
            .then(res => {
                setStores(res.data.items);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch stores:', err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F5C45]"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold text-gray-900 text-center mb-4">Our Stores</h1>
            <p className="text-gray-600 text-center mb-12">Shop from official brand stores</p>

            {stores.length === 0 ? (
                <div className="text-center py-20 text-gray-500">No stores available yet.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {stores.map((store) => (
                        <Link
                            key={store.id}
                            href={`/stores/${store.id}`}
                            className="bg-white rounded-2xl shadow-soft hover:shadow-strong transition-all duration-300 p-6 text-center hover:-translate-y-2 border border-gray-100 group"
                        >
                            <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden bg-gray-100 border-2 border-[#0F5C45]/20 group-hover:border-[#0F5C45] transition">
                                {store.logoUrl ? (
                                    <Image
                                        src={getImageUrl(store.logoUrl)}
                                        alt={store.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-4xl bg-[#0F5C45]/10">🏪</div>
                                )}
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mt-4">{store.name}</h3>
                            <p className="text-gray-500 text-sm mt-2 line-clamp-2">{store.description}</p>
                            <div className="flex justify-center items-center gap-4 mt-3 text-sm text-gray-600">
                                <span>{store.productCount} products</span>
                                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                <span>@{store.vendorUsername}</span>
                            </div>
                            <span className="inline-block mt-4 bg-[#0F5C45] text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-[#0A4735] transition">
                                Visit Store
                            </span>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}