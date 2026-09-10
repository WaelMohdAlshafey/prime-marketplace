// @ts-nocheck
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { FileText, Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';

export default function AdminPages() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        title: '', slug: '', content: '',
        metaDescription: '', metaKeywords: '',
        isPublished: true, showInFooter: false,
        showInNavbar: false, displayOrder: 0,
    });

    useEffect(() => {
        if (isLoading) return;
        if (!user || user.role !== 'Admin') { router.push('/'); return; }
        fetchPages();
    }, [user, isLoading, router]);

    const fetchPages = async () => {
        try {
            const res = await api.get('/api/Pages/admin/all');
            setPages(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const openCreate = () => {
        setEditing(null);
        setForm({
            title: '', slug: '', content: '',
            metaDescription: '', metaKeywords: '',
            isPublished: true, showInFooter: false,
            showInNavbar: false, displayOrder: pages.length + 1,
        });
        setShowModal(true);
    };

    const openEdit = (page) => {
        setEditing(page);
        setForm({
            title: page.title,
            slug: page.slug,
            content: page.content || '',
            metaDescription: page.metaDescription || '',
            metaKeywords: page.metaKeywords || '',
            isPublished: page.isPublished,
            showInFooter: page.showInFooter,
            showInNavbar: page.showInNavbar,
            displayOrder: page.displayOrder || 0,
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editing) await api.put(`/api/Pages/${editing.id}`, form);
            else await api.post('/api/Pages', form);
            setShowModal(false);
            await fetchPages();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to save page.');
        } finally { setSubmitting(false); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this page permanently?')) return;
        try { await api.delete(`/api/Pages/${id}`); await fetchPages(); }
        catch { alert('Failed to delete.'); }
    };

    const handleTogglePublish = async (page) => {
        try {
            await api.put(`/api/Pages/${page.id}`, { ...page, isPublished: !page.isPublished });
            await fetchPages();
        } catch { alert('Failed to toggle.'); }
    };

    if (loading) return <div className="p-12 text-center">Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-[#0F5C45]" />
                    <div>
                        <h1 className="text-3xl font-bold">Pages</h1>
                        <p className="text-gray-500 text-sm">Manage dynamic pages</p>
                    </div>
                </div>
                <button onClick={openCreate}
                    className="flex items-center gap-2 bg-[#0F5C45] text-white px-4 py-2 rounded-xl hover:bg-[#0A4735]">
                    <Plus className="w-5 h-5" /> Add Page
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <table className="w-full text-right">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-600">Title</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-600">Slug</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-600">Status</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-600">Navbar</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-600">Footer</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-600">Order</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {pages.map(p => (
                            <tr key={p.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm">{p.title}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">/{p.slug}</td>
                                <td className="px-6 py-4 text-sm">
                                    <button onClick={() => handleTogglePublish(p)}
                                        className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${p.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                        {p.isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                        {p.isPublished ? 'Published' : 'Draft'}
                                    </button>
                                </td>
                                <td className="px-6 py-4 text-sm">{p.showInNavbar ? '✅' : '—'}</td>
                                <td className="px-6 py-4 text-sm">{p.showInFooter ? '✅' : '—'}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{p.displayOrder ?? '—'}</td>
                                <td className="px-6 py-4 text-sm space-x-2">
                                    <button onClick={() => openEdit(p)} className="text-blue-600 hover:text-blue-800">
                                        <Pencil className="w-4 h-4 inline" />
                                    </button>
                                    <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-800">
                                        <Trash2 className="w-4 h-4 inline" />
                                    </button>
                                    <a href={`/${p.slug}`} target="_blank" className="text-[#0F5C45] hover:text-[#0A4735]">
                                        <Eye className="w-4 h-4 inline" />
                                    </a>
                                </td>
                            </tr>
                        ))}
                        {pages.length === 0 && (
                            <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-500">No pages yet.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">{editing ? 'Edit Page' : 'New Page'}</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 text-2xl">×</button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Title *</label>
                                <input type="text" required value={form.title}
                                    onChange={e => {
                                        const title = e.target.value;
                                        setForm({
                                            ...form, title,
                                            slug: editing ? form.slug : title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
                                        });
                                    }}
                                    className="w-full px-4 py-2 border rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Slug *</label>
                                <input type="text" required value={form.slug}
                                    onChange={e => setForm({ ...form, slug: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Content (HTML)</label>
                                <textarea rows={8} value={form.content}
                                    onChange={e => setForm({ ...form, content: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg font-mono text-sm" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Meta Description</label>
                                    <input type="text" value={form.metaDescription}
                                        onChange={e => setForm({ ...form, metaDescription: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Meta Keywords</label>
                                    <input type="text" value={form.metaKeywords}
                                        onChange={e => setForm({ ...form, metaKeywords: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg" />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" checked={form.isPublished}
                                        onChange={e => setForm({ ...form, isPublished: e.target.checked })} />
                                    Published
                                </label>
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" checked={form.showInNavbar}
                                        onChange={e => setForm({ ...form, showInNavbar: e.target.checked })} />
                                    Show in Navbar
                                </label>
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" checked={form.showInFooter}
                                        onChange={e => setForm({ ...form, showInFooter: e.target.checked })} />
                                    Show in Footer
                                </label>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Display Order</label>
                                <input type="number" value={form.displayOrder}
                                    onChange={e => setForm({ ...form, displayOrder: parseInt(e.target.value) || 0 })}
                                    className="w-24 px-4 py-2 border rounded-lg" />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="submit" disabled={submitting}
                                    className="flex-1 py-3 bg-[#0F5C45] text-white rounded-xl disabled:opacity-50">
                                    {submitting ? 'Saving...' : editing ? 'Update' : 'Create'}
                                </button>
                                <button type="button" onClick={() => setShowModal(false)}
                                    className="flex-1 py-3 bg-gray-200 rounded-xl">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}