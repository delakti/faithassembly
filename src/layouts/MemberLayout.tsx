import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { FaHome, FaHandHoldingHeart, FaUsers, FaCalendarCheck, FaPray, FaUserCircle, FaSignOutAlt, FaBars, FaTimes, FaSignature, FaBullhorn, FaCalendarAlt } from 'react-icons/fa';

const MemberLayout: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const auth = getAuth();

    const handleLogout = async () => {
        try {
            await auth.signOut();
            navigate('/members/login');
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const navItems = [
        { path: '/members/dashboard', label: 'Dashboard', icon: <FaHome /> },
        { path: '/members/giving', label: 'My Giving', icon: <FaHandHoldingHeart /> },
        { path: '/members/gift-aid', label: 'Gift Aid', icon: <FaSignature /> },
        { path: '/members/groups', label: 'Groups', icon: <FaUsers /> },
        { path: '/members/check-in', label: 'Check-In', icon: <FaCalendarCheck /> },
        { path: '/members/news', label: 'News', icon: <FaBullhorn /> },
        { path: '/members/appointments', label: 'Appointments', icon: <FaCalendarAlt /> },
        { path: '/members/prayer', label: 'Prayer & Care', icon: <FaPray /> },
        { path: '/members/profile', label: 'My Profile', icon: <FaUserCircle /> },
    ];

    const NavLinkItem = ({ item, mobile = false }: { item: any, mobile?: boolean }) => {
        const isActive = location.pathname === item.path;
        return (
            <Link
                to={item.path}
                onClick={() => mobile && setIsSidebarOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive
                    ? 'bg-blue-100 text-blue-700 font-bold'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
            >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
            </Link>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 fixed inset-y-0 z-20">
                <div className="h-16 flex items-center px-6 border-b border-gray-200">
                    <FaUserCircle className="text-blue-600 text-2xl mr-3" />
                    <span className="text-xl font-bold text-gray-800 tracking-tight">Member Portal</span>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLinkItem key={item.path} item={item} />
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-500 bg-gray-50 rounded-lg mb-2">
                        <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold">
                            {auth.currentUser?.displayName?.charAt(0) || 'M'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="font-medium truncate text-gray-900">{auth.currentUser?.displayName || 'Member'}</p>
                            <p className="text-xs truncate">{auth.currentUser?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full space-x-3 px-4 py-2 text-gray-600 hover:text-red-600 transition-colors"
                    >
                        <FaSignOutAlt />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Header */}
            <header className="md:hidden fixed top-0 w-full bg-white border-b border-gray-200 z-30 h-16 flex items-center justify-between px-4">
                <div className="flex items-center">
                    <FaUserCircle className="text-blue-600 text-xl mr-2" />
                    <span className="font-bold text-gray-800">Member Portal</span>
                </div>
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-gray-600">
                    {isSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                </button>
            </header>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div className="md:hidden fixed inset-0 z-40 bg-gray-800 bg-opacity-75" onClick={() => setIsSidebarOpen(false)}></div>
            )}

            {/* Mobile Sidebar Drawer */}
            <div className={`md:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="h-16 flex items-center px-4 border-b border-gray-200 justify-between">
                    <span className="text-lg font-bold text-gray-800">Menu</span>
                    <button onClick={() => setIsSidebarOpen(false)}><FaTimes /></button>
                </div>
                <nav className="p-4 space-y-2">
                    {navItems.map((item) => (
                        <NavLinkItem key={item.path} item={item} mobile />
                    ))}
                    <div className="border-t border-gray-100 my-4 pt-4">
                        <button
                            onClick={handleLogout}
                            className="flex items-center space-x-3 px-4 py-3 w-full text-red-600 font-medium"
                        >
                            <FaSignOutAlt />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </nav>
            </div>

            {/* Main Content Area */}
            <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 transition-all">
                <Outlet />
            </main>
        </div>
    );
};

export default MemberLayout;
