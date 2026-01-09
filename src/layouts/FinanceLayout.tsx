import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { FaLandmark, FaHome, FaMoneyBillWave, FaFileInvoiceDollar, FaChartPie, FaUniversity, FaSignOutAlt, FaBars, FaTimes, FaHandHoldingUsd } from 'react-icons/fa';

const FinanceLayout: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const auth = getAuth();

    const handleLogout = async () => {
        await auth.signOut();
        navigate('/finance/login');
    };

    const navItems = [
        { path: '/finance/dashboard', label: 'Dashboard', icon: <FaHome /> },
        { path: '/finance/income', label: 'Income', icon: <FaHandHoldingUsd /> },
        { path: '/finance/expenses', label: 'Expenses', icon: <FaMoneyBillWave /> },
        { path: '/finance/invoices', label: 'Invoices', icon: <FaFileInvoiceDollar /> },
        { path: '/finance/banking', label: 'Banking', icon: <FaUniversity /> },
        { path: '/finance/reports', label: 'Reports', icon: <FaChartPie /> },
    ];

    return (
        <div className="min-h-screen bg-emerald-50 flex flex-col md:flex-row font-sans">
            {/* Mobile Header */}
            <header className="md:hidden bg-white p-4 shadow-sm flex justify-between items-center z-20 relative">
                <div className="flex items-center space-x-2">
                    <FaLandmark className="text-emerald-600 text-2xl" />
                    <span className="font-bold text-gray-800 text-lg">Finance Portal</span>
                </div>
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-600 focus:outline-none">
                    {isSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                </button>
            </header>

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                md:relative md:translate-x-0 transition duration-200 ease-in-out
                bg-slate-900 w-64 shadow-xl md:shadow-none z-10 flex flex-col text-white
            `}>
                <div className="p-6 border-b border-slate-800 hidden md:flex items-center space-x-3">
                    <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center text-white shadow-lg">
                        <FaLandmark size={20} />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg leading-tight">Faith Finance</h1>
                        <p className="text-xs text-slate-400">Department Access</p>
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
                                className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${isActive
                                        ? 'bg-emerald-600 text-white font-bold shadow-md'
                                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                    }`}
                            >
                                <span className={`mr-3 text-lg ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
                                    {item.icon}
                                </span>
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-400 rounded-lg hover:bg-slate-800 transition-colors"
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

export default FinanceLayout;
