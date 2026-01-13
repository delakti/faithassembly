import React, { useState, useEffect, useRef } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { HiUserGroup, HiDocumentDownload, HiChartPie, HiLocationMarker } from 'react-icons/hi';

import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import html2canvas from 'html2canvas'; // Will need to be installed or handled if missing
import jsPDF from 'jspdf'; // Will need to be installed

interface Group {
    id: string;
    name: string;
    leaderName: string;
    location: string;
    meetingDay: string;
    membersCount?: number;
}



const HouseSuperintendent: React.FC = () => {
    const db = getFirestore();
    const [groups, setGroups] = useState<Group[]>([]);
    const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
    const reportRef = useRef<HTMLDivElement>(null);

    // Mock data for initial dev if fetch fails or is empty
    const mockGroups = [
        { id: '1', name: 'Grace House', leaderName: 'Bro. John', location: 'Barking', meetingDay: 'Tuesday', membersCount: 12 },
        { id: '2', name: 'Peace House', leaderName: 'Sis. Mary', location: 'Dagenham', meetingDay: 'Wednesday', membersCount: 8 },
        { id: '3', name: 'Joy House', leaderName: 'Deacon Paul', location: 'Romford', meetingDay: 'Thursday', membersCount: 15 },
    ];

    useEffect(() => {
        fetchData();
    }, [selectedMonth]);

    const fetchData = async () => {
        // setLoading(true);
        try {
            // 1. Fetch Groups
            // Assuming collection is 'groups' based on plan. Adjust if 'life_groups' etc.
            const groupsSnap = await getDocs(collection(db, 'groups'));
            const groupsData = groupsSnap.empty ? mockGroups : groupsSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                membersCount: doc.data().members?.length || 0
            })) as Group[];

            setGroups(groupsData as Group[]);

            // 2. Fetch Attendance for selected month
            // This assumes an 'attendance' collection. Need to verify schema later.
            // For now, allow mock/empty to render UI
            // const q = query(collection(db, 'attendance'), where('date', '>=', start), where('date', '<=', end));
            // For MVP UI, we'll simulate some records if empty
            // setAttendance([]);

        } catch (error) {
            console.error("Error fetching superintendent data", error);
            // Fallback to mocks for demo
            setGroups(mockGroups);
        } finally {
            // setLoading(false);
        }
    };

    const generatePDF = async () => {
        if (!reportRef.current) return;

        try {
            toast.loading("Generating Report...");
            const canvas = await html2canvas(reportRef.current, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`House_Fellowship_Report_${selectedMonth}.pdf`);
            toast.dismiss();
            toast.success("Report Downloaded");
        } catch (error) {
            console.error(error);
            toast.dismiss();
            toast.error("Failed to generate PDF");
        }
    };

    const totalMembers = groups.reduce((acc, g) => acc + (g.membersCount || 0), 0);
    const activeGroups = groups.length;

    return (
        <div className="space-y-8 p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-serif text-slate-900">Fellowship Superintendent</h1>
                    <p className="text-slate-500">Overview and reporting for all House Fellowships.</p>
                </div>
                <div className="flex gap-4 items-center">
                    <input
                        type="month"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="border border-slate-300 rounded-lg p-2 text-sm"
                    />
                    <button
                        onClick={generatePDF}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-indigo-700 shadow-sm"
                    >
                        <HiDocumentDownload className="w-5 h-5" /> Download Report
                    </button>
                </div>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
                            <HiUserGroup className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-400 uppercase">Active Groups</p>
                            <h3 className="text-3xl font-bold text-slate-800">{activeGroups}</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                            <HiChartPie className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-400 uppercase">Total Membership</p>
                            <h3 className="text-3xl font-bold text-slate-800">{totalMembers}</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                            <HiLocationMarker className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-400 uppercase">Locations</p>
                            <h3 className="text-3xl font-bold text-slate-800">{new Set(groups.map(g => g.location)).size}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Report Content - This part gets captured by PDF */}
            <div ref={reportRef} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-8">
                {/* Header for PDF */}
                <div className="border-b border-slate-100 pb-6 mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 text-center uppercase tracking-wide">Faith Assembly House Fellowship Report</h2>
                    <p className="text-center text-slate-500 font-medium">{format(new Date(selectedMonth), 'MMMM yyyy')}</p>
                </div>

                {/* Groups Summary Table */}
                <div>
                    <h3 className="font-bold text-lg text-slate-800 mb-4 bg-slate-50 p-2 rounded">Group Overview</h3>
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-100 text-slate-500 uppercase">
                            <tr>
                                <th className="p-3 rounded-l">Group Name</th>
                                <th className="p-3">Leader</th>
                                <th className="p-3">Location</th>
                                <th className="p-3">Meeting Day</th>
                                <th className="p-3 rounded-r text-right">Members</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {groups.map(group => (
                                <tr key={group.id}>
                                    <td className="p-3 font-bold text-slate-700">{group.name}</td>
                                    <td className="p-3">{group.leaderName}</td>
                                    <td className="p-3">{group.location}</td>
                                    <td className="p-3">{group.meetingDay}</td>
                                    <td className="p-3 text-right bg-slate-50 font-mono">{group.membersCount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Attendance Summary (Placeholder for now) */}
                <div>
                    <h3 className="font-bold text-lg text-slate-800 mb-4 bg-slate-50 p-2 rounded">Monthly Attendance Summary</h3>
                    <div className="p-4 border border-slate-100 rounded text-center text-slate-500 italic">
                        Detailed attendance logs for {format(new Date(selectedMonth), 'MMMM')} will appear here.
                    </div>
                </div>

                {/* Footer for PDF */}
                <div className="pt-12 text-center text-xs text-slate-400 mt-12 border-t border-slate-100">
                    Generated by Faith Assembly Admin Portal • {new Date().toLocaleDateString()}
                </div>
            </div>
        </div>
    );
};

export default HouseSuperintendent;
