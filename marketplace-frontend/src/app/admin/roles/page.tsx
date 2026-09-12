// @ts-nocheck
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Shield, Plus, Pencil, Trash2, Lock } from 'lucide-react';

export default function AdminRoles() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({ name: '', description: '' });

    useEffect(() => {
        if (isLoading) return;
        if (!user || user.role !== 'Admin') { router.push('/'); return; }
        fetchRoles();
    }, [user, isLoading, router]);

    const fetchRoles = async () => {
        try {
            const res = await api.get('/api/Roles');
            setRoles(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const openCreate = () => {
        setEditing(null);
        setForm({ name: '', description: '' });
        setShowModal(true);
    };

    const openEdit = (r) => {
        setEditing(r);
        setForm({ name: r.name, description: r.description || '' });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editing) await api.put(`/api/Roles/${editing.id}`, form);
            else await api.post('/api/Roles', form);
            setShowModal(false);
            await fetchRoles();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to save role.');
        } finally { setSubmitting(false); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this role?')) return;
        try { await api.delete(`/api/Roles/${id}`); await fetchRoles(); }
        catch (err) { alert(err.response?.data?.message || 'Failed to delete.'); }
    };

    if (loading) return <div className="p-12 text-center">Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                    <Shield className="w-8 h-8 text-[#0F5C45]" />
                    <div>
                        <h1 className="text-3xl font-bold">Roles</h1>
                        <p className="text-gray-500 text-sm">Manage user roles and their labels</p>
                    </div>
                </div>
                <button onClick={openCreate}
                    className="flex items-center gap-2 bg-[#0F5C45] text-white px-4 py-2 rounded-xl hover:bg-[#0A4735]">
                    <Plus className="w-5 h-5" /> Add Role
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <table className="w-full text-right">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-600">Name</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-600">Description</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-600">Users</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-600">Type</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {roles.map(r => (
                            <tr key={r.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm font-medium">{r.name}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{r.description || '—'}</td>
                                <td className="px-6 py-4 text-sm">{r.userCount}</td>
                                <td className="px-6 py-4 text-sm">
                                    {r.isSystemRole ? (
                                        <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700 flex items-center gap-1 w-fit">
                                            <Lock className="w-3 h-3" /> System
                                        </span>
                                    ) : (
                                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700 w-fit">
                                            Custom
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-sm space-x-2">
                                    <button onClick={() => openEdit(r)} className="text-blue-600 hover:text-blue-800">
                                        <Pencil className="w-4 h-4 inline" />
                                    </button>
                                    {!r.isSystemRole && (
                                        <button onClick={() => handleDelete(r.id)} className="text-red-600 hover:text-red-800">
                                            <Trash2 className="w-4 h-4 inline" />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {roles.length === 0 && (
                            <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No roles yet.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">{editing ? 'Edit Role' : 'New Role'}</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 text-2xl">×</button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Role Name *</label>
                                <input type="text" required value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg" />
                                <p className="text-xs text-gray-400 mt-1">
                                    New roles default to Customer-level access. Promote them later in code if needed.
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <textarea rows={3} value={form.description}
                                    onChange={e => setForm({ ...form, description: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg" />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="submit" disabled={submitting}
                                    className="flex-1 py-3 bg-[#0F5C45] text-white rounded-xl disabled:opacity-50">
                                    {submitting ? 'Saving...' : editing ? 'Update' : 'Create'}
                                </button>
                                <button type="button" onClick={() => setShowModal(false)}
                                    className="flex-1 py-3 bg-gray-200 rounded-xl">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}