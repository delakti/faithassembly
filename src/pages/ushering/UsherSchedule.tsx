import React, { useState } from 'react';
import { HiCalendar, HiUserGroup, HiChevronLeft, HiChevronRight, HiCheck, HiSwitchHorizontal } from 'react-icons/hi';
import { toast } from 'react-hot-toast';

// Mock Data for Development
const SCHEDULE_DATA = [
    {
        id: 1,
        date: "Sunday, Jan 14",
        service: "Main Service",
        time: "09:30 AM",
        team: "Team Alpha (Week A)",
        status: "active",
        duties: [
            { position: "Main Entrance (Lead)", assignee: "Dcn. Michael", status: "confirmed" },
            { position: "Sanctuary Left Aisle", assignee: "Sis. Sarah", status: "confirmed" },
            { position: "Sanctuary Right Aisle", assignee: "Bro. David", status: "pending" },
            { position: "Balcony", assignee: "Bro. John", status: "confirmed" },
            { position: "Overflow Room", assignee: "Sis. Mary", status: "swap_requested" }
        ]
    },
    {
        id: 2,
        date: "Wednesday, Jan 17",
        service: "Bible Study",
        time: "07:00 PM",
        team: "Midweek Squad",
        status: "upcoming",
        duties: [
            { position: "Main Entrance", assignee: "Bro. Peter", status: "confirmed" },
            { position: "Sanctuary", assignee: "Sis. Ruth", status: "confirmed" }
        ]
    }
];

const UsherSchedule: React.FC = () => {
    const [selectedService, setSelectedService] = useState(SCHEDULE_DATA[0]);

    const handleConfirm = (position: string) => {
        toast.success(`Confirmed duty: ${position}`);
    };

    const handleSwapRequest = (position: string) => {
        toast.success(`Swap requested for: ${position}`);
    };

    return (
        <div className="space-y-6 font-sans text-slate-900">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-slate-900">Duty Rota</h1>
                    <p className="text-slate-500 font-medium">Service Assignments & Schedule</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 font-bold text-sm shadow-sm hover:bg-slate-50 flex items-center gap-2">
                        <HiCalendar className="w-4 h-4" /> Sync Calendar
                    </button>
                    <button className="px-4 py-2 bg-amber-600 text-white rounded-lg font-bold text-sm shadow hover:bg-amber-500">
                        Download PDF
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Service Selector / Calendar List */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-slate-400 uppercase text-xs tracking-widest">Upcoming Services</h3>
                        <div className="flex gap-1">
                            <button className="p-1 hover:bg-slate-100 rounded text-slate-400"><HiChevronLeft /></button>
                            <button className="p-1 hover:bg-slate-100 rounded text-slate-400"><HiChevronRight /></button>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        {SCHEDULE_DATA.map((service) => (
                            <button
                                key={service.id}
                                onClick={() => setSelectedService(service)}
                                className={`w-full text-left p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-all ${selectedService.id === service.id ? 'bg-amber-50 border-l-4 border-l-amber-500' : 'border-l-4 border-l-transparent'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${service.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                                        }`}>
                                        {service.status === 'active' ? 'THIS WEEK' : 'UPCOMING'}
                                    </span>
                                    <span className="text-xs font-medium text-slate-400">{service.team}</span>
                                </div>
                                <h4 className="font-bold text-slate-900 text-sm mt-2">{service.service}</h4>
                                <p className="text-slate-500 text-xs mt-0.5">{service.date} • {service.time}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Duty Details */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-5">
                            <HiUserGroup className="w-32 h-32 text-slate-900" />
                        </div>

                        <div className="relative z-10">
                            <h2 className="text-xl font-bold text-slate-900 mb-1">{selectedService.service}</h2>
                            <p className="text-slate-500 text-sm font-medium mb-6 flex items-center gap-2">
                                <span className="bg-slate-100 px-2 py-1 rounded text-slate-600">{selectedService.date}</span>
                                <span className="text-slate-300">•</span>
                                <span className="text-amber-600 font-bold">{selectedService.team}</span>
                            </p>

                            <div className="space-y-3">
                                {selectedService.duties.map((duty, index) => (
                                    <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100 group hover:border-amber-200 transition-colors">

                                        <div className="mb-3 sm:mb-0">
                                            <h5 className="font-bold text-slate-800 text-sm">{duty.position}</h5>
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500">
                                                    {duty.assignee.charAt(0)}
                                                </div>
                                                <span className="text-sm text-slate-600">{duty.assignee}</span>
                                                {duty.status === 'confirmed' && <HiCheck className="w-4 h-4 text-green-500" />}
                                                {duty.status === 'pending' && <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>}
                                                {duty.status === 'swap_requested' && <span className="text-[10px] bg-red-100 text-red-600 px-1.5 rounded border border-red-200 font-bold">SWAP REQUESTED</span>}
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            {duty.status === 'pending' && (
                                                <button
                                                    onClick={() => handleConfirm(duty.position)}
                                                    className="px-3 py-1.5 bg-green-600 text-white text-xs font-bold rounded shadow-sm hover:bg-green-500 flex items-center gap-1"
                                                >
                                                    <HiCheck /> Confirm
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleSwapRequest(duty.position)}
                                                className="px-3 py-1.5 bg-white border border-slate-200 text-slate-500 text-xs font-bold rounded hover:bg-slate-50 hover:text-red-500 transition-colors flex items-center gap-1"
                                            >
                                                <HiSwitchHorizontal /> Swap
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UsherSchedule;
