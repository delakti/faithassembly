import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HiMenuAlt3, HiChevronDown, HiSearch } from 'react-icons/hi';
import { FaShoppingCart } from 'react-icons/fa';
import { useStore } from '../context/StoreContext';
import { useSearch } from '../context/SearchContext';
import logo from '../assets/logo.jpg';
import whiteLogo from '../assets/logo-white.png';
import QuickMenu from './QuickMenu';

const Navbar: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { cartCount, setIsCartOpen } = useStore();
    const { openSearch } = useSearch();
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

    const linkClasses = "hover:text-cyan-400 transition-colors duration-200 font-semibold uppercase tracking-wide text-sm flex items-center";
    const dropdownClasses = "absolute top-full left-0 bg-white text-gray-800 shadow-xl rounded-md py-2 min-w-[200px] flex flex-col mt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0";
    const dropdownItemClasses = "px-6 py-3 hover:bg-gray-50 hover:text-cyan-600 transition-colors text-sm font-medium border-l-4 border-transparent hover:border-cyan-500";

    // Determine which logo to show
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
                        <div className="hidden lg:block">
                            <div className="ml-10 flex items-center space-x-8">
                                <Link to="/" className={linkClasses}>Home</Link>

                                {/* About Dropdown */}
                                <div className="relative group">
                                    <button className={linkClasses}>
                                        About <HiChevronDown className="ml-1" />
                                    </button>
                                    <div className={dropdownClasses}>
                                        <Link to="/about" className={dropdownItemClasses}>Our Story & Beliefs</Link>
                                        <Link to="/mission" className={dropdownItemClasses}>Mission & Vision</Link>
                                        <Link to="/leadership" className={dropdownItemClasses}>Leadership</Link>
                                        <Link to="/contact" className={dropdownItemClasses}>Contact Us</Link>
                                    </div>
                                </div>

                                {/* Services Dropdown */}
                                <div className="relative group">
                                    <button className={linkClasses}>
                                        Services <HiChevronDown className="ml-1" />
                                    </button>
                                    <div className={dropdownClasses}>
                                        <Link to="/services" className={dropdownItemClasses}>Service Times</Link>
                                        <Link to="/sermons" className={dropdownItemClasses}>Watch Sermons</Link>
                                        <Link to="/plan-visit" className={dropdownItemClasses}>Plan Your Visit</Link>
                                        <Link to="/visit" className={dropdownItemClasses}>Visitor Connect Card</Link>
                                    </div>
                                </div>

                                {/* Ministries Dropdown */}
                                <div className="relative group">
                                    <button className={linkClasses}>
                                        Ministries <HiChevronDown className="ml-1" />
                                    </button>
                                    <div className={dropdownClasses}>
                                        <Link to="/ministries" className={dropdownItemClasses}>All Ministries</Link>
                                        <Link to="/groups" className={dropdownItemClasses}>Groups & Connect</Link>
                                        <Link to="/bible-study" className={dropdownItemClasses}>Bible Study</Link>
                                        <Link to="/children/login" className={dropdownItemClasses}>Children's Ministry</Link>
                                        <Link to="/volunteer" className={dropdownItemClasses}>Volunteer</Link>
                                        <Link to="/members/login" className={dropdownItemClasses}>Members Portal</Link>
                                    </div>
                                </div>

                                <Link to="/events" className={linkClasses}>Events</Link>
                                <Link to="/give" className={linkClasses}>Give</Link>

                                <Link to="/store" className={`${linkClasses} text-purple-400 hover:text-purple-300`}>Store</Link>
                                <button onClick={() => setIsCartOpen(true)} className="relative p-2 text-gray-300 hover:text-white transition">
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
                            <button
                                onClick={openSearch}
                                className="p-2 text-gray-300 hover:text-white transition-colors hover:scale-110 transform"
                                aria-label="Search"
                            >
                                <HiSearch size={22} />
                            </button>

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
