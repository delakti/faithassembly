import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import {
    HiMusicNote,
    HiMicrophone,
    HiCalendar,
    HiUserGroup,
    HiLogout,
    HiSparkles,
    HiMenu,
    HiX
} from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';

const WorshipLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const auth = getAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/worship/login');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const navItems = [
        { path: '/worship/dashboard', label: 'Studio', icon: <HiSparkles className="w-5 h-5" /> },
        { path: '/worship/library', label: 'Library', icon: <HiMusicNote className="w-5 h-5" /> },
        { path: '/worship/events', label: 'Stage', icon: <HiCalendar className="w-5 h-5" /> },
        { path: '/worship/team', label: 'Ensemble', icon: <HiUserGroup className="w-5 h-5" /> },
        { path: '/worship/announcements', label: 'Backstage', icon: <HiMicrophone className="w-5 h-5" /> },
    ];

    return (
        <div className="flex h-screen bg-black font-sans overflow-hidden text-gray-200">
            {/* Sidebar (Desktop) */}
            <aside className="hidden md:flex w-72 bg-neutral-900/50 backdrop-blur-xl border-r border-white/10 flex-col z-20">
                <div className="p-8 flex items-center space-x-3 border-b border-white/10">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/20">
                        <HiMusicNote className="w-5 h-5 text-black" />
                    </div>
                    <div>
                        <h1 className="font-serif text-2xl text-white tracking-wide">Worship<span className="text-yellow-500">Arts</span></h1>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-8">
                    {navItems.map((item) => {
                        const isActive = location.pathname.startsWith(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center px-6 py-4 rounded-xl transition-all duration-300 font-medium tracking-wide group ${isActive
                                        ? 'bg-gradient-to-r from-yellow-500/20 to-transparent text-yellow-400 border-l-2 border-yellow-500'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <span className={`mr-4 transition-transform group-hover:scale-110 ${isActive ? 'text-yellow-400' : 'text-gray-500 group-hover:text-white'}`}>{item.icon}</span>
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-6 border-t border-white/10">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-6 py-3 text-gray-500 hover:text-red-400 transition-colors font-medium text-sm"
                    >
                        <HiLogout className="w-5 h-5 mr-3" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Mobile Header & Nav */}
            <div className="md:hidden fixed top-0 left-0 right-0 bg-neutral-900/90 backdrop-blur-md z-50 px-6 py-4 flex justify-between items-center border-b border-white/10">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                        <HiMusicNote className="w-4 h-4 text-black" />
                    </div>
                    <span className="font-serif text-lg text-white">Worship<span className="text-yellow-500">Arts</span></span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white">
                    {isMobileMenuOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
                </button>
            </div>

            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="md:hidden fixed inset-0 bg-black z-40 pt-24 px-6"
                    >
                        <nav className="space-y-2">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center px-6 py-5 rounded-xl transition-all font-medium text-lg ${location.pathname.startsWith(item.path)
                                            ? 'bg-white/10 text-yellow-400'
                                            : 'text-gray-400'
                                        }`}
                                >
                                    <span className="mr-4">{item.icon}</span>
                                    {item.label}
                                </Link>
                            ))}
                            <button
                                onClick={handleLogout}
                                className="flex items-center w-full px-6 py-5 text-gray-500 hover:text-red-400 font-medium text-lg mt-8 border-t border-white/10 pt-8"
                            >
                                <HiLogout className="w-6 h-6 mr-4" />
                                Sign Out
                            </button>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>


            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-gradient-to-br from-neutral-900 to-black pt-20 md:pt-0 relative">
                {/* Ambient Background Lights */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-yellow-900/10 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="p-6 md:p-12 max-w-7xl mx-auto pb-24 md:pb-12 text-white relative z-10">
                    <header className="mb-12 flex justify-between items-end">
                        <div>
                            <p className="text-yellow-500 font-medium text-xs tracking-[0.2em] uppercase mb-2">Faith Assembly Choir</p>
                            <h2 className="text-4xl md:text-5xl font-serif text-white">
                                {navItems.find(n => location.pathname.startsWith(n.path))?.label || 'Studio'}
                            </h2>
                        </div>
                        <div className="w-12 h-12 rounded-full border border-white/20 p-1 hidden md:block">
                            <img src="https://images.unsplash.com/photo-1516280440614-6697288d5d38?w=800&auto=format&fit=crop&q=60" alt="Profile" className="w-full h-full object-cover rounded-full" />
                        </div>
                    </header>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default WorshipLayout;
