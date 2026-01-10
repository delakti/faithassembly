import React, { useState, useEffect } from 'react';
import { HiCalendar, HiUser, HiRefresh, HiCheckCircle, HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import type { MediaService } from '../../types/media';

const ROLES = [
    { key: 'sound', label: 'FOH Sound' },
    { key: 'visuals', label: 'ProPresenter' },
    { key: 'stream', label: 'Livestream' },
    { key: 'camera1', label: 'Camera 1' },
    { key: 'camera2', label: 'Camera 2' },
    { key: 'photo', label: 'Photography' },
];

const MediaSchedule: React.FC = () => {
    const [currentWeek, setCurrentWeek] = useState(0);
    const [services, setServices] = useState<MediaService[]>([]);

    useEffect(() => {
        const q = query(collection(db, 'media_services'), orderBy('date', 'asc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setServices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MediaService)));
        });
        return () => unsubscribe();
    }, []);

    const handleSwap = (role: string) => {
        toast(`Swap request for ${role} sent.`, { icon: '🔄' });
    };

    const handleVolunteer = async (serviceId: string, roleKey: string, roleLabel: string) => {
        if (!auth.currentUser) {
            toast.error("Please login to volunteer");
            return;
        }

        try {
            const serviceRef = doc(db, 'media_services', serviceId);

            await updateDoc(serviceRef, {
                [`team.${roleKey}`]: auth.currentUser.displayName || "Volunteer"
            });

            toast.success(`You volunteered for ${roleLabel}!`);
        } catch (error) {
            toast.error("Failed to volunteer");
            console.error(error);
        }
    };

    return (
        <div className="space-y-8 font-sans">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <span className="text-cyan-500 font-mono font-bold text-xs mb-2 block tracking-widest uppercase">Rota Management</span>
                    <h1 className="text-3xl font-bold text-white uppercase tracking-tight">Production Schedule</h1>
                </div>

                <div className="flex items-center gap-4 bg-slate-900 border border-slate-800 rounded-lg p-1">
                    <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors" onClick={() => setCurrentWeek(Math.max(0, currentWeek - 1))}>
                        <HiChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="font-mono text-sm font-bold text-white px-4">
                        Week {49 + currentWeek} / 2025
                    </span>
                    <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors" onClick={() => setCurrentWeek(currentWeek + 1)}>
                        <HiChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                {services.length === 0 && <p className="text-slate-500 italic">No services scheduled.</p>}
                {services.map((service) => (
                    <div key={service.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                        {/* Service Header */}
                        <div className="bg-slate-950 p-6 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded bg-slate-900 border border-slate-800 flex flex-col items-center justify-center text-center">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase">DEC</span>
                                    {/* Assuming date string format like "Sunday, Dec 03" */}
                                    <span className="text-lg font-bold text-white">{service.date.split ? service.date.split(' ')[2] : '00'}</span>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">{service.event}</h2>
                                    <div className="flex items-center gap-3 text-sm text-slate-500 font-mono">
                                        <span className="flex items-center gap-1"><HiCalendar className="w-4 h-4" /> {service.time}</span>
                                        <span className="text-slate-700">|</span>
                                        <span className="text-cyan-500">{service.series}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button className="px-4 py-2 border border-slate-700 text-slate-400 text-xs font-bold font-mono uppercase rounded hover:border-white hover:text-white transition-colors">
                                    Download Run Sheet
                                </button>
                            </div>
                        </div>

                        {/* Roles Grid */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-800">
                            {ROLES.map((roleDef) => {
                                const assignee = (service.team as any)[roleDef.key];
                                const isAssignedToMe = assignee === 'You' || assignee === auth.currentUser?.displayName;
                                const isOpen = assignee === 'Open';
                                const isNotNeeded = assignee === '-';

                                return (
                                    <div key={roleDef.key} className={`bg-slate-900 p-6 flex items-start justify-between group ${isAssignedToMe ? 'bg-cyan-900/10' : ''
                                        }`}>
                                        <div>
                                            <span className="text-xs font-mono font-bold text-slate-500 uppercase block mb-1">{roleDef.label}</span>
                                            {isNotNeeded ? (
                                                <span className="text-slate-700 font-mono text-sm uppercase">-- Not Required --</span>
                                            ) : isOpen ? (
                                                <button
                                                    onClick={() => handleVolunteer(service.id, roleDef.key, roleDef.label)}
                                                    className="px-3 py-1 bg-green-500/10 text-green-500 border border-green-500/20 text-xs font-bold uppercase rounded hover:bg-green-500/20 transition-colors"
                                                >
                                                    Volunteer
                                                </button>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${isAssignedToMe ? 'bg-cyan-500' : 'bg-slate-600'}`}></div>
                                                    <span className={`font-bold ${isAssignedToMe ? 'text-cyan-400' : 'text-white'}`}>
                                                        {assignee}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {!isNotNeeded && !isOpen && (
                                            isAssignedToMe ? (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleSwap(roleDef.label)}
                                                        className="text-slate-600 hover:text-yellow-500 transition-colors"
                                                        title="Request Swap"
                                                    >
                                                        <HiRefresh className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        className="text-cyan-500"
                                                        title="Confirmed"
                                                    >
                                                        <HiCheckCircle className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <button className="text-slate-700 hover:text-slate-500 transition-colors">
                                                    <HiUser className="w-5 h-5" />
                                                </button>
                                            )
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MediaSchedule;
