import React, { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import {
    HiHome,
    HiCalendar,
    HiColorSwatch,
    HiSpeakerphone,
    HiClipboardList,
    HiLogout,
    HiShieldCheck,
    HiSparkles
} from 'react-icons/hi';

const DecorationLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const auth = getAuth();
    const db = getFirestore();
    const [isLeader, setIsLeader] = useState(false);

    useEffect(() => {
        const checkRole = async () => {
            if (auth.currentUser) {
                const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
                if (userDoc.exists()) {
                    const role = userDoc.data().role;
                    if (['decor_leader', 'hospitality_leader', 'super_admin', 'admin'].includes(role)) {
                        setIsLeader(true);
                    }
                }
            }
        };
        checkRole();
    }, [auth.currentUser, db]); // Added db to dependency array

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/decoration/login'); // Assuming there will be a login redirect
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const navItems = [
        { path: '/decoration/dashboard', label: 'Overview', icon: <HiHome className="w-5 h-5" /> },
        { path: '/decoration/announcements', label: 'Messages', icon: <HiSpeakerphone className="w-5 h-5" /> },
        { path: '/decoration/rota', label: 'Rota', icon: <HiCalendar className="w-5 h-5" /> },
        { path: '/decoration/assets', label: 'Inventory', icon: <HiColorSwatch className="w-5 h-5" /> },
        { path: '/decoration/planning', label: 'Planning', icon: <HiClipboardList className="w-5 h-5" /> },
    ];

    if (isLeader) {
        navItems.push({ path: '/decoration/leader', label: 'Leader Panel', icon: <HiShieldCheck className="w-5 h-5" /> });
    }

    return (
        <div className="flex h-screen bg-fuchsia-50 font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className="hidden md:flex w-72 bg-white flex-col border-r border-fuchsia-100 shadow-sm z-20">
                <div
                    onClick={() => navigate('/decoration/dashboard')}
                    className="p-8 flex items-center space-x-3 border-b border-fuchsia-50 cursor-pointer group"
                >
                    <div className="w-10 h-10 bg-fuchsia-100 rounded-full flex items-center justify-center group-hover:bg-fuchsia-200 transition-colors">
                        <HiSparkles className="w-5 h-5 text-fuchsia-600" />
                    </div>
                    <div>
                        <h1 className="font-medium text-2xl text-fuchsia-950 tracking-wide font-serif group-hover:text-fuchsia-700 transition-colors">Decor<span className="text-fuchsia-500">Team</span></h1>
                    </div>
                </div>

                <nav className="flex-1 px-6 space-y-2 mt-8 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = location.pathname.startsWith(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center px-4 py-3 rounded-lg transition-all font-sans text-sm tracking-wide ${isActive
                                    ? 'bg-fuchsia-50 text-fuchsia-700 font-medium translate-x-1 shadow-sm'
                                    : 'text-slate-500 hover:text-fuchsia-600 hover:bg-fuchsia-50/50'
                                    }`}
                            >
                                <span className="mr-3">{item.icon}</span>
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-6 border-t border-fuchsia-50">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-slate-400 hover:text-fuchsia-600 transition-colors font-sans text-sm"
                    >
                        <HiLogout className="w-5 h-5 mr-3" />
                        Log Out
                    </button>
                </div>
            </aside>

            {/* Mobile Bottom Nav */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-fuchsia-100 flex justify-around p-3 z-50 safe-area-bottom shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                {navItems.slice(0, 5).map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex flex-col items-center p-2 rounded-lg ${location.pathname.startsWith(item.path) ? 'text-fuchsia-600 bg-fuchsia-50' : 'text-slate-400'}`}
                    >
                        {item.icon}
                        <span className="text-[10px] mt-1 font-medium">{item.label}</span>
                    </Link>
                ))}
                {isLeader && (
                    <Link
                        to="/decoration/leader"
                        className={`flex flex-col items-center p-2 rounded-lg ${location.pathname.startsWith('/decoration/leader') ? 'text-fuchsia-600 bg-fuchsia-50' : 'text-slate-400'}`}
                    >
                        <HiShieldCheck className="w-5 h-5" />
                        <span className="text-[10px] mt-1 font-medium">Manage</span>
                    </Link>
                )}
            </div>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative bg-fuchsia-50/30">
                {/* Decorative Background */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-fuchsia-100/40 to-transparent rounded-full blur-[80px] pointer-events-none -mr-20 -mt-20"></div>

                <div className="p-6 md:p-12 relative z-10 max-w-7xl mx-auto pb-24 md:pb-12 text-slate-800">
                    <header className="mb-8 md:mb-12 flex justify-between items-end">
                        <div>
                            <p className="text-fuchsia-500 font-medium text-xs tracking-widest uppercase mb-2 font-sans">Ministry of Excellence</p>
                            <h2 className="text-3xl md:text-3xl font-serif text-slate-900">
                                {location.pathname.split('/').pop()?.charAt(0).toUpperCase() + location.pathname.split('/').pop()!.slice(1)}
                            </h2>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-white border border-fuchsia-100 shadow-sm overflow-hidden p-1">
                            <div className="w-full h-full bg-fuchsia-100 rounded-full flex items-center justify-center text-fuchsia-600 font-bold text-xs">
                                DT
                            </div>
                        </div>
                    </header>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DecorationLayout;
