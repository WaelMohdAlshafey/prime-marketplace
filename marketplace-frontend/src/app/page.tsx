'use client';

import { useState } from 'react';
import ProductCard from '@/components/ProductCard';
import ProductDetailModal from '@/components/ProductDetailModal';

// Dummy product data for testing
const testProducts = [
    { id: 1, name: 'Test Product 1', description: 'Description 1', price: 99.99, stockQuantity: 10 },
    { id: 2, name: 'Test Product 2', description: 'Description 2', price: 49.99, stockQuantity: 5 },
];

export default function Home() {
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCardClick = (productId: number) => {
        console.log('🖱️ handleCardClick called with productId:', productId);
        setSelectedProductId(productId);
        setIsModalOpen(true);
        console.log('🔓 isModalOpen set to true');
    };

    // Test button to open modal manually (for debugging)
    const testOpenModal = () => {
        console.log('🔧 Test button clicked – opening modal with productId 1');
        setSelectedProductId(1);
        setIsModalOpen(true);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Product Grid</h1>

            {/* Test button */}
            <button
                onClick={testOpenModal}
                className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg z-50 shadow-lg hover:bg-blue-700"
            >
                🧪 Open Modal (Test)
            </button>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {testProducts.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onCardClick={handleCardClick}
                    />
                ))}
            </div>

            <ProductDetailModal
                productId={selectedProductId || 0}
                isOpen={isModalOpen}
                onClose={() => {
                    console.log('🔒 Modal closed');
                    setIsModalOpen(false);
                }}
            />
        </div>
    );
}