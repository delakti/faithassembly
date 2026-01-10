import React, { useState, useEffect } from 'react';
import { HiCalendar, HiRefresh, HiCheckCircle, HiClock, HiUserGroup, HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import type { HospitalityShift } from '../../types/hospitality';

const HospitalitySchedule: React.FC = () => {
    const [assignments, setAssignments] = useState<HospitalityShift[]>([]);
    const [loading, setLoading] = useState(true);
    const currentMonth = 'Current Rota';

    useEffect(() => {
        const q = query(collection(db, 'hospitality_schedule'), orderBy('date', 'asc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setAssignments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as HospitalityShift)));
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleConfirm = async (id: string) => {
        try {
            await updateDoc(doc(db, 'hospitality_schedule', id), {
                status: 'Confirmed'
            });
            toast.success('Thank you for serving!');
        } catch (error) {
            toast.error("Failed to confirm shift");
        }
    };

    const handleSwapRequest = async (id: string) => {
        try {
            await updateDoc(doc(db, 'hospitality_schedule', id), {
                status: 'Swap Requested'
            });
            toast('Swap request posted to the board.', { icon: '📌' });
        } catch (error) {
            toast.error("Failed to request swap");
        }
    };

    return (
        <div className="space-y-8 font-sans text-stone-800">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div className="border-l-4 border-orange-400 pl-6">
                    <span className="text-orange-500 font-bold tracking-widest uppercase text-xs mb-2 block">Weekly Rota</span>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900">My Timetable</h1>
                    <p className="text-stone-500 font-medium mt-2 max-w-2xl">
                        "Serve one another with whatever gift each of you has received." — 1 Peter 4:10
                    </p>
                </div>
                <div className="flex items-center gap-4 bg-white p-2 rounded-xl border border-stone-200 shadow-sm">
                    <button className="p-2 hover:bg-stone-50 rounded-lg text-stone-400 hover:text-orange-500 transition-colors">
                        <HiChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="font-bold text-stone-700 min-w-[120px] text-center">{currentMonth}</span>
                    <button className="p-2 hover:bg-stone-50 rounded-lg text-stone-400 hover:text-orange-500 transition-colors">
                        <HiChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {loading && <p className="text-stone-500">Loading schedule...</p>}
            {assignments.length === 0 && !loading && <p className="text-stone-500 italic">No shifts assigned yet.</p>}

            <div className="grid gap-6">
                {assignments.map((item) => (
                    <div key={item.id} className="bg-white border border-stone-200 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-8 relative overflow-hidden">
                        {/* Status Strip */}
                        <div className={`absolute left-0 top-0 bottom-0 w-2 ${item.status === 'Confirmed' ? 'bg-green-500' :
                            item.status === 'Swap Requested' ? 'bg-orange-300' :
                                'bg-blue-400'
                            }`}></div>

                        {/* Date Block */}
                        <div className="md:w-48 flex-shrink-0">
                            <div className="bg-stone-50 rounded-xl p-6 border border-stone-100 text-center h-full flex flex-col justify-center">
                                <span className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">{item.date.split(',')[0]}</span>
                                <span className="text-3xl font-serif font-black text-stone-800">{item.date.split(' ')[2] || '?'}</span>
                                <span className="text-xs font-bold text-orange-500 uppercase tracking-widest mt-1">{item.date.split(' ')[1] || 'TBD'}</span>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="flex-1 flex flex-col justify-center">
                            <div className="flex items-center gap-3 mb-2">
                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${item.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                                    item.status === 'Swap Requested' ? 'bg-orange-100 text-orange-700' :
                                        'bg-blue-100 text-blue-700'
                                    }`}>
                                    {item.status === 'Confirmed' && <HiCheckCircle className="w-3 h-3" />}
                                    {item.status}
                                </span>
                            </div>
                            <h3 className="text-2xl font-bold text-stone-800 mb-2">{item.event}</h3>
                            <div className="flex flex-wrap gap-4 text-sm text-stone-500 font-medium mb-6">
                                <span className="flex items-center gap-2"><HiClock className="w-4 h-4 text-orange-400" /> {item.time}</span>
                                <span className="flex items-center gap-2 text-stone-400">|</span>
                                <span className="flex items-center gap-2"><HiUserGroup className="w-4 h-4 text-orange-400" /> {item.role} @ {item.location}</span>
                            </div>

                            <div className="flex -space-x-3">
                                {item.team && item.team.map((member, idx) => (
                                    <div key={idx} className="w-10 h-10 rounded-full bg-stone-100 border-2 border-white flex items-center justify-center text-xs font-bold text-stone-600 shadow-sm" title={member}>
                                        {member.charAt(0)}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="md:w-56 flex flex-col justify-center gap-3 border-t md:border-t-0 md:border-l border-stone-100 pt-6 md:pt-0 md:pl-8">
                            {item.status !== 'Confirmed' && item.status !== 'Swap Requested' && (
                                <button
                                    onClick={() => handleConfirm(item.id)}
                                    className="w-full py-3 bg-stone-800 text-white font-bold text-sm rounded-xl hover:bg-stone-900 transition-colors flex items-center justify-center gap-2 shadow-sm"
                                >
                                    <HiCheckCircle className="w-4 h-4" /> I'll Be There
                                </button>
                            )}
                            {item.status !== 'Swap Requested' && (
                                <button
                                    onClick={() => handleSwapRequest(item.id)}
                                    className="w-full py-3 bg-white border border-stone-200 text-stone-500 font-bold text-sm rounded-xl hover:border-orange-300 hover:text-orange-500 transition-colors flex items-center justify-center gap-2"
                                >
                                    <HiRefresh className="w-4 h-4" /> Request Cover
                                </button>
                            )}
                            {item.status === 'Swap Requested' && (
                                <div className="text-center p-3 bg-orange-50 text-orange-600 rounded-xl text-xs font-bold border border-orange-100">
                                    Request Pending...
                                </div>
                            )}
                            {item.status === 'Confirmed' && (
                                <div className="text-center p-3 bg-green-50 text-green-600 rounded-xl text-xs font-bold border border-green-100 flex items-center justify-center gap-2">
                                    <HiCheckCircle className="w-4 h-4" /> Confirmed
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-center mt-8">
                <button className="text-stone-400 font-bold text-sm flex items-center gap-2 hover:text-orange-500 transition-colors">
                    <HiCalendar className="w-4 h-4" /> Subscribe to Calendar
                </button>
            </div>
        </div>
    );
};

export default HospitalitySchedule;
