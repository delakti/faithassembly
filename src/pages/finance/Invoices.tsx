import React from 'react';
import { FaFileInvoiceDollar } from 'react-icons/fa';

const Invoices: React.FC = () => {
    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                <FaFileInvoiceDollar size={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Invoice Manager</h1>
            <p className="text-gray-500 max-w-md mx-auto">Create and track invoices for vendors and service providers. Coming soon.</p>
        </div>
    );
};

export default Invoices;
