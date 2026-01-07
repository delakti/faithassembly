import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaYoutube, FaTwitter, FaSoundcloud, FaTiktok, FaSpotify } from 'react-icons/fa';

const Footer: React.FC = () => {
    return (
        <footer className="bg-neutral-900 text-white pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

                    {/* Column 1: Brand & Contact */}
                    <div>
                        <h3 className="text-2xl font-bold mb-6">FAITH ASSEMBLY</h3>
                        <p className="text-gray-400 mb-4">
                            25 Bakers Road<br />
                            Uxbridge, Greater London
                        </p>
                        <p className="text-gray-400">
                            Sunday Service: 10:00 AM
                        </p>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6 text-yellow-500">Quick Links</h4>
                        <ul className="space-y-3 text-gray-400">
                            <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
                            <li><Link to="/services" className="hover:text-white transition">Service Times</Link></li>
                            <li><Link to="/events" className="hover:text-white transition">Events Calendar</Link></li>
                            <li><Link to="/contact" className="hover:text-white transition">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Connect */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6 text-yellow-500">Connect</h4>
                        <ul className="space-y-3 text-gray-400">
                            <li><Link to="/plan-visit" className="hover:text-white transition">Plan Your Visit</Link></li>
                            <li><Link to="/give" className="hover:text-white transition">Give Online</Link></li>
                            <li><Link to="/sermons" className="hover:text-white transition">Watch Sermons</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Social */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6 text-yellow-500">Follow Us</h4>
                        <div className="flex space-x-4 text-2xl text-gray-400 flex-wrap gap-y-2">
                            <a href="https://www.facebook.com/RCCGFaithAssemblyUxbridge/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition"><FaFacebook /></a>
                            <a href="https://twitter.com/faithassemblyux" target="_blank" rel="noopener noreferrer" className="hover:text-white transition"><FaTwitter /></a>
                            <a href="https://www.instagram.com/rccgfaithassembly/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition"><FaInstagram /></a>
                            <a href="https://www.youtube.com/channel/UCI8g_7iBvboeQteg-vH9lXg" target="_blank" rel="noopener noreferrer" className="hover:text-white transition"><FaYoutube /></a>
                            <a href="https://soundcloud.com/rccg-faith-assembly-uxbridge" target="_blank" rel="noopener noreferrer" className="hover:text-white transition"><FaSoundcloud /></a>
                            <a href="https://www.tiktok.com/@faithassemblyuxbridge" target="_blank" rel="noopener noreferrer" className="hover:text-white transition"><FaTiktok /></a>
                            <a href="https://open.spotify.com/artist/3F1j870mdry7yJpQXX4bOU?si=SB0K54XUQvCsrXJkZU92bw" target="_blank" rel="noopener noreferrer" className="hover:text-white transition"><FaSpotify /></a>
                        </div>
                    </div>

                </div>

                <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} Faith Assembly. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
