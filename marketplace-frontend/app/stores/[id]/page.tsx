'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import api from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import { StoreResponseDto, Product } from '@/types';

export default function StoreDetailPage() {
    const { id } = useParams();
    const [store, setStore] = useState<StoreResponseDto | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        const fetchStore = async () => {
            try {
                const storeRes = await api.get(`/api/Stores/${id}`);
                setStore(storeRes.data);
                const productsRes = await api.get(`/api/Stores/${id}/products?page=1&pageSize=50`);
                setProducts(productsRes.data.items);
            } catch (err) {
                console.error('Failed to fetch store:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStore();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F5C45]"></div>
            </div>
        );
    }

    if (!store) {
        return <div className="text-center py-20 text-gray-500">Store not found.</div>;
    }

    return (
        <div className="container mx-auto px-4 py-12">
            {/* Store Header */}
            <div className="bg-white rounded-2xl shadow-soft p-8 mb-8 text-center">
                <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-[#0F5C45]/20">
                    {store.logoUrl ? (
                        <Image src={store.logoUrl} alt={store.name} fill className="object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-5xl bg-[#0F5C45]/10">🏪</div>
                    )}
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mt-4">{store.name}</h1>
                <p className="text-gray-600 mt-2 max-w-2xl mx-auto">{store.description}</p>
                <div className="flex justify-center gap-6 mt-4 text-sm text-gray-500">
                    <span>Vendor: {store.vendorUsername}</span>
                    <span>{store.productCount} products</span>
                </div>
            </div>

            {/* Products */}
            <h2 className="text-2xl font-bold text-gray-800 mb-6">All Products</h2>
            {products.length === 0 ? (
                <div className="text-center py-20 text-gray-500">This store has no products yet.</div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
}