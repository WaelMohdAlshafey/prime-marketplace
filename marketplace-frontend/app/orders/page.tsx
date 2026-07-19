'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { Order } from '@/types';
import { useAuth } from '@/context/AuthContext';

export default function Orders() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    // ============================================================
    // FIX: Move fetchOrders BEFORE useEffect
    // ============================================================
    const fetchOrders = async () => {
        try {
            const response = await api.get<Order[]>('/api/Orders');
            setOrders(response.data);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
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
        fetchOrders();
    }, [user, isLoading]);

    if (isLoading || loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <div className="text-6xl mb-4">📦</div>
                <h2 className="text-2xl font-bold text-gray-800">No orders yet</h2>
                <p className="text-gray-500 mt-2">Start shopping to place your first order</p>
                <a href="/" className="btn-primary inline-block mt-6">Browse Products</a>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">📦 Your Orders</h1>

            <div className="space-y-6">
                {orders.map((order) => (
                    <div key={order.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                            <div>
                                <p className="font-semibold text-gray-800">Order #{order.id}</p>
                                <p className="text-sm text-gray-500">{new Date(order.orderDate).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xl font-bold text-gray-800">${order.totalAmount.toFixed(2)}</p>
                                <span className={`text-sm px-2 py-1 rounded-full ${order.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
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
                                        <span className="font-medium text-gray-800">${item.subtotal.toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 pt-3 border-t border-gray-200 flex justify-end">
                                <Link
                                    href={`/orders/${order.id}`}
                                    className="text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium transition"
                                >
                                    View Invoice →
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}