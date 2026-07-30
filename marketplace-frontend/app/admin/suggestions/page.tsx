'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { CheckCircle, XCircle, Eye } from 'lucide-react';

interface Suggestion {
    id: number;
    name: string;
    description?: string;
    category?: string;
    vendorId?: number;
    vendorName?: string;
    suggestedPrice?: number;
    estimatedCostPrice?: number;
    suggestedStockQuantity?: number;
    imageData?: string;
    notes?: string;
    status: string;
    adminNote?: string;
    createdAt: string;
    reviewedAt?: string;
    suggestedByUsername: string;
    reviewedByUsername?: string;
}

export default function AdminSuggestions() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [adminNote, setAdminNote] = useState('');

    const fetchSuggestions = async (status?: string) => {
        setLoading(true);
        try {
            const url = status ? `/api/ProductSuggestions?status=${status}` : '/api/ProductSuggestions';
            const response = await api.get(url);
            setSuggestions(response.data.items);
        } catch (error) {
            console.error('Failed to fetch suggestions:', error);
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
        if (user.role !== 'Admin') {
            router.push('/');
            return;
        }
        // ✅ Suppress ESLint warning – this is a standard data‑fetching pattern
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchSuggestions();
    }, [user, isLoading, fetchSuggestions]);

    const handleApprove = async (id: number) => {
        if (!confirm('Approve this suggestion? This will create the product.')) return;
        try {
            await api.put(`/api/ProductSuggestions/${id}/approve`, { adminNote: adminNote || 'Approved by Admin' });
            setAdminNote('');
            await fetchSuggestions(filter);
        } catch (error) {
            console.error('Approve failed:', error);
            alert('Failed to approve.');
        }
    };

    const handleReject = async (id: number) => {
        if (!confirm('Reject this suggestion?')) return;
        try {
            await api.put(`/api/ProductSuggestions/${id}/reject`, { adminNote: adminNote || 'Rejected by Admin' });
            setAdminNote('');
            await fetchSuggestions(filter);
        } catch (error) {
            console.error('Reject failed:', error);
            alert('Failed to reject.');
        }
    };

    const viewDetails = (suggestion: Suggestion) => {
        setSelectedSuggestion(suggestion);
        setShowModal(true);
    };

    if (isLoading || loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F5C45]"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Product Suggestions</h1>
                <div className="flex gap-2">
                    <select
                        value={filter}
                        onChange={(e) => { setFilter(e.target.value); fetchSuggestions(e.target.value); }}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C45] focus:border-transparent"
                    >
                        <option value="">All</option>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase">ID</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Product</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Vendor</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Price</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Status</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Submitted By</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {suggestions.map((s) => (
                                <tr key={s.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 text-sm text-gray-900">{s.id}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{s.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{s.vendorName || 'N/A'}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">£{s.suggestedPrice?.toFixed(2) || 'N/A'}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${s.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                s.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                                    'bg-red-100 text-red-800'
                                            }`}>
                                            {s.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{s.suggestedByUsername}</td>
                                    <td className="px-6 py-4 text-sm space-x-2 rtl:space-x-reverse">
                                        {s.status === 'Pending' && (
                                            <>
                                                <button
                                                    onClick={() => handleApprove(s.id)}
                                                    className="text-green-600 hover:text-green-800 font-medium"
                                                >
                                                    <CheckCircle className="w-4 h-4 inline" /> Approve
                                                </button>
                                                <button
                                                    onClick={() => handleReject(s.id)}
                                                    className="text-red-600 hover:text-red-800 font-medium"
                                                >
                                                    <XCircle className="w-4 h-4 inline" /> Reject
                                                </button>
                                            </>
                                        )}
                                        <button
                                            onClick={() => viewDetails(s)}
                                            className="text-blue-600 hover:text-blue-800 font-medium"
                                        >
                                            <Eye className="w-4 h-4 inline" /> View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {suggestions.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                        No suggestions found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && selectedSuggestion && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-2xl font-bold text-gray-900">Suggestion Details</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600 text-2xl"
                            >
                                ×
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Product Name</p>
                                    <p className="font-medium">{selectedSuggestion.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Category</p>
                                    <p className="font-medium">{selectedSuggestion.category || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Vendor</p>
                                    <p className="font-medium">{selectedSuggestion.vendorName || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Status</p>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${selectedSuggestion.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                            selectedSuggestion.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                                'bg-red-100 text-red-800'
                                        }`}>
                                        {selectedSuggestion.status}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Suggested Price</p>
                                    <p className="font-medium">£{selectedSuggestion.suggestedPrice?.toFixed(2) || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Estimated Cost</p>
                                    <p className="font-medium">£{selectedSuggestion.estimatedCostPrice?.toFixed(2) || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Suggested Stock</p>
                                    <p className="font-medium">{selectedSuggestion.suggestedStockQuantity || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Submitted By</p>
                                    <p className="font-medium">{selectedSuggestion.suggestedByUsername}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-sm text-gray-500">Description</p>
                                    <p className="font-medium">{selectedSuggestion.description || 'No description'}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-sm text-gray-500">Reason / Notes</p>
                                    <p className="font-medium">{selectedSuggestion.notes || 'No notes'}</p>
                                </div>
                                {selectedSuggestion.imageData && (
                                    <div className="col-span-2">
                                        <p className="text-sm text-gray-500">Image</p>
                                        <img
                                            src={`data:image/jpeg;base64,${selectedSuggestion.imageData}`}
                                            alt={selectedSuggestion.name}
                                            className="w-48 h-48 object-cover rounded-lg border border-gray-200"
                                        />
                                    </div>
                                )}
                                {selectedSuggestion.adminNote && (
                                    <div className="col-span-2">
                                        <p className="text-sm text-gray-500">Admin Note</p>
                                        <p className="font-medium text-gray-700">{selectedSuggestion.adminNote}</p>
                                    </div>
                                )}
                            </div>

                            {selectedSuggestion.status === 'Pending' && (
                                <div className="border-t border-gray-200 pt-4 mt-4">
                                    <h3 className="font-semibold text-gray-800 mb-2">Admin Action</h3>
                                    <div className="flex flex-col md:flex-row gap-3">
                                        <input
                                            type="text"
                                            placeholder="Add a note (optional)"
                                            value={adminNote}
                                            onChange={(e) => setAdminNote(e.target.value)}
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0F5C45] focus:border-transparent"
                                        />
                                        <button
                                            onClick={() => handleApprove(selectedSuggestion.id)}
                                            className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
                                        >
                                            <CheckCircle className="w-4 h-4 inline" /> Approve
                                        </button>
                                        <button
                                            onClick={() => handleReject(selectedSuggestion.id)}
                                            className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
                                        >
                                            <XCircle className="w-4 h-4 inline" /> Reject
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}