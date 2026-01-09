import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { HiMenuAlt3, HiX, HiHome, HiCalendar, HiUserGroup, HiClipboardList, HiCurrencyPound, HiCube, HiSpeakerphone, HiLogout, HiAcademicCap } from 'react-icons/hi';
import { getAuth, signOut } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';

const UsherLayout: React.FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const auth = getAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/ushering/login');
    };

    const navItems = [
        { path: 'dashboard', label: 'Station', icon: HiHome },
        { path: 'schedule', label: 'Duty Rota', icon: HiCalendar },
        { path: 'attendance', label: 'Head Count', icon: HiUserGroup },
        { path: 'offering', label: 'Offering', icon: HiCurrencyPound },
        { path: 'stock', label: 'Inventory', icon: HiCube },
        { path: 'announcements', label: 'Briefs', icon: HiSpeakerphone },
        { path: 'team', label: 'Squads', icon: HiClipboardList },
        { path: 'events', label: 'Trainings', icon: HiAcademicCap },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex flex-col w-72 bg-slate-900 text-white fixed h-full z-20 shadow-2xl">
                <div className="p-8 border-b border-slate-800">
                    <h1 className="text-2xl font-serif font-bold text-amber-500 tracking-wider">GATEKEEPERS</h1>
                    <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">Ushering Department</p>
                </div>

                <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 group ${isActive
                                    ? 'bg-amber-600/20 text-amber-500 shadow-inner' // Active state
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`
                            }
                        >
                            <item.icon className="w-6 h-6" />
                            <span className="font-medium tracking-wide">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="p-6 border-t border-slate-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                        <HiLogout className="w-6 h-6" />
                        <span className="font-medium">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 lg:ml-72 flex flex-col min-h-screen transition-all duration-300">
                {/* Mobile Header */}
                <header className="lg:hidden bg-slate-900 text-white p-4 sticky top-0 z-30 shadow-md flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-serif font-bold text-amber-500">GATEKEEPERS</h1>
                    </div>
                    <button onClick={() => setIsMobileMenuOpen(true)}>
                        <HiMenuAlt3 className="w-8 h-8 text-amber-500" />
                    </button>
                </header>

                {/* Content Container */}
                <div className="p-4 md:p-8 lg:p-10 max-w-7xl mx-auto w-full">
                    <Outlet />
                </div>
            </main>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 right-0 w-80 bg-slate-900 text-white z-50 lg:hidden shadow-2xl flex flex-col"
                        >
                            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-serif font-bold text-amber-500">Menu</h2>
                                </div>
                                <button onClick={() => setIsMobileMenuOpen(false)}>
                                    <HiX className="w-8 h-8 text-slate-400 hover:text-white" />
                                </button>
                            </div>

                            <nav className="flex-1 overflow-y-auto p-6 space-y-2">
                                {navItems.map((item) => (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={({ isActive }) =>
                                            `flex items-center gap-4 px-4 py-4 rounded-lg transition-all border border-transparent ${isActive
                                                ? 'bg-amber-600/20 text-amber-500 border-amber-500/20'
                                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                            }`
                                        }
                                    >
                                        <item.icon className="w-6 h-6" />
                                        <span className="font-medium text-lg">{item.label}</span>
                                    </NavLink>
                                ))}
                            </nav>

                            <div className="p-6 border-t border-slate-800">
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="flex items-center gap-3 w-full px-4 py-4 text-slate-400 hover:text-red-400 hover:bg-red-900/10 rounded-lg transition-colors"
                                >
                                    <HiLogout className="w-6 h-6" />
                                    <span className="font-medium text-lg">Sign Out</span>
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UsherLayout;
