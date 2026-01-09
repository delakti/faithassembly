import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import {
    HiHome,
    HiCalendar,
    HiUserGroup,
    HiSpeakerphone,
    HiLogout,
    HiMenu,
    HiX,
    HiFire,
    HiHeart,
    HiChatAlt2
} from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';

const EvangelismLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const auth = getAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/evangelism/login');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const navItems = [
        { path: '/evangelism/dashboard', label: 'Mission Control', icon: <HiHome className="w-5 h-5" /> },
        { path: '/evangelism/schedule', label: 'Outreach', icon: <HiCalendar className="w-5 h-5" /> },
        { path: '/evangelism/followup', label: 'Harvest', icon: <HiHeart className="w-5 h-5" /> },
        { path: '/evangelism/testimonies', label: 'Stories', icon: <HiChatAlt2 className="w-5 h-5" /> },
        { path: '/evangelism/team', label: 'Squads', icon: <HiUserGroup className="w-5 h-5" /> },
        { path: '/evangelism/announcements', label: 'Intel', icon: <HiSpeakerphone className="w-5 h-5" /> },
    ];

    return (
        <div className="flex h-screen bg-stone-900 font-sans overflow-hidden text-stone-300">
            {/* Sidebar (Desktop) */}
            <aside className="hidden md:flex w-72 bg-stone-950 border-r border-stone-800 flex-col z-20">
                <div className="p-8 flex items-center space-x-3 bg-stone-950 border-b border-stone-800">
                    <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center border-2 border-orange-400 shadow-[0_0_15px_rgba(234,88,12,0.5)]">
                        <HiFire className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="font-extrabold text-lg tracking-tight text-white uppercase italic">Go<span className="text-orange-500">Ye</span></h1>
                        <p className="text-[10px] text-stone-500 uppercase tracking-widest font-bold">Soul Winning Ops</p>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-8">
                    {navItems.map((item) => {
                        const isActive = location.pathname.startsWith(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 font-bold group relative overflow-hidden ${isActive
                                        ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/50'
                                        : 'text-stone-500 hover:text-white hover:bg-stone-800'
                                    }`}
                            >
                                <span className={`mr-3 ${isActive ? 'text-white' : 'text-stone-600 group-hover:text-stone-400'}`}>{item.icon}</span>
                                <span className="uppercase tracking-wide text-sm">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 m-4 bg-gradient-to-br from-orange-900/20 to-stone-900 rounded-lg border border-orange-900/30">
                    <div className="flex items-center gap-3">
                        <HiFire className="w-5 h-5 text-orange-500 animate-pulse" />
                        <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">The Harvest is Ripe</span>
                    </div>
                </div>

                <div className="p-6 border-t border-stone-800 bg-stone-950">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-stone-500 hover:text-white transition-colors font-bold text-xs uppercase tracking-wider"
                    >
                        <HiLogout className="w-5 h-5 mr-3" />
                        Log Out
                    </button>
                </div>
            </aside>

            {/* Mobile Header & Nav */}
            <div className="md:hidden fixed top-0 left-0 right-0 bg-stone-950 z-50 px-6 py-4 flex justify-between items-center text-white shadow-lg border-b border-stone-800">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center border border-orange-400">
                        <HiFire className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-extrabold text-lg uppercase italic">Go<span className="text-orange-500">Ye</span></span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-stone-400">
                    {isMobileMenuOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
                </button>
            </div>

            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        className="md:hidden fixed inset-0 bg-stone-900 z-40 pt-24 px-6"
                    >
                        <nav className="space-y-2">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center px-6 py-4 rounded-lg transition-all font-bold uppercase tracking-wider text-sm ${location.pathname.startsWith(item.path)
                                            ? 'bg-orange-600 text-white shadow-lg'
                                            : 'text-stone-400 bg-stone-800'
                                        }`}
                                >
                                    <span className="mr-4">{item.icon}</span>
                                    {item.label}
                                </Link>
                            ))}
                            <button
                                onClick={handleLogout}
                                className="flex items-center w-full px-6 py-4 text-stone-500 hover:text-white font-bold text-sm uppercase tracking-wider mt-8 border-t border-stone-800 pt-8"
                            >
                                <HiLogout className="w-5 h-5 mr-4" />
                                Log Out
                            </button>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>


            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-stone-900 pt-20 md:pt-0 scrollbar-hide">
                <div className="p-6 md:p-10 max-w-7xl mx-auto pb-24 md:pb-12">
                    {/* Header */}
                    <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-800 pb-6">
                        <div>
                            <span className="text-orange-500 font-bold text-xs mb-1 block tracking-widest uppercase">Field Operations</span>
                            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase italic">
                                {navItems.find(i => location.pathname.startsWith(i.path))?.label || 'Dashboard'}
                            </h2>
                        </div>
                    </header>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default EvangelismLayout;
