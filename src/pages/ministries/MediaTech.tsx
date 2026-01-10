import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiArrowLeft, HiArrowRight, HiDesktopComputer, HiVideoCamera, HiWifi } from 'react-icons/hi';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const MediaTech: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-white font-sans text-slate-900">
            <Navbar />

            {/* HERO */}
            <div className="relative h-[60vh] flex items-center justify-center bg-indigo-900 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1520110120835-c96534a4c984?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center opacity-30 mix-blend-lighten" />
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-block py-1 px-4 rounded border border-indigo-400 text-indigo-200 text-xs font-mono mb-6">
                            SYSTEM.INIT(SERVICE)
                        </span>
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                            Media & Tech
                        </h1>
                        <p className="text-xl text-indigo-100 font-light max-w-2xl mx-auto font-mono">
                            Amplify the message. Connect the world. Serve unseen.
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <Link to="/ministries" className="inline-flex items-center text-slate-500 hover:text-indigo-600 transition">
                    <HiArrowLeft className="mr-2" /> Back to Ministries
                </Link>
            </div>

            {/* CONTENT */}
            <section className="py-16 px-4">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-indigo-50 p-6 rounded-2xl text-center">
                            <HiVideoCamera className="w-10 h-10 text-indigo-600 mx-auto mb-3" />
                            <h3 className="font-bold text-slate-900">Visuals</h3>
                        </div>
                        <div className="bg-indigo-50 p-6 rounded-2xl text-center">
                            <HiWifi className="w-10 h-10 text-indigo-600 mx-auto mb-3" />
                            <h3 className="font-bold text-slate-900">Streaming</h3>
                        </div>
                        <div className="bg-indigo-50 p-6 rounded-2xl text-center col-span-2">
                            <HiDesktopComputer className="w-10 h-10 text-indigo-600 mx-auto mb-3" />
                            <h3 className="font-bold text-slate-900">Production</h3>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-6">Behind the Scenes</h2>
                        <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                            The Media Team uses technology to enhance the worship experience and take the Word of God beyond our physical walls. If you are tech-savvy, creative, or willing to learn, we have a spot for you.
                        </p>

                        <div className="bg-indigo-900 text-white p-8 rounded-2xl shadow-xl">
                            <h3 className="text-xl font-bold mb-2 text-indigo-100">Tech Team Portal</h3>
                            <p className="text-indigo-200/70 mb-6 text-sm">
                                Manage equipment, view rosters, and access production schedules.
                            </p>

                            <Link
                                to="/media/login"
                                className="block w-full bg-indigo-500 text-white font-bold py-3 text-center rounded-lg hover:bg-indigo-600 transition"
                            >
                                AUTHORIZE ACCESS <HiArrowRight className="inline ml-2" />
                            </Link>
                        </div>
                    </div>

                </div>
            </section>

            <Footer />
        </div>
    );
};

export default MediaTech;
