import React from 'react';
import { HiSpeakerphone, HiLightningBolt, HiExclamation } from 'react-icons/hi';

const ANNOUNCEMENTS = [
    {
        id: 1,
        title: "Urgent: City Centre Crusade Mobilization",
        date: "Dec 10, 2025",
        author: "Evangelism Director",
        priority: "critical",
        content: "Brethren, next Saturday's crusade is pivotal. We need FULL mobilization. All leave is cancelled for core team members. We are expecting a harvest of 500 souls. Fasting begins on Wednesday."
    },
    {
        id: 2,
        title: "New Tracts Available: 'The Great Question'",
        date: "Dec 05, 2025",
        author: "Resource Manager",
        priority: "normal",
        content: "A fresh batch of 'The Great Question' tracts has arrived. These are excellent for street conversations. Please collect your bundles from the Resource Room after Sunday service."
    },
    {
        id: 3,
        title: "Rain Forecast for Tuesday Outreach",
        date: "Dec 11, 2025",
        author: "Team Lead (Alpha)",
        priority: "warning",
        content: "Heavy rain is forecast for our market outreach. Please bring umbrellas and waterproof gear. We will focus on the covered market area."
    }
];

const EvangelismAnnouncements: React.FC = () => {
    return (
        <div className="space-y-8 font-sans">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <span className="text-orange-500 font-bold text-xs mb-2 block tracking-widest uppercase">Field Intel</span>
                    <h1 className="text-3xl font-black text-white uppercase italic tracking-tight">Campaign Briefs</h1>
                </div>
            </div>

            <div className="space-y-4">
                {ANNOUNCEMENTS.map((item) => (
                    <div key={item.id} className="bg-stone-950 border border-stone-800 rounded-xl p-6 md:p-8 relative overflow-hidden group hover:border-orange-500/50 transition-all">
                        {item.priority === 'critical' && (
                            <div className="absolute top-0 right-0 p-4">
                                <span className="flex items-center gap-1 text-red-500 text-[10px] font-bold font-mono uppercase tracking-widest border border-red-900/50 bg-red-900/10 px-2 py-1 rounded animate-pulse">
                                    <HiExclamation className="w-3 h-3" /> Action Required
                                </span>
                            </div>
                        )}

                        <div className="flex items-start gap-4 mb-4">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center border-2 flex-shrink-0 ${item.priority === 'critical' ? 'bg-red-500/10 border-red-500 text-red-500' :
                                    item.priority === 'warning' ? 'bg-yellow-500/10 border-yellow-500 text-yellow-500' :
                                        'bg-stone-800 border-stone-700 text-stone-500'
                                }`}>
                                {item.priority === 'critical' ? <HiLightningBolt className="w-6 h-6" /> : <HiSpeakerphone className="w-6 h-6" />}
                            </div>
                            <div>
                                <h3 className={`text-xl font-bold mb-1 uppercase italic ${item.priority === 'critical' ? 'text-red-500' : 'text-white'
                                    }`}>{item.title}</h3>
                                <div className="flex items-center gap-3 text-xs font-bold text-stone-500 uppercase tracking-wide">
                                    <span>{item.date}</span>
                                    <span>&bull;</span>
                                    <span className="text-stone-400">From: {item.author}</span>
                                </div>
                            </div>
                        </div>

                        <p className="text-stone-300 leading-relaxed text-sm md:text-base border-l-4 border-stone-800 pl-6 ml-6">
                            {item.content}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EvangelismAnnouncements;
