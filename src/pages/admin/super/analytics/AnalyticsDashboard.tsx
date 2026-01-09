import React from 'react';
import {
    HiTrendingUp,
    HiUserGroup,
    HiCurrencyDollar,
    HiLightningBolt
} from 'react-icons/hi';
import { Line, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const AnalyticsDashboard: React.FC = () => {
    // Mock Data for Widgets
    const stats = [
        { title: 'Total Members', value: '1,245', change: '+12%', icon: <HiUserGroup className="w-6 h-6 text-white" />, color: 'bg-purple-500' },
        { title: 'Weekly Giving', value: '£12,450', change: '+5%', icon: <HiCurrencyDollar className="w-6 h-6 text-white" />, color: 'bg-emerald-500' },
        { title: 'Active (Live)', value: '85', change: 'Now', icon: <HiLightningBolt className="w-6 h-6 text-white" />, color: 'bg-amber-500' },
        { title: 'New Converts', value: '24', change: '+3 this week', icon: <HiTrendingUp className="w-6 h-6 text-white" />, color: 'bg-sky-500' },
    ];

    // Chart Data
    const lineData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Attendance',
                data: [450, 480, 520, 510, 550, 590],
                borderColor: 'rgb(14 165 233)',
                backgroundColor: 'rgba(14, 165, 233, 0.5)',
                tension: 0.4,
            },
            {
                label: 'Online Views',
                data: [1200, 1350, 1250, 1600, 1800, 2100],
                borderColor: 'rgb(168 85 247)',
                backgroundColor: 'rgba(168, 85, 247, 0.5)',
                tension: 0.4,
            },
        ],
    };

    const doughnutData = {
        labels: ['Youth', 'Men', 'Women', 'Children', 'Seniors'],
        datasets: [
            {
                data: [35, 20, 25, 15, 5],
                backgroundColor: [
                    'rgba(14, 165, 233, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(168, 85, 247, 0.8)',
                    'rgba(244, 63, 94, 0.8)',
                    'rgba(234, 179, 8, 0.8)',
                ],
                borderWidth: 0,
            },
        ],
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Analytics & Oversight</h1>
                <p className="text-slate-500">High-level view of church growth and activity.</p>
            </div>

            {/* Widgets */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">{stat.title}</p>
                            <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
                            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full mt-2 inline-block">
                                {stat.change}
                            </span>
                        </div>
                        <div className={`p-4 rounded-xl shadow-lg ${stat.color}`}>
                            {stat.icon}
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-800 mb-6">Growth Trends</h3>
                    <div className="h-64">
                        <Line options={{ responsive: true, maintainAspectRatio: false }} data={lineData} />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-800 mb-6">Demographics</h3>
                    <div className="h-64 flex items-center justify-center">
                        <Doughnut options={{ responsive: true, maintainAspectRatio: false }} data={doughnutData} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
