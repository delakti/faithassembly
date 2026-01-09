import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { FaChild, FaHome, FaClipboardList, FaChalkboardTeacher, FaCalendarAlt, FaImages, FaSignOutAlt, FaBars, FaTimes, FaExclamationTriangle, FaEnvelope } from 'react-icons/fa';

const ChildrenLayout: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const auth = getAuth();

    const handleLogout = async () => {
        await auth.signOut();
        navigate('/children/login');
    };

    const navItems = [
        { path: '/children/dashboard', label: 'Dashboard', icon: <FaHome /> },
        { path: '/children/directory', label: 'Directory', icon: <FaChild /> },
        { path: '/children/attendance', label: 'Attendance', icon: <FaClipboardList /> },
        { path: '/children/lessons', label: 'Lessons', icon: <FaChalkboardTeacher /> },
        { path: '/children/events', label: 'Events', icon: <FaCalendarAlt /> },
        { path: '/children/incidents', label: 'Incidents', icon: <FaExclamationTriangle /> },
        { path: '/children/gallery', label: 'Gallery', icon: <FaImages /> },
        { path: '/children/messaging', label: 'Messaging', icon: <FaEnvelope /> },
    ];

    return (
        <div className="min-h-screen bg-sky-50 flex flex-col md:flex-row font-sans">
            {/* Mobile Header */}
            <header className="md:hidden bg-white p-4 shadow-sm flex justify-between items-center z-20 relative">
                <div className="flex items-center space-x-2">
                    <FaChild className="text-sky-500 text-2xl" />
                    <span className="font-bold text-gray-800 text-lg">Kids Ministry</span>
                </div>
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-600 focus:outline-none">
                    {isSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                </button>
            </header>

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                md:relative md:translate-x-0 transition duration-200 ease-in-out
                bg-white w-64 shadow-xl md:shadow-none z-10 flex flex-col
            `}>
                <div className="p-6 border-b border-gray-100 hidden md:flex items-center space-x-3">
                    <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center text-sky-600">
                        <FaChild size={20} />
                    </div>
                    <div>
                        <h1 className="font-extrabold text-gray-900 leading-tight">Faith Kids</h1>
                        <p className="text-xs text-gray-500 font-medium">Staff Portal</p>
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                    {navItems.map((item) => {
                        const isActive = location.pathname.startsWith(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsSidebarOpen(false)}
                                className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                    ? 'bg-sky-50 text-sky-700 font-bold shadow-sm'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <span className={`mr-3 text-lg ${isActive ? 'text-sky-600' : 'text-gray-400 group-hover:text-gray-600'}`}>
                                    {item.icon}
                                </span>
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                    >
                        <FaSignOutAlt className="mr-3" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Overlay for mobile sidebar */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-0 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default ChildrenLayout;
