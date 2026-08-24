'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '@/lib/api';
import {
    Users,
    Package,
    ShoppingBag,
    DollarSign,
    Mail,
    Clock,
    TrendingUp,
    LayoutDashboard,
} from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface DashboardStats {
    totalUsers: number;
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
    totalSubscribers: number;
    pendingOrders: number;
    recentOrders: Array<{
        id: number;
        orderDate: string;
        totalAmount: number;
        status: string;
        userId: number;
    }>;
    usersByRole: Array<{ role: string; count: number }>;
    ordersByStatus: Array<{ status: string; count: number }>;
    monthlyRevenue: Array<{ year: number; month: number; total: number }>;
}

export default function AdminDashboard() {
    const { t } = useTranslation('common');
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/api/Admin/dashboard');
                setStats(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch dashboard stats:', err);
                setError('Failed to load dashboard data.');
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error || !stats) {
        return (
            <div className="text-center py-20 text-red-600">
                <p className="text-xl font-bold">⚠️ Error</p>
                <p>{error || 'Unable to load dashboard.'}</p>
            </div>
        );
    }

    const chartData = {
        labels: stats.monthlyRevenue.map((item) =>
            `${item.month}/${item.year}`
        ),
        datasets: [
            {
                label: 'Revenue (£)',
                data: stats.monthlyRevenue.map((item) => item.total),
                borderColor: 'var(--color-primary, #0F5C45)',
                backgroundColor: 'rgba(15, 92, 69, 0.1)',
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Monthly Revenue (Last 12 Months)',
            },
        },
    };

    const statCards = [
        {
            title: 'Total Users',
            value: stats.totalUsers,
            icon: Users,
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-600',
        },
        {
            title: 'Products',
            value: stats.totalProducts,
            icon: Package,
            bgColor: 'bg-green-50',
            textColor: 'text-green-600',
        },
        {
            title: 'Orders',
            value: stats.totalOrders,
            icon: ShoppingBag,
            bgColor: 'bg-purple-50',
            textColor: 'text-purple-600',
        },
        {
            title: 'Revenue',
            value: `£${stats.totalRevenue.toFixed(2)}`,
            icon: DollarSign,
            bgColor: 'bg-amber-50',
            textColor: 'text-amber-600',
        },
        {
            title: 'Subscribers',
            value: stats.totalSubscribers,
            icon: Mail,
            bgColor: 'bg-rose-50',
            textColor: 'text-rose-600',
        },
        {
            title: 'Pending Orders',
            value: stats.pendingOrders,
            icon: Clock,
            bgColor: 'bg-red-50',
            textColor: 'text-red-600',
        },
    ];

    return (
        <div>
            <div className="flex items-center gap-3 mb-8">
                <LayoutDashboard className="w-8 h-8 text-primary" />
                <div>
                    <h1 className="text-3xl font-bold text-text">Dashboard</h1>
                    <p className="text-text-muted mt-1">Overview of your marketplace</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
                {statCards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <div
                            key={card.title}
                            className="bg-card-bg rounded-2xl shadow-soft hover:shadow-strong transition-all duration-300 p-4 md:p-6 hover:-translate-y-1 border border-card-border"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs md:text-sm text-text-muted font-medium">{card.title}</p>
                                    <p className="text-xl md:text-3xl font-bold text-text mt-1">{card.value}</p>
                                </div>
                                <div className={`p-2 md:p-3 rounded-xl ${card.bgColor}`}>
                                    <Icon className={`w-5 h-5 md:w-6 md:h-6 ${card.textColor}`} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Chart */}
            <div className="bg-card-bg rounded-2xl shadow-soft p-4 md:p-6 mb-6 md:mb-8 border border-card-border">
                {stats.monthlyRevenue.length > 0 ? (
                    <div className="h-64 md:h-80">
                        <Line data={chartData} options={chartOptions} />
                    </div>
                ) : (
                    <p className="text-center text-text-muted py-8">No revenue data available yet.</p>
                )}
            </div>

            {/* Recent Orders */}
            <div className="bg-card-bg rounded-2xl shadow-soft p-4 md:p-6 border border-card-border">
                <h2 className="text-lg md:text-xl font-bold text-text mb-4">Recent Orders</h2>
                <div className="overflow-x-auto -mx-4 md:mx-0">
                    <div className="inline-block min-w-full align-middle">
                        <table className="min-w-full divide-y divide-border">
                            <thead className="bg-background">
                                <tr>
                                    <th className="px-3 md:px-4 py-3 text-right text-xs font-semibold text-text-muted uppercase">Order ID</th>
                                    <th className="px-3 md:px-4 py-3 text-right text-xs font-semibold text-text-muted uppercase">Date</th>
                                    <th className="px-3 md:px-4 py-3 text-right text-xs font-semibold text-text-muted uppercase">Amount</th>
                                    <th className="px-3 md:px-4 py-3 text-right text-xs font-semibold text-text-muted uppercase">Status</th>
                                    <th className="px-3 md:px-4 py-3 text-right text-xs font-semibold text-text-muted uppercase">User</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {stats.recentOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-background transition">
                                        <td className="px-3 md:px-4 py-3 text-sm text-text">#{order.id}</td>
                                        <td className="px-3 md:px-4 py-3 text-sm text-text-muted whitespace-nowrap">
                                            {new Date(order.orderDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-3 md:px-4 py-3 text-sm font-semibold text-text whitespace-nowrap">
                                            £{order.totalAmount.toFixed(2)}
                                        </td>
                                        <td className="px-3 md:px-4 py-3 text-sm">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.status === 'Paid'
                                                ? 'bg-green-100 text-green-800'
                                                : order.status === 'Pending'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-3 md:px-4 py-3 text-sm text-text-muted">User #{order.userId}</td>
                                    </tr>
                                ))}
                                {stats.recentOrders.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-8 text-center text-text-muted">
                                            No orders yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}