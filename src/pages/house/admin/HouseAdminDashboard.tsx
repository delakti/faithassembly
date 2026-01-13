import React, { useState, useEffect, useRef } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { HiUserGroup, HiDocumentDownload, HiChartPie, HiLocationMarker } from 'react-icons/hi';

import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface Group {
    id: string;
    name: string;
    leaderName: string;
    location: string;
    meetingDay: string;
    membersCount?: number;
}

const HouseAdminDashboard: React.FC = () => {
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
        try {
            // 1. Fetch Groups
            const groupsSnap = await getDocs(collection(db, 'groups'));
            const groupsData = groupsSnap.empty ? mockGroups : groupsSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                membersCount: doc.data().members?.length || 0
            })) as Group[];

            setGroups(groupsData as Group[]);

        } catch (error) {
            console.error("Error fetching superintendent data", error);
            // Fallback to mocks for demo
            setGroups(mockGroups);
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
        <div className="space-y-8 animate-fade-in-up">
            {/* Header Stats */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Overview</h2>
                    <p className="text-gray-500 text-sm">Welcome back, Superintendent.</p>
                </div>
                <div className="flex gap-4 items-center">
                    <input
                        type="month"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="border border-indigo-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                    <button
                        onClick={generatePDF}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95"
                    >
                        <HiDocumentDownload className="w-5 h-5" /> Download Report
                    </button>
                </div>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-indigo-50 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
                            <HiUserGroup className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Active Groups</p>
                            <h3 className="text-3xl font-bold text-gray-800">{activeGroups}</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-green-50 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                            <HiChartPie className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-green-500 uppercase tracking-wider">Total Membership</p>
                            <h3 className="text-3xl font-bold text-gray-800">{totalMembers}</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-blue-50 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                            <HiLocationMarker className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-blue-400 uppercase tracking-wider">Locations</p>
                            <h3 className="text-3xl font-bold text-gray-800">{new Set(groups.map(g => g.location)).size}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Report Content - This part gets captured by PDF */}
            <div ref={reportRef} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-8">
                {/* Header for PDF */}
                <div className="border-b border-gray-100 pb-6 mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 text-center uppercase tracking-wide">Faith Assembly House Fellowship Report</h2>
                    <p className="text-center text-gray-500 font-medium">{format(new Date(selectedMonth), 'MMMM yyyy')}</p>
                </div>

                {/* Groups Summary Table */}
                <div>
                    <h3 className="font-bold text-lg text-gray-800 mb-4 bg-gray-50 p-3 rounded-lg inline-block">Group Overview</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-gray-50 text-gray-500 uppercase font-bold text-xs">
                                <tr>
                                    <th className="p-4 rounded-l-lg">Group Name</th>
                                    <th className="p-4">Leader</th>
                                    <th className="p-4">Location</th>
                                    <th className="p-4">Meeting Day</th>
                                    <th className="p-4 rounded-r-lg text-right">Members</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {groups.map(group => (
                                    <tr key={group.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-bold text-indigo-900">{group.name}</td>
                                        <td className="p-4 text-gray-700">{group.leaderName}</td>
                                        <td className="p-4 text-gray-500">{group.location}</td>
                                        <td className="p-4">
                                            <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-xs font-bold uppercase">{group.meetingDay}</span>
                                        </td>
                                        <td className="p-4 text-right font-mono font-bold text-gray-800">{group.membersCount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Attendance Summary (Placeholder for now) */}
                <div>
                    <h3 className="font-bold text-lg text-gray-800 mb-4 bg-gray-50 p-3 rounded-lg inline-block">Monthly Metrics</h3>
                    <div className="p-8 border-2 border-dashed border-gray-200 rounded-xl text-center">
                        <p className="text-gray-400 text-sm font-medium italic">
                            Detailed attendance logs and qualitative notes for {format(new Date(selectedMonth), 'MMMM')} will be populated here.
                        </p>
                    </div>
                </div>

                {/* Footer for PDF */}
                <div className="pt-8 text-center text-[10px] text-gray-400 mt-12 border-t border-gray-100 uppercase tracking-widest">
                    Generated by Faith Assembly Admin Portal • {new Date().toLocaleDateString()}
                </div>
            </div>
        </div>
    );
};

export default HouseAdminDashboard;
