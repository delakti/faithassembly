import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import {
    HiHome,
    HiCalendar,
    HiClipboardList,
    HiDocumentText,
    HiUserGroup,
    HiLogout,
    HiMenu,
    HiX,
    HiHeart,
    HiSparkles,
    HiShieldCheck
} from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';

const VisitationLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const auth = getAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/visitation/login');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const navItems = [
        { path: '/visitation/dashboard', label: 'Overview', icon: <HiHome className="w-5 h-5" /> },
        { path: '/visitation/schedule', label: 'My Visits', icon: <HiCalendar className="w-5 h-5" /> },
        { path: '/visitation/requests', label: 'Requests Log', icon: <HiClipboardList className="w-5 h-5" /> },
        { path: '/visitation/reports', label: 'Reports', icon: <HiDocumentText className="w-5 h-5" /> },
        { path: '/visitation/prayer', label: 'Prayer Wall', icon: <HiSparkles className="w-5 h-5" /> },
        { path: '/visitation/events', label: 'Events', icon: <HiUserGroup className="w-5 h-5" /> },
        { path: '/visitation/leader', label: 'Leader Panel', icon: <HiShieldCheck className="w-5 h-5" /> }, // Ideally conditionally rendered
    ];

    return (
        <div className="flex h-screen bg-stone-50 font-sans overflow-hidden text-stone-800">
            {/* Sidebar (Desktop) */}
            <aside className="hidden md:flex w-64 bg-slate-900 flex-col z-20 border-r border-slate-800 text-white">
                <Link
                    to="/visitation/dashboard"
                    className="p-8 flex items-center space-x-3 bg-slate-900 border-b border-slate-800 cursor-pointer hover:bg-slate-800/50 transition-colors"
                >
                    <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center border border-teal-500/50">
                        <HiHeart className="w-5 h-5 text-teal-400" />
                    </div>
                    <div>
                        <h1 className="font-serif font-bold text-xl tracking-tight text-white">Visitation<span className="text-teal-400">Team</span></h1>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest">Care & Connect</p>
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
                                    ? 'bg-teal-600/20 text-teal-400 border border-teal-500/30'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                    }`}
                            >
                                <span className={`mr-3 ${isActive ? 'text-teal-400' : 'text-slate-500 group-hover:text-slate-300'}`}>{item.icon}</span>
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
                <Link
                    to="/visitation/dashboard"
                    className="flex items-center space-x-2 cursor-pointer"
                >
                    <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center border border-teal-500/50">
                        <HiHeart className="w-4 h-4 text-teal-400" />
                    </div>
                    <span className="font-serif font-bold text-lg">Visitation<span className="text-teal-400">Team</span></span>
                </Link>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-300">
                    {isMobileMenuOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
                </button>
            </div>

            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="md:hidden fixed inset-0 bg-slate-900 z-40 pt-24 px-6 text-white"
                    >
                        <nav className="space-y-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center px-6 py-4 rounded-xl transition-all font-medium text-lg ${location.pathname.startsWith(item.path)
                                        ? 'bg-teal-600/20 text-teal-400 border border-teal-500/30'
                                        : 'text-slate-400 bg-slate-800/50'
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
            <main className="flex-1 overflow-y-auto bg-stone-50 pt-20 md:pt-0">
                <div className="p-6 md:p-12 max-w-6xl mx-auto pb-24 md:pb-12">
                    <header className="mb-8 flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                        <div>
                            <h2 className="text-2xl font-serif font-bold text-stone-800">
                                {navItems.find(n => location.pathname.startsWith(n.path))?.label || 'Welcome'}
                            </h2>
                            <p className="text-stone-500 text-sm">Caring for our community.</p>
                        </div>
                    </header>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default VisitationLayout;
