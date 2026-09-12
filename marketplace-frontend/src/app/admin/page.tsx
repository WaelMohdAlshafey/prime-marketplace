'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import {
    Users,
    Package,
    ShoppingBag,
    DollarSign,
    Mail,
    Clock,
    LayoutDashboard,
    TrendingUp,
    PieChart as PieIcon,
    UserPlus,
} from 'lucide-react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
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

interface AnalyticsData {
    topSelling: Array<{ productName: string; soldCount: number }>;
    revenueByCategory: Array<{ category: string; revenue: number }>;
    usersGrowth: Array<{ year: number; month: number; newUsers: number }>;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, analyticsRes] = await Promise.all([
                    api.get('/api/Admin/dashboard'),
                    api.get('/api/Admin/analytics'),
                ]);
                setStats(statsRes.data);
                setAnalytics(analyticsRes.data);
            } catch (err) {
                console.error('Failed to fetch dashboard data:', err);
                setError('Failed to load dashboard data.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
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

    // --- Monthly Revenue ---
    const revenueChartData = {
        labels: stats.monthlyRevenue.map((item) => `${item.month}/${item.year}`),
        datasets: [
            {
                label: 'Revenue (£)',
                data: stats.monthlyRevenue.map((item) => item.total),
                borderColor: '#0F5C45',
                backgroundColor: 'rgba(15, 92, 69, 0.1)',
                fill: true,
                tension: 0.4,
            },
        ],
    };

    // --- Top Selling Products ---
    const topSellingData = {
        labels: analytics?.topSelling.map((x) => x.productName) || [],
        datasets: [
            {
                label: 'Units Sold',
                data: analytics?.topSelling.map((x) => x.soldCount) || [],
                backgroundColor: 'rgba(15, 92, 69, 0.7)',
                borderColor: '#0F5C45',
                borderWidth: 2,
            },
        ],
    };

    // --- Revenue by Category ---
    const palette = [
        '#0F5C45', '#D4A54A', '#3B82F6', '#EF4444', '#8B5CF6',
        '#F59E0B', '#10B981', '#EC4899', '#6366F1', '#14B8A6',
    ];
    const categoryData = {
        labels: analytics?.revenueByCategory.map((x) => x.category) || [],
        datasets: [
            {
                label: 'Revenue (£)',
                data: analytics?.revenueByCategory.map((x) => x.revenue) || [],
                backgroundColor: palette,
                borderWidth: 1,
            },
        ],
    };

    // --- Users Growth ---
    const usersGrowthData = {
        labels: analytics?.usersGrowth.map((x) => `${x.month}/${x.year}`) || [],
        datasets: [
            {
                label: 'New Users',
                data: analytics?.usersGrowth.map((x) => x.newUsers) || [],
                borderColor: '#3B82F6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const baseChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top' as const },
        },
    };

    const statCards = [
        { title: 'Total Users', value: stats.totalUsers, icon: Users, bgColor: 'bg-blue-50', textColor: 'text-blue-600' },
        { title: 'Products', value: stats.totalProducts, icon: Package, bgColor: 'bg-green-50', textColor: 'text-green-600' },
        { title: 'Orders', value: stats.totalOrders, icon: ShoppingBag, bgColor: 'bg-purple-50', textColor: 'text-purple-600' },
        { title: 'Revenue', value: `£${stats.totalRevenue.toFixed(2)}`, icon: DollarSign, bgColor: 'bg-amber-50', textColor: 'text-amber-600' },
        { title: 'Subscribers', value: stats.totalSubscribers, icon: Mail, bgColor: 'bg-rose-50', textColor: 'text-rose-600' },
        { title: 'Pending Orders', value: stats.pendingOrders, icon: Clock, bgColor: 'bg-red-50', textColor: 'text-red-600' },
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

            {/* Monthly Revenue */}
            <div className="bg-card-bg rounded-2xl shadow-soft p-4 md:p-6 mb-6 md:mb-8 border border-card-border">
                <h2 className="text-lg md:text-xl font-bold text-text mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Monthly Revenue (Last 12 Months)
                </h2>
                {stats.monthlyRevenue.length > 0 ? (
                    <div className="h-64 md:h-80">
                        <Line data={revenueChartData} options={baseChartOptions} />
                    </div>
                ) : (
                    <p className="text-center text-text-muted py-8">No revenue data available yet.</p>
                )}
            </div>

            {/* Two Charts Side-by-Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
                {/* Top Selling Products */}
                <div className="bg-card-bg rounded-2xl shadow-soft p-4 md:p-6 border border-card-border">
                    <h2 className="text-lg font-bold text-text mb-4 flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-primary" />
                        Top Selling Products
                    </h2>
                    {analytics?.topSelling && analytics.topSelling.length > 0 ? (
                        <div className="h-64 md:h-80">
                            <Bar data={topSellingData} options={baseChartOptions} />
                        </div>
                    ) : (
                        <p className="text-center text-text-muted py-8">No sales data yet.</p>
                    )}
                </div>

                {/* Revenue by Category */}
                <div className="bg-card-bg rounded-2xl shadow-soft p-4 md:p-6 border border-card-border">
                    <h2 className="text-lg font-bold text-text mb-4 flex items-center gap-2">
                        <PieIcon className="w-5 h-5 text-primary" />
                        Revenue by Category
                    </h2>
                    {analytics?.revenueByCategory && analytics.revenueByCategory.length > 0 ? (
                        <div className="h-64 md:h-80">
                            <Doughnut data={categoryData} options={baseChartOptions} />
                        </div>
                    ) : (
                        <p className="text-center text-text-muted py-8">No category data yet.</p>
                    )}
                </div>
            </div>

            {/* Users Growth */}
            <div className="bg-card-bg rounded-2xl shadow-soft p-4 md:p-6 mb-6 md:mb-8 border border-card-border">
                <h2 className="text-lg md:text-xl font-bold text-text mb-4 flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-primary" />
                    New Users Growth (Last 12 Months)
                </h2>
                {analytics?.usersGrowth && analytics.usersGrowth.length > 0 ? (
                    <div className="h-64 md:h-80">
                        <Line data={usersGrowthData} options={baseChartOptions} />
                    </div>
                ) : (
                    <p className="text-center text-text-muted py-8">No user growth data yet.</p>
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