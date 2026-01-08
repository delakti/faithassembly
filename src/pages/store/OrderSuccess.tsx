import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';

const OrderSuccess: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 flex flex-col items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                    <FaCheckCircle className="text-4xl" />
                </motion.div>

                <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
                <p className="text-gray-600 mb-8">
                    Thank you for your purchase. We have received your order and will process it shortly. You will receive an email confirmation soon.
                </p>

                <div className="space-y-4">
                    <Link
                        to="/store"
                        className="block w-full py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
                    >
                        Continue Shopping
                    </Link>
                    <Link
                        to="/"
                        className="block w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition"
                    >
                        Return Home
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default OrderSuccess;
