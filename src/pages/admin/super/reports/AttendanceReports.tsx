import React, { useState, useEffect } from 'react';
import {
    getFirestore,
    collection,
    query,
    orderBy,
    getDocs,
    Timestamp
} from 'firebase/firestore';
import { HiDownload, HiSearch, HiCalendar } from 'react-icons/hi';
import { toast } from 'react-hot-toast';

interface AttendanceRecord {
    id: string;
    userId: string;
    userName: string;
    method: string;
    timestamp: Timestamp;
    serviceDate?: string;
}

const AttendanceReports: React.FC = () => {
    const [records, setRecords] = useState<AttendanceRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterDate, setFilterDate] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    // Summary Stats
    const [totalAttendees, setTotalAttendees] = useState(0);
    const [uniqueAttendees, setUniqueAttendees] = useState(0);

    const db = getFirestore();

    const fetchAttendance = async () => {
        setLoading(true);
        try {
            let q = query(collection(db, 'attendance'), orderBy('timestamp', 'desc'));
            const snapshot = await getDocs(q);
            const data: AttendanceRecord[] = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as AttendanceRecord[];

            setRecords(data);
        } catch (error) {
            console.error("Error loading reports", error);
            toast.error("Failed to load attendance data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, []);

    // Filter Logic
    const filteredRecords = records.filter(record => {
        const dateMatch = filterDate ? (record.serviceDate === filterDate || (record.timestamp?.toDate().toISOString().split('T')[0] === filterDate)) : true;
        const searchMatch = record.userName?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
        return dateMatch && searchMatch;
    });

    // Recalculate stats when filtered
    useEffect(() => {
        setTotalAttendees(filteredRecords.length);
        const unique = new Set(filteredRecords.map(r => r.userId)).size;
        setUniqueAttendees(unique);
    }, [filteredRecords]);


    const handleExport = () => {
        // Simple CSV Export
        const headers = ['User Name', 'User ID', 'Time', 'Method', 'Service Date'];
        const csvContent = [
            headers.join(','),
            ...filteredRecords.map(r => [
                `"${r.userName}"`,
                r.userId,
                r.timestamp?.toDate ? r.timestamp.toDate().toLocaleString() : 'N/A',
                r.method,
                r.serviceDate || ''
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `attendance_report_${new Date().toISOString()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6 font-sans text-slate-900">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Attendance Reports</h1>
                    <p className="text-slate-500">View and export service attendance logs.</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={fetchAttendance} className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-medium">
                        Refresh
                    </button>
                    <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm font-medium">
                        <HiDownload className="w-5 h-5" />
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Total Check-Ins</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{totalAttendees}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Unique People</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{uniqueAttendees}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Date Filter</p>
                    <p className="text-xl font-bold text-slate-700 mt-2">
                        {filterDate ? new Date(filterDate).toLocaleDateString(undefined, { dateStyle: 'medium' }) : 'All Time'}
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative w-full md:w-64">
                    <HiSearch className="absolute left-3 top-3 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search person..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <HiCalendar className="text-slate-400" />
                    <input
                        type="date"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                        className="border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                {filterDate && (
                    <button onClick={() => setFilterDate('')} className="text-xs text-red-500 hover:text-red-700 font-bold uppercase">
                        Clear Date
                    </button>
                )}
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="p-4 font-semibold text-slate-600">Name</th>
                            <th className="p-4 font-semibold text-slate-600">Date/Time</th>
                            <th className="p-4 font-semibold text-slate-600">Method</th>
                            <th className="p-4 font-semibold text-slate-600">Service Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr><td colSpan={4} className="p-8 text-center text-slate-400">Loading records...</td></tr>
                        ) : filteredRecords.length === 0 ? (
                            <tr><td colSpan={4} className="p-8 text-center text-slate-400">No records found matching your filters.</td></tr>
                        ) : (
                            filteredRecords.map((record) => (
                                <tr key={record.id} className="hover:bg-slate-50">
                                    <td className="p-4 font-bold text-slate-900">{record.userName || 'Anonymous'}</td>
                                    <td className="p-4 text-slate-600">
                                        {record.timestamp?.toDate ? record.timestamp.toDate().toLocaleString() : 'N/A'}
                                    </td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 bg-gray-100 rounded text-xs font-mono text-gray-600">
                                            {record.method}
                                        </span>
                                    </td>
                                    <td className="p-4 text-slate-600">{record.serviceDate || '-'}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AttendanceReports;
