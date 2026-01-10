import React, { useState } from 'react';
import LifeTeacherRota from './teachers/LifeTeacherRota';
import LifeGroupManager from './teachers/LifeGroupManager';
import LifeAttendanceTeacher from './attendance/LifeAttendanceTeacher';
import LifeAssignmentsTeacher from './learning/LifeAssignmentsTeacher';
import LifeResources from './resources/LifeResources';
import { HiBookOpen, HiCalendar, HiClipboardList, HiCollection, HiUserGroup } from 'react-icons/hi';

const LifeLeaderPanel: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'rota' | 'classes' | 'attendance' | 'assignments' | 'resources'>('rota');

    return (
        <div className="space-y-8 font-sans">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Leader Panel</h1>
                    <p className="text-slate-500">Manage classes, attendance, and learning resources.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setActiveTab('rota')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'rota' ? 'bg-sky-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                    >
                        <HiCalendar className="w-4 h-4" />
                        Rota
                    </button>
                    <button
                        onClick={() => setActiveTab('classes')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'classes' ? 'bg-sky-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                    >
                        <HiUserGroup className="w-4 h-4" />
                        Classes
                    </button>
                    <button
                        onClick={() => setActiveTab('attendance')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'attendance' ? 'bg-sky-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                    >
                        <HiClipboardList className="w-4 h-4" />
                        Attendance
                    </button>
                    <button
                        onClick={() => setActiveTab('assignments')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'assignments' ? 'bg-sky-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                    >
                        <HiBookOpen className="w-4 h-4" />
                        Assignments
                    </button>
                    <button
                        onClick={() => setActiveTab('resources')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'resources' ? 'bg-sky-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                    >
                        <HiCollection className="w-4 h-4" />
                        Resources
                    </button>
                </div>
            </header>

            {/* Content Area */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px] p-6">
                {activeTab === 'rota' && <LifeTeacherRota />}
                {activeTab === 'classes' && <LifeGroupManager />}
                {activeTab === 'attendance' && <LifeAttendanceTeacher />}
                {activeTab === 'assignments' && <LifeAssignmentsTeacher />}
                {activeTab === 'resources' && <LifeResources />}
            </div>
        </div>
    );
};

export default LifeLeaderPanel;
