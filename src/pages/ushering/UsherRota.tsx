import React, { useState, useEffect } from 'react';
import { HiCalendar, HiDownload, HiRefresh, HiCheck, HiSwitchHorizontal, HiPlus } from 'react-icons/hi';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, addDoc, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { toast } from 'react-hot-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Types
interface Assignment {
    role: string;
    userId: string;
    userName: string;
    status: 'confirmed' | 'pending' | 'swap_requested';
}

interface ServiceRota {
    id: string;
    date: string;
    time: string;
    name: string;
    team: string;
    assignments: Assignment[];
}

const UsherRota: React.FC<{ isLeader?: boolean }> = ({ isLeader = true }) => {
    const [services, setServices] = useState<ServiceRota[]>([]);
    const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Fetch Services
    useEffect(() => {
        const q = query(collection(db, 'usher_schedule'), orderBy('date', 'asc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ServiceRota));
            setServices(fetched);
            if (fetched.length > 0 && !selectedServiceId) {
                // Default to first upcoming service (simple logic: first in list for now)
                setSelectedServiceId(fetched[0].id);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [selectedServiceId]);

    const selectedService = services.find(s => s.id === selectedServiceId);

    // Actions
    const handleStatusUpdate = async (serviceId: string, roleIndex: number, newStatus: Assignment['status']) => {
        if (!selectedService) return;
        const updatedAssignments = [...selectedService.assignments];
        updatedAssignments[roleIndex].status = newStatus;

        try {
            await updateDoc(doc(db, 'usher_schedule', serviceId), {
                assignments: updatedAssignments
            });
            toast.success(`Status updated to ${newStatus}`);
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const handleSwapRequest = async (serviceId: string, roleIndex: number) => {
        // In a real app, this might open a modal to select a new user
        // For now, let's just mark status as swap_requested or simulate a swap
        const newName = prompt("Enter new usher name (or leave empty to just flag 'Swap Requested'):");
        if (newName) {
            const updatedAssignments = [...selectedService!.assignments];
            updatedAssignments[roleIndex].userName = newName;
            updatedAssignments[roleIndex].status = 'pending'; // Reset to pending for new person
            try {
                await updateDoc(doc(db, 'usher_schedule', serviceId), {
                    assignments: updatedAssignments
                });
                toast.success("Usher swapped successfully");
            } catch (error) {
                toast.error("Failed to swap");
            }
        } else {
            handleStatusUpdate(serviceId, roleIndex, 'swap_requested');
        }
    };

    const createService = async () => {
        // Quick create for demo
        const date = prompt("Enter Service Date (YYYY-MM-DD):", new Date().toISOString().split('T')[0]);
        if (!date) return;

        const newService = {
            date: date,
            time: "09:30 AM",
            name: "Sunday Service",
            team: "Team Alpha",
            assignments: [
                { role: "Main Entrance (Lead)", userId: "u1", userName: "Unassigned", status: 'pending' },
                { role: "Sanctuary Left Aisle", userId: "u2", userName: "Unassigned", status: 'pending' },
                { role: "Sanctuary Right Aisle", userId: "u3", userName: "Unassigned", status: 'pending' },
                { role: "Balcony", userId: "u4", userName: "Unassigned", status: 'pending' },
                { role: "Overflow Room", userId: "u5", userName: "Unassigned", status: 'pending' }
            ],
            createdAt: serverTimestamp()
        };

        await addDoc(collection(db, 'usher_schedule'), newService);
        toast.success("New Service Added");
    };

    const deleteService = async (id: string) => {
        if (!confirm("Delete this service schedule?")) return;
        await deleteDoc(doc(db, 'usher_schedule', id));
        toast.success("Service Deleted");
        if (selectedServiceId === id) setSelectedServiceId(services[0]?.id || null);
    };

    const generatePDF = () => {
        if (!selectedService) return;
        const doc = new jsPDF();

        doc.setFontSize(22);
        doc.setTextColor(217, 119, 6);
        doc.text("Duty Rota", 14, 20);

        doc.setFontSize(12);
        doc.setTextColor(30);
        doc.text(`${selectedService.name} - ${selectedService.date}`, 14, 30);
        doc.text(`Team: ${selectedService.team}`, 14, 36);

        autoTable(doc, {
            startY: 45,
            head: [['Role', 'Assignee', 'Status']],
            body: selectedService.assignments.map(a => [
                a.role,
                a.userName,
                a.status.replace('_', ' ').toUpperCase()
            ]),
            theme: 'grid',
            headStyles: { fillColor: [30, 41, 59] }
        });

        doc.save(`Rota_${selectedService.date}.pdf`);
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading schedules...</div>;

    return (
        <div className="grid lg:grid-cols-12 gap-6 min-h-[600px]">
            {/* Sidebar List */}
            <div className="lg:col-span-4 space-y-4">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-slate-400 text-xs uppercase tracking-widest">Upcoming Services</h3>
                    {isLeader && (
                        <button onClick={createService} className="text-amber-600 hover:text-amber-700 text-xs font-bold uppercase flex items-center gap-1">
                            <HiPlus className="w-4 h-4" /> New
                        </button>
                    )}
                </div>
                <div className="space-y-3">
                    {services.map(service => (
                        <div
                            key={service.id}
                            onClick={() => setSelectedServiceId(service.id)}
                            className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedServiceId === service.id ? 'bg-amber-50 border-amber-200 shadow-sm ring-1 ring-amber-200' : 'bg-white border-slate-200 hover:border-amber-200'}`}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded text-white mb-2 inline-block ${selectedServiceId === service.id ? 'bg-amber-500' : 'bg-slate-400'}`}>
                                        {new Date(service.date) <= new Date() ? 'THIS WEEK' : 'UPCOMING'}
                                    </span>
                                    <h4 className="font-bold text-slate-900">{service.name}</h4>
                                    <p className="text-xs text-slate-500 font-medium mt-1">
                                        {new Date(service.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })} &bull; {service.time}
                                    </p>
                                </div>
                                {isLeader && (
                                    <button onClick={(e) => { e.stopPropagation(); deleteService(service.id); }} className="text-slate-300 hover:text-red-500 p-1">
                                        &times;
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    {services.length === 0 && (
                        <p className="text-sm text-slate-400 italic p-4 text-center border border-dashed border-slate-200 rounded-xl">No upcoming services scheduled.</p>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-8">
                {selectedService ? (
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm h-full">
                        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
                            <div>
                                <h2 className="text-2xl font-serif font-bold text-slate-900">{selectedService.name}</h2>
                                <p className="text-slate-500 font-medium flex items-center gap-2 mt-1">
                                    <HiCalendar className="text-slate-400" />
                                    {new Date(selectedService.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                                    <span className="text-slate-300">|</span>
                                    <span className="text-amber-600 font-bold">{selectedService.team}</span>
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 font-bold rounded-lg text-sm hover:bg-slate-50 flex items-center gap-2">
                                    <HiRefresh className="w-4 h-4" /> Sync Calendar
                                </button>
                                <button onClick={generatePDF} className="px-4 py-2 bg-amber-600 text-white font-bold rounded-lg text-sm hover:bg-amber-700 flex items-center gap-2 shadow-sm">
                                    <HiDownload className="w-4 h-4" /> Download PDF
                                </button>
                            </div>
                        </header>

                        <div className="space-y-3">
                            {selectedService.assignments.map((assignment, index) => (
                                <div key={index} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 group hover:border-slate-200 transition-all">
                                    <div className="flex items-center gap-4 mb-3 md:mb-0">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${assignment.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                                assignment.status === 'swap_requested' ? 'bg-red-100 text-red-700' :
                                                    'bg-amber-100 text-amber-700'
                                            }`}>
                                            {assignment.userName.charAt(0)}
                                        </div>
                                        <div>
                                            <h5 className="font-bold text-slate-900 text-sm">{assignment.role}</h5>
                                            <div className="flex items-center gap-2">
                                                <span className="text-slate-600 font-medium">{assignment.userName}</span>
                                                {assignment.status === 'confirmed' && <HiCheck className="text-green-500 w-4 h-4" />}
                                                {assignment.status === 'swap_requested' && <span className="bg-red-100 text-red-600 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded">Swap Requested</span>}
                                            </div>
                                        </div>
                                    </div>

                                    {isLeader && (
                                        <div className="flex items-center gap-2">
                                            {assignment.status !== 'confirmed' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(selectedService.id, index, 'confirmed')}
                                                    className="px-3 py-1.5 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700 flex items-center gap-1 shadow-sm"
                                                >
                                                    <HiCheck /> Confirm
                                                </button>
                                            )}

                                            <button
                                                onClick={() => handleSwapRequest(selectedService.id, index)}
                                                className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-50 flex items-center gap-1"
                                            >
                                                <HiSwitchHorizontal /> Swap
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-300 border-2 border-dashed border-slate-200 rounded-2xl p-12">
                        <HiCalendar className="w-16 h-16 mb-4 opacity-20" />
                        <p className="font-bold text-lg">Select a service to view rota</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UsherRota;
