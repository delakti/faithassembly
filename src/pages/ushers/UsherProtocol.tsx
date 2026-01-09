import React, { useState } from 'react';
import { HiBookOpen, HiShieldCheck, HiOutlineSparkles, HiChevronDown, HiChevronUp, HiExclamation } from 'react-icons/hi';

const GUIDELINES = [
    {
        category: "Excellence in Service",
        icon: <HiOutlineSparkles className="w-6 h-6 text-yellow-500" />,
        items: [
            {
                title: "The Heart of an Usher",
                content: "We are the first smile and the first impression. Our goal is to prepare the atmosphere for people to encounter God. Serve with joy, anticipating needs before they are asked."
            },
            {
                title: "Dress Code",
                content: "Men: Navy or Black Suit, White Shirt, Solid Tie. Women: Navy or Black Suit/Dress (appropriate length), White Blouse. Comfortable black shoes are essential. Badges must be worn at all times."
            },
            {
                title: "Punctuality",
                content: "Call time is 30 minutes before service starts. This allows for briefing, prayer, and section checks. If you are running late, notify your Head Usher immediately."
            }
        ]
    },
    {
        category: "Safety & Procedures",
        icon: <HiShieldCheck className="w-6 h-6 text-blue-500" />,
        items: [
            {
                title: "Emergency Evacuation",
                content: "In case of fire or emergency, remain calm. Direct the congregation to the nearest exit (North or South doors). Do not use elevators. Ensure exits are kept clear at all times."
            },
            {
                title: "Medical Emergencies",
                content: "Do not move the person unless they are in immediate danger. Signal for the Medical Team immediately. Clear the area to give them space to work."
            },
            {
                title: "Disruptive Behavior",
                content: "Approach with kindness but firmness. De-escalate the situation. If necessary, signal for Security. Never engage in a physical altercation."
            }
        ]
    }
];

const UsherProtocol: React.FC = () => {
    const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
        "The Heart of an Usher": true
    });

    const toggleSection = (title: string) => {
        setOpenSections(prev => ({
            ...prev,
            [title]: !prev[title]
        }));
    };

    return (
        <div className="space-y-8 font-sans text-slate-800">
            <div className="mb-8 border-l-4 border-slate-800 pl-6">
                <span className="text-slate-500 font-bold tracking-widest uppercase text-xs mb-2 block">Standard Operating Procedures</span>
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900">Protocol Handbook</h1>
                <p className="text-slate-500 font-medium mt-2 max-w-2xl">
                    "Let all things be done decently and in order." — 1 Corinthians 14:40. Your guide to excellence and safety.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <div className="md:col-span-2 space-y-8">
                    {GUIDELINES.map((section, idx) => (
                        <div key={idx} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                            <div className="bg-slate-50 p-6 border-b border-slate-100 flex items-center gap-3">
                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                    {section.icon}
                                </div>
                                <h2 className="text-xl font-bold text-slate-800">{section.category}</h2>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {section.items.map((item, itemIdx) => (
                                    <div key={itemIdx} className="bg-white">
                                        <button
                                            onClick={() => toggleSection(item.title)}
                                            className="w-full px-6 py-5 flex justify-between items-center hover:bg-slate-50 transition-colors text-left"
                                        >
                                            <span className="font-bold text-slate-700">{item.title}</span>
                                            {openSections[item.title] ? (
                                                <HiChevronUp className="w-5 h-5 text-slate-400" />
                                            ) : (
                                                <HiChevronDown className="w-5 h-5 text-slate-400" />
                                            )}
                                        </button>
                                        {openSections[item.title] && (
                                            <div className="px-6 pb-6 pt-2 text-slate-600 leading-relaxed text-sm animate-fadeIn">
                                                {item.content}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Sidebar Resources */}
                <div className="space-y-6">
                    <div className="bg-blue-900 text-white rounded-xl p-6 shadow-lg relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                                <HiExclamation className="w-5 h-5 text-yellow-400" /> Quick Reference
                            </h3>
                            <p className="text-blue-200 text-sm mb-6">
                                Essential codes for radio communication.
                            </p>
                            <ul className="space-y-3 text-sm font-mono">
                                <li className="flex justify-between border-b border-blue-800 pb-2">
                                    <span className="text-blue-300">Code Red</span>
                                    <span className="font-bold">Fire / Evacuate</span>
                                </li>
                                <li className="flex justify-between border-b border-blue-800 pb-2">
                                    <span className="text-blue-300">Code Blue</span>
                                    <span className="font-bold">Medical Emergency</span>
                                </li>
                                <li className="flex justify-between border-b border-blue-800 pb-2">
                                    <span className="text-blue-300">Code Orange</span>
                                    <span className="font-bold">Disruptive Person</span>
                                </li>
                                <li className="flex justify-between">
                                    <span className="text-blue-300">Code Green</span>
                                    <span className="font-bold">All Clear</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-6">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <HiBookOpen className="w-5 h-5 text-slate-400" /> Downloads
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <a href="#" className="block p-3 rounded bg-slate-50 hover:bg-slate-100 transition-colors group">
                                    <span className="text-sm font-bold text-slate-700 group-hover:text-blue-600 block mb-1">Usher Training Manual 2024</span>
                                    <span className="text-xs text-slate-400 uppercase tracking-widest">PDF &bull; 2.4 MB</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" className="block p-3 rounded bg-slate-50 hover:bg-slate-100 transition-colors group">
                                    <span className="text-sm font-bold text-slate-700 group-hover:text-blue-600 block mb-1">Evacuation Floor Plan</span>
                                    <span className="text-xs text-slate-400 uppercase tracking-widest">JPG &bull; 1.1 MB</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UsherProtocol;
