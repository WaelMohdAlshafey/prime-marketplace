'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '@/lib/api';
import { CheckCircle, Package, Truck, Clock } from 'lucide-react';

interface TrackingData {
    id: number;
    trackingNumber: string;
    shippingCarrier: string;
    shippedAt: string;
    deliveredAt: string | null;
    status: string;
    totalAmount: number;
    orderDate: string;
    items: { productName: string; quantity: number; unitPrice: number }[];
    logs: {
        id: number;
        status: string;
        note: string | null;
        createdAt: string;
        updatedBy: { username: string };
    }[];
}

export default function TrackingPage() {
    const { t } = useTranslation('common');
    const [trackingNumber, setTrackingNumber] = useState('');
    const [data, setData] = useState<TrackingData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!trackingNumber.trim()) return;

        setLoading(true);
        setError(null);
        setData(null);

        try {
            const response = await api.get(`/api/Orders/track/${trackingNumber.trim()}`);
            setData(response.data);
        } catch (err: unknown) {
            let message = 'Tracking number not found.';
            if (err && typeof err === 'object' && 'response' in err) {
                const errorObj = err as { response: { data?: { message?: string } } };
                if (errorObj.response?.data?.message) {
                    message = errorObj.response.data.message;
                }
            }
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'delivered':
                return <CheckCircle className="w-6 h-6 text-green-500" />;
            case 'shipped':
            case 'in transit':
                return <Truck className="w-6 h-6 text-blue-500" />;
            case 'packaging':
                return <Package className="w-6 h-6 text-yellow-500" />;
            default:
                return <Clock className="w-6 h-6 text-gray-400" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'delivered': return 'border-green-500 bg-green-50';
            case 'shipped':
            case 'in transit': return 'border-blue-500 bg-blue-50';
            case 'packaging': return 'border-yellow-500 bg-yellow-50';
            default: return 'border-gray-300 bg-gray-50';
        }
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-2xl">
            <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
                {t('trackingTitle')}
            </h1>

            <form onSubmit={handleTrack} className="flex gap-2 mb-8">
                <input
                    type="text"
                    placeholder={t('trackingPlaceholder')}
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0F5C45] focus:border-transparent"
                    dir="ltr"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-[#0F5C45] text-white rounded-xl hover:bg-[#0A4735] transition disabled:opacity-50"
                >
                    {loading ? t('trackingSearching') : t('trackingButton')}
                </button>
            </form>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-center">
                    ⚠️ {error}
                </div>
            )}

            {data && (
                <div className="bg-white rounded-2xl shadow-md p-6">
                    {/* Order Summary */}
                    <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
                        <span className="text-sm text-gray-500">
                            {t('trackingOrder', { id: data.id })}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${data.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                data.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                                    data.status === 'In Transit' ? 'bg-purple-100 text-purple-800' :
                                        'bg-yellow-100 text-yellow-800'
                            }`}>
                            {data.status}
                        </span>
                    </div>

                    <div className="space-y-2 text-sm mb-4">
                        <p><strong>{t('trackingNumber')}:</strong> {data.trackingNumber}</p>
                        <p><strong>{t('trackingCarrier')}:</strong> {data.shippingCarrier || 'N/A'}</p>
                        <p><strong>{t('trackingShipped')}:</strong> {data.shippedAt ? new Date(data.shippedAt).toLocaleDateString() : 'Not yet'}</p>
                        <p><strong>{t('trackingDelivered')}:</strong> {data.deliveredAt ? new Date(data.deliveredAt).toLocaleDateString() : 'In transit'}</p>
                        <p><strong>{t('trackingTotal')}:</strong> £{data.totalAmount.toFixed(2)}</p>
                    </div>

                    {/* Timeline */}
                    <div className="mt-6 border-t border-gray-200 pt-4">
                        <h4 className="font-semibold text-gray-800 mb-4">Tracking History</h4>
                        {data.logs && data.logs.length > 0 ? (
                            <div className="space-y-4">
                                {data.logs.map((log, index) => (
                                    <div key={log.id} className="flex items-start gap-3">
                                        <div className={`p-2 rounded-full ${getStatusColor(log.status)}`}>
                                            {getStatusIcon(log.status)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center">
                                                <span className="font-semibold text-gray-800">{log.status}</span>
                                                <span className="text-xs text-gray-400">
                                                    {new Date(log.createdAt).toLocaleString()}
                                                </span>
                                            </div>
                                            {log.note && (
                                                <p className="text-sm text-gray-600 mt-1">{log.note}</p>
                                            )}
                                            <p className="text-xs text-gray-400 mt-1">
                                                Updated by: {log.updatedBy?.username || 'System'}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm">No tracking history yet.</p>
                        )}
                    </div>

                    {/* Items */}
                    <div className="mt-4 border-t border-gray-200 pt-4">
                        <h4 className="font-semibold mb-2">{t('trackingItems')}</h4>
                        {data.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm py-1 border-b border-gray-100">
                                <span>{item.productName} × {item.quantity}</span>
                                <span>£{item.unitPrice.toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}