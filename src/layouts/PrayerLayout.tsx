import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import {
    HiHome,
    HiClock,
    HiFire,
    HiUserGroup,
    HiLogout,
    HiMenu,
    HiX,
    HiSparkles,
    HiSpeakerphone
} from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';

const PrayerLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const auth = getAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/prayer/login');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const navItems = [
        { path: '/prayer/dashboard', label: 'Sanctuary', icon: <HiHome className="w-5 h-5" /> },
        { path: '/prayer/schedule', label: 'The Watch', icon: <HiClock className="w-5 h-5" /> },
        { path: '/prayer/requests', label: 'Prayer Wall', icon: <HiSparkles className="w-5 h-5" /> },
        { path: '/prayer/events', label: 'Gatherings', icon: <HiFire className="w-5 h-5" /> },
        { path: '/prayer/announcements', label: 'Intel', icon: <HiSpeakerphone className="w-5 h-5" /> },
        { path: '/prayer/team', label: 'Intercessors', icon: <HiUserGroup className="w-5 h-5" /> },
    ];

    return (
        <div className="flex h-screen bg-slate-950 font-sans overflow-hidden text-slate-200">
            {/* Sidebar (Desktop) */}
            <aside className="hidden md:flex w-64 bg-slate-900 flex-col z-20 border-r border-slate-800">
                <Link to="/prayer/dashboard" className="p-8 flex items-center space-x-3 bg-slate-900 border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-indigo-900/30 flex items-center justify-center border border-indigo-500/30">
                        <HiFire className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                        <h1 className="font-serif font-bold text-xl tracking-tight text-white">Prayer<span className="text-indigo-400">Force</span></h1>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest">In His Presence</p>
                    </div>
                </Link>

                <nav className="flex-1 px-4 space-y-2 mt-8">
                    {navItems.map((item) => {
                        const isActive = location.pathname.startsWith(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 font-medium group ${isActive
                                    ? 'bg-slate-800 text-indigo-400 shadow-sm border border-slate-700'
                                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
                                    }`}
                            >
                                <span className={`mr-3 ${isActive ? 'text-indigo-400' : 'text-slate-600 group-hover:text-slate-400'}`}>{item.icon}</span>
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-6 border-t border-slate-800 bg-slate-900">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-slate-500 hover:text-red-400 transition-colors font-medium text-sm"
                    >
                        <HiLogout className="w-5 h-5 mr-3" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Mobile Header & Nav */}
            <div className="md:hidden fixed top-0 left-0 right-0 bg-slate-900 z-50 px-6 py-4 flex justify-between items-center text-white shadow-sm border-b border-slate-800">
                <Link to="/prayer/dashboard" className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-900/30 flex items-center justify-center border border-indigo-500/30">
                        <HiFire className="w-4 h-4 text-indigo-400" />
                    </div>
                    <span className="font-serif font-bold text-lg">Prayer<span className="text-indigo-400">Force</span></span>
                </Link>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-400">
                    {isMobileMenuOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
                </button>
            </div>

            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="md:hidden fixed inset-0 bg-slate-950 z-40 pt-24 px-6"
                    >
                        <nav className="space-y-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center px-6 py-4 rounded-xl transition-all font-medium text-lg ${location.pathname.startsWith(item.path)
                                        ? 'bg-slate-800 text-indigo-400 shadow-sm border border-slate-700'
                                        : 'text-slate-500 bg-slate-900/50'
                                        }`}
                                >
                                    <span className="mr-4">{item.icon}</span>
                                    {item.label}
                                </Link>
                            ))}
                            <button
                                onClick={handleLogout}
                                className="flex items-center w-full px-6 py-4 text-slate-500 hover:text-red-400 font-medium text-lg mt-8 border-t border-slate-800 pt-8"
                            >
                                <HiLogout className="w-6 h-6 mr-4" />
                                Sign Out
                            </button>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>


            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-slate-950 pt-20 md:pt-0">
                <div className="p-6 md:p-12 max-w-6xl mx-auto pb-24 md:pb-12">
                    {/* Header with Verse */}
                    <header className="mb-12 border-b border-slate-800 pb-8">
                        <span className="text-indigo-400 font-bold tracking-widest uppercase text-xs mb-2 block">Daily Word</span>
                        <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-2">
                            "Pray without ceasing."
                        </h2>
                        <p className="text-slate-500 font-serif italic text-sm">— 1 Thessalonians 5:17</p>
                    </header>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default PrayerLayout;
