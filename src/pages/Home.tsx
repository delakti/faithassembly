import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center text-center text-white">
                {/* Background Image Overlay */}
                <div className="absolute inset-0 bg-black/50 z-10" />
                <div
                    className="absolute inset-0 bg-cover bg-center z-0"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1438232992991-995b7058bbb3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")' }}
                />

                {/* Content */}
                <div className="relative z-20 px-4 max-w-4xl mx-auto">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-5xl md:text-7xl font-bold mb-6 tracking-tight"
                    >
                        FAITH ASSEMBLY
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-xl md:text-2xl mb-8 font-light"
                    >
                        Building Disciples who Make Disciples.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <Link to="/plan-visit" className="bg-yellow-500 text-black px-8 py-3 rounded-full font-bold uppercase tracking-wider hover:bg-yellow-400 transition-transform hover:scale-105 flex items-center justify-center gap-2">
                            Plan Your Visit <FaArrowRight />
                        </Link>
                        <a href="https://www.youtube.com/@faithassemblyuk/streams" target="_blank" rel="noopener noreferrer" className="bg-transparent border-2 border-white px-8 py-3 rounded-full font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-transform hover:scale-105">
                            Watch Online
                        </a>
                    </motion.div>
                </div>
            </section>

            {/* Service Service Times Bar */}
            <section className="bg-neutral-900 py-6 text-white border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-4">
                    <div className="flex items-center gap-3">
                        <FaClock className="text-yellow-500 text-xl" />
                        <div>
                            <p className="font-bold uppercase tracking-wide text-sm text-gray-400">Next Service</p>
                            <p className="text-lg">Sunday 10:00 AM</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <FaMapMarkerAlt className="text-yellow-500 text-xl" />
                        <div>
                            <p className="font-bold uppercase tracking-wide text-sm text-gray-400">Location</p>
                            <p className="text-lg">Faith Arena, 25 Bakers Road, Uxbridge</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Welcome / Mission Section */}
            <section className="py-20 px-4 bg-white">
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="text-4xl font-bold mb-8 text-gray-900">WELCOME HOME</h2>
                    <p className="text-xl text-gray-600 leading-relaxed mb-10">
                        We are a community of believers passionate about God and people.
                        No matter where you are in your journey, you belong here.
                        Join us as we worship, learn, and grow together in faith.
                    </p>
                    <Link to="/about" className="text-yellow-600 font-bold uppercase hover:text-yellow-700 underline underline-offset-4">
                        Learn More About Us
                    </Link>
                </div>
            </section>

            {/* Grid Images Section */}
            <section className="grid grid-cols-1 md:grid-cols-2">
                <div className="relative h-96">
                    <img
                        src="https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                        alt="Worship"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center hover:bg-black/30 transition-colors cursor-pointer group">
                        <h3 className="text-4xl font-bold text-white group-hover:scale-110 transition-transform">Ministries</h3>
                    </div>
                </div>
                <div className="relative h-96">
                    <img
                        src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                        alt="Community"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center hover:bg-black/30 transition-colors cursor-pointer group">
                        <h3 className="text-4xl font-bold text-white group-hover:scale-110 transition-transform">Events</h3>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
