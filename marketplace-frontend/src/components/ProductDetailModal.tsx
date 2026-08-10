'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Star, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { getImageUrl } from '@/lib/getImageUrl';
import api from '@/lib/api';

interface ProductDetailModalProps {
    productId: number;
    isOpen: boolean;
    onClose: () => void;
}

interface ProductDetail {
    id: number;
    name: string;
    description: string;
    price: number;
    stockQuantity: number;
    imageUrl?: string;
    vendorName?: string;
    rating?: number;
    reviewsCount?: number;
    category?: string;
    reviews?: Array<{
        id: number;
        userId: number;
        userName: string;
        rating: number;
        review?: string;
        createdAt: string;
    }>;
}

export default function ProductDetailModal({ productId, isOpen, onClose }: ProductDetailModalProps) {
    const { user } = useAuth();
    const { addToCart } = useCart();
    const [product, setProduct] = useState<ProductDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [userRating, setUserRating] = useState(0);
    const [userReview, setUserReview] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [ratingMessage, setRatingMessage] = useState('');
    const [addingToCart, setAddingToCart] = useState(false);

    useEffect(() => {
        if (isOpen && productId) {
            fetchProductDetails();
        }
    }, [isOpen, productId]);

    const fetchProductDetails = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/api/Products/${productId}`);
            setProduct(response.data);
            try {
                const reviewsRes = await api.get(`/api/Products/${productId}/reviews`);
                setProduct(prev => prev ? { ...prev, reviews: reviewsRes.data } : null);
            } catch (e) { /* ignore */ }
        } catch (error) {
            console.error('Failed to fetch product details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async () => {
        setAddingToCart(true);
        try {
            await addToCart(productId, quantity);
        } catch (error) {
            console.error('Failed to add to cart:', error);
        } finally {
            setAddingToCart(false);
        }
    };

    const handleSubmitRating = async () => {
        if (!user) {
            setRatingMessage('Please login to rate this product.');
            return;
        }
        if (userRating < 1 || userRating > 5) {
            setRatingMessage('Please select a rating (1-5 stars).');
            return;
        }
        setSubmitting(true);
        setRatingMessage('');
        try {
            await api.post(`/api/Products/${productId}/rate`, {
                rating: userRating,
                review: userReview || null
            });
            setRatingMessage('✅ Rating submitted successfully!');
            await fetchProductDetails();
            setUserRating(0);
            setUserReview('');
        } catch (error: any) {
            setRatingMessage(error.response?.data?.message || 'Failed to submit rating.');
        } finally {
            setSubmitting(false);
        }
    };

    const renderStars = (rating: number, interactive = false) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => interactive && setUserRating(star)}
                        disabled={!interactive || submitting}
                        className={`text-2xl transition ${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
                    >
                        <Star
                            className={`w-6 h-6 ${star <= rating ? 'fill-[#FFB400] text-[#FFB400]' : 'fill-gray-300 text-gray-300'}`}
                        />
                    </button>
                ))}
            </div>
        );
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                    >
                        {/* Close button */}
                        <div className="sticky top-0 z-10 flex justify-end p-4 bg-white/80 backdrop-blur-sm border-b border-gray-100">
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-full transition"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F5C45]"></div>
                            </div>
                        ) : product ? (
                            <div className="p-6">
                                {/* Main content */}
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Image */}
                                    <div className="md:w-1/2">
                                        <div className="relative w-full h-64 md:h-80 bg-gray-100 rounded-xl overflow-hidden">
                                            <Image
                                                src={product.imageUrl ? getImageUrl(product.imageUrl) : '/images/placeholder.jpg'}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    </div>

                                    {/* Details */}
                                    <div className="md:w-1/2 space-y-4 text-right">
                                        <h2 className="text-2xl font-bold text-gray-800">{product.name}</h2>

                                        {/* Rating display */}
                                        <div className="flex items-center gap-2">
                                            {product.rating ? (
                                                <>
                                                    {renderStars(product.rating)}
                                                    <span className="text-sm text-gray-500">({product.reviewsCount || 0} reviews)</span>
                                                </>
                                            ) : (
                                                <span className="text-sm text-gray-400">No ratings yet</span>
                                            )}
                                        </div>

                                        <p className="text-gray-600">{product.description}</p>

                                        <div className="flex items-center gap-2">
                                            <span className="text-3xl font-bold text-[#0F5C45]">£{product.price.toFixed(2)}</span>
                                            {product.stockQuantity > 0 ? (
                                                <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded-full">{product.stockQuantity} in stock</span>
                                            ) : (
                                                <span className="text-sm text-red-600 bg-red-50 px-2 py-1 rounded-full">Out of stock</span>
                                            )}
                                        </div>

                                        {product.vendorName && (
                                            <p className="text-sm text-gray-500">Sold by: <span className="font-medium">{product.vendorName}</span></p>
                                        )}

                                        {/* Quantity and Add to Cart */}
                                        <div className="flex items-center gap-3 pt-2">
                                            {product.stockQuantity > 0 && (
                                                <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                                                    <button
                                                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                                        disabled={quantity <= 1}
                                                        className="w-8 h-8 rounded-md flex items-center justify-center text-gray-600 hover:bg-white transition disabled:opacity-30"
                                                    >
                                                        −
                                                    </button>
                                                    <span className="w-8 text-center font-medium">{quantity}</span>
                                                    <button
                                                        onClick={() => setQuantity(q => Math.min(product.stockQuantity, q + 1))}
                                                        disabled={quantity >= product.stockQuantity}
                                                        className="w-8 h-8 rounded-md flex items-center justify-center text-gray-600 hover:bg-white transition disabled:opacity-30"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            )}
                                            <button
                                                onClick={handleAddToCart}
                                                disabled={addingToCart || product.stockQuantity === 0}
                                                className="flex-1 py-2 bg-[#0F5C45] text-white rounded-lg hover:bg-[#0A4735] transition disabled:opacity-50 flex items-center justify-center gap-2"
                                            >
                                                <ShoppingBag className="w-4 h-4" />
                                                {addingToCart ? 'Adding...' : `Add ${quantity} to Cart`}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Rating submission section */}
                                <div className="mt-8 pt-6 border-t border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Rate this product</h3>
                                    {user ? (
                                        <>
                                            <div className="flex items-center gap-4 mb-3">
                                                {renderStars(userRating, true)}
                                                <span className="text-sm text-gray-500">{userRating > 0 ? `${userRating} stars` : 'Select rating'}</span>
                                            </div>
                                            <textarea
                                                placeholder="Write a review (optional)"
                                                value={userReview}
                                                onChange={(e) => setUserReview(e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C45] focus:border-transparent"
                                                rows={3}
                                            />
                                            <button
                                                onClick={handleSubmitRating}
                                                disabled={submitting || userRating === 0}
                                                className="mt-3 px-6 py-2 bg-[#0F5C45] text-white rounded-lg hover:bg-[#0A4735] transition disabled:opacity-50"
                                            >
                                                {submitting ? 'Submitting...' : 'Submit Rating'}
                                            </button>
                                            {ratingMessage && (
                                                <p className={`mt-2 text-sm ${ratingMessage.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
                                                    {ratingMessage}
                                                </p>
                                            )}
                                        </>
                                    ) : (
                                        <p className="text-gray-500">Please <a href="/auth/login" className="text-[#0F5C45] hover:underline">login</a> to rate this product.</p>
                                    )}
                                </div>

                                {/* Reviews list */}
                                {product.reviews && product.reviews.length > 0 && (
                                    <div className="mt-6 pt-6 border-t border-gray-200">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Reviews</h3>
                                        <div className="space-y-4 max-h-60 overflow-y-auto">
                                            {product.reviews.map((review) => (
                                                <div key={review.id} className="border-b border-gray-100 pb-3">
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-medium text-gray-700">{review.userName}</span>
                                                        <div className="flex items-center gap-1">
                                                            {renderStars(review.rating)}
                                                        </div>
                                                    </div>
                                                    {review.review && <p className="text-sm text-gray-600 mt-1">{review.review}</p>}
                                                    <p className="text-xs text-gray-400 mt-1">{new Date(review.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="p-6 text-center text-gray-500">Product not found.</div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}