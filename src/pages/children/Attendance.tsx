import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, query, getDocs, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { FaUserCheck, FaUserTimes, FaSave, FaFilter, FaCheckDouble } from 'react-icons/fa';

const Attendance: React.FC = () => {
    const [children, setChildren] = useState<any[]>([]);
    const [filteredChildren, setFilteredChildren] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterGroup, setFilterGroup] = useState('All');
    const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
    const [presentList, setPresentList] = useState<Set<string>>(new Set());
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchChildren();
    }, []);

    useEffect(() => {
        filterData();
    }, [filterGroup, children]);

    const fetchChildren = async () => {
        try {
            const q = query(collection(db, 'children'), orderBy('firstName', 'asc'));
            const snap = await getDocs(q);
            const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            setChildren(data);
            setFilteredChildren(data);
        } catch (error) {
            console.error("Error fetching children:", error);
        } finally {
            setLoading(false);
        }
    };

    const filterData = () => {
        if (filterGroup === 'All') {
            setFilteredChildren(children);
        } else {
            setFilteredChildren(children.filter(child => child.assignedGroup === filterGroup));
        }
    };

    const toggleAttendance = (childId: string) => {
        const newPresentList = new Set(presentList);
        if (newPresentList.has(childId)) {
            newPresentList.delete(childId);
        } else {
            newPresentList.add(childId);
        }
        setPresentList(newPresentList);
    };

    const markAllPresent = () => {
        const allIds = new Set(filteredChildren.map(c => c.id));
        setPresentList(allIds);
    };

    const handleSubmit = async () => {
        if (presentList.size === 0) {
            if (!window.confirm("No children marked present. Save empty attendance record?")) return;
        }

        setSubmitting(true);
        try {
            const batchData = {
                date: attendanceDate,
                group: filterGroup,
                presentCount: presentList.size,
                totalChildren: filteredChildren.length,
                attendees: Array.from(presentList),
                createdAt: serverTimestamp()
            };

            await addDoc(collection(db, 'children_attendance'), batchData);
            alert(`Attendance saved! ${presentList.size} children marked present.`);
            setPresentList(new Set()); // Reset for next class/session
        } catch (error) {
            console.error("Error saving attendance:", error);
            alert("Failed to save attendance.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Attendance Tracker</h1>
                    <p className="text-gray-500">Record attendance for Sunday services and events.</p>
                </div>
                <div className="bg-white p-2 border rounded-xl flex items-center shadow-sm">
                    <span className="text-sm font-bold text-gray-500 mr-2 pl-2">DATE:</span>
                    <input
                        type="date"
                        value={attendanceDate}
                        onChange={(e) => setAttendanceDate(e.target.value)}
                        className="p-1 outline-none text-gray-800 font-bold"
                    />
                </div>
            </div>

            {/* Controls */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="relative w-full md:w-64">
                    <FaFilter className="absolute left-3 top-3.5 text-gray-400" />
                    <select
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-200 outline-none appearance-none bg-white font-medium text-gray-700"
                        value={filterGroup}
                        onChange={e => setFilterGroup(e.target.value)}
                    >
                        <option value="All">All Groups</option>
                        <option value="Creche">Creche (0-4)</option>
                        <option value="Primary">Primary (5-11)</option>
                        <option value="Teens">Teens (12-18)</option>
                    </select>
                </div>

                <div className="flex space-x-3 w-full md:w-auto">
                    <button
                        onClick={markAllPresent}
                        className="flex-1 md:flex-none flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition"
                    >
                        <FaCheckDouble className="mr-2" /> Mark All Present
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="flex-1 md:flex-none flex items-center justify-center px-6 py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 shadow-md transition disabled:opacity-50"
                    >
                        {submitting ? 'Saving...' : <><FaSave className="mr-2" /> Save Record</>}
                    </button>
                </div>
            </div>

            {/* List */}
            {loading ? (
                <div className="text-center py-12 text-gray-400">Loading list...</div>
            ) : filteredChildren.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                    <p className="text-gray-500">No children found in this group.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredChildren.map((child: any) => {
                        const isPresent = presentList.has(child.id);
                        return (
                            <div
                                key={child.id}
                                onClick={() => toggleAttendance(child.id)}
                                className={`
                                    cursor-pointer p-4 rounded-xl border flex items-center justify-between transition-all select-none
                                    ${isPresent
                                        ? 'bg-green-50 border-green-200 shadow-sm'
                                        : 'bg-white border-gray-200 hover:border-sky-300'
                                    }
                                `}
                            >
                                <div className="flex items-center space-x-3">
                                    <div className={`
                                        w-10 h-10 rounded-full flex items-center justify-center font-bold text-white
                                        ${isPresent ? 'bg-green-500' : 'bg-gray-300'}
                                    `}>
                                        {child.firstName[0]}{child.lastName[0]}
                                    </div>
                                    <div>
                                        <h3 className={`font-bold ${isPresent ? 'text-green-800' : 'text-gray-700'}`}>{child.firstName} {child.lastName}</h3>
                                        <p className="text-xs text-gray-500">{child.assignedGroup}</p>
                                    </div>
                                </div>
                                <div className={`
                                    w-8 h-8 rounded-full flex items-center justify-center
                                    ${isPresent ? 'text-green-600 bg-white' : 'text-gray-300'}
                                `}>
                                    {isPresent ? <FaUserCheck /> : <FaUserTimes />}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Attendance;
