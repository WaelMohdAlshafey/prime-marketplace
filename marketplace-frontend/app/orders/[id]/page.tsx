'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Order } from '@/types';
import { useAuth } from '@/context/AuthContext';

export default function OrderDetail() {
    const { id } = useParams();
    const router = useRouter();
    const { user, isLoading } = useAuth();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchOrder = async () => {
        try {
            const response = await api.get<Order>(`/api/Orders/${id}`);
            setOrder(response.data);
        } catch (error) {
            console.error('Failed to fetch order:', error);
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
        if (id) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            fetchOrder();
        }
    }, [id, user, isLoading]);

    if (loading || isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!order) {
        return <div className="text-center py-20">Order not found.</div>;
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-3xl">
            <div className="bg-white rounded-xl shadow-md p-8">
                <div className="border-b border-gray-200 pb-4 mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">🧾 Invoice</h1>
                    <p className="text-gray-500">Order #{order.id}</p>
                    <p className="text-sm text-gray-400">{new Date(order.orderDate).toLocaleString('ar-EG')}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <p className={`font-semibold ${order.status === 'Paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                            {order.status === 'Paid' ? 'مدفوع' : 'معلق'}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Payment Method</p>
                        <p className="font-semibold">{order.paymentMethod}</p>
                    </div>
                    <div className="col-span-2">
                        <p className="text-sm text-gray-500">Shipping Address</p>
                        <p className="font-semibold">{order.shippingAddress}</p>
                    </div>

                    {order.isPaymentConfirmed && (
                        <div className="col-span-2 bg-green-50 p-4 rounded-lg border border-green-200 mt-2">
                            <p className="text-sm font-semibold text-green-700">✅ Payment Confirmed</p>
                            {order.paymentTransactionId && (
                                <p className="text-sm text-gray-600">Transaction ID: {order.paymentTransactionId}</p>
                            )}
                            {order.cardLastFour && (
                                <p className="text-sm text-gray-600">Card ending in: ****{order.cardLastFour}</p>
                            )}
                            {order.phoneNumber && (
                                <p className="text-sm text-gray-600">Phone: {order.phoneNumber}</p>
                            )}
                            {order.payPalEmail && (
                                <p className="text-sm text-gray-600">PayPal: {order.payPalEmail}</p>
                            )}
                            {order.paymentConfirmedAt && (
                                <p className="text-sm text-gray-600">Confirmed at: {new Date(order.paymentConfirmedAt).toLocaleString('ar-EG')}</p>
                            )}
                        </div>
                    )}
                </div>

                <div className="border-t border-gray-200 pt-4">
                    <h3 className="font-bold text-lg mb-3">Items</h3>
                    {order.items.map((item) => (
                        <div key={item.productId} className="flex justify-between py-2 border-b border-gray-100">
                            <span>{item.productName} × {item.quantity}</span>
                            {/* ============================================================
                   CURRENCY FIX: Changed $ to £
                   ============================================================ */}
                            <span className="font-medium">£{item.subtotal.toFixed(2)}</span>
                        </div>
                    ))}
                    <div className="flex justify-between pt-4 text-xl font-bold">
                        <span>Total</span>
                        <span>£{order.totalAmount.toFixed(2)}</span>
                    </div>
                </div>

                <button
                    onClick={() => window.print()}
                    className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                >
                    🖨️ Print Invoice
                </button>
            </div>
        </div>
    );
}