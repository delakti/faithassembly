import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import {
    HiHome,
    HiSpeakerphone,
    HiLogout,
    HiUserGroup
} from 'react-icons/hi';

const HouseAdminLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const auth = getAuth();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/members/login');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const navItems = [
        { path: '/house-admin/dashboard', label: 'Superintendent Overview', icon: <HiHome className="w-5 h-5" /> },
        { path: '/house-admin/communication', label: 'Communication', icon: <HiSpeakerphone className="w-5 h-5" /> },
    ];

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-indigo-900 text-white flex-shrink-0 flex flex-col transition-all duration-300">
                <div className="p-6 border-b border-indigo-800 flex items-center space-x-3">
                    <HiUserGroup className="w-8 h-8 text-indigo-300" />
                    <div>
                        <h1 className="font-bold text-lg tracking-wide leading-tight">House Fellowship</h1>
                        <p className="text-xs text-indigo-300">Administration</p>
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                    {navItems.map((item) => {
                        const isActive = location.pathname.startsWith(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center px-4 py-3 rounded-lg transition-colors group ${isActive
                                    ? 'bg-indigo-700 text-white shadow-md'
                                    : 'text-indigo-100 hover:bg-indigo-800 hover:text-white'
                                    }`}
                            >
                                <span className={`mr-3 ${isActive ? 'text-white' : 'text-indigo-300 group-hover:text-white'}`}>
                                    {item.icon}
                                </span>
                                <span className="font-medium text-sm">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-indigo-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-indigo-300 hover:bg-indigo-800 hover:text-white rounded-lg transition-colors text-sm font-medium"
                    >
                        <HiLogout className="w-5 h-5 mr-3" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <header className="bg-white shadow-sm h-16 flex items-center justify-between px-8 sticky top-0 z-10">
                    <h2 className="text-xl font-bold text-gray-800 capitalize">
                        {navItems.find(i => location.pathname.startsWith(i.path))?.label || 'Dashboard'}
                    </h2>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold border border-indigo-200">
                                S
                            </div>
                            <div className="text-sm">
                                <p className="font-semibold text-gray-900 leading-none">Superintendent</p>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default HouseAdminLayout;
