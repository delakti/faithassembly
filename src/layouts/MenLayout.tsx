import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import {
    HiHome,
    HiNewspaper,
    HiCalendar,
    HiUserGroup,
    HiLogout,
    HiShieldCheck,
    HiCollection,
    HiMenu,
    HiX,
    HiChatAlt2
} from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';

const MenLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const auth = getAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/men/login');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const navItems = [
        { path: '/men/dashboard', label: 'HQ', icon: <HiHome className="w-5 h-5" /> },
        { path: '/men/announcements', label: 'Intel', icon: <HiNewspaper className="w-5 h-5" /> },
        { path: '/men/events', label: 'Missions', icon: <HiCalendar className="w-5 h-5" /> },
        { path: '/men/groups', label: 'Squads', icon: <HiUserGroup className="w-5 h-5" /> },
        { path: '/men/forum', label: 'Locker Room', icon: <HiChatAlt2 className="w-5 h-5" /> },
        { path: '/men/resources', label: 'Armory', icon: <HiCollection className="w-5 h-5" /> },
    ];

    return (
        <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
            {/* Sidebar (Desktop) */}
            <aside className="hidden md:flex w-64 bg-slate-900 flex-col border-r border-slate-800 shadow-2xl z-20">
                <div className="p-6 flex items-center space-x-3 border-b border-slate-800">
                    <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/30">
                        <HiShieldCheck className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="font-black text-xl text-white tracking-widest uppercase italic">Iron<span className="text-indigo-500">Men</span></h1>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-8">
                    {navItems.map((item) => {
                        const isActive = location.pathname.startsWith(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center px-4 py-3 rounded-lg transition-all font-bold tracking-wide ${isActive
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50 translate-x-1'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                    }`}
                            >
                                <span className="mr-3">{item.icon}</span>
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-6 border-t border-slate-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-slate-400 hover:text-red-500 transition-colors font-bold text-sm"
                    >
                        <HiLogout className="w-5 h-5 mr-3" />
                        Log Out
                    </button>
                </div>
            </aside>

            {/* Mobile Header & Nav */}
            <div className="md:hidden fixed top-0 left-0 right-0 bg-slate-900 z-50 px-4 py-3 flex justify-between items-center shadow-md">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center">
                        <HiShieldCheck className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-black text-lg text-white tracking-widest uppercase italic">Iron<span className="text-indigo-500">Men</span></span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white">
                    {isMobileMenuOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
                </button>
            </div>

            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        className="md:hidden fixed inset-0 bg-slate-900 z-40 pt-16 px-6"
                    >
                        <nav className="space-y-4 mt-8">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center px-4 py-4 rounded-lg transition-all font-bold text-lg ${location.pathname.startsWith(item.path)
                                        ? 'bg-indigo-600 text-white'
                                        : 'text-slate-400'
                                        }`}
                                >
                                    <span className="mr-4">{item.icon}</span>
                                    {item.label}
                                </Link>
                            ))}
                            <button
                                onClick={handleLogout}
                                className="flex items-center w-full px-4 py-4 text-slate-400 hover:text-red-500 font-bold text-lg mt-8"
                            >
                                <HiLogout className="w-6 h-6 mr-4" />
                                Log Out
                            </button>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>


            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-slate-50 pt-16 md:pt-0">
                <div className="p-6 md:p-12 max-w-7xl mx-auto pb-24 md:pb-12 text-slate-800">
                    <header className="mb-8 md:mb-12 flex justify-between items-end border-b-2 border-slate-200 pb-4">
                        <div>
                            <p className="text-indigo-600 font-bold text-sm tracking-widest uppercase mb-1">Men's Fellowship</p>
                            <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase italic">
                                {navItems.find(n => location.pathname.startsWith(n.path))?.label || 'HQ'}
                            </h2>
                        </div>
                        <div className="w-10 h-10 rounded bg-slate-200 border-2 border-white shadow-sm overflow-hidden hidden md:block">
                            <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=60" alt="Profile" className="w-full h-full object-cover" />
                        </div>
                    </header>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default MenLayout;
