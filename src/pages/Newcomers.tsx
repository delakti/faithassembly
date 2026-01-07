import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Newcomers: React.FC = () => {
    useEffect(() => { window.scrollTo(0, 0); }, []);
    return (
        <div className="pt-32 px-4 max-w-4xl mx-auto min-h-screen text-center">
            <h1 className="text-5xl font-bold mb-8">Welcome to the Family!</h1>
            <p className="text-xl text-gray-600 mb-12">
                We are so glad you are here. Whether you are new to faith or looking for a new church home, there is a place for you at Faith Assembly.
            </p>
            <div className="flex justify-center gap-4">
                <Link to="/plan-visit" className="bg-cyan-600 text-white px-8 py-3 rounded-full font-bold hover:bg-cyan-700 transition">
                    Plan Your Visit
                </Link>
                <Link to="/about" className="bg-gray-100 text-gray-900 px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition">
                    Learn About Us
                </Link>
            </div>
        </div>
    );
};
export default Newcomers;
