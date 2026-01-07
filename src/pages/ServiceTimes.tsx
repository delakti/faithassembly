import React from 'react';
import { FaCalendarAlt, FaClock } from 'react-icons/fa';

const ServiceTimes: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 pb-20 pt-24">
            {/* Added pt-24 to account for fixed navbar */}

            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-gray-900 mb-4">SERVICE TIMES</h1>
                    <p className="text-xl text-gray-600">Join us for worship and the word.</p>
                </div>

                <div className="grid gap-6">
                    {/* Sunday Service */}
                    <div className="bg-white rounded-lg shadow-lg p-8 transform hover:-translate-y-1 transition-transform duration-300 border-l-8 border-yellow-500">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Sunday Celebration Service</h2>
                                <p className="text-gray-600">A time of vibrant worship and powerful teaching.</p>
                            </div>
                            <div className="mt-4 md:mt-0 flex items-center text-xl font-bold text-yellow-600 bg-yellow-50 px-4 py-2 rounded-lg">
                                <FaClock className="mr-2" /> 10:00 AM
                            </div>
                        </div>
                    </div>

                    {/* Workers Meeting */}
                    <div className="bg-white rounded-lg shadow-lg p-8 transform hover:-translate-y-1 transition-transform duration-300 border-l-8 border-gray-800">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Workers' Meeting</h2>
                                <p className="text-gray-600">Prayer and preparation for the service.</p>
                            </div>
                            <div className="mt-4 md:mt-0 flex items-center text-xl font-bold text-gray-800 bg-gray-100 px-4 py-2 rounded-lg">
                                <FaClock className="mr-2" /> 09:30 AM (Sundays)
                            </div>
                        </div>
                    </div>

                    {/* Bible Study */}
                    <div className="bg-white rounded-lg shadow-lg p-8 transform hover:-translate-y-1 transition-transform duration-300 border-l-8 border-blue-600">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Bible Study</h2>
                                <p className="text-gray-600">Deep dive into the scriptures (Mid-week).</p>
                            </div>
                            <div className="mt-4 md:mt-0 flex items-center text-xl font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-lg">
                                <FaCalendarAlt className="mr-2" /> Wednesday 7:00 PM
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-16 bg-black text-white p-8 rounded-2xl text-center">
                    <h3 className="text-2xl font-bold mb-4">Cannot make it in person?</h3>
                    <p className="mb-6">Join us online via YouTube or Zoom.</p>
                    <a href="https://www.youtube.com/@faithassemblyuk/streams" target="_blank" rel="noopener noreferrer" className="inline-block bg-white text-black font-bold py-3 px-8 rounded-full hover:bg-gray-200 transition-colors">
                        Watch Online
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ServiceTimes;
