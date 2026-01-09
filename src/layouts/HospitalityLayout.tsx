import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import {
    HiHome,
    HiCalendar,
    HiSpeakerphone,
    HiUserGroup,
    HiLogout,
    HiMenu,
    HiX,
    HiHeart
} from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';

const HospitalityLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const auth = getAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/hospitality/login');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const navItems = [
        { path: '/hospitality/dashboard', label: 'Home', icon: <HiHome className="w-5 h-5" /> },
        { path: '/hospitality/referrals', label: 'My Rota', icon: <HiCalendar className="w-5 h-5" /> },
        { path: '/hospitality/events', label: 'Gatherings', icon: <HiUserGroup className="w-5 h-5" /> },
        { path: '/hospitality/announcements', label: 'Notice Board', icon: <HiSpeakerphone className="w-5 h-5" /> },
        { path: '/hospitality/team', label: 'Our Family', icon: <HiUserGroup className="w-5 h-5" /> },
    ];

    return (
        <div className="flex h-screen bg-stone-50 font-sans overflow-hidden text-stone-800">
            {/* Sidebar (Desktop) */}
            <aside className="hidden md:flex w-64 bg-stone-100 flex-col z-20 border-r border-stone-200">
                <div className="p-8 flex items-center space-x-3 bg-stone-50 border-b border-stone-200">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center border border-orange-200">
                        <HiHeart className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                        <h1 className="font-serif font-bold text-xl tracking-tight text-stone-800">Faith<span className="text-orange-600">Hosts</span></h1>
                        <p className="text-[10px] text-stone-500 uppercase tracking-widest">Serving with a Smile</p>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-8">
                    {navItems.map((item) => {
                        const isActive = location.pathname.startsWith(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 font-medium group ${isActive
                                    ? 'bg-white text-orange-600 shadow-sm border border-orange-100'
                                    : 'text-stone-500 hover:text-stone-800 hover:bg-white/50'
                                    }`}
                            >
                                <span className={`mr-3 ${isActive ? 'text-orange-500' : 'text-stone-400 group-hover:text-stone-600'}`}>{item.icon}</span>
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-6 border-t border-stone-200 bg-stone-50">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-stone-500 hover:text-red-500 transition-colors font-medium text-sm"
                    >
                        <HiLogout className="w-5 h-5 mr-3" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Mobile Header & Nav */}
            <div className="md:hidden fixed top-0 left-0 right-0 bg-white z-50 px-6 py-4 flex justify-between items-center text-stone-800 shadow-sm border-b border-stone-200">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center border border-orange-200">
                        <HiHeart className="w-4 h-4 text-orange-500" />
                    </div>
                    <span className="font-serif font-bold text-lg">Faith<span className="text-orange-600">Hosts</span></span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-stone-600">
                    {isMobileMenuOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
                </button>
            </div>

            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="md:hidden fixed inset-0 bg-stone-50 z-40 pt-24 px-6"
                    >
                        <nav className="space-y-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center px-6 py-4 rounded-xl transition-all font-medium text-lg ${location.pathname.startsWith(item.path)
                                        ? 'bg-white text-orange-600 shadow-sm border border-orange-100'
                                        : 'text-stone-500 bg-white/50'
                                        }`}
                                >
                                    <span className="mr-4">{item.icon}</span>
                                    {item.label}
                                </Link>
                            ))}
                            <button
                                onClick={handleLogout}
                                className="flex items-center w-full px-6 py-4 text-stone-500 hover:text-red-500 font-medium text-lg mt-8 border-t border-stone-200 pt-8"
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
                                {navItems.find(n => location.pathname.startsWith(n.path))?.label || 'Welcome Home'}
                            </h2>
                            <p className="text-stone-500 text-sm">Thank you for serving today.</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-stone-200 border-2 border-white shadow-sm overflow-hidden hidden md:block">
                            <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=60" alt="Profile" className="w-full h-full object-cover" />
                        </div>
                    </header>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default HospitalityLayout;
