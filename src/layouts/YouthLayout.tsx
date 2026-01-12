
import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import {
    HiHome,
    HiCalendar,
    HiUserGroup,
    HiPhotograph,
    HiChatAlt2,
    HiLogout,
    HiLightningBolt
} from 'react-icons/hi';

const YouthLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const auth = getAuth();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/youth/login');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const navItems = [
        { path: '/youth/dashboard', label: 'Home', icon: <HiHome className="w-6 h-6" /> },
        { path: '/youth/events', label: 'Events', icon: <HiCalendar className="w-6 h-6" /> },
        { path: '/youth/groups', label: 'Squads', icon: <HiUserGroup className="w-6 h-6" /> },
        { path: '/youth/chat', label: 'Chat', icon: <HiChatAlt2 className="w-6 h-6" /> },
        { path: '/youth/media', label: 'Media', icon: <HiPhotograph className="w-6 h-6" /> },
    ];

    return (
        <div className="flex h-screen bg-black text-white font-sans overflow-hidden">
            {/* Mobile Bottom Nav (Visible on small screens) */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 flex justify-around p-4 z-50">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`text - gray - 400 ${location.pathname.startsWith(item.path) ? 'text-yellow-400' : ''} `}
                    >
                        {item.icon}
                    </Link>
                ))}
            </div>

            {/* Desktop Sidebar (Hidden on mobile) */}
            <aside className="hidden md:flex w-64 bg-gray-900 flex-col border-r border-gray-800">
                <div
                    onClick={() => navigate('/youth/dashboard')}
                    className="p-8 flex items-center space-x-3 cursor-pointer group"
                >
                    <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center transform -rotate-6 group-hover:rotate-0 transition-transform">
                        <HiLightningBolt className="w-6 h-6 text-black" />
                    </div>
                    <div>
                        <h1 className="font-black text-2xl tracking-tighter italic text-white group-hover:text-yellow-400 transition-colors">YTH<span className="text-yellow-400 group-hover:text-white transition-colors">NATION</span></h1>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    {navItems.map((item) => {
                        const isActive = location.pathname.startsWith(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items - center px - 4 py - 4 rounded - xl transition - all font - bold ${isActive
                                    ? 'bg-yellow-400 text-black translate-x-2'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                    } `}
                            >
                                <span className="mr-3">{item.icon}</span>
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-6">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-red-400 hover:text-red-300 transition-colors font-bold text-sm"
                    >
                        <HiLogout className="w-5 h-5 mr-3" />
                        Log Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto pb-20 md:pb-0 relative">
                {/* Background Blobs */}
                <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-yellow-600/10 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="p-6 md:p-10 relative z-10">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-black text-white italic uppercase tracking-wide">
                            {location.pathname.split('/').pop()?.toUpperCase() || 'DASHBOARD'}
                        </h2>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 border-2 border-white/20"></div>
                    </div>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default YouthLayout;
