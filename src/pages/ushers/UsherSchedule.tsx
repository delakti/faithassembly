import React, { useState } from 'react';
import { HiCalendar, HiRefresh, HiCheckCircle } from 'react-icons/hi';
import { toast } from 'react-hot-toast';

const SCHEDULE = [
    {
        id: 1,
        date: "Sunday, Nov 19",
        service: "Morning Service",
        time: "08:30 AM",
        role: "Head Usher",
        location: "Main Sanctuary - Foyer",
        status: "Confirmed",
        team: ["James D.", "Sarah L.", "Mike T."]
    },
    {
        id: 2,
        date: "Sunday, Nov 19",
        service: "Evening Service",
        time: "05:30 PM",
        role: "Usher",
        location: "Balcony - Section B",
        status: "Pending",
        team: ["David R.", "Lisa K."]
    },
    {
        id: 3,
        date: "Wednesday, Nov 22",
        service: "Midweek Bible Study",
        time: "06:30 PM",
        role: "Usher",
        location: "Main Sanctuary - Right Aisle",
        status: "Swap Requested",
        team: ["John M."]
    }
];

const UsherSchedule: React.FC = () => {
    const [assignments, setAssignments] = useState(SCHEDULE);

    const handleConfirm = (id: number) => {
        setAssignments(prev => prev.map(a => a.id === id ? { ...a, status: 'Confirmed' } : a));
        toast.success('Assignment Confirmed.');
    };

    const handleSwapRequest = (id: number) => {
        setAssignments(prev => prev.map(a => a.id === id ? { ...a, status: 'Swap Requested' } : a));
        toast('Swap request sent to team.', { icon: '🔄' });
    };

    return (
        <div className="space-y-8 font-sans text-slate-800">
            <div className="mb-8 border-l-4 border-blue-600 pl-6">
                <span className="text-blue-600 font-bold tracking-widest uppercase text-xs mb-2 block">Service Rota</span>
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900">My Schedule</h1>
                <p className="text-slate-500 font-medium mt-2 max-w-2xl">
                    "Everything should be done in a fitting and orderly way." View your upcoming assignments and manage availability.
                </p>
            </div>

            <div className="space-y-6">
                {assignments.map((item) => (
                    <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6">
                        {/* Date Block */}
                        <div className="md:w-48 flex-shrink-0 flex flex-col justify-center items-center bg-slate-50 rounded-xl p-6 border border-slate-100">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{item.date.split(',')[0]}</span>
                            <span className="text-3xl font-black text-slate-800">{item.date.split(' ')[2]}</span>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{item.date.split(' ')[1]}</span>
                        </div>

                        {/* Details */}
                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${item.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                                    item.status === 'Swap Requested' ? 'bg-orange-100 text-orange-700' :
                                        'bg-blue-100 text-blue-700'
                                    }`}>
                                    {item.status}
                                </span>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-1">{item.service}</h3>
                            <p className="text-blue-600 font-medium mb-4 flex items-center gap-2 text-sm">
                                <HiCalendar className="w-4 h-4" /> {item.time} &bull; {item.location}
                            </p>

                            <div className="bg-slate-50 rounded-lg p-4 mb-4 border border-slate-100">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Your Role</span>
                                <span className="text-sm font-bold text-slate-700 block mb-3">{item.role}</span>

                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Team Members</span>
                                <div className="flex -space-x-2 overflow-hidden">
                                    {item.team.map((member, idx) => (
                                        <div key={idx} className="w-8 h-8 rounded-full bg-white border-2 border-slate-50 flex items-center justify-center text-xs font-bold text-slate-600 shadow-sm" title={member}>
                                            {member.charAt(0)}
                                        </div>
                                    ))}
                                    <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-400">
                                        +
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="md:w-48 flex flex-col justify-center gap-3">
                            {item.status !== 'Confirmed' && item.status !== 'Swap Requested' && (
                                <button
                                    onClick={() => handleConfirm(item.id)}
                                    className="w-full py-3 bg-blue-600 text-white font-bold uppercase tracking-widest text-xs rounded hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
                                >
                                    <HiCheckCircle className="w-4 h-4" /> Confirm
                                </button>
                            )}
                            {item.status !== 'Swap Requested' && (
                                <button
                                    onClick={() => handleSwapRequest(item.id)}
                                    className="w-full py-3 bg-white border border-slate-200 text-slate-500 font-bold uppercase tracking-widest text-xs rounded hover:border-orange-500 hover:text-orange-500 transition-colors flex items-center justify-center gap-2"
                                >
                                    <HiRefresh className="w-4 h-4" /> Request Swap
                                </button>
                            )}
                            {item.status === 'Swap Requested' && (
                                <div className="text-center p-3 bg-orange-50 text-orange-600 rounded text-xs font-bold border border-orange-100">
                                    Swap Pending Approval
                                </div>
                            )}
                            {item.status === 'Confirmed' && (
                                <div className="text-center p-3 bg-green-50 text-green-600 rounded text-xs font-bold border border-green-100 flex items-center justify-center gap-2">
                                    <HiCheckCircle className="w-4 h-4" /> You're Set
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UsherSchedule;
