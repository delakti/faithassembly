import React, { useState } from 'react';
import {
    HiUserGroup,
    HiSearch,
    HiFilter,
    HiPlus,
    HiDotsHorizontal,
    HiMail
} from 'react-icons/hi';

const LifeGroupManager: React.FC = () => {
    const [activeTab, setActiveTab] = useState('students');

    // Mock Data
    const students = [
        { id: 1, name: 'Samuel Doe', age: 14, group: 'Teens', attendance: '92%' },
        { id: 2, name: 'Esther Smith', age: 10, group: 'Juniors', attendance: '88%' },
        { id: 3, name: 'Joshua Brown', age: 16, group: 'Youth', attendance: '75%' },
    ];

    const groups = [
        { id: 1, name: 'Juniors (5-10)', teacher: 'Sis. Mary', count: 12 },
        { id: 2, name: 'Intermediates (11-13)', teacher: 'Bro. John', count: 8 },
        { id: 3, name: 'Teens (14-18)', teacher: 'Bro. David', count: 15 },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Class Manager</h1>
                    <p className="text-slate-500">Organize students and groups.</p>
                </div>
                <button className="flex items-center space-x-2 px-4 py-2 bg-sky-600 rounded-lg text-white hover:bg-sky-700">
                    <HiPlus className="w-5 h-5" />
                    <span>Add Student</span>
                </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('students')}
                        className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'students'
                                ? 'border-sky-500 text-sky-600'
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                            }`}
                    >
                        Directory
                    </button>
                    <button
                        onClick={() => setActiveTab('groups')}
                        className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'groups'
                                ? 'border-sky-500 text-sky-600'
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                            }`}
                    >
                        Classes & Groups
                    </button>
                </nav>
            </div>

            {/* Content Active Tab: Students */}
            {activeTab === 'students' && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex gap-4">
                        <div className="relative flex-1">
                            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search students..."
                                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
                            />
                        </div>
                        <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500">
                            <HiFilter className="w-5 h-5" />
                        </button>
                    </div>

                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                                <th className="p-4 border-b border-slate-100">Name</th>
                                <th className="p-4 border-b border-slate-100">Group</th>
                                <th className="p-4 border-b border-slate-100">Age</th>
                                <th className="p-4 border-b border-slate-100">Attendance</th>
                                <th className="p-4 border-b border-slate-100">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {students.map((student) => (
                                <tr key={student.id} className="hover:bg-slate-50">
                                    <td className="p-4 font-medium text-slate-800">{student.name}</td>
                                    <td className="p-4">
                                        <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-medium border border-slate-200">
                                            {student.group}
                                        </span>
                                    </td>
                                    <td className="p-4 text-slate-600">{student.age}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 bg-slate-100 rounded-full h-2 overflow-hidden">
                                                <div
                                                    className="bg-emerald-500 h-2 rounded-full"
                                                    style={{ width: student.attendance }}
                                                />
                                            </div>
                                            <span className="text-xs font-medium text-slate-600">{student.attendance}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 flex space-x-2">
                                        <button className="text-slate-400 hover:text-sky-600">
                                            <HiMail className="w-5 h-5" />
                                        </button>
                                        <button className="text-slate-400 hover:text-sky-600">
                                            <HiDotsHorizontal className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Content Active Tab: Groups */}
            {activeTab === 'groups' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groups.map((group) => (
                        <div key={group.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-sky-300 transition-all cursor-pointer group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="bg-sky-50 text-sky-600 p-3 rounded-xl group-hover:bg-sky-600 group-hover:text-white transition-colors">
                                    <HiUserGroup className="w-6 h-6" />
                                </div>
                                <button className="text-slate-400 hover:text-slate-600">
                                    <HiDotsHorizontal className="w-5 h-5" />
                                </button>
                            </div>
                            <h3 className="text-lg font-bold text-slate-800">{group.name}</h3>
                            <p className="text-slate-500 text-sm mt-1">Lead: <span className="text-slate-700 font-medium">{group.teacher}</span></p>

                            <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Students</span>
                                <span className="text-lg font-bold text-slate-900">{group.count}</span>
                            </div>
                        </div>
                    ))}

                    {/* Add New Group Card */}
                    <button className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-sky-400 hover:text-sky-600 hover:bg-sky-50 transition-all">
                        <HiPlus className="w-8 h-8 mb-2" />
                        <span className="font-medium">Create New Class</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default LifeGroupManager;
