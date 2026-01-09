import React, { useState } from 'react';
import {
    HiPlus,
    HiPencil,
    HiOutlineEye
} from 'react-icons/hi';

const LifeAssignmentsTeacher: React.FC = () => {
    const [view, setView] = useState<'list' | 'create' | 'grade'>('list');

    // Mock Data
    const assignments = [
        { id: 1, title: 'Reflection on Psalm 23', dueDate: '2024-01-20', submissions: 12, total: 15, status: 'Active' },
        { id: 2, title: 'The Parables of Jesus', dueDate: '2024-01-27', submissions: 5, total: 15, status: 'Draft' },
    ];

    const submissions = [
        { id: 1, student: 'Samuel Doe', date: 'Jan 18, 10:00 AM', status: 'Pending Review', content: 'Psalm 23 teaches us about trust...' },
        { id: 2, student: 'Esther Smith', date: 'Jan 19, 02:30 PM', status: 'Graded', grade: 'A' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Assignments</h1>
                    <p className="text-slate-500">Create tasks and grade student work.</p>
                </div>
                {view === 'list' && (
                    <button
                        onClick={() => setView('create')}
                        className="flex items-center space-x-2 px-4 py-2 bg-sky-600 rounded-lg text-white hover:bg-sky-700"
                    >
                        <HiPlus className="w-5 h-5" />
                        <span>New Assignment</span>
                    </button>
                )}
                {view !== 'list' && (
                    <button
                        onClick={() => setView('list')}
                        className="text-slate-500 hover:text-slate-700 font-medium"
                    >
                        &larr; Back to List
                    </button>
                )}
            </div>

            {view === 'list' && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                                <th className="p-4 border-b border-slate-100">Title</th>
                                <th className="p-4 border-b border-slate-100">Due Date</th>
                                <th className="p-4 border-b border-slate-100">Submissions</th>
                                <th className="p-4 border-b border-slate-100">Status</th>
                                <th className="p-4 border-b border-slate-100">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {assignments.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50">
                                    <td className="p-4 font-medium text-slate-800">{item.title}</td>
                                    <td className="p-4 text-slate-600">{item.dueDate}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
                                                <div
                                                    className="bg-sky-500 h-2 rounded-full"
                                                    style={{ width: `${(item.submissions / item.total) * 100}%` }}
                                                />
                                            </div>
                                            <span className="text-xs font-medium text-slate-600">{item.submissions}/{item.total}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium uppercase ${item.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                                            }`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="p-4 flex space-x-2">
                                        <button
                                            onClick={() => setView('grade')}
                                            className="text-slate-400 hover:text-sky-600" title="Grade"
                                        >
                                            <HiOutlineEye className="w-5 h-5" />
                                        </button>
                                        <button className="text-slate-400 hover:text-amber-600" title="Edit">
                                            <HiPencil className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {view === 'create' && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 max-w-3xl">
                    <h2 className="text-xl font-bold text-slate-800 mb-6">Create New Assignment</h2>
                    <form className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                            <input type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none" placeholder="e.g. Weekly Reflection" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                                <input type="date" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Points</label>
                                <input type="number" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none" placeholder="100" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Description / Instructions</label>
                            <textarea className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none h-32" placeholder="Enter details..." />
                        </div>
                        <div className="flex justify-end space-x-3 pt-4">
                            <button type="button" onClick={() => setView('list')} className="px-6 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">Cancel</button>
                            <button type="button" className="px-6 py-2 bg-sky-600 rounded-lg text-white hover:bg-sky-700 font-medium">Create Assignment</button>
                        </div>
                    </form>
                </div>
            )}

            {view === 'grade' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 space-y-4">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                            <h3 className="font-bold text-slate-800 mb-4">Submissions</h3>
                            <div className="space-y-2">
                                {submissions.map((sub) => (
                                    <div key={sub.id} className="p-3 rounded-lg border border-slate-100 hover:border-sky-300 cursor-pointer bg-slate-50/50">
                                        <div className="flex justify-between items-start">
                                            <span className="font-medium text-slate-800 text-sm">{sub.student}</span>
                                            {sub.status === 'Graded'
                                                ? <span className="text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-medium">{sub.grade}</span>
                                                : <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-medium">Pending</span>
                                            }
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">{sub.date}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-100">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-800">Samuel Doe</h2>
                                    <p className="text-sm text-slate-500">Reflection on Psalm 23</p>
                                </div>
                                <div className="flex gap-2">
                                    <input type="text" placeholder="Grade (A-F)" className="w-24 px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                                    <button className="px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700">submit</button>
                                </div>
                            </div>

                            <div className="prose prose-slate max-w-none">
                                <p className="text-slate-600 leading-relaxed">
                                    Psalm 23 teaches us about trust. When David says "The Lord is my Shepherd", he recognizes that he doesn't need to worry because God is in control. This is relevant to my life because...
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LifeAssignmentsTeacher;
