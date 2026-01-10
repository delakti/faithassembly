import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiArrowLeft, HiArrowRight, HiScale, HiUserGroup } from 'react-icons/hi';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const MensFellowship: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-white font-sans text-slate-900">
            <Navbar />

            {/* HERO */}
            <div className="relative h-[60vh] flex items-center justify-center bg-slate-900 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1552581234-26160f608093?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center opacity-40 mix-blend-overlay" />
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-block py-1 px-4 rounded bg-blue-600 text-white text-xs font-bold uppercase tracking-widest mb-6">
                            Brotherhood
                        </span>
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight uppercase">
                            Men of Valor
                        </h1>
                        <p className="text-xl text-slate-300 font-light max-w-2xl mx-auto leading-relaxed">
                            Iron sharpens iron. We are building strong leaders, fathers, and husbands for the glory of God.
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <Link to="/ministries" className="inline-flex items-center text-slate-500 hover:text-blue-700 transition">
                    <HiArrowLeft className="mr-2" /> Back to Ministries
                </Link>
            </div>

            {/* CONTENT */}
            <section className="py-16 px-4">
                <div className="max-w-6xl mx-auto grid md:grid-cols-12 gap-12 items-center">

                    {/* Main Content */}
                    <div className="md:col-span-7 lg:col-span-8">
                        <h2 className="text-4xl font-black text-slate-900 mb-6 uppercase tracking-tight">Stand Firm.</h2>
                        <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                            In a world that confuses true masculinity, we look to Christ as our standard. The Men's Fellowship is a place where you can be real, find accountability, and grow in your walk with God. No pretense, just brotherhood.
                        </p>

                        <div className="grid sm:grid-cols-2 gap-6 mb-12">
                            <div className="flex items-start">
                                <div className="bg-blue-100 p-3 rounded-lg text-blue-700 mr-4">
                                    <HiScale className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-lg">Accountability</h4>
                                    <p className="text-sm text-slate-500">Groups designed to help you stay on track.</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="bg-blue-100 p-3 rounded-lg text-blue-700 mr-4">
                                    <HiUserGroup className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-lg">Mentorship</h4>
                                    <p className="text-sm text-slate-500">Wisdom passed down through generations.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar CTA */}
                    <div className="md:col-span-5 lg:col-span-4">
                        <div className="bg-slate-900 p-10 rounded-2xl shadow-2xl text-center text-white">
                            <h3 className="text-2xl font-black uppercase mb-4 text-white">Men's Portal</h3>
                            <p className="text-slate-400 mb-8">
                                Access study resources, event schedules, and group chats.
                            </p>

                            <Link
                                to="/men/login"
                                className="block w-full bg-blue-600 text-white font-bold py-4 rounded-lg hover:bg-blue-700 transition"
                            >
                                ACCESS PORTAL <HiArrowRight className="inline ml-2" />
                            </Link>
                        </div>
                    </div>

                </div>
            </section>

            <Footer />
        </div>
    );
};

export default MensFellowship;
