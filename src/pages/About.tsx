import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import pastorSolomon from '../assets/pastor-solomon.png';
import pastorOla from '../assets/pastor-ola.jpg';

const About: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-white">
            {/* Hero Section */}
            <div className="relative h-[60vh] flex items-center justify-center bg-gray-900 text-white overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-60"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1544253108-9648939a038f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")' }}
                />
                <div className="relative z-10 text-center px-4 max-w-4xl">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-5xl md:text-7xl font-bold mb-6 tracking-tight"
                    >
                        WHO WE ARE
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="text-xl md:text-2xl font-light text-gray-200"
                    >
                        Our story, our vision, and our leadership.
                    </motion.p>
                </div>
            </div>

            {/* Mission & Vision */}
            <div className="py-24 px-4 max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-sm font-bold text-cyan-500 tracking-widest uppercase mb-3">Our Mission</h2>
                        <h3 className="text-4xl font-bold text-gray-900 mb-6">Building Disciples Who Make Disciples.</h3>
                        <p className="text-lg text-gray-600 leading-relaxed mb-6">
                            Faith Assembly exists to lead people into a life-changing relationship with Jesus Christ. We believe that church is more than a service—it's a family where people find purpose, hope, and a place to belong.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <img className="rounded-lg shadow-xl w-full h-full object-cover transform translate-y-8" src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Community" />
                        <img className="rounded-lg shadow-xl w-full h-full object-cover" src="https://images.unsplash.com/photo-1521334884326-7543f3911d19?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Worship" />
                    </div>
                </div>
            </div>

            {/* Pastor Profile */}
            <div className="bg-gray-50 py-24 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-4xl font-bold mb-16">Meet Our Pastors</h2>
                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Pastor Solomon */}
                        <div className="bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col">
                            <div className="h-96 relative">
                                <img
                                    src={pastorSolomon}
                                    alt="Pastor Solomon"
                                    className="absolute inset-0 w-full h-full object-cover object-top"
                                />
                            </div>
                            <div className="p-8 text-center">
                                <h3 className="text-2xl font-bold mb-2">Pastor Solomon</h3>
                                <p className="text-cyan-600 font-semibold mb-4">Senior Pastor</p>
                                <p className="text-gray-600 leading-relaxed">
                                    A visionary leader with a heart for people and a passion for God's word.
                                </p>
                            </div>
                        </div>

                        {/* Pastor Ola */}
                        <div className="bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col">
                            <div className="h-96 relative">
                                <img
                                    src={pastorOla}
                                    alt="Pastor Ola"
                                    className="absolute inset-0 w-full h-full object-cover object-top"
                                />
                            </div>
                            <div className="p-8 text-center">
                                <h3 className="text-2xl font-bold mb-2">Pastor Ola</h3>
                                <p className="text-cyan-600 font-semibold mb-4">Pastor</p>
                                <p className="text-gray-600 leading-relaxed">
                                    Dedicated to serving the community and nurturing spiritual growth.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Values */}
            <div className="py-24 px-4 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold">What We Believe</h2>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { title: "The Bible", desc: "We believe the Bible is the inspired, infallible Word of God." },
                        { title: "Salvation", desc: "We believe salvation is a free gift of God, received through faith in Jesus." },
                        { title: "Community", desc: "We believe we are better together and created for relationship." }
                    ].map((value, idx) => (
                        <div key={idx} className="bg-white p-8 border border-gray-100 rounded-xl shadow-sm hover:shadow-lg transition-shadow">
                            <h4 className="text-xl font-bold mb-4 text-gray-900">{value.title}</h4>
                            <p className="text-gray-600">{value.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default About;
