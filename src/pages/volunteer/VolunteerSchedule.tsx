import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { db } from '../../firebase';
import { collection, query, where, onSnapshot, updateDoc, doc, orderBy } from 'firebase/firestore';
import type { Task } from '../../types/volunteer';
import { FaCalendarDay, FaClock, FaMapMarkerAlt, FaUserCheck, FaSpinner } from 'react-icons/fa';

const VolunteerSchedule: React.FC = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const [shifts, setShifts] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    useEffect(() => {
        if (!user) return;

        // Fetch tasks with type 'shift'
        // In a real app we might range query by date (e.g. this month)
        const q = query(
            collection(db, 'volunteer_tasks'),
            where('type', '==', 'shift'),
            orderBy('date', 'asc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedShifts: Task[] = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Task[];
            setShifts(fetchedShifts);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const handleSignUp = async (shiftId: string) => {
        if (!user) return;
        setProcessingId(shiftId);
        try {
            await updateDoc(doc(db, 'volunteer_tasks', shiftId), {
                assignedTo: user.uid,
                status: 'accepted'
            });
        } catch (error) {
            console.error("Error signing up for shift:", error);
            alert("Shift could not be claimed.");
        } finally {
            setProcessingId(null);
        }
    };

    const handleCancel = async (shiftId: string) => {
        if (!window.confirm("Are you sure you want to cancel this shift?")) return;
        setProcessingId(shiftId);
        try {
            await updateDoc(doc(db, 'volunteer_tasks', shiftId), {
                assignedTo: null,
                status: 'pending'
            });
        } catch (error) {
            console.error("Error cancelling shift:", error);
        } finally {
            setProcessingId(null);
        }
    };

    // Group shifts by date
    const groupedShifts = shifts.reduce((acc, shift) => {
        const dateKey = shift.date; // Assuming ISO YYYY-MM-DD
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(shift);
        return acc;
    }, {} as Record<string, Task[]>);

    const sortedDates = Object.keys(groupedShifts).sort();

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Shift Schedule</h1>

            {loading ? (
                <div className="flex justify-center py-10">
                    <FaSpinner className="animate-spin text-orange-500 text-2xl" />
                </div>
            ) : shifts.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                    <FaCalendarDay className="mx-auto text-4xl text-gray-300 mb-4" />
                    <p className="text-gray-500">No upcoming shifts scheduled.</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {sortedDates.map(date => (
                        <div key={date}>
                            <div className="sticky top-[72px] md:top-20 z-10 bg-gray-50/95 backdrop-blur py-2 mb-3 border-b border-gray-200">
                                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                    <FaCalendarDay className="text-orange-500" />
                                    {new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {groupedShifts[date].map(shift => {
                                    const isAssignedToMe = shift.assignedTo === user?.uid;
                                    const isTaken = shift.assignedTo && !isAssignedToMe;

                                    return (
                                        <div key={shift.id} className={`p-5 rounded-xl border transition ${isAssignedToMe ? 'bg-orange-50 border-orange-200 shadow-sm' :
                                            isTaken ? 'bg-gray-50 border-gray-100 opacity-70' :
                                                'bg-white border-gray-200 shadow-sm hover:shadow-md'
                                            }`}>
                                            <div className="flex justify-between items-start mb-3">
                                                <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${shift.team === 'Welcome' ? 'bg-green-100 text-green-700' :
                                                    shift.team === 'Media' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {shift.team}
                                                </span>
                                                {isAssignedToMe && (
                                                    <span className="flex items-center gap-1 text-xs font-bold text-orange-600">
                                                        <FaUserCheck /> Yours
                                                    </span>
                                                )}
                                            </div>

                                            <h3 className="font-bold text-gray-900 text-lg mb-1">{shift.title}</h3>

                                            <div className="space-y-2 my-4 text-sm text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <FaClock className="text-gray-400" />
                                                    {shift.startTime} - {shift.endTime}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <FaMapMarkerAlt className="text-gray-400" />
                                                    {shift.location}
                                                </div>
                                            </div>

                                            <div className="pt-3 border-t border-gray-100/50">
                                                {isAssignedToMe ? (
                                                    <button
                                                        onClick={() => handleCancel(shift.id)}
                                                        disabled={processingId === shift.id}
                                                        className="w-full py-2 border border-red-200 text-red-600 rounded-lg text-sm font-bold hover:bg-red-50 transition"
                                                    >
                                                        {processingId === shift.id ? 'Processing...' : 'Cancel Shift'}
                                                    </button>
                                                ) : isTaken ? (
                                                    <button disabled className="w-full py-2 bg-gray-100 text-gray-400 rounded-lg text-sm font-bold cursor-not-allowed">
                                                        Taken
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleSignUp(shift.id)}
                                                        disabled={processingId === shift.id}
                                                        className="w-full py-2 bg-orange-600 text-white rounded-lg text-sm font-bold hover:bg-orange-700 transition"
                                                    >
                                                        {processingId === shift.id ? 'Signing Up...' : 'Sign Up'}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default VolunteerSchedule;
