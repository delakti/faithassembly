import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
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

    const [userRole, setUserRole] = React.useState('');
    const db = getFirestore();

    React.useEffect(() => {
        const fetchRole = async () => {
            if (auth.currentUser) {
                const docRef = doc(db, 'users', auth.currentUser.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setUserRole(docSnap.data().role);
                }
            }
        };
        fetchRole();
    }, [auth.currentUser]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/admin/super/login');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const navItems = [
        { path: '/admin/super/dashboard', label: 'Dashboard', icon: <HiHome className="w-5 h-5" /> },
        { path: '/admin/super/users', label: 'User Management', icon: <HiUsers className="w-5 h-5" /> },
        { path: '/admin/super/donors', label: 'Donor Management', icon: <HiUsers className="w-5 h-5" /> },
        { path: '/admin/super/portals', label: 'Portal Oversight', icon: <HiViewGrid className="w-5 h-5" /> },
        { path: '/admin/super/analytics', label: 'Analytics & Logs', icon: <HiChartBar className="w-5 h-5" /> },
        { path: '/admin/super/settings', label: 'System Settings', icon: <HiCog className="w-5 h-5" /> },
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

                    {/* Superintendent Link */}
                    {['super_admin', 'admin', 'hospitality_leader', 'house_leader'].includes(userRole) && (
                        <div className="pt-4 mt-2 border-t border-slate-800">
                            <p className="px-4 text-[10px] font-bold text-slate-500 uppercase mb-2 tracking-wider">Superintendent</p>
                            <Link
                                to="/admin/house-superintendent"
                                className={`flex items-center px-4 py-3 rounded-lg transition-colors group ${location.pathname.includes('house-superintendent')
                                    ? 'bg-indigo-600 text-white shadow-md'
                                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                    }`}
                            >
                                <span className={`mr-3 ${location.pathname.includes('house-superintendent') ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
                                    <HiUserGroup className="w-5 h-5" />
                                </span>
                                <span className="font-medium text-sm">House Fellowship</span>
                            </Link>
                        </div>
                    )}
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
