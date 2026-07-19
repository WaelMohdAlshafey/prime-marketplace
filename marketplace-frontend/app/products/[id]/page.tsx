'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Product } from '@/types';
import { useAuth } from '@/context/AuthContext';

export default function ProductDetail() {
    const { id } = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [adding, setAdding] = useState(false);

    const fetchProduct = async () => {
        try {
            const response = await api.get<Product>(`/api/Products/${id}`);
            setProduct(response.data);
        } catch (error) {
            console.error('Failed to fetch product:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            fetchProduct();
        }
    }, [id]);

    const addToCart = async () => {
        if (!user) {
            router.push('/auth/login');
            return;
        }

        setAdding(true);
        try {
            await api.post('/api/Cart', { productId: Number(id), quantity });
            alert('✅ Added to cart!');
        } catch (error) {
            console.error('Failed to add to cart:', error);
            alert('❌ Failed to add to cart. Please try again.');
        } finally {
            setAdding(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!product) {
        return <div className="text-center py-20">Product not found.</div>;
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <div className="bg-white rounded-xl shadow-md p-8">
                <div className="flex justify-center mb-6 text-6xl">📦</div>
                <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
                <p className="text-gray-600 mt-4 text-lg">{product.description}</p>
                <div className="mt-6 flex items-center gap-8">
                    <p className="text-4xl font-bold text-blue-600">${product.price.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">In stock: {product.stockQuantity}</p>
                </div>

                {/* ============================================================
             ADD TO CART BUTTON
             ============================================================ */}
                <div className="mt-8 flex items-center gap-4">
                    <input
                        type="number"
                        min="1"
                        max={product.stockQuantity}
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="w-24 px-4 py-3 border border-gray-300 rounded-lg text-center"
                    />
                    <button
                        onClick={addToCart}
                        disabled={adding || product.stockQuantity === 0}
                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50"
                    >
                        {adding ? 'Adding...' : '🛒 Add to Cart'}
                    </button>
                </div>
            </div>
        </div>
    );
}