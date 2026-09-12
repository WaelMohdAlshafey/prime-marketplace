'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import api from '@/lib/api';
import { Product } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Package, ArrowLeft, Star } from 'lucide-react';
import { getImageUrl } from '@/lib/getImageUrl';

const CURRENCY = '£';

interface Review {
    id: number;
    userId: number;
    userName: string;
    rating: number;
    review?: string;
    createdAt: string;
}

export default function ProductDetail() {
    const { id } = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const { addToCart } = useCart();
    const [product, setProduct] = useState<Product | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [adding, setAdding] = useState(false);

    // Rating form
    const [userRating, setUserRating] = useState(0);
    const [userReview, setUserReview] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [ratingMessage, setRatingMessage] = useState('');

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

    const fetchReviews = async () => {
        try {
            const response = await api.get<Review[]>(`/api/Products/${id}/reviews`);
            setReviews(response.data || []);
        } catch (error) {
            console.warn('Failed to fetch reviews:', error);
        }
    };

    useEffect(() => {
        if (id) {
            fetchProduct();
            fetchReviews();
        }
    }, [id]);

    const handleAddToCart = async () => {
        if (!user) {
            router.push('/auth/login');
            return;
        }
        setAdding(true);
        try {
            await addToCart(Number(id), quantity);
            alert(`✅ Added ${quantity} item(s) to cart!`);
        } catch (error) {
            console.error('Failed to add to cart:', error);
            alert('❌ Failed to add to cart. Please try again.');
        } finally {
            setAdding(false);
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
            await api.post(`/api/Products/${id}/rate`, {
                rating: userRating,
                review: userReview || null,
            });
            setRatingMessage('✅ Rating submitted successfully!');
            await fetchProduct();
            await fetchReviews();
            setUserRating(0);
            setUserReview('');
        } catch (error: unknown) {
            let message = 'Failed to submit rating.';
            if (error && typeof error === 'object' && 'response' in error) {
                const e = error as { response?: { data?: { message?: string } } };
                if (e.response?.data?.message) message = e.response.data.message;
            }
            setRatingMessage(`❌ ${message}`);
        } finally {
            setSubmitting(false);
        }
    };

    const renderStars = (rating: number, interactive = false) => (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => interactive && setUserRating(star)}
                    disabled={!interactive || submitting}
                    className={`transition ${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
                >
                    <Star
                        className={`w-5 h-5 ${star <= rating ? 'fill-[#FFB400] text-[#FFB400]' : 'fill-gray-300 text-gray-300'}`}
                    />
                </button>
            ))}
        </div>
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F5C45]"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-gray-800">Product not found</h2>
                <button
                    onClick={() => router.push('/')}
                    className="mt-4 text-[#0F5C45] hover:underline"
                >
                    ← Back to home
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-500 hover:text-[#0F5C45] transition mb-6"
            >
                <ArrowLeft className="w-4 h-4" /> Back
            </button>

            <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
                <div className="p-6 md:p-8">
                    {/* Product Image */}
                    <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 mb-6">
                        {product.imageUrl ? (
                            <Image
                                src={getImageUrl(product.imageUrl)}
                                alt={product.name}
                                fill
                                className="object-contain p-4"
                                sizes="(max-width: 768px) 100vw, 50vw"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                                }}
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center">
                                <ShoppingBag className="w-16 h-16 text-gray-300" />
                                <p className="text-gray-400 mt-2 text-sm">No image available</p>
                            </div>
                        )}
                    </div>

                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{product.name}</h1>

                    {product.rating ? (
                        <div className="flex items-center gap-2 mt-2">
                            {renderStars(Math.round(product.rating))}
                            <span className="text-sm text-gray-500">
                                ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                            </span>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400 mt-2">No ratings yet</p>
                    )}

                    <p className="text-gray-600 mt-3 text-base md:text-lg leading-relaxed">
                        {product.description}
                    </p>

                    <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-6">
                        <div>
                            <span className="text-3xl md:text-4xl font-bold text-[#0F5C45]">
                                {CURRENCY}{product.price.toFixed(2)}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
                            <Package className="w-4 h-4 text-green-600" />
                            <span className="text-gray-600">In stock:</span>
                            <span className="font-semibold text-green-700">{product.stockQuantity} units</span>
                        </div>
                    </div>

                    <div className="mt-8 flex flex-wrap items-center gap-4">
                        {product.stockQuantity > 0 && (
                            <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-1 border border-gray-200">
                                <button
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    disabled={quantity <= 1}
                                    className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-600 hover:bg-white hover:shadow-sm transition disabled:opacity-30 disabled:cursor-not-allowed text-xl font-bold"
                                >
                                    −
                                </button>
                                <span className="w-12 text-center text-lg font-medium text-gray-800">
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => setQuantity(q => Math.min(product.stockQuantity, q + 1))}
                                    disabled={quantity >= product.stockQuantity}
                                    className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-600 hover:bg-white hover:shadow-sm transition disabled:opacity-30 disabled:cursor-not-allowed text-xl font-bold"
                                >
                                    +
                                </button>
                            </div>
                        )}

                        <button
                            onClick={handleAddToCart}
                            disabled={adding || product.stockQuantity === 0}
                            className={`flex-1 md:flex-none px-8 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${product.stockQuantity === 0
                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                : adding
                                    ? 'bg-[#0F5C45]/70 text-white cursor-wait'
                                    : 'bg-gradient-to-r from-[#0F5C45] to-[#1A7A5C] text-white hover:shadow-lg hover:shadow-[#0F5C45]/20 hover:scale-105'
                                }`}
                        >
                            <ShoppingBag className="w-5 h-5" />
                            {adding
                                ? 'Adding...'
                                : product.stockQuantity === 0
                                    ? 'Out of Stock'
                                    : `Add ${quantity} to Cart`}
                        </button>
                    </div>

                    {product.vendorName && (
                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <p className="text-sm text-gray-500">
                                Sold by: <span className="font-medium text-gray-700">{product.vendorName}</span>
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* ============================================================
                REVIEWS SECTION
                ============================================================ */}
            <div className="mt-8 bg-white rounded-2xl shadow-soft p-6 md:p-8">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
                    Reviews ({reviews.length})
                </h2>

                {/* Rate this product */}
                <div className="bg-gray-50 rounded-xl p-4 md:p-6 mb-6">
                    <h3 className="font-semibold text-gray-800 mb-3">Rate this product</h3>
                    {user ? (
                        <>
                            <div className="flex items-center gap-4 mb-3">
                                {renderStars(userRating, true)}
                                <span className="text-sm text-gray-500">
                                    {userRating > 0 ? `${userRating} stars` : 'Select rating'}
                                </span>
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
                        <p className="text-gray-500">
                            Please <a href="/auth/login" className="text-[#0F5C45] hover:underline">login</a> to rate this product.
                        </p>
                    )}
                </div>

                {/* Reviews list */}
                {reviews.length === 0 ? (
                    <p className="text-gray-500 text-center py-6">No reviews yet. Be the first!</p>
                ) : (
                    <div className="space-y-4">
                        {reviews.map((review) => (
                            <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-medium text-gray-800">{review.userName}</span>
                                    <div className="flex items-center gap-1">
                                        {renderStars(review.rating)}
                                    </div>
                                </div>
                                {review.review && (
                                    <p className="text-gray-600 mt-1">{review.review}</p>
                                )}
                                <p className="text-xs text-gray-400 mt-1">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}