import React from 'react';
import { FaChartLine } from 'react-icons/fa';

const Budget: React.FC = () => {
    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-600">
                <FaChartLine size={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Budget Planner</h1>
            <p className="text-gray-500 max-w-md mx-auto">Set department budgets and track actual vs planned spending. Coming next update.</p>
        </div>
    );
};

export default Budget;
