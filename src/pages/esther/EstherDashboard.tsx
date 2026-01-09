import React from 'react';
import { HiSparkles, HiCalendar, HiUserGroup } from 'react-icons/hi';
import { motion } from 'framer-motion';

const EstherDashboard: React.FC = () => {
    return (
        <div className="space-y-8 font-sans">
            {/* Hero / Verse of Day */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-rose-100 relative overflow-hidden text-center md:text-left"
            >
                <div className="relative z-10 max-w-3xl">
                    <span className="inline-block px-3 py-1 bg-rose-50 text-rose-600 text-xs font-bold tracking-widest uppercase rounded-full mb-6">Verse of the Day</span>
                    <blockquote className="font-serif text-3xl md:text-4xl text-rose-950 leading-snug mb-6 italic">
                        "She is clothed with strength and dignity; she can laugh at the days to come."
                    </blockquote>
                    <cite className="text-gray-500 font-medium not-italic block">— Proverbs 31:25</cite>
                </div>
                {/* Decorative Floral */}
                <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-1/4 translate-y-1/4">
                    <svg width="400" height="400" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#BE185D" d="M45.7,-76.3C58.9,-69.3,69.1,-58.3,77.3,-46.3C85.5,-34.3,91.7,-21.3,90.4,-8.8C89.1,3.8,80.3,15.9,71.2,27.3C62.1,38.7,52.7,49.4,41.9,57.1C31.1,64.8,18.9,69.5,7.1,68.4C-4.7,67.3,-16.1,60.4,-27.4,53.4C-38.7,46.4,-49.9,39.3,-58.5,29.3C-67.1,19.3,-73.1,6.4,-72.4,-6.2C-71.7,-18.8,-64.3,-31.1,-54.6,-41.8C-44.9,-52.5,-32.9,-61.6,-20.5,-69.1C-8.1,-76.6,4.7,-82.5,17.2,-81.9C29.7,-81.3,42,-74.2,45.7,-76.3Z" transform="translate(100 100)" />
                    </svg>
                </div>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-rose-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 bg-yellow-50 rounded-full flex items-center justify-center mb-4 text-yellow-600">
                        <HiSparkles className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-serif text-gray-900 mb-2">New Devotional</h3>
                    <p className="text-gray-500 text-sm mb-4">"Finding Peace in the Chaos" - Sister Beatrice explores how we can stay grounded.</p>
                    <button className="text-rose-500 text-sm font-medium hover:text-rose-600 transition-colors">Read More &rarr;</button>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-rose-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-blue-600">
                        <HiCalendar className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-serif text-gray-900 mb-2">Morning Prayer</h3>
                    <p className="text-gray-500 text-sm mb-4">Join us this Saturday at 7:00 AM for our monthly intercession circle.</p>
                    <button className="text-rose-500 text-sm font-medium hover:text-rose-600 transition-colors">RSVP Now &rarr;</button>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-rose-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center mb-4 text-green-600">
                        <HiUserGroup className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-serif text-gray-900 mb-2">Mentoring Groups</h3>
                    <p className="text-gray-500 text-sm mb-4">Applications for the Spring mentorship cohort are now open.</p>
                    <button className="text-rose-500 text-sm font-medium hover:text-rose-600 transition-colors">Learn More &rarr;</button>
                </div>
            </div>

        </div>
    );
};

export default EstherDashboard;
