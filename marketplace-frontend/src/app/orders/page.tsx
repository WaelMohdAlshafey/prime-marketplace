'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { Order } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Package, ShoppingBag } from 'lucide-react';

interface ApiError {
    response?: {
        data?: {
            message?: string;
        };
    };
    message?: string;
}

export default function Orders() {
    const { user, isLoading } = useAuth();
    const { template } = useTheme();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState<number | null>(null);

    const fetchOrders = useCallback(async () => {
        try {
            const response = await api.get<Order[]>('/api/Orders');
            setOrders(response.data);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isLoading) return;
        if (!user) {
            router.push('/auth/login');
            return;
        }
        fetchOrders();
    }, [user, isLoading, router, fetchOrders]);

    const handleCancelOrder = async (orderId: number) => {
        if (!confirm('Are you sure you want to cancel this order?')) return;
        setCancelling(orderId);
        try {
            await api.put(`/api/Orders/${orderId}/status`, {
                status: 'Cancelled',
                note: 'Cancelled by customer.'
            });
            alert('✅ Order cancelled successfully.');
            await fetchOrders();
        } catch (err) {
            console.error('Failed to cancel order:', err);
            let message = 'Failed to cancel order.';
            if (err && typeof err === 'object') {
                const error = err as ApiError;
                if (error.response?.data?.message) {
                    message = error.response.data.message;
                } else if (error.message) {
                    message = error.message;
                }
            }
            alert(`❌ ${message}`);
        } finally {
            setCancelling(null);
        }
    };

    if (isLoading || loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F5C45]"></div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <div className="p-6 bg-gray-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                    <Package className="w-12 h-12 text-gray-300" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">No orders found</h2>
                <p className="text-gray-500 mt-2">Start shopping to create your first order</p>
                <Link href="/" className="inline-block mt-6 bg-[#0F5C45] text-white px-6 py-3 rounded-xl hover:bg-[#0A4735] transition">
                    Browse Products
                </Link>
            </div>
        );
    }

    // Simple Template
    if (template === 'simple') {
        return (
            <div className="container mx-auto px-4 py-12 max-w-3xl bg-white min-h-screen">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-[#0F5C45]/10 rounded-xl">
                        <ShoppingBag className="w-6 h-6 text-[#0F5C45]" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">My Orders</h1>
                </div>
                <div className="space-y-4">
                    {orders.map((order) => {
                        const isCancellable = order.status === 'Pending' || order.status === 'Paid';
                        return (
                            <div key={order.id} className="bg-white shadow-sm rounded-xl p-4 border border-gray-100">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-semibold">Order #{order.id}</p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(order.orderDate).toLocaleDateString('en-GB')}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-gray-800">£{order.totalAmount.toFixed(2)}</p>
                                        <span className={`text-xs px-2 py-1 rounded-full ${order.status === 'Paid' ? 'bg-green-100 text-green-800' :
                                            order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                                    <Link href={`/orders/${order.id}`} className="text-sm text-blue-600 hover:underline">
                                        View Invoice →
                                    </Link>
                                    {isCancellable && (
                                        <button
                                            onClick={() => handleCancelOrder(order.id)}
                                            disabled={cancelling === order.id}
                                            className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 text-sm"
                                        >
                                            {cancelling === order.id ? '...' : 'Cancel'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    // STANDARD TEMPLATE
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-[#0F5C45]/10 rounded-xl">
                    <ShoppingBag className="w-7 h-7 text-[#0F5C45]" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>
            </div>

            <div className="space-y-6">
                {orders.map((order) => {
                    const isCancellable = order.status === 'Pending' || order.status === 'Paid';
                    return (
                        <div key={order.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
                            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-gray-800">Order #{order.id}</p>
                                    <p className="text-sm text-gray-500">
                                        {new Date(order.orderDate).toLocaleDateString('en-GB', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-bold text-gray-800">£{order.totalAmount.toFixed(2)}</p>
                                    <span className={`text-sm px-2 py-1 rounded-full ${order.status === 'Paid' ? 'bg-green-100 text-green-800' :
                                        order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6 bg-gray-50">
                                <p className="text-sm text-gray-600">Shipping: {order.shippingAddress}</p>
                                <p className="text-sm text-gray-600">Payment: {order.paymentMethod}</p>

                                <div className="mt-4 border-t border-gray-200 pt-4">
                                    {order.items.map((item) => (
                                        <div key={item.productId} className="flex justify-between text-sm py-1">
                                            <span className="text-gray-600">{item.productName} × {item.quantity}</span>
                                            <span className="font-medium text-gray-800">£{item.subtotal.toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-4 pt-3 border-t border-gray-200 flex flex-wrap items-center justify-between gap-2">
                                    <Link
                                        href={`/orders/${order.id}`}
                                        className="text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium"
                                    >
                                        View Invoice →
                                    </Link>
                                    {isCancellable && (
                                        <button
                                            onClick={() => handleCancelOrder(order.id)}
                                            disabled={cancelling === order.id}
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 text-sm"
                                        >
                                            {cancelling === order.id ? 'Cancelling...' : 'Cancel Order'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}