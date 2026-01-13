import React, { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import {
    HiHome,
    HiBookOpen,
    HiCalendar,
    HiUserGroup,
    HiLogout,
    HiHeart,
    HiChatAlt2,
    HiCollection,
    HiShieldCheck
} from 'react-icons/hi';

const EstherLayout: React.FC = () => {
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
                    if (['esther_leader', 'hospitality_leader', 'super_admin', 'admin'].includes(role)) {
                        setIsLeader(true);
                    }
                }
            }
        };
        checkRole();
    }, [auth.currentUser]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/esther/login');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const navItems = [
        { path: '/esther/dashboard', label: 'Home', icon: <HiHome className="w-5 h-5" /> },
        { path: '/esther/devotionals', label: 'Inspiration', icon: <HiBookOpen className="w-5 h-5" /> },
        { path: '/esther/events', label: 'Gatherings', icon: <HiCalendar className="w-5 h-5" /> },
        { path: '/esther/groups', label: 'Circles', icon: <HiUserGroup className="w-5 h-5" /> },
        { path: '/esther/forum', label: 'Prayer Wall', icon: <HiChatAlt2 className="w-5 h-5" /> },
        { path: '/esther/resources', label: 'Library', icon: <HiCollection className="w-5 h-5" /> },
    ];

    if (isLeader) {
        navItems.push({ path: '/esther/leader', label: 'Leader Panel', icon: <HiShieldCheck className="w-5 h-5" /> });
    }

    return (
        <div className="flex h-screen bg-rose-50 font-serif overflow-hidden">
            {/* Sidebar */}
            <aside className="hidden md:flex w-72 bg-white flex-col border-r border-rose-100 shadow-sm z-20">
                <div
                    onClick={() => navigate('/esther/dashboard')}
                    className="p-8 flex items-center space-x-3 border-b border-rose-50 cursor-pointer group"
                >
                    <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center group-hover:bg-rose-200 transition-colors">
                        <HiHeart className="w-5 h-5 text-rose-500" />
                    </div>
                    <div>
                        <h1 className="font-medium text-2xl text-rose-950 tracking-wide font-serif group-hover:text-rose-600 transition-colors">Esther<span className="text-rose-400">Gen</span></h1>
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
                                    ? 'bg-rose-50 text-rose-600 font-medium translate-x-1 shadow-sm'
                                    : 'text-gray-500 hover:text-rose-500 hover:bg-rose-50/50'
                                    }`}
                            >
                                <span className="mr-3">{item.icon}</span>
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-6 border-t border-rose-50">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-gray-400 hover:text-rose-500 transition-colors font-sans text-sm"
                    >
                        <HiLogout className="w-5 h-5 mr-3" />
                        Log Out
                    </button>
                </div>
            </aside>

            {/* Mobile Bottom Nav */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-rose-100 flex justify-around p-3 z-50 safe-area-bottom shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                {navItems.slice(0, 5).map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex flex-col items-center p-2 rounded-lg ${location.pathname.startsWith(item.path) ? 'text-rose-600 bg-rose-50' : 'text-gray-400'}`}
                    >
                        {item.icon}
                        <span className="text-[10px] mt-1 font-medium">{item.label}</span>
                    </Link>
                ))}
                {isLeader && (
                    <Link
                        to="/esther/leader"
                        className={`flex flex-col items-center p-2 rounded-lg ${location.pathname.startsWith('/esther/leader') ? 'text-rose-600 bg-rose-50' : 'text-gray-400'}`}
                    >
                        <HiShieldCheck className="w-5 h-5" />
                        <span className="text-[10px] mt-1 font-medium">Manage</span>
                    </Link>
                )}
            </div>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative bg-rose-50">
                {/* Decorative Background */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-rose-100/40 to-transparent rounded-full blur-[100px] pointer-events-none -mr-20 -mt-20"></div>

                <div className="p-6 md:p-12 relative z-10 max-w-7xl mx-auto pb-24 md:pb-12 text-slate-800">
                    <header className="mb-8 md:mb-12 flex justify-between items-end">
                        <div>
                            <p className="text-rose-500 font-medium text-sm tracking-widest uppercase mb-2 font-sans">Women of Faith</p>
                            <h2 className="text-3xl md:text-4xl font-serif text-rose-950">
                                {location.pathname.split('/').pop()?.charAt(0).toUpperCase() + location.pathname.split('/').pop()!.slice(1)}
                            </h2>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-rose-200 border-2 border-white shadow-sm overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=60" alt="Profile" className="w-full h-full object-cover" />
                        </div>
                    </header>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default EstherLayout;
