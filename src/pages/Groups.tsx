import React from 'react';
import { motion } from 'framer-motion';
import { FaUserCircle, FaMapMarkerAlt } from 'react-icons/fa';

interface GroupData {
    fellowship: string;
    locations: string[];
    leaders: string;
    color: string;
}

const groupsData: GroupData[] = [
    {
        fellowship: "House of Bethel",
        locations: ["Uxbridge", "Brunel", "Hillingdon"],
        leaders: "Titi / Elizabeth",
        color: "bg-blue-600"
    },
    {
        fellowship: "House of Rehoboth",
        locations: ["Ickenham", "Harefield", "Ruislip", "Gerard Cross"],
        leaders: "Samson / James",
        color: "bg-emerald-600"
    },
    {
        fellowship: "House of Power",
        locations: ["Yeading", "Northwood", "Hayes", "Eastcote", "Northolt", "Hounslow"],
        leaders: "Ife / Anu",
        color: "bg-purple-600"
    },
    {
        fellowship: "House of Glory",
        locations: ["Yiewsley", "West Drayton", "Cowley", "Heathrow"],
        leaders: "Chinonso / Deji / David",
        color: "bg-amber-600"
    }
];

const Groups: React.FC = () => {
    return (
        <div className="bg-gray-50 min-h-screen pt-20 pb-16">
            {/* Hero Section */}
            <div className="bg-neutral-900 text-white py-16 mb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold mb-4"
                    >
                        Our House Fellowships
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-gray-400 max-w-2xl mx-auto"
                    >
                        Connect, grow, and fellowship with believers in your local area. Find the house closest to you.
                    </motion.p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                    {groupsData.map((group, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 border border-gray-100"
                        >
                            <div className={`${group.color} p-6 text-white`}>
                                <h2 className="text-2xl font-bold">{group.fellowship}</h2>
                            </div>

                            <div className="p-8">
                                <div className="mb-6">
                                    <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <FaMapMarkerAlt /> Locations Covered
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {group.locations.map((loc, i) => (
                                            <span key={i} className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                                                {loc}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center pt-6 border-t border-gray-100">
                                    <div className="flex -space-x-4 mr-4">
                                        {/* Placeholder Avatars based on number of leaders approximately */}
                                        {group.leaders.split('/').map((_, i) => (
                                            <div key={i} className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-gray-400">
                                                <FaUserCircle className="w-full h-full" />
                                            </div>
                                        ))}
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Led by</p>
                                        <p className="font-semibold text-gray-900">{group.leaders}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Groups;
