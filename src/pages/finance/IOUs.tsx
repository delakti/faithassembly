import React from 'react';
import { FaHandHoldingUsd } from 'react-icons/fa';

const IOUs: React.FC = () => {
    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-600">
                <FaHandHoldingUsd size={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">IOU & Reimbursements</h1>
            <p className="text-gray-500 max-w-md mx-auto">Track money owed to or by the church. This feature is coming in the next update.</p>
        </div>
    );
};

export default IOUs;
