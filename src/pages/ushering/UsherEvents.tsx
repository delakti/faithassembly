import React, { useState } from 'react';
import { HiAcademicCap, HiCalendar, HiVideoCamera, HiDownload } from 'react-icons/hi';

interface TrainingEvent {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    type: 'live' | 'online';
    mandatory: boolean;
}

interface Resource {
    id: string;
    title: string;
    type: 'pdf' | 'video';
    size?: string;
    duration?: string;
}

const UsherEvents: React.FC = () => {
    // Mock Data
    const [trainings] = useState<TrainingEvent[]>([
        {
            id: '1',
            title: 'Emergency Evacuation Procedures',
            description: 'Mandatory drill and protocol review for all squad leaders and senior ushers.',
            date: 'Saturday, Feb 10th',
            time: '10:00 AM - 12:00 PM',
            location: 'Main Sanctuary',
            type: 'live',
            mandatory: true
        },
        {
            id: '2',
            title: 'Excellence in Hospitality',
            description: 'Guest speaker workshop on delivering world-class service in a church setting.',
            date: 'Tuesday, Feb 13th',
            time: '07:00 PM - 08:30 PM',
            location: 'Youth Hall',
            type: 'live',
            mandatory: false
        }
    ]);

    const [resources] = useState<Resource[]>([
        { id: '1', title: 'Usher Handbook 2024.pdf', type: 'pdf', size: '2.4 MB' },
        { id: '2', title: 'Offering Collection Protocol.mp4', type: 'video', duration: '5:30' },
        { id: '3', title: 'Radio Etiquette Guide.pdf', type: 'pdf', size: '1.1 MB' }
    ]);

    return (
        <div className="space-y-8 font-sans pb-20 max-w-6xl mx-auto">
            <header>
                <h1 className="text-3xl font-serif font-bold text-slate-900">Training & Events</h1>
                <p className="text-slate-500 font-medium mt-1">Equipping the team for excellence.</p>
            </header>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Upcoming Trainings List */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <HiCalendar className="text-amber-600" /> Upcoming Sessions
                    </h2>
                    <div className="space-y-4">
                        {trainings.map(training => (
                            <div key={training.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6">
                                <div className="flex-none flex flex-col items-center justify-center w-20 h-20 bg-slate-50 rounded-lg border border-slate-100 text-center">
                                    <span className="text-xs font-bold text-slate-500 uppercase">{training.date.split(',')[0]}</span>
                                    <span className="text-2xl font-bold text-slate-900">{training.date.split(' ')[1]}</span>
                                    <span className="text-xs font-bold text-slate-500 uppercase">{training.date.split(' ')[2]}</span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        {training.mandatory && (
                                            <span className="bg-red-100 text-red-700 text-[10px] font-bold uppercase px-2 py-0.5 rounded border border-red-200">Mandatory</span>
                                        )}
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${training.type === 'live' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-blue-100 text-blue-700 border-blue-200'}`}>
                                            {training.type}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-1">{training.title}</h3>
                                    <p className="text-slate-600 text-sm mb-3">{training.description}</p>
                                    <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                                        <span className="flex items-center gap-1"><HiClock className="w-4 h-4" /> {training.time}</span>
                                        <span className="flex items-center gap-1"><HiLocationMarker className="w-4 h-4" /> {training.location}</span>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <button className="w-full md:w-auto px-6 py-2 bg-white border-2 border-slate-100 text-slate-600 font-bold rounded-lg hover:border-amber-500 hover:text-amber-600 transition-colors">
                                        Register
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Training Resources */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <HiDownload className="text-amber-600" /> Resources
                    </h2>
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                        {resources.map(res => (
                            <div key={res.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 group cursor-pointer transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${res.type === 'pdf' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                                        {res.type === 'pdf' ? <HiDocumentText className="w-5 h-5" /> : <HiVideoCamera className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-1">{res.title}</p>
                                        <p className="text-xs text-slate-400">{res.type === 'pdf' ? res.size : res.duration}</p>
                                    </div>
                                </div>
                                <HiDownload className="w-5 h-5 text-slate-300 group-hover:text-amber-600" />
                            </div>
                        ))}
                        <button className="w-full mt-4 py-2 text-sm font-bold text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors">
                            View All Resources
                        </button>
                    </div>

                    {/* Quick Stat */}
                    <div className="bg-slate-900 p-6 rounded-xl text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <span className="text-slate-400 uppercase text-xs font-bold tracking-widest">My Training Hours</span>
                            <div className="flex items-baseline gap-2 mt-2">
                                <span className="text-3xl font-bold text-amber-500">12.5</span>
                                <span className="text-sm text-slate-400">/ 20 hrs target</span>
                            </div>
                            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-4 overflow-hidden">
                                <div className="bg-amber-500 h-full w-[62%]"></div>
                            </div>
                        </div>
                        <HiAcademicCap className="absolute -bottom-4 -right-4 w-32 h-32 text-slate-800 opacity-50" />
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper Icons not in initial list
import { HiClock, HiLocationMarker, HiDocumentText } from 'react-icons/hi';

export default UsherEvents;
