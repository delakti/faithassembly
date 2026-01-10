import React, { useState } from 'react';
import { HiPlus, HiCalendar, HiBookOpen } from 'react-icons/hi';


const EstherLeaderPanel: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'devotionals' | 'events'>('devotionals');

    return (
        <div className="space-y-8 font-sans">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif text-rose-950">Leader Panel</h1>
                    <p className="text-gray-500">Manage devotionals, events, and ministry resources.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setActiveTab('devotionals')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'devotionals' ? 'bg-rose-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                    >
                        Devotionals
                    </button>
                    <button
                        onClick={() => setActiveTab('events')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'events' ? 'bg-rose-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                    >
                        Events
                    </button>
                </div>
            </header>

            {/* Content Area */}
            <div className="bg-white rounded-2xl border border-rose-100 shadow-sm overflow-hidden min-h-[500px]">
                {activeTab === 'devotionals' && (
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center">
                                <HiBookOpen className="w-5 h-5 mr-2 text-rose-500" />
                                Manage Devotionals
                            </h2>
                            <button className="flex items-center px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors text-sm font-bold">
                                <HiPlus className="w-4 h-4 mr-2" />
                                New Devotional
                            </button>
                        </div>

                        <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                            <p className="text-gray-500 font-medium">Devotional management list will appear here.</p>
                            <p className="text-sm text-gray-400 mt-2">Connect to Firestore to list and edit devotionals.</p>
                        </div>
                    </div>
                )}

                {activeTab === 'events' && (
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center">
                                <HiCalendar className="w-5 h-5 mr-2 text-rose-500" />
                                Manage Events
                            </h2>
                            <button className="flex items-center px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors text-sm font-bold">
                                <HiPlus className="w-4 h-4 mr-2" />
                                New Event
                            </button>
                        </div>

                        <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                            <p className="text-gray-500 font-medium">Event management list will appear here.</p>
                            <p className="text-sm text-gray-400 mt-2">Connect to Firestore to list and edit events.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EstherLeaderPanel;
