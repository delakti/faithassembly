import React, { useState } from 'react';
import { HiChip, HiExclamation, HiCheck, HiPlus, HiTag } from 'react-icons/hi';
import { toast } from 'react-hot-toast';

const EQUIPMENT = [
    {
        id: 1,
        name: "Sony A7III (Cam A)",
        status: "Operational",
        category: "Camera",
        lastCheck: "Dec 01, 2025",
        notes: "Lens cap missing."
    },
    {
        id: 2,
        name: "Behringer X32",
        status: "Maintenance",
        category: "Audio",
        lastCheck: "Nov 28, 2025",
        notes: "Fader 4 sticking. Needs cleaning."
    },
    {
        id: 3,
        name: "Blackmagic ATEM Mini",
        status: "Operational",
        category: "Video",
        lastCheck: "Dec 03, 2025",
        notes: "Firmware updated to v8.6."
    },
    {
        id: 4,
        name: "Sennheiser G4 (Mic 2)",
        status: "Critical",
        category: "Audio",
        lastCheck: "Dec 03, 2025",
        notes: "Intermittent dropouts. Do not use."
    }
];

const MediaEquipment: React.FC = () => {
    const [equipment, setEquipment] = useState(EQUIPMENT);

    const reportIssue = (id: number) => {
        setEquipment(prev => prev.map(e => e.id === id ? { ...e, status: 'Reported' } : e));
        toast('Issue flagged to Tech Lead.', { icon: '⚠️' });
    };

    return (
        <div className="space-y-8 font-sans">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <span className="text-cyan-500 font-mono font-bold text-xs mb-2 block tracking-widest uppercase">Inventory Control</span>
                    <h1 className="text-3xl font-bold text-white uppercase tracking-tight">Equipment Log</h1>
                </div>

                <button className="px-6 py-3 bg-slate-800 border border-slate-700 text-white font-bold rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-2 font-mono uppercase text-sm">
                    <HiPlus className="w-5 h-5" /> Add Item
                </button>
            </div>

            <div className="grid gap-4">
                {equipment.map((item) => (
                    <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-slate-700 transition-all">
                        <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center border flex-shrink-0 ${item.status === 'Operational' ? 'bg-green-500/10 border-green-500/20 text-green-500' :
                                    item.status === 'Maintenance' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500' :
                                        'bg-red-500/10 border-red-500/20 text-red-500'
                                }`}>
                                <HiChip className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-lg flex items-center gap-3">
                                    {item.name}
                                    <span className="text-[10px] font-mono text-slate-500 uppercase px-2 py-0.5 bg-slate-950 rounded border border-slate-800 flex items-center gap-1">
                                        <HiTag className="w-3 h-3" /> {item.category}
                                    </span>
                                </h3>
                                <p className="text-slate-400 text-sm mt-1">{item.notes}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 justify-between md:justify-end border-t md:border-t-0 border-slate-800 pt-4 md:pt-0">
                            <div className="text-right">
                                <span className={`block text-xs font-bold uppercase tracking-wide mb-1 ${item.status === 'Operational' ? 'text-green-500' :
                                        item.status === 'Maintenance' ? 'text-yellow-500' :
                                            'text-red-500'
                                    }`}>
                                    Status: {item.status}
                                </span>
                                <span className="text-[10px] font-mono text-slate-600 uppercase">Checked: {item.lastCheck}</span>
                            </div>

                            {item.status === 'Operational' ? (
                                <button
                                    onClick={() => reportIssue(item.id)}
                                    className="px-4 py-2 border border-red-900/50 text-red-500 text-xs font-bold uppercase rounded hover:bg-red-900/20 transition-colors flex items-center gap-2"
                                >
                                    <HiExclamation className="w-4 h-4" /> Report
                                </button>
                            ) : (
                                <button className="px-4 py-2 bg-slate-950 text-slate-600 text-xs font-bold uppercase rounded cursor-not-allowed flex items-center gap-2">
                                    <HiCheck className="w-4 h-4" /> Pending
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MediaEquipment;
