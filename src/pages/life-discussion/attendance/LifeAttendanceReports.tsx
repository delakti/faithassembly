import React from 'react';
import {
    HiTrendingUp,
    HiUsers,
    HiCalendar,
    HiDownload
} from 'react-icons/hi';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement
);

const LifeAttendanceReports: React.FC = () => {
    // Mock Data for Charts
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

    const attendanceData = {
        labels: months,
        datasets: [
            {
                label: 'Average Attendance',
                data: [45, 52, 48, 60, 58, 65],
                backgroundColor: 'rgba(14, 165, 233, 0.5)',
                borderColor: 'rgb(14, 165, 233)',
                borderWidth: 1,
            },
        ],
    };

    const classComparisonData = {
        labels: ['Juniors', 'Inters', 'Teens', 'Youth'],
        datasets: [
            {
                label: 'This Month',
                data: [85, 78, 92, 65],
                backgroundColor: 'rgba(16, 185, 129, 0.5)',
                borderColor: 'rgb(16, 185, 129)',
                borderWidth: 1,
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
        scales: {
            y: {
                beginAtZero: true,
            }
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Attendance Reports</h1>
                    <p className="text-slate-500">Analytics and insights for Sunday School.</p>
                </div>
                <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">
                    <HiDownload className="w-5 h-5" />
                    <span>Export CSV</span>
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center text-sky-600">
                            <HiUsers className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-slate-500 text-sm font-medium">Avg. Attendance</p>
                            <h3 className="text-2xl font-bold text-slate-800">58 Students</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
                            <HiTrendingUp className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-slate-500 text-sm font-medium">Growth Rate</p>
                            <h3 className="text-2xl font-bold text-slate-800">+12%</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                            <HiCalendar className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-slate-500 text-sm font-medium">Total Sessions</p>
                            <h3 className="text-2xl font-bold text-slate-800">24</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Attendance Trends (6 Months)</h3>
                    <Line options={chartOptions} data={attendanceData} />
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Class Participation (%)</h3>
                    <Bar options={chartOptions} data={classComparisonData} />
                </div>
            </div>
        </div>
    );
};

export default LifeAttendanceReports;
