'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

// ============================================================
// TYPES
// ============================================================
interface User {
    id: number;
    username: string;
    email: string;
    role: string;
    createdAt: string;
}

interface ApiError {
    response?: {
        data?: {
            message?: string;
        };
    };
    message?: string;
}

export default function AdminUsersPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // State for modals
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showEditRoleModal, setShowEditRoleModal] = useState(false);
    const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
    const [showCreateUserModal, setShowCreateUserModal] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [newRole, setNewRole] = useState('');

    // State for creating a new user
    const [newUser, setNewUser] = useState({
        username: '',
        email: '',
        password: '',
        role: 'Customer',
    });

    // ============================================================
    // FETCH USERS
    // ============================================================
    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/api/Users');
            setUsers(response.data);
        } catch (err: unknown) {
            console.error('Failed to fetch users:', err);
            let message = 'فشل تحميل المستخدمين';
            if (err && typeof err === 'object') {
                const errorObj = err as ApiError;
                if (errorObj.response?.data?.message) {
                    message = errorObj.response.data.message;
                } else if (errorObj.message) {
                    message = errorObj.message;
                }
            }
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    // ============================================================
    // AUTH CHECK
    // ============================================================
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

        fetchUsers();
    }, [user, isLoading]);

    // ============================================================
    // HANDLERS
    // ============================================================
    const handleUpdateRole = async () => {
        if (!selectedUser) return;
        try {
            await api.put(`/api/Users/${selectedUser.id}/role`, { role: newRole });
            alert('✅ Role updated successfully!');
            setShowEditRoleModal(false);
            fetchUsers();
        } catch (err: unknown) {
            let message = 'Failed to update role.';
            if (err && typeof err === 'object') {
                const errorObj = err as ApiError;
                if (errorObj.response?.data?.message) {
                    message = errorObj.response.data.message;
                }
            }
            alert(`❌ ${message}`);
        }
    };

    const handleResetPassword = async () => {
        if (!selectedUser) return;
        if (!newPassword || newPassword.length < 6) {
            alert('⚠️ Password must be at least 6 characters.');
            return;
        }
        try {
            await api.put(`/api/Users/${selectedUser.id}/reset-password`, {
                newPassword,
            });
            alert('✅ Password reset successfully!');
            setShowResetPasswordModal(false);
            setNewPassword('');
        } catch (err: unknown) {
            let message = 'Failed to reset password.';
            if (err && typeof err === 'object') {
                const errorObj = err as ApiError;
                if (errorObj.response?.data?.message) {
                    message = errorObj.response.data.message;
                }
            }
            alert(`❌ ${message}`);
        }
    };

    const handleDeleteUser = async (userId: number, username: string) => {
        if (!confirm(`Are you sure you want to delete user "${username}"?`)) return;
        try {
            await api.delete(`/api/Users/${userId}`);
            alert('✅ User deleted successfully!');
            fetchUsers();
        } catch (err: unknown) {
            let message = 'Failed to delete user.';
            if (err && typeof err === 'object') {
                const errorObj = err as ApiError;
                if (errorObj.response?.data?.message) {
                    message = errorObj.response.data.message;
                }
            }
            alert(`❌ ${message}`);
        }
    };

    const handleCreateUser = async () => {
        if (!newUser.username || !newUser.email || !newUser.password) {
            alert('⚠️ Please fill in all fields.');
            return;
        }
        if (newUser.password.length < 6) {
            alert('⚠️ Password must be at least 6 characters.');
            return;
        }
        try {
            await api.post('/api/Users', newUser);
            alert('✅ User created successfully!');
            setShowCreateUserModal(false);
            setNewUser({ username: '', email: '', password: '', role: 'Customer' });
            fetchUsers();
        } catch (err: unknown) {
            let message = 'Failed to create user.';
            if (err && typeof err === 'object') {
                const errorObj = err as ApiError;
                if (errorObj.response?.data?.message) {
                    message = errorObj.response.data.message;
                }
            }
            alert(`❌ ${message}`);
        }
    };

    // ============================================================
    // RENDER
    // ============================================================
    if (isLoading || loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F5C45]"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl max-w-md mx-auto">
                    <p className="text-lg font-semibold">⚠️ خطأ</p>
                    <p className="mt-2">{error}</p>
                    <button
                        onClick={fetchUsers}
                        className="mt-4 px-6 py-2 bg-[#0F5C45] text-white rounded-xl hover:bg-[#0A4735] transition"
                    >
                        إعادة المحاولة
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">👥 إدارة المستخدمين</h1>
                <button
                    onClick={() => setShowCreateUserModal(true)}
                    className="bg-[#0F5C45] text-white px-6 py-2 rounded-xl hover:bg-[#0A4735] transition"
                >
                    + إضافة مستخدم جديد
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase">ID</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase">اسم المستخدم</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase">البريد الإلكتروني</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase">الدور</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase">تاريخ التسجيل</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {users.map((u) => (
                                <tr key={u.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 text-sm text-gray-900">{u.id}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{u.username}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{u.email}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${u.role === 'Admin'
                                                    ? 'bg-red-100 text-red-800'
                                                    : u.role === 'Vendor'
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}
                                        >
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(u.createdAt).toLocaleDateString('ar-EG')}
                                    </td>
                                    <td className="px-6 py-4 text-sm space-x-2 rtl:space-x-reverse">
                                        <button
                                            onClick={() => {
                                                setSelectedUser(u);
                                                setNewRole(u.role);
                                                setShowEditRoleModal(true);
                                            }}
                                            className="text-blue-600 hover:text-blue-800 font-medium"
                                        >
                                            تعديل الدور
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedUser(u);
                                                setShowResetPasswordModal(true);
                                            }}
                                            className="text-yellow-600 hover:text-yellow-800 font-medium"
                                        >
                                            إعادة تعيين كلمة المرور
                                        </button>
                                        <button
                                            onClick={() => handleDeleteUser(u.id, u.username)}
                                            className="text-red-600 hover:text-red-800 font-medium"
                                        >
                                            حذف
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ============================================================
          MODAL: Edit Role
          ============================================================ */}
            {showEditRoleModal && selectedUser && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-right">
                            تعديل دور المستخدم
                        </h2>
                        <p className="text-gray-600 mb-4 text-right">
                            المستخدم: <strong>{selectedUser.username}</strong>
                        </p>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
                                الدور الجديد
                            </label>
                            <select
                                value={newRole}
                                onChange={(e) => setNewRole(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C45]"
                            >
                                <option value="Admin">Admin</option>
                                <option value="Vendor">Vendor</option>
                                <option value="Customer">Customer</option>
                            </select>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleUpdateRole}
                                className="flex-1 py-2 bg-[#0F5C45] text-white rounded-xl hover:bg-[#0A4735] transition"
                            >
                                حفظ
                            </button>
                            <button
                                onClick={() => setShowEditRoleModal(false)}
                                className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition"
                            >
                                إلغاء
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ============================================================
          MODAL: Reset Password
          ============================================================ */}
            {showResetPasswordModal && selectedUser && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-right">
                            إعادة تعيين كلمة المرور
                        </h2>
                        <p className="text-gray-600 mb-4 text-right">
                            المستخدم: <strong>{selectedUser.username}</strong>
                        </p>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
                                كلمة المرور الجديدة
                            </label>
                            <input
                                type="text"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="أدخل كلمة مرور جديدة (6 أحرف على الأقل)"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C45]"
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleResetPassword}
                                className="flex-1 py-2 bg-[#0F5C45] text-white rounded-xl hover:bg-[#0A4735] transition"
                            >
                                حفظ
                            </button>
                            <button
                                onClick={() => {
                                    setShowResetPasswordModal(false);
                                    setNewPassword('');
                                }}
                                className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition"
                            >
                                إلغاء
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ============================================================
          MODAL: Create New User
          ============================================================ */}
            {showCreateUserModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-right">
                            إضافة مستخدم جديد
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
                                    اسم المستخدم *
                                </label>
                                <input
                                    type="text"
                                    value={newUser.username}
                                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C45]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
                                    البريد الإلكتروني *
                                </label>
                                <input
                                    type="email"
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C45]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
                                    كلمة المرور *
                                </label>
                                <input
                                    type="text"
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                    placeholder="6 أحرف على الأقل"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C45]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
                                    الدور
                                </label>
                                <select
                                    value={newUser.role}
                                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C45]"
                                >
                                    <option value="Customer">Customer</option>
                                    <option value="Vendor">Vendor</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={handleCreateUser}
                                className="flex-1 py-2 bg-[#0F5C45] text-white rounded-xl hover:bg-[#0A4735] transition"
                            >
                                إضافة
                            </button>
                            <button
                                onClick={() => {
                                    setShowCreateUserModal(false);
                                    setNewUser({ username: '', email: '', password: '', role: 'Customer' });
                                }}
                                className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition"
                            >
                                إلغاء
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}