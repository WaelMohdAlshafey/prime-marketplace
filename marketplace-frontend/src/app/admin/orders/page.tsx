'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '@/lib/api';
import { Order } from '@/types';
import { Eye, CheckCircle, Clock, Send, ArrowLeftCircle } from 'lucide-react';

interface ApiError {
    response?: {
        data?: {
            message?: string;
        };
    };
    message?: string;
}

const STATUS_OPTIONS = [
    'Pending',
    'Paid',
    'Packaging',
    'Shipped',
    'In Transit',
    'Out for Delivery',
    'Delivered',
    'Cancelled'
];

export default function AdminOrders() {
    const { t } = useTranslation('common');
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [note, setNote] = useState('');
    const [updating, setUpdating] = useState(false);
    const [confirmingPayment, setConfirmingPayment] = useState(false);
    const [revertingPayment, setRevertingPayment] = useState(false);

    const fetchOrders = async () => {
        try {
            const response = await api.get('/api/Orders/admin/all');
            setOrders(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch orders:', err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // ---------- Update Status ----------
    const handleUpdateStatus = async (orderId: number, newStatus: string) => {
        setUpdating(true);
        try {
            await api.put(`/api/Orders/${orderId}/status`, { status: newStatus, note });
            await fetchOrders();
            setNote('');
            // ✅ CLOSE MODAL AFTER SUCCESSFUL UPDATE
            setShowModal(false);
        } catch (err) {
            console.error('Failed to update order status:', err);
            let message = 'Failed to update order status.';
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
            setUpdating(false);
        }
    };

    // ---------- Confirm Payment ----------
    const handleConfirmPayment = async () => {
        if (!selectedOrder) return;
        setConfirmingPayment(true);
        try {
            await api.post(`/api/Orders/${selectedOrder.id}/confirm-payment`, {
                transactionId: `TXN-${Date.now()}`
            });
            alert('✅ Payment confirmed successfully!');
            await fetchOrders();
            setShowModal(false);
        } catch (err) {
            console.error('Failed to confirm payment:', err);
            let message = 'Failed to confirm payment.';
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
            setConfirmingPayment(false);
        }
    };

    // ---------- Revert Payment ----------
    const handleRevertPayment = async () => {
        if (!selectedOrder) return;
        if (!confirm('Revert payment for this order? This will set status back to Pending.')) return;
        setRevertingPayment(true);
        try {
            await api.post(`/api/Orders/${selectedOrder.id}/revert-payment`, {
                note: note || 'Payment reverted by Admin.'
            });
            alert('✅ Payment reverted successfully!');
            await fetchOrders();
            setShowModal(false);
        } catch (err) {
            console.error('Failed to revert payment:', err);
            let message = 'Failed to revert payment.';
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
            setRevertingPayment(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Paid': return 'bg-green-100 text-green-800';
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Shipped': return 'bg-blue-100 text-blue-800';
            case 'In Transit': return 'bg-purple-100 text-purple-800';
            case 'Out for Delivery': return 'bg-indigo-100 text-indigo-800';
            case 'Delivered': return 'bg-emerald-100 text-emerald-800';
            case 'Cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F5C45]"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
                    <p className="text-gray-500 mt-1">Manage all orders</p>
                </div>
                <span className="text-sm text-gray-500">{orders.length} orders</span>
            </div>

            <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Order ID</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase">User</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Date</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Amount</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Status</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Payment</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">#{order.id}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">User #{order.userId}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {new Date(order.orderDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                                        £{order.totalAmount.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        {order.isPaymentConfirmed ? (
                                            <span className="text-green-600 flex items-center gap-1">
                                                <CheckCircle className="w-4 h-4" /> Confirmed
                                            </span>
                                        ) : (
                                            <span className="text-yellow-600 flex items-center gap-1">
                                                <Clock className="w-4 h-4" /> Pending
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm space-x-2 rtl:space-x-reverse">
                                        <button
                                            onClick={() => {
                                                setSelectedOrder(order);
                                                setShowModal(true);
                                            }}
                                            className="text-[#0F5C45] hover:text-[#0A4735] font-medium"
                                        >
                                            <Eye className="w-4 h-4 inline" /> View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Order Details Modal */}
            {showModal && selectedOrder && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-2xl font-bold text-gray-900">Order #{selectedOrder.id}</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600 text-2xl"
                            >
                                ×
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Order Summary */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Date</p>
                                    <p className="font-medium">{new Date(selectedOrder.orderDate).toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Status</p>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                                        {selectedOrder.status}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Payment Method</p>
                                    <p className="font-medium">{selectedOrder.paymentMethod}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Payment Confirmed</p>
                                    <p className="font-medium">
                                        {selectedOrder.isPaymentConfirmed ? '✅ Yes' : '❌ No'}
                                    </p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-sm text-gray-500">Shipping Address</p>
                                    <p className="font-medium">{selectedOrder.shippingAddress}</p>
                                </div>
                            </div>

                            {/* Payment Actions */}
                            <div className="border-t border-gray-200 pt-4">
                                <h3 className="font-semibold text-gray-800 mb-2">Payment</h3>
                                <div className="flex flex-wrap items-center gap-3">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${selectedOrder.isPaymentConfirmed
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {selectedOrder.isPaymentConfirmed ? '✅ Confirmed' : '⏳ Pending'}
                                    </span>
                                    {!selectedOrder.isPaymentConfirmed && (
                                        <button
                                            onClick={handleConfirmPayment}
                                            disabled={confirmingPayment}
                                            className="px-4 py-2 bg-[#0F5C45] text-white rounded-lg hover:bg-[#0A4735] transition disabled:opacity-50"
                                        >
                                            {confirmingPayment ? 'Confirming...' : 'Confirm Payment'}
                                        </button>
                                    )}
                                    {selectedOrder.isPaymentConfirmed && (
                                        <button
                                            onClick={handleRevertPayment}
                                            disabled={revertingPayment}
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 flex items-center gap-2"
                                        >
                                            <ArrowLeftCircle className="w-4 h-4" />
                                            {revertingPayment ? 'Reverting...' : 'Revert Payment'}
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Update Status */}
                            <div className="border-t border-gray-200 pt-4">
                                <h3 className="font-semibold text-gray-800 mb-2">Update Status</h3>
                                <div className="flex flex-col md:flex-row gap-3">
                                    <select
                                        value={selectedOrder.status}
                                        onChange={(e) => {
                                            const newStatus = e.target.value;
                                            setSelectedOrder({ ...selectedOrder, status: newStatus });
                                        }}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0F5C45] focus:border-transparent"
                                    >
                                        {STATUS_OPTIONS.map((opt) => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                    <input
                                        type="text"
                                        placeholder="Add a note (optional)"
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0F5C45] focus:border-transparent"
                                    />
                                    <button
                                        onClick={() => handleUpdateStatus(selectedOrder.id, selectedOrder.status)}
                                        disabled={updating}
                                        className="px-6 py-2 bg-[#0F5C45] text-white rounded-xl hover:bg-[#0A4735] transition disabled:opacity-50 flex items-center gap-2"
                                    >
                                        <Send className="w-4 h-4" />
                                        {updating ? 'Updating...' : 'Update'}
                                    </button>
                                </div>
                            </div>

                            {/* Items */}
                            <div className="border-t border-gray-200 pt-4">
                                <h3 className="font-semibold text-gray-800 mb-2">Items</h3>
                                {selectedOrder.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between py-2 border-b border-gray-100">
                                        <span>{item.productName} × {item.quantity}</span>
                                        <span className="font-medium">£{item.subtotal.toFixed(2)}</span>
                                    </div>
                                ))}
                                <div className="flex justify-between py-2 text-lg font-bold">
                                    <span>Total</span>
                                    <span>£{selectedOrder.totalAmount.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}