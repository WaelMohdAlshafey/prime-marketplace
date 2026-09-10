// @ts-nocheck
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { FolderTree, Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';

export default function AdminPageClasses() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        name: '', slug: '', description: '', icon: '📄',
        colorClass: 'bg-gray-50 text-gray-700',
        displayOrder: 0, isActive: true,
    });

    useEffect(() => {
        if (isLoading) return;
        if (!user || user.role !== 'Admin') { router.push('/'); return; }
        fetchClasses();
    }, [user, isLoading, router]);

    const fetchClasses = async () => {
        try {
            const res = await api.get('/api/PageClasses');
            setClasses(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const openCreate = () => {
        setEditing(null);
        setForm({
            name: '', slug: '', description: '', icon: '📄',
            colorClass: 'bg-gray-50 text-gray-700',
            displayOrder: classes.length + 1, isActive: true,
        });
        setShowModal(true);
    };

    const openEdit = (c) => {
        setEditing(c);
        setForm({
            name: c.name, slug: c.slug, description: c.description || '',
            icon: c.icon || '📄', colorClass: c.colorClass || 'bg-gray-50 text-gray-700',
            displayOrder: c.displayOrder || 0, isActive: c.isActive,
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editing) await api.put(`/api/PageClasses/${editing.id}`, form);
            else await api.post('/api/PageClasses', form);
            setShowModal(false);
            await fetchClasses();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to save.');
        } finally { setSubmitting(false); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this class? Pages will remain but lose their class.')) return;
        try { await api.delete(`/api/PageClasses/${id}`); await fetchClasses(); }
        catch { alert('Failed to delete.'); }
    };

    if (loading) return <div className="p-12 text-center">Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                    <FolderTree className="w-8 h-8 text-[#0F5C45]" />
                    <div>
                        <h1 className="text-3xl font-bold">Page Classes</h1>
                        <p className="text-gray-500 text-sm">Group and style your pages dynamically</p>
                    </div>
                </div>
                <button onClick={openCreate}
                    className="flex items-center gap-2 bg-[#0F5C45] text-white px-4 py-2 rounded-xl hover:bg-[#0A4735]">
                    <Plus className="w-5 h-5" /> Add Class
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <table className="w-full text-right">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-600">Icon</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-600">Name</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-600">Slug</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-600">Pages</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-600">Status</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-600">Order</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {classes.map(c => (
                            <tr key={c.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-2xl">{c.icon || '📄'}</td>
                                <td className="px-6 py-4 text-sm font-medium">{c.name}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">/{c.slug}</td>
                                <td className="px-6 py-4 text-sm">{c.pageCount}</td>
                                <td className="px-6 py-4 text-sm">
                                    <span className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 w-fit ${c.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                        {c.isActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                        {c.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">{c.displayOrder ?? '—'}</td>
                                <td className="px-6 py-4 text-sm space-x-2">
                                    <button onClick={() => openEdit(c)} className="text-blue-600 hover:text-blue-800">
                                        <Pencil className="w-4 h-4 inline" />
                                    </button>
                                    <button onClick={() => handleDelete(c.id)} className="text-red-600 hover:text-red-800">
                                        <Trash2 className="w-4 h-4 inline" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {classes.length === 0 && (
                            <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-500">No classes yet.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">{editing ? 'Edit Class' : 'New Class'}</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 text-2xl">×</button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Name *</label>
                                <input type="text" required value={form.name}
                                    onChange={e => setForm({
                                        ...form, name: e.target.value,
                                        slug: editing ? form.slug : e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
                                    })}
                                    className="w-full px-4 py-2 border rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Slug *</label>
                                <input type="text" required value={form.slug}
                                    onChange={e => setForm({ ...form, slug: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Icon (emoji)</label>
                                <input type="text" maxLength={2} value={form.icon}
                                    onChange={e => setForm({ ...form, icon: e.target.value })}
                                    className="w-24 px-4 py-2 border rounded-lg text-center text-2xl" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Color (Tailwind classes)</label>
                                <input type="text" value={form.colorClass}
                                    onChange={e => setForm({ ...form, colorClass: e.target.value })}
                                    placeholder="bg-blue-50 text-blue-600"
                                    className="w-full px-4 py-2 border rounded-lg font-mono text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <textarea rows={2} value={form.description}
                                    onChange={e => setForm({ ...form, description: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Display Order</label>
                                    <input type="number" value={form.displayOrder}
                                        onChange={e => setForm({ ...form, displayOrder: parseInt(e.target.value) || 0 })}
                                        className="w-full px-4 py-2 border rounded-lg" />
                                </div>
                                <label className="flex items-center gap-2 mt-6">
                                    <input type="checkbox" checked={form.isActive}
                                        onChange={e => setForm({ ...form, isActive: e.target.checked })} />
                                    Active
                                </label>
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