import React from 'react';
import { HiSpeakerphone } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import NoticeFeed from './components/NoticeFeed';
import HospitalitySidebar from './components/HospitalitySidebar';

const HospitalityAnnouncements: React.FC = () => {
    return (
        <div className="space-y-8 font-sans text-stone-800 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
                <div className="border-l-4 border-orange-400 pl-6">
                    <span className="text-orange-500 font-bold tracking-widest uppercase text-xs mb-2 block">Communication</span>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900">Notice Board</h1>
                    <p className="text-stone-500 font-medium mt-2 max-w-2xl">
                        Stay updated with the latest news and conversations from the team.
                    </p>
                </div>
                <button
                    onClick={() => toast('Please use the Leader Panel to post updates.')}
                    className="px-6 py-3 bg-stone-800 text-white font-bold rounded-xl shadow hover:bg-stone-900 transition-colors flex items-center gap-2"
                >
                    <HiSpeakerphone className="w-5 h-5" /> Post Update
                </button>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Main Feed */}
                <div className="md:col-span-2 space-y-6">
                    <NoticeFeed />
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <HospitalitySidebar />
                </div>
            </div>
        </div>
    );
};

export default HospitalityAnnouncements;
