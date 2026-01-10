import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiArrowLeft, HiArrowRight, HiMusicNote, HiMicrophone, HiSparkles } from 'react-icons/hi';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const WorshipChoir: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-white font-sans text-slate-900">
            <Navbar />

            {/* HERO */}
            <div className="relative h-[65vh] flex items-center justify-center bg-orange-900 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1510915361894-db8b60106cb1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center opacity-50 mix-blend-hard-light" />
                <div className="absolute inset-0 bg-gradient-to-t from-orange-900 via-transparent to-transparent" />

                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-orange-100 to-orange-400 mb-4 tracking-tight drop-shadow-xl">
                            Sound of Heaven
                        </h1>
                        <p className="text-xl text-orange-100 font-light max-w-2xl mx-auto">
                            Leading the congregation into the presence of God through dynamic praise and intimate worship.
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <Link to="/ministries" className="inline-flex items-center text-slate-500 hover:text-orange-600 transition">
                    <HiArrowLeft className="mr-2" /> Back to Ministries
                </Link>
            </div>

            {/* CONTENT */}
            <section className="py-16 px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-slate-900 mb-6">More Than Music</h2>
                        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                            We are worshipers first, muscians second. Our mandate is to create an atmosphere where the Holy Spirit can move freely and hearts can be transformed.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 mb-20">
                        <div className="bg-white p-8 rounded-xl shadow-lg border border-orange-100 text-center hover:scale-105 transition-transform duration-300">
                            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mx-auto mb-6">
                                <HiMicrophone className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Vocals</h3>
                            <p className="text-slate-500 text-sm">Choir and Praise Team singers who lead with passion and skill.</p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-lg border border-orange-100 text-center hover:scale-105 transition-transform duration-300">
                            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mx-auto mb-6">
                                <HiMusicNote className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Band</h3>
                            <p className="text-slate-500 text-sm">Skilled instrumentalists creating the soundscape for worship.</p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-lg border border-orange-100 text-center hover:scale-105 transition-transform duration-300">
                            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mx-auto mb-6">
                                <HiSparkles className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Excellence</h3>
                            <p className="text-slate-500 text-sm">Committment to rehearsals and spiritual preparation.</p>
                        </div>
                    </div>

                    {/* CTA Box */}
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden shadow-2xl">
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Join the Team</h2>
                            <p className="text-orange-100 mb-8 max-w-xl mx-auto text-lg">
                                Access the Worship Portal for setlists, charts, rehearsal schedules, and team communications.
                            </p>
                            <Link
                                to="/worship/login"
                                className="inline-block bg-white text-orange-600 font-bold px-10 py-4 rounded-full shadow-lg hover:bg-orange-50 transition transform hover:scale-105"
                            >
                                Team Login <HiArrowRight className="inline ml-1" />
                            </Link>
                        </div>
                    </div>

                </div>
            </section>

            <Footer />
        </div>
    );
};

export default WorshipChoir;
