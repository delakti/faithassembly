import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiArrowLeft, HiArrowRight, HiUserGroup, HiHeart } from 'react-icons/hi';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const UsheringHospitality: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-white font-sans text-slate-900">
            <Navbar />

            {/* HERO */}
            <div className="relative h-[60vh] flex items-center justify-center bg-teal-800 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522855167098-6369c0d95d11?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center opacity-40 mix-blend-overlay" />
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-block py-1 px-4 rounded-full bg-teal-700/50 text-teal-100 border border-teal-500/50 text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-sm">
                            Kingdom Service
                        </span>
                        <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
                            Ushering & <br /> Hospitality
                        </h1>
                        <p className="text-xl text-teal-100 font-light max-w-2xl mx-auto leading-relaxed">
                            Creating a warm, welcoming atmosphere for every soul that walks through our doors.
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <Link to="/ministries" className="inline-flex items-center text-slate-500 hover:text-teal-700 transition">
                    <HiArrowLeft className="mr-2" /> Back to Ministries
                </Link>
            </div>

            {/* CONTENT */}
            <section className="py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16 max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold text-slate-900 mb-6">Service with a Smile</h2>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            We are the first face of Faith Assembly. From the parking lot to the pew, our teams ensure that guests feel seen, loved, and prepared to receive from God.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-10">
                        {/* USHERING */}
                        <div className="bg-slate-50 p-10 rounded-3xl border border-slate-200 hover:shadow-xl transition-shadow flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-teal-600 shadow-sm mb-6">
                                <HiUserGroup className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-slate-900">Ushering Team</h3>
                            <p className="text-slate-500 mb-8 px-4">
                                Managing seating, maintaining order, and handling the offering with integrity.
                            </p>
                            <Link
                                to="/ushering/login"
                                className="mt-auto px-8 py-3 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 transition w-full"
                            >
                                Usher Portal <HiArrowRight className="inline ml-1" />
                            </Link>
                        </div>

                        {/* HOSPITALITY */}
                        <div className="bg-pink-50 p-10 rounded-3xl border border-pink-100 hover:shadow-xl transition-shadow flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-pink-500 shadow-sm mb-6">
                                <HiHeart className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-slate-900">Hospitality Team</h3>
                            <p className="text-slate-500 mb-8 px-4">
                                Welcoming guests, hosting receptions, and ensuring everyone feels at home.
                            </p>
                            <Link
                                to="/hospitality/login"
                                className="mt-auto px-8 py-3 bg-pink-500 text-white font-bold rounded-lg hover:bg-pink-600 transition w-full"
                            >
                                Hospitality Portal <HiArrowRight className="inline ml-1" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default UsheringHospitality;
