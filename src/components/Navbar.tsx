import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HiMenuAlt3 } from 'react-icons/hi';
import { FaShoppingCart } from 'react-icons/fa';
import { useStore } from '../context/StoreContext';
import logo from '../assets/logo.jpg';
import whiteLogo from '../assets/logo-white.png';
import QuickMenu from './QuickMenu';

const Navbar: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { cartCount, setIsCartOpen } = useStore();
    const location = useLocation();

    const isHome = location.pathname === '/';

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    // Navbar background behavior
    const navbarClasses = isHome
        ? `fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-black/95 text-white shadow-md backdrop-blur-sm' : 'bg-transparent text-white'
        }`
        : 'fixed w-full z-50 bg-black/95 text-white shadow-md backdrop-blur-sm';

    const linkClasses = "hover:text-cyan-400 transition-colors duration-200 font-semibold uppercase tracking-wide text-sm";

    // Determine which logo to show
    // Use white logo if not on home page OR if on home page and scrolled
    const currentLogo = !isHome || (isHome && isScrolled) ? whiteLogo : logo;

    return (
        <>
            <nav className={navbarClasses}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <div className="flex-shrink-0 flex items-center">
                            <Link to="/">
                                <img className="h-12 w-auto" src={currentLogo} alt="Faith Assembly Logo" />
                            </Link>
                        </div>

                        {/* Desktop Center Links */}
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-center space-x-8">
                                <Link to="/" className={linkClasses}>Home</Link>
                                <Link to="/about" className={linkClasses}>About</Link>
                                <Link to="/groups" className={linkClasses}>Groups</Link>
                                <Link to="/bible-study" className={linkClasses}>Bible Study</Link>
                                <Link to="/services" className={linkClasses}>Services</Link>
                                <Link to="/events" className={linkClasses}>Events</Link>
                                <Link to="/contact" className={linkClasses}>Contact</Link>
                                <Link to="/baptism" className={linkClasses}>Baptism</Link>
                                <Link to="/give" className={linkClasses}>Give</Link>
                                <Link to="/volunteer" className={linkClasses}>Volunteer</Link>
                                <Link to="/prayer" className={linkClasses}>Prayer</Link>
                                <Link to="/salvation" className={`${linkClasses} text-red-400 font-semibold`}>Decided?</Link>
                                <Link to="/store" className={`${linkClasses} font-semibold text-purple-600`}>Store</Link>
                                <button onClick={() => setIsCartOpen(true)} className="relative p-2 text-gray-600 hover:text-purple-600 transition">
                                    <FaShoppingCart size={20} />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                            {cartCount}
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Right Side - Plan Visit & Menu */}
                        <div className="flex items-center space-x-4">
                            <Link
                                to="/plan-visit"
                                className="hidden sm:block border-2 border-cyan-500 text-cyan-400 px-4 py-2 rounded hover:bg-cyan-500 hover:text-white transition-all font-semibold uppercase text-sm tracking-wide"
                            >
                                Plan Your Visit
                            </Link>

                            <button
                                onClick={toggleMenu}
                                type="button"
                                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-cyan-400 focus:outline-none transition-transform hover:scale-110"
                                aria-label="Open menu"
                            >
                                <HiMenuAlt3 className="w-8 h-8" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Quick Menu Side Drawer */}
            <QuickMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        </>
    );
};

export default Navbar;
