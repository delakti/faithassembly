import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    HiBookOpen,
    HiUserGroup,
    HiCalendar,
    HiClipboardList,
    HiMenu,
    HiX,
    HiHome,
    HiLogout,
    HiAnnotation,
    HiAcademicCap
} from 'react-icons/hi';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const LifeDiscussionLayout: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [userRole, setUserRole] = useState<string>('');
    const location = useLocation();
    const navigate = useNavigate();
    const auth = getAuth();
    const db = getFirestore();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                // Fetch role for UI customization
                try {
                    const docSnap = await getDoc(doc(db, 'users', currentUser.uid));
                    if (docSnap.exists()) {
                        setUserRole(docSnap.data().role);
                    }
                } catch (err) {
                    console.error("Error fetching role:", err);
                }
            } else {
                setUser(null);
                setUserRole('');
            }
        });
        return () => unsubscribe();
    }, [auth, db]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/life-discussion/login');
        } catch (error) {
            console.error('Failed to log out', error);
        }
    };

    const isTeacher = ['sunday_teacher', 'sunday_admin', 'super_admin'].includes(userRole);

    // Navigation items based on role
    const navItems = [
        { path: '/life-discussion/dashboard', name: 'Dashboard', icon: <HiHome className="w-5 h-5" /> },
        { path: '/life-discussion/announcements', name: 'Announcements', icon: <HiAnnotation className="w-5 h-5" /> },
    ];

    if (isTeacher) {
        navItems.push(
            { path: '/life-discussion/rota', name: 'Teacher Rota', icon: <HiCalendar className="w-5 h-5" /> },
            { path: '/life-discussion/classes', name: 'Manage Groups', icon: <HiUserGroup className="w-5 h-5" /> },
            { path: '/life-discussion/assignments', name: 'Assignments', icon: <HiClipboardList className="w-5 h-5" /> },
            { path: '/life-discussion/resources', name: 'Lesson Plans', icon: <HiBookOpen className="w-5 h-5" /> },
            { path: '/life-discussion/leader', name: 'Leader Panel', icon: <HiAcademicCap className="w-5 h-5" /> }
        );
    } else {
        // Student items
        navItems.push(
            { path: '/life-discussion/my-assignments', name: 'My Assignments', icon: <HiClipboardList className="w-5 h-5" /> },
            { path: '/life-discussion/my-attendance', name: 'My Attendance', icon: <HiAcademicCap className="w-5 h-5" /> }
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 shadow-sm fixed inset-y-0 left-0 z-10 transition-all">
                <div className="p-6 border-b border-slate-100 flex items-center space-x-3">
                    <div className="bg-sky-100 p-2 rounded-lg text-sky-600">
                        <HiBookOpen className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-slate-800 leading-tight">Life Disc.</h1>
                        <p className="text-xs text-slate-500">Sunday School</p>
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive = location.pathname.startsWith(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                    ? 'bg-sky-50 text-sky-700 font-semibold shadow-sm ring-1 ring-sky-100'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                            >
                                <span className={`${isActive ? 'text-sky-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
                                    {item.icon}
                                </span>
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <div className="flex items-center px-4 py-3 mb-2 bg-slate-50 rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-sky-200 flex items-center justify-center text-sky-700 font-bold text-sm">
                            {user?.displayName?.charAt(0) || 'U'}
                        </div>
                        <div className="ml-3 overflow-hidden">
                            <p className="text-sm font-medium text-slate-900 truncate">{user?.displayName || 'User'}</p>
                            <p className="text-xs text-slate-500 truncate capitalize">{userRole?.replace('sunday_', '') || 'Guest'}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center space-x-2 bg-white border border-slate-200 text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                    >
                        <HiLogout className="w-4 h-4" />
                        <span>Sign Out</span>
                    </button>
                    <Link to="/" className="block text-center mt-3 text-xs text-slate-400 hover:text-sky-600 hover:underline">
                        Back to Main Site
                    </Link>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 w-full bg-white border-b border-slate-200 z-20 px-4 py-3 flex items-center justify-between shadow-sm">
                <div className="flex items-center space-x-2">
                    <div className="bg-sky-100 p-1.5 rounded-md text-sky-600">
                        <HiBookOpen className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-slate-800">Life Discussion</span>
                </div>
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                    <HiMenu className="w-6 h-6" />
                </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSidebarOpen(false)}
                            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 md:hidden"
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 w-72 bg-white z-40 md:hidden shadow-2xl flex flex-col"
                        >
                            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-sky-100 p-2 rounded-lg text-sky-600">
                                        <HiBookOpen className="w-6 h-6" />
                                    </div>
                                    <span className="font-bold text-lg text-slate-800">Menu</span>
                                </div>
                                <button
                                    onClick={() => setIsSidebarOpen(false)}
                                    className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                                >
                                    <HiX className="w-6 h-6" />
                                </button>
                            </div>

                            <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setIsSidebarOpen(false)}
                                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${location.pathname.startsWith(item.path)
                                            ? 'bg-sky-50 text-sky-700 font-semibold ring-1 ring-sky-100'
                                            : 'text-slate-600 hover:bg-slate-50'
                                            }`}
                                    >
                                        <span className={location.pathname.startsWith(item.path) ? 'text-sky-600' : 'text-slate-400'}>
                                            {item.icon}
                                        </span>
                                        <span>{item.name}</span>
                                    </Link>
                                ))}
                            </nav>

                            <div className="p-5 border-t border-slate-100">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-center space-x-2 bg-slate-50 text-slate-700 px-4 py-3 rounded-xl font-medium"
                                >
                                    <HiLogout className="w-5 h-5" />
                                    <span>Sign Out</span>
                                </button>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 pt-16 md:pt-0 min-h-screen transition-all duration-300">
                <div className="p-4 md:p-8 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default LifeDiscussionLayout;
