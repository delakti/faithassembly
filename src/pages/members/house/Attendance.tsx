import React, { useState } from 'react';
import { useHouseFellowship } from '../../../layouts/HouseLayout';
import { db } from '../../../firebase';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { FaCalendarCheck, FaCheck, FaUserCheck, FaHistory } from 'react-icons/fa';

const HouseAttendance: React.FC = () => {
    const { fellowship, members } = useHouseFellowship();
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [presentMembers, setPresentMembers] = useState<Set<string>>(new Set());
    const [saving, setSaving] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');



    const toggleMember = (id: string) => {
        setPresentMembers(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const handleSave = async () => {
        if (!fellowship?.name) return;
        setSaving(true);
        try {
            const attendees = Array.from(presentMembers).map(id => {
                const m = members.find(mem => mem.id === id);
                return { id, name: `${m?.firstName} ${m?.lastName}` };
            });

            const attendanceRef = doc(db, 'fellowships', fellowship.name, 'attendance', date);
            await setDoc(attendanceRef, {
                date: date,
                timestamp: Timestamp.now(),
                totalPresent: attendees.length,
                totalMembers: members.length,
                attendees: attendees,
                leader: fellowship.leaders,
                type: 'Weekly Meeting'
            }, { merge: true });

            setSuccessMsg('Attendance saved successfully!');
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (error) {
            console.error("Error saving attendance:", error);
            alert("Failed to save attendance. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    if (!fellowship) return null;

    if (!fellowship.isLeader) {
        return (
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaHistory className="text-3xl" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">My Attendance</h2>
                    <p className="text-gray-500 mb-6">
                        View your attendance history for {fellowship.name}.
                    </p>
                    <div className="border-t border-gray-100 pt-6">
                        <p className="text-sm text-gray-400 italic">Attendance history view is coming soon.</p>
                    </div>
                </div>
            </div>
        );
    }

    // Leader View
    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <FaCalendarCheck className="mr-3 text-blue-600" />
                    Attendance Record
                </h2>
                <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium text-gray-700">Meeting Date:</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
            </div>

            {successMsg && (
                <div className="bg-green-100 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6 flex items-center">
                    <FaCheck className="mr-2" /> {successMsg}
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Member List</span>
                    <span className="text-sm font-medium text-gray-700">
                        Present: <span className="font-bold text-blue-600">{presentMembers.size}</span> / {members.length}
                    </span>
                </div>

                <div className="divide-y divide-gray-50">
                    {members.map(member => {
                        const isPresent = presentMembers.has(member.id);
                        return (
                            <div
                                key={member.id}
                                onClick={() => toggleMember(member.id)}
                                className={`p-4 flex items-center justify-between cursor-pointer transition-colors ${isPresent ? 'bg-blue-50/50' : 'hover:bg-gray-50'
                                    }`}
                            >
                                <div className="flex items-center space-x-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${isPresent ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'
                                        }`}>
                                        {isPresent ? <FaCheck /> : `${member.firstName?.[0] || '?'}${member.lastName?.[0] || ''}`}
                                    </div>
                                    <div>
                                        <p className={`font-medium ${isPresent ? 'text-blue-900' : 'text-gray-900'}`}>
                                            {member.firstName} {member.lastName}
                                        </p>
                                        <p className="text-xs text-gray-500">{member.phone}</p>
                                    </div>
                                </div>
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isPresent ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'
                                    }`}>
                                    {isPresent && <FaCheck className="text-xs" />}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className={`flex items-center px-6 py-3 rounded-lg font-bold text-white transition ${saving ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md'
                            }`}
                    >
                        {saving ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                Saving...
                            </>
                        ) : (
                            <>
                                <FaUserCheck className="mr-2" /> Save Attendance
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HouseAttendance;
