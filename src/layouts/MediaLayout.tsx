import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import {
    HiHome,
    HiCalendar,
    HiCollection,
    HiCog,
    HiUserGroup,
    HiSpeakerphone,
    HiLogout,
    HiMenu,
    HiX,
    HiLightningBolt
} from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';

const MediaLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const auth = getAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/media/login');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const navItems = [
        { path: '/media/dashboard', label: 'Hub', icon: <HiHome className="w-5 h-5" /> },
        { path: '/media/schedule', label: 'Rota', icon: <HiCalendar className="w-5 h-5" /> },
        { path: '/media/resources', label: 'Assets', icon: <HiCollection className="w-5 h-5" /> },
        { path: '/media/equipment', label: 'Gear', icon: <HiCog className="w-5 h-5" /> },
        { path: '/media/announcements', label: 'Briefs', icon: <HiSpeakerphone className="w-5 h-5" /> },
        { path: '/media/team', label: 'Crew', icon: <HiUserGroup className="w-5 h-5" /> },
    ];

    return (
        <div className="flex h-screen bg-slate-950 font-sans overflow-hidden text-slate-300">
            {/* Sidebar (Desktop) */}
            <aside className="hidden md:flex w-72 bg-slate-900 border-r border-slate-800 flex-col z-20">
                <div
                    onClick={() => navigate('/media/dashboard')}
                    className="p-8 flex items-center space-x-3 bg-slate-900 border-b border-slate-800 cursor-pointer hover:bg-slate-800/50 transition-colors"
                >
                    <div className="w-10 h-10 rounded bg-cyan-500/10 flex items-center justify-center border border-cyan-500/30">
                        <HiLightningBolt className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                        <h1 className="font-mono font-bold text-lg tracking-tight text-white uppercase">Media<span className="text-cyan-400">Box</span></h1>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Production Ops</p>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-8">
                    {navItems.map((item) => {
                        const isActive = location.pathname.startsWith(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 font-medium group relative overflow-hidden ${isActive
                                    ? 'bg-slate-800 text-cyan-400 border border-slate-700'
                                    : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800/50'
                                    }`}
                            >
                                {isActive && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500"></div>
                                )}
                                <span className={`mr-3 ${isActive ? 'text-cyan-400' : 'text-slate-600 group-hover:text-slate-400'}`}>{item.icon}</span>
                                <span className="font-mono text-sm tracking-wide">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 m-4 border border-slate-800 bg-slate-950/50 rounded-lg">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">System Operational</span>
                    </div>
                </div>

                <div className="p-6 border-t border-slate-800 bg-slate-900">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-slate-500 hover:text-red-400 transition-colors font-mono text-xs uppercase tracking-wider font-bold"
                    >
                        <HiLogout className="w-5 h-5 mr-3" />
                        Log Out
                    </button>
                </div>
            </aside>

            {/* Mobile Header & Nav */}
            <div className="md:hidden fixed top-0 left-0 right-0 bg-slate-900 z-50 px-6 py-4 flex justify-between items-center text-white shadow-lg border-b border-slate-800">
                <div
                    onClick={() => navigate('/media/dashboard')}
                    className="flex items-center space-x-2 cursor-pointer"
                >
                    <div className="w-8 h-8 rounded bg-cyan-500/10 flex items-center justify-center border border-cyan-500/30">
                        <HiLightningBolt className="w-5 h-5 text-cyan-400" />
                    </div>
                    <span className="font-mono font-bold text-lg uppercase">Media<span className="text-cyan-400">Box</span></span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-400">
                    {isMobileMenuOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
                </button>
            </div>

            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        className="md:hidden fixed inset-0 bg-slate-950 z-40 pt-24 px-6 border-l border-slate-800"
                    >
                        <nav className="space-y-2">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center px-6 py-4 rounded-lg transition-all font-mono uppercase tracking-wider text-sm ${location.pathname.startsWith(item.path)
                                        ? 'bg-slate-800 text-cyan-400 border border-slate-700'
                                        : 'text-slate-500 bg-slate-900/50'
                                        }`}
                                >
                                    <span className="mr-4">{item.icon}</span>
                                    {item.label}
                                </Link>
                            ))}
                            <button
                                onClick={handleLogout}
                                className="flex items-center w-full px-6 py-4 text-slate-500 hover:text-red-400 font-mono text-sm uppercase tracking-wider mt-8 border-t border-slate-800 pt-8"
                            >
                                <HiLogout className="w-5 h-5 mr-4" />
                                Log Out
                            </button>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>


            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-slate-950 pt-20 md:pt-0 scrollbar-hide">
                <div className="p-6 md:p-10 max-w-7xl mx-auto pb-24 md:pb-12">
                    {/* Header */}
                    <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
                        <div>
                            <span className="text-cyan-500 font-mono font-bold text-xs mb-2 block tracking-widest uppercase">Console // {location.pathname.split('/').pop()}</span>
                            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                                Production Control
                            </h2>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded text-[10px] font-mono text-slate-500 uppercase">
                                v2.4.0 (Stable)
                            </span>
                        </div>
                    </header>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default MediaLayout;
