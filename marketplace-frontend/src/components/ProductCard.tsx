'use client';

import { Heart, ShoppingBag } from 'lucide-react';

interface ProductCardProps {
    product: {
        id: number;
        name: string;
        description: string;
        price: number;
        stockQuantity: number;
        imageUrl?: string;
    };
    onCardClick?: (id: number) => void;
}

export default function ProductCard({ product, onCardClick }: ProductCardProps) {
    const handleCardClick = (e: React.MouseEvent) => {
        e.preventDefault();
        console.log('🖱️ ProductCard clicked, productId:', product.id);
        if (onCardClick) {
            onCardClick(product.id);
        } else {
            console.warn('⚠️ onCardClick is not defined – check parent component.');
        }
    };

    return (
        <div
            className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-lg transition"
            onClick={handleCardClick}
        >
            <div className="relative">
                <div className="w-full h-48 bg-gray-100 rounded-md mb-2 flex items-center justify-center text-gray-400">
                    {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="object-cover w-full h-full" />
                    ) : (
                        <span>No Image</span>
                    )}
                </div>
                <h3 className="font-bold text-lg">{product.name}</h3>
                <p className="text-gray-600 text-sm">{product.description}</p>
                <p className="text-xl font-bold text-green-600 mt-2">£{product.price}</p>
            </div>
            <div className="mt-3 flex items-center gap-2">
                <button
                    className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-600"
                    onClick={(e) => {
                        e.stopPropagation();
                        alert('Add to cart clicked');
                    }}
                >
                    <ShoppingBag className="w-4 h-4 inline mr-1" /> Add
                </button>
                <button
                    className="text-gray-400 hover:text-red-500"
                    onClick={(e) => {
                        e.stopPropagation();
                        alert('Wishlist clicked');
                    }}
                >
                    <Heart className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}