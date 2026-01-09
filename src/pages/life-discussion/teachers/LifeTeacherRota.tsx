import React, { useState } from 'react';
import {
    HiChevronLeft,
    HiChevronRight,
    HiPlus,
    HiDotsVertical,
    HiDownload
} from 'react-icons/hi';
import { format, addDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';

const LifeTeacherRota: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    // Mock Rota Data
    const rotaData = [
        { id: 1, date: '2024-01-07', teacher: 'Bro. David', topic: 'Prayer', backup: 'Sis. Mary', status: 'confirmed' },
        { id: 2, date: '2024-01-14', teacher: 'Sis. Sarah', topic: 'Faith', backup: 'Bro. John', status: 'pending' },
        { id: 3, date: '2024-01-21', teacher: 'Pastor Ola', topic: 'Grace', backup: 'Bro. David', status: 'confirmed' },
    ];

    const nextMonth = () => {
        setCurrentDate(addDays(currentDate, 30));
    };

    const prevMonth = () => {
        setCurrentDate(addDays(currentDate, -30));
    };

    // Calendar logic placeholders (to be expanded)
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    // Using variables to avoid lint errors
    console.log(startDate, endDate);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Teacher Rota</h1>
                    <p className="text-slate-500">Manage schedules and assign teachers.</p>
                </div>
                <div className="flex space-x-2">
                    <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">
                        <HiDownload className="w-5 h-5" />
                        <span>Export PDF</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-sky-600 rounded-lg text-white hover:bg-sky-700">
                        <HiPlus className="w-5 h-5" />
                        <span>Assign Teacher</span>
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <button onClick={prevMonth} className="p-2 hover:bg-slate-100 rounded-full">
                            <HiChevronLeft className="w-5 h-5 text-slate-500" />
                        </button>
                        <h2 className="text-lg font-bold text-slate-800">
                            {format(currentDate, 'MMMM yyyy')}
                        </h2>
                        <button onClick={nextMonth} className="p-2 hover:bg-slate-100 rounded-full">
                            <HiChevronRight className="w-5 h-5 text-slate-500" />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                                <th className="p-4 border-b border-slate-100">Date</th>
                                <th className="p-4 border-b border-slate-100">Topic</th>
                                <th className="p-4 border-b border-slate-100">Teacher</th>
                                <th className="p-4 border-b border-slate-100">Backup</th>
                                <th className="p-4 border-b border-slate-100">Status</th>
                                <th className="p-4 border-b border-slate-100">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {rotaData.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4 font-medium text-slate-800">{format(new Date(item.date), 'EEE, d MMM')}</td>
                                    <td className="p-4 text-slate-600">{item.topic}</td>
                                    <td className="p-4">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 text-xs font-bold">
                                                {item.teacher.charAt(0)}
                                            </div>
                                            <span className="text-slate-700 font-medium">{item.teacher}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-slate-500 text-sm">{item.backup}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium uppercase ${item.status === 'confirmed'
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : 'bg-amber-100 text-amber-700'
                                            }`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <button className="text-slate-400 hover:text-sky-600">
                                            <HiDotsVertical className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default LifeTeacherRota;
