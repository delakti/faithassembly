import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import {
    HiHome,
    HiUsers,
    HiViewGrid, // Portals
    HiChartBar,
    HiCog,
    HiLogout,
    HiShieldCheck
} from 'react-icons/hi';

const SuperAdminLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const auth = getAuth();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/super-admin/login');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const navItems = [
        { path: '/super-admin/dashboard', label: 'Dashboard', icon: <HiHome className="w-5 h-5" /> },
        { path: '/super-admin/users', label: 'User Management', icon: <HiUsers className="w-5 h-5" /> },
        { path: '/super-admin/portals', label: 'Portal Oversight', icon: <HiViewGrid className="w-5 h-5" /> },
        { path: '/super-admin/analytics', label: 'Analytics & Logs', icon: <HiChartBar className="w-5 h-5" /> },
        { path: '/super-admin/settings', label: 'System Settings', icon: <HiCog className="w-5 h-5" /> },
    ];

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex-shrink-0 flex flex-col transition-all duration-300">
                <div className="p-6 border-b border-slate-800 flex items-center space-x-3">
                    <HiShieldCheck className="w-8 h-8 text-red-500" />
                    <div>
                        <h1 className="font-bold text-lg tracking-wide">Super Admin</h1>
                        <p className="text-xs text-slate-400">Control Center</p>
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
                                        ? 'bg-red-600 text-white shadow-md'
                                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                    }`}
                            >
                                <span className={`mr-3 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
                                    {item.icon}
                                </span>
                                <span className="font-medium text-sm">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors text-sm font-medium"
                    >
                        <HiLogout className="w-5 h-5 mr-3" />
                        Sign Out
                    </button>
                    <div className="mt-4 text-center">
                        <p className="text-[10px] text-slate-600">Faith Assembly System v2.0</p>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <header className="bg-white shadow-sm h-16 flex items-center justify-between px-8 sticky top-0 z-10">
                    <h2 className="text-xl font-bold text-gray-800 capitalize">
                        {location.pathname.split('/').pop()?.replace('-', ' ') || 'Dashboard'}
                    </h2>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold border border-red-200">
                                S
                            </div>
                            <div className="text-sm">
                                <p className="font-semibold text-gray-900 leading-none">Super Admin</p>
                                <p className="text-xs text-gray-500">System Owner</p>
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

export default SuperAdminLayout;
