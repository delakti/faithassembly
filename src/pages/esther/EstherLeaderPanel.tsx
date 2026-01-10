import React, { useState } from 'react';
import EstherDevotionalManager from './EstherDevotionalManager';
import EstherEventManager from './EstherEventManager';
import EstherResourceManager from './EstherResourceManager';
import EstherGroupManager from './EstherGroupManager';


const EstherLeaderPanel: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'devotionals' | 'events' | 'resources' | 'groups'>('devotionals');

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
                    <button
                        onClick={() => setActiveTab('groups')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'groups' ? 'bg-rose-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                    >
                        Groups
                    </button>
                    <button
                        onClick={() => setActiveTab('resources')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'resources' ? 'bg-rose-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                    >
                        Resources
                    </button>
                </div>
            </header>

            {/* Content Area */}
            <div className="bg-white rounded-2xl border border-rose-100 shadow-sm overflow-hidden min-h-[500px]">
                {activeTab === 'devotionals' && (
                    <div className="p-0">
                        <EstherDevotionalManager />
                    </div>
                )}

                {activeTab === 'events' && (
                    <div className="p-0">
                        <EstherEventManager />
                    </div>
                )}

                {activeTab === 'groups' && (
                    <div className="p-0">
                        <EstherGroupManager />
                    </div>
                )}

                {activeTab === 'resources' && (
                    <div className="p-0">
                        <EstherResourceManager />
                    </div>
                )}
            </div>
        </div>
    );
};

export default EstherLeaderPanel;
