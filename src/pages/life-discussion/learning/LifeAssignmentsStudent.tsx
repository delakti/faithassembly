import React, { useState } from 'react';
import {
    HiOutlineClipboardCheck,
    HiOutlineClock,
    HiUpload,
    HiCheckCircle
} from 'react-icons/hi';

const LifeAssignmentsStudent: React.FC = () => {
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const assignments = [
        {
            id: 1,
            title: 'Reflection on Psalm 23',
            dueDate: 'Jan 20',
            status: 'Pending',
            description: 'Write a short reflection on what "The Lord is my Shepherd" means to you personally.'
        },
        {
            id: 2,
            title: 'The Parables of Jesus',
            dueDate: 'Jan 27',
            status: 'New',
            description: 'Choose one parable and explain its moral lesson.'
        },
        {
            id: 3,
            title: 'Prayer Journal',
            dueDate: 'Jan 10',
            status: 'Submitted',
            grade: 'A'
        },
    ];

    const selectedAssignment = assignments.find(a => a.id === selectedId);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-800">My Assignments</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* List of assignments */}
                <div className="lg:col-span-1 space-y-4">
                    {assignments.map((assignment) => (
                        <div
                            key={assignment.id}
                            onClick={() => setSelectedId(assignment.id)}
                            className={`p-5 rounded-xl border cursor-pointer transition-all ${selectedId === assignment.id
                                    ? 'bg-sky-50 border-sky-300 shadow-sm'
                                    : 'bg-white border-slate-200 hover:border-sky-200'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${assignment.status === 'Submitted'
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : 'bg-amber-100 text-amber-700'
                                    }`}>
                                    {assignment.status}
                                </span>
                                <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                                    <HiOutlineClock className="w-3 h-3" />
                                    Due: {assignment.dueDate}
                                </span>
                            </div>
                            <h3 className="font-bold text-slate-800">{assignment.title}</h3>
                            {assignment.grade && (
                                <p className="text-sm text-emerald-600 font-medium mt-1">Grade: {assignment.grade}</p>
                            )}
                        </div>
                    ))}
                </div>

                {/* Detail / Submission View */}
                <div className="lg:col-span-2">
                    {selectedAssignment ? (
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 h-full">
                            <div className="border-b border-slate-100 pb-6 mb-6">
                                <h2 className="text-2xl font-bold text-slate-800 mb-2">{selectedAssignment.title}</h2>
                                <p className="text-slate-500 leading-relaxed">{selectedAssignment.description || "No specific instructions provided."}</p>
                            </div>

                            {selectedAssignment.status === 'Submitted' ? (
                                <div className="bg-emerald-50 rounded-xl p-6 text-center border border-emerald-100">
                                    <HiCheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                                    <h3 className="text-lg font-bold text-emerald-800 mb-1">Good Job!</h3>
                                    <p className="text-emerald-600">You submitted this assignment on Jan 9, 2024.</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Your Answer</label>
                                        <textarea
                                            className="w-full h-48 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none resize-none text-slate-700"
                                            placeholder="Type your response here..."
                                        />
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="flex-1 border-t border-slate-100"></div>
                                        <span className="text-xs text-slate-400 font-bold uppercase">OR</span>
                                        <div className="flex-1 border-t border-slate-100"></div>
                                    </div>

                                    <button className="w-full py-4 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 font-medium hover:border-sky-400 hover:text-sky-600 hover:bg-sky-50 transition-all flex flex-col items-center justify-center gap-2">
                                        <HiUpload className="w-6 h-6" />
                                        <span>Upload Document</span>
                                    </button>

                                    <div className="pt-4 flex justify-end">
                                        <button className="px-8 py-3 bg-sky-600 text-white font-bold rounded-xl hover:bg-sky-700 shadow-md shadow-sky-200 transition-all">
                                            Submit Assignment
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-slate-50 rounded-xl border border-slate-200 h-full flex flex-col items-center justify-center text-center p-8 text-slate-400">
                            <HiOutlineClipboardCheck className="w-16 h-16 mb-4 opacity-50" />
                            <p className="font-medium">Select an assignment to view details</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LifeAssignmentsStudent;
