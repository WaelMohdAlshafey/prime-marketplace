'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Cart } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { TrashIcon } from '@heroicons/react/24/outline';
import { MARKETPLACE } from '@/constants/marketplace';

export default function CartPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [cart, setCart] = useState<Cart | null>(null);
    const [loading, setLoading] = useState(true);
    const [checkoutData, setCheckoutData] = useState({
        shippingAddress: '',
        paymentMethod: 'CashOnDelivery',
        cardNumber: '',
        cardExpiry: '',
        cardCvv: '',
        phoneNumber: '',
        payPalEmail: '',
        deliveryInstructions: '',
    });
    const [checkoutLoading, setCheckoutLoading] = useState(false);

    const fetchCart = async () => {
        try {
            const response = await api.get<Cart>('/api/Cart');
            setCart(response.data);
        } catch (error) {
            console.error('Failed to fetch cart:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isLoading) return;

        if (!user) {
            router.push('/auth/login');
            return;
        }

        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchCart();
    }, [user, isLoading]);

    const removeFromCart = async (cartItemId: number) => {
        try {
            await api.delete(`/api/Cart/${cartItemId}`);
            await fetchCart();
        } catch (error) {
            console.error('Failed to remove item:', error);
        }
    };

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setCheckoutLoading(true);
        try {
            const response = await api.post('/api/Orders/checkout', checkoutData);
            const order = response.data;

            let confirmationData = {};

            switch (checkoutData.paymentMethod) {
                case 'Card':
                    confirmationData = {
                        transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
                    };
                    break;
                case 'MobileWallet':
                    confirmationData = {
                        phoneNumber: checkoutData.phoneNumber,
                    };
                    break;
                case 'PayPal':
                    confirmationData = {
                        payPalEmail: checkoutData.payPalEmail,
                    };
                    break;
                case 'CashOnDelivery':
                    confirmationData = {
                        deliveryConfirmation: checkoutData.deliveryInstructions || 'Awaiting delivery confirmation',
                    };
                    break;
                default:
                    throw new Error('Unknown payment method');
            }

            await api.post(`/api/Orders/${order.id}/confirm-payment`, confirmationData);

            alert('🎉 Order placed and payment confirmed successfully!');
            router.push(`/orders/${order.id}`);
        } catch (error) {
            console.error('Checkout failed:', error);
            alert('❌ Checkout failed. Please try again.');
        } finally {
            setCheckoutLoading(false);
        }
    };

    const renderPaymentFields = () => {
        switch (checkoutData.paymentMethod) {
            case 'Card':
                return (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                            <input
                                type="text"
                                required
                                placeholder="4111 1111 1111 1111"
                                value={checkoutData.cardNumber}
                                onChange={(e) => setCheckoutData({ ...checkoutData, cardNumber: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry (MM/YY)</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="MM/YY"
                                    value={checkoutData.cardExpiry}
                                    onChange={(e) => setCheckoutData({ ...checkoutData, cardExpiry: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                                <input
                                    type="password"
                                    required
                                    placeholder="123"
                                    value={checkoutData.cardCvv}
                                    onChange={(e) => setCheckoutData({ ...checkoutData, cardCvv: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </>
                );

            case 'MobileWallet':
                return (
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h3 className="font-semibold text-blue-800 mb-2">📱 Pay via Mobile Wallet</h3>
                        <p className="text-sm text-gray-700 mb-3">
                            Send payment to one of our official wallet numbers. We will confirm your payment manually.
                        </p>
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-700">Our Wallet Numbers:</p>
                            {MARKETPLACE.mobileNumbers.map((num: string, idx: number) => (
                                <div key={idx} className="flex items-center gap-2 bg-white p-2 rounded border border-gray-200">
                                    <span className="text-sm font-mono text-blue-600">{num}</span>
                                    <button
                                        onClick={() => navigator.clipboard.writeText(num)}
                                        className="text-xs text-blue-500 hover:text-blue-700 transition"
                                    >
                                        📋 Copy
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="mt-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Your Phone Number (for confirmation)</label>
                            <input
                                type="tel"
                                required
                                placeholder="+20 100 000 0000"
                                value={checkoutData.phoneNumber}
                                onChange={(e) => setCheckoutData({ ...checkoutData, phoneNumber: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                );

            case 'PayPal':
                return (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">PayPal Email</label>
                        <input
                            type="email"
                            required
                            placeholder="you@example.com"
                            value={checkoutData.payPalEmail}
                            onChange={(e) => setCheckoutData({ ...checkoutData, payPalEmail: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                );

            case 'CashOnDelivery':
                return (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Instructions</label>
                        <textarea
                            placeholder="Any special instructions for the delivery..."
                            value={checkoutData.deliveryInstructions}
                            onChange={(e) => setCheckoutData({ ...checkoutData, deliveryInstructions: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={2}
                        />
                    </div>
                );

            default:
                return null;
        }
    };

    if (isLoading || loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <div className="text-6xl mb-4">🛒</div>
                <h2 className="text-2xl font-bold text-gray-800">Your cart is empty</h2>
                <p className="text-gray-500 mt-2">Start shopping to add items to your cart</p>
                <a href="/" className="btn-primary inline-block mt-6">Browse Products</a>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">🛍️ Your Cart</h1>

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="divide-y divide-gray-200">
                    {cart.items.map((item) => (
                        <div key={item.id} className="p-4 flex justify-between items-center hover:bg-gray-50 transition">
                            <div>
                                <h3 className="font-semibold text-gray-800">{item.productName}</h3>
                                <p className="text-gray-500 text-sm">
                                    ${item.unitPrice.toFixed(2)} × {item.quantity} =
                                    <span className="font-semibold text-gray-700 ml-1">${item.subtotal.toFixed(2)}</span>
                                </p>
                            </div>
                            <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-red-500 hover:text-red-700 transition p-2 hover:bg-red-50 rounded-full"
                            >
                                <TrashIcon className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="bg-gray-50 p-4 border-t border-gray-200 flex justify-between items-center">
                    <div>
                        <p className="text-sm text-gray-500">{cart.totalItems} items</p>
                        <p className="text-2xl font-bold text-gray-800">${cart.totalAmount.toFixed(2)}</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleCheckout} className="mt-8 bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Checkout</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Address</label>
                        <input
                            type="text"
                            required
                            value={checkoutData.shippingAddress}
                            onChange={(e) => setCheckoutData({ ...checkoutData, shippingAddress: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="123 Main St, City, Country"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                        <select
                            value={checkoutData.paymentMethod}
                            onChange={(e) => setCheckoutData({ ...checkoutData, paymentMethod: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="CashOnDelivery">💵 Cash on Delivery</option>
                            <option value="Card">💳 Credit/Debit Card</option>
                            <option value="PayPal">💰 PayPal</option>
                            <option value="MobileWallet">📱 Mobile Wallet</option>
                        </select>
                    </div>

                    {/* Dynamic Payment Fields */}
                    {renderPaymentFields()}

                    <button
                        type="submit"
                        disabled={checkoutLoading}
                        className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 transition disabled:opacity-50"
                    >
                        {checkoutLoading ? 'Processing...' : '✅ Place Order & Pay'}
                    </button>
                </div>
            </form>
        </div>
    );
}