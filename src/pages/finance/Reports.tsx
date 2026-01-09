import React from 'react';
import { FaChartPie, FaDownload } from 'react-icons/fa';

const Reports: React.FC = () => {
    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 text-teal-600">
                <FaChartPie size={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Financial Reports</h1>
            <p className="text-gray-500 max-w-md mx-auto mb-6">Detailed income and expense analysis with export functionality.</p>

            <button disabled className="px-6 py-2 bg-gray-100 text-gray-400 rounded-full font-bold cursor-not-allowed flex items-center justify-center mx-auto">
                <FaDownload className="mr-2" /> Download Report (Disabled)
            </button>
        </div>
    );
};

export default Reports;
