import React from 'react';
import { HiSpeakerphone, HiExclamation } from 'react-icons/hi';

const ANNOUNCEMENTS = [
    {
        id: 1,
        title: "Firmware Update Required: All Cameras",
        date: "Dec 05, 2025",
        author: "Tech Lead",
        priority: "high",
        content: "Please ensure all Sony A7III bodies are updated to v4.0 before Sunday service. The update fixes the HDMI output stability issue we faced last week."
    },
    {
        id: 2,
        title: "New Lower Thirds Style Guide",
        date: "Dec 02, 2025",
        author: "Creative Director",
        priority: "medium",
        content: "We have refreshed the lower thirds for the 'Kingdom Come' series. Please review the updated style guide in the Resources folder. Font size for names has been increased to 42pt."
    },
    {
        id: 3,
        title: "Cable Management Reminder",
        date: "Nov 28, 2025",
        author: "Stage Manager",
        priority: "low",
        content: "After service, please ensure all XLR cables are coiled properly using the over-under method. We found several tangled cables on stage left."
    }
];

const MediaAnnouncements: React.FC = () => {
    return (
        <div className="space-y-8 font-sans">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <span className="text-cyan-500 font-mono font-bold text-xs mb-2 block tracking-widest uppercase"> production Briefs</span>
                    <h1 className="text-3xl font-bold text-white uppercase tracking-tight">Tech Intel</h1>
                </div>
            </div>

            <div className="space-y-4">
                {ANNOUNCEMENTS.map((item) => (
                    <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 md:p-8 relative overflow-hidden group hover:border-slate-700 transition-all">
                        {item.priority === 'high' && (
                            <div className="absolute top-0 right-0 p-4">
                                <span className="flex items-center gap-1 text-red-500 text-[10px] font-bold font-mono uppercase tracking-widest border border-red-900/50 bg-red-900/10 px-2 py-1 rounded">
                                    <HiExclamation className="w-3 h-3" /> Critical
                                </span>
                            </div>
                        )}

                        <div className="flex items-start gap-4 mb-4">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center border flex-shrink-0 ${item.priority === 'high' ? 'bg-red-500/10 border-red-500/20 text-red-500' :
                                item.priority === 'medium' ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-500' :
                                    'bg-slate-800 border-slate-700 text-slate-500'
                                }`}>
                                <HiSpeakerphone className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">{item.title}</h3>
                                <div className="flex items-center gap-3 text-xs font-mono text-slate-500 uppercase">
                                    <span>{item.date}</span>
                                    <span className="text-slate-700">|</span>
                                    <span className="text-slate-400">Auth: {item.author}</span>
                                </div>
                            </div>
                        </div>

                        <p className="text-slate-400 leading-relaxed ml-14 text-sm md:text-base border-l-2 border-slate-800 pl-4">
                            {item.content}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MediaAnnouncements;
