// app/admin/analytics/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '@/lib/api';
import { Bar, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { BarChart3 } from 'lucide-react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

interface AnalyticsData {
    usersByRole: Array<{ role: string; count: number }>;
    ordersByStatus: Array<{ status: string; count: number }>;
    monthlyRevenue: Array<{ year: number; month: number; total: number }>;
    totalUsers: number;
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
}

export default function AdminAnalytics() {
    const { t } = useTranslation('common');
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await api.get('/api/Admin/dashboard');
                setData(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch analytics:', err);
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F5C45]"></div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="text-center py-20 text-red-600">
                <p className="text-xl font-bold">⚠️ Error</p>
                <p>Unable to load analytics.</p>
            </div>
        );
    }

    const usersChartData = {
        labels: data.usersByRole.map((item) => item.role),
        datasets: [
            {
                label: 'Users by Role',
                data: data.usersByRole.map((item) => item.count),
                backgroundColor: ['#0F5C45', '#D4A54A', '#1A7A5C', '#E8C97A'],
                borderWidth: 1,
            },
        ],
    };

    const ordersChartData = {
        labels: data.ordersByStatus.map((item) => item.status),
        datasets: [
            {
                label: 'Orders by Status',
                data: data.ordersByStatus.map((item) => item.count),
                backgroundColor: ['#10B981', '#F59E0B', '#3B82F6', '#6366F1', '#EF4444'],
                borderWidth: 1,
            },
        ],
    };

    const revenueChartData = {
        labels: data.monthlyRevenue.map((item) =>
            `${item.month}/${item.year}`
        ),
        datasets: [
            {
                label: 'Revenue (£)',
                data: data.monthlyRevenue.map((item) => item.total),
                backgroundColor: 'rgba(15, 92, 69, 0.6)',
                borderColor: '#0F5C45',
                borderWidth: 2,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
        },
    };

    return (
        <div>
            <div className="flex items-center gap-3 mb-8">
                <BarChart3 className="w-8 h-8 text-[#0F5C45]" />
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
                    <p className="text-gray-500 mt-1">Visual insights into your marketplace</p>
                </div>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-xl shadow-soft p-4">
                    <p className="text-sm text-gray-500">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{data.totalUsers}</p>
                </div>
                <div className="bg-white rounded-xl shadow-soft p-4">
                    <p className="text-sm text-gray-500">Total Products</p>
                    <p className="text-2xl font-bold text-gray-900">{data.totalProducts}</p>
                </div>
                <div className="bg-white rounded-xl shadow-soft p-4">
                    <p className="text-sm text-gray-500">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900">{data.totalOrders}</p>
                </div>
                <div className="bg-white rounded-xl shadow-soft p-4">
                    <p className="text-sm text-gray-500">Total Revenue</p>
                    <p className="text-2xl font-bold text-[#0F5C45]">£{data.totalRevenue.toFixed(2)}</p>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-soft p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Users by Role</h3>
                    <Pie data={usersChartData} options={chartOptions} />
                </div>
                <div className="bg-white rounded-2xl shadow-soft p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Orders by Status</h3>
                    <Pie data={ordersChartData} options={chartOptions} />
                </div>
                <div className="bg-white rounded-2xl shadow-soft p-6 col-span-1 md:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Revenue</h3>
                    <Bar data={revenueChartData} options={chartOptions} height={60} />
                </div>
            </div>
        </div>
    );
}