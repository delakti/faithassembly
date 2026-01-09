import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    HiUserGroup,
    HiMusicNote,
    HiSparkles,
    HiGlobeAlt,
    HiHeart,
    HiDesktopComputer,
    HiBriefcase,
    HiArrowRight
} from 'react-icons/hi';
import { FaChild, FaPrayingHands } from 'react-icons/fa';

const MINISTRIES = [
    {
        title: "Children's Church",
        desc: "A fun, safe, and faith-filled environment where kids learn about Jesus through creative lessons and play.",
        target: "Ages 3-12",
        icon: <FaChild className="w-8 h-8" />,
        color: "bg-yellow-100 text-yellow-600",
        link: "/children/login"
    },
    {
        title: "Youth Ministry",
        desc: "Empowering the next generation to live boldly for Christ in a complex world.",
        target: "Ages 13-19",
        icon: <HiSparkles className="w-8 h-8" />,
        color: "bg-purple-100 text-purple-600",
        link: "/groups"
    },
    {
        title: "Women of Faith",
        desc: "A sisterhood of women encouraging one another in faith, prayer, and life.",
        target: "All Women",
        icon: <HiHeart className="w-8 h-8" />,
        color: "bg-pink-100 text-pink-600",
        link: "/groups"
    },
    {
        title: "Men's Fellowship",
        desc: "Men sharpening men. Building strong leaders, fathers, and husbands.",
        target: "All Men",
        icon: <HiBriefcase className="w-8 h-8" />,
        color: "bg-blue-100 text-blue-600",
        link: "/groups"
    },
    {
        title: "Worship & Choir",
        desc: "Leading the congregation into the presence of God through dynamic praise and worship.",
        target: "Musicians & Vocalists",
        icon: <HiMusicNote className="w-8 h-8" />,
        color: "bg-orange-100 text-orange-600",
        link: "/volunteer"
    },
    {
        title: "Evangelism",
        desc: "Taking the Gospel to the streets of Uxbridge and beyond. Sharing the love of Jesus.",
        target: "Everyone",
        icon: <HiGlobeAlt className="w-8 h-8" />,
        color: "bg-green-100 text-green-600",
        link: "/volunteer"
    },
    {
        title: "Media & Tech",
        desc: "Using technology to amplify the message. Cameras, sound, projection, and streaming.",
        target: "Tech Savvy",
        icon: <HiDesktopComputer className="w-8 h-8" />,
        color: "bg-indigo-100 text-indigo-600",
        link: "/volunteer"
    },
    {
        title: "Prayer Team",
        desc: "Interceding for the church, the nation, and specific needs. The engine room of the church.",
        target: "Prayer Warriors",
        icon: <FaPrayingHands className="w-8 h-8" />,
        color: "bg-red-100 text-red-600",
        link: "/prayer"
    },
    {
        title: "Ushering & Hospitality",
        desc: "Creating a welcoming atmosphere for every guest and member who walks through our doors.",
        target: "Everyone",
        icon: <HiUserGroup className="w-8 h-8" />,
        color: "bg-teal-100 text-teal-600",
        link: "/volunteer"
    }
];

const Ministries: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.5 }
    };

    return (
        <div className="bg-white font-sans">
            {/* HERO */}
            <div className="relative h-[50vh] flex items-center justify-center bg-gray-900 text-white overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-40"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")' }}
                />
                <div className="relative z-10 text-center px-4 pt-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="flex items-center justify-center space-x-2 text-sm text-cyan-400 font-semibold uppercase tracking-wider mb-4">
                            <Link to="/" className="hover:text-white transition">Home</Link>
                            <HiArrowRight />
                            <span>Ministries</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">
                            Our Ministries
                        </h1>
                        <p className="text-xl md:text-2xl font-light text-gray-200">
                            Serving God, Serving People.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* OVERVIEW */}
            <section className="py-20 px-4 max-w-4xl mx-auto text-center">
                <motion.div {...fadeInUp}>
                    <p className="text-xl text-gray-600 leading-relaxed font-light">
                        "Each of you should use whatever gift you have received to serve others, as faithful stewards of God’s grace in its various forms." <span className="text-cyan-600 font-bold block mt-2 text-base not-italic">— 1 Peter 4:10</span>
                    </p>
                    <p className="mt-6 text-gray-500">
                        At Faith Assembly, ministry is about more than just programs—it's about people. We believe that every member has a unique role to play in the body of Christ. Whether you have a heart for kids, a passion for purity, or a talent for tech, there is a place for you to belong and serve.
                    </p>
                </motion.div>
            </section>

            {/* MINISTRIES GRID */}
            <section className="bg-gray-50 py-24 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {MINISTRIES.map((min, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.05 }}
                                className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col overflow-hidden group"
                            >
                                <div className="p-8 flex-grow">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${min.color} group-hover:scale-110 transition-transform`}>
                                        {min.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{min.title}</h3>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">{min.target}</p>
                                    <p className="text-gray-600 text-sm leading-relaxed mb-6">
                                        {min.desc}
                                    </p>
                                </div>
                                <div className="p-4 bg-gray-50 border-t border-gray-100">
                                    <Link
                                        to={min.link}
                                        className="text-cyan-600 font-bold text-sm uppercase tracking-wide flex items-center justify-center hover:text-cyan-800 transition"
                                    >
                                        Get Involved <HiArrowRight className="ml-1" />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="bg-cyan-600 py-24 px-4 text-center">
                <div className="max-w-3xl mx-auto text-white">
                    <h2 className="text-3xl font-bold mb-6">Ready to Serve?</h2>
                    <p className="text-cyan-100 mb-10 text-lg">
                        We would love to help you find your perfect fit in the Faith Assembly family.
                    </p>
                    <Link
                        to="/volunteer"
                        className="inline-block bg-white text-cyan-700 px-10 py-4 rounded-full font-bold text-lg hover:bg-cyan-50 transition shadow-xl"
                    >
                        Join a Team Today
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Ministries;
