import React from 'react';
import { Link } from 'react-router-dom';
import {
    FaChild, FaUserFriends, FaFemale, FaMale, FaMusic,
    FaPray, FaHandHoldingHeart, FaMicrophoneAlt, FaBullhorn,
    FaHome, FaChalkboardTeacher, FaShoppingCart, FaPaintBrush, FaUserTie
} from 'react-icons/fa';

const portals = [
    {
        id: 'youth',
        name: 'Youth Ministry',
        path: '/youth/dashboard',
        icon: <FaUserFriends className="text-4xl text-orange-500" />,
        description: 'Manage youth events, groups, and resources.',
        color: 'border-orange-200 bg-orange-50'
    },
    {
        id: 'children',
        name: 'Children\'s Church',
        path: '/children/dashboard',
        icon: <FaChild className="text-4xl text-blue-500" />,
        description: 'Manage kids check-in, lessons, and profiles.',
        color: 'border-blue-200 bg-blue-50'
    },
    {
        id: 'women',
        name: 'Women of Faith',
        path: '/esther/dashboard',
        icon: <FaFemale className="text-4xl text-pink-500" />,
        description: 'Esther Generation devotionals and groups.',
        color: 'border-pink-200 bg-pink-50'
    },
    {
        id: 'men',
        name: 'Men\'s Fellowship',
        path: '/men/dashboard',
        icon: <FaMale className="text-4xl text-slate-700" />,
        description: 'Men\'s events, forums, and accountability.',
        color: 'border-slate-200 bg-slate-50'
    },
    {
        id: 'worship',
        name: 'Worship & Choir',
        path: '/worship/dashboard',
        icon: <FaMusic className="text-4xl text-purple-500" />,
        description: 'Song library, rosters, and rehearsals.',
        color: 'border-purple-200 bg-purple-50'
    },
    {
        id: 'prayer',
        name: 'Prayer Team',
        path: '/prayer/dashboard',
        icon: <FaPray className="text-4xl text-indigo-500" />,
        description: 'Prayer schedules, requests, and vigils.',
        color: 'border-indigo-200 bg-indigo-50'
    },
    {
        id: 'house',
        name: 'House Fellowships',
        path: '/members/fellowship/dashboard',
        icon: <FaHome className="text-4xl text-green-600" />,
        description: 'Attendance and offerings for home cells.',
        color: 'border-green-200 bg-green-50'
    },
    {
        id: 'sunday-school',
        name: 'Life Discussion',
        path: '/life-discussion/dashboard',
        icon: <FaChalkboardTeacher className="text-4xl text-yellow-600" />,
        description: 'Sunday school classes, rotas, and lessons.',
        color: 'border-yellow-200 bg-yellow-50'
    },
    {
        id: 'media',
        name: 'Media & Tech',
        path: '/media/dashboard',
        icon: <FaMicrophoneAlt className="text-4xl text-red-500" />,
        description: 'Equipment logs and service production schedules.',
        color: 'border-red-200 bg-red-50'
    },
    {
        id: 'evangelism',
        name: 'Evangelism',
        path: '/evangelism/dashboard',
        icon: <FaBullhorn className="text-4xl text-teal-600" />,
        description: 'Outreach schedules and follow-up tracking.',
        color: 'border-teal-200 bg-teal-50'
    },
    {
        id: 'hospitality',
        name: 'Hospitality & Ushering',
        path: '/hospitality/dashboard',
        icon: <FaHandHoldingHeart className="text-4xl text-rose-500" />,
        description: 'Greeting teams, rotas, and guest handling.',
        color: 'border-rose-200 bg-rose-50'
    },
    {
        id: 'store',
        name: 'Bookstore Manager',
        path: '/admin/products',
        icon: <FaShoppingCart className="text-4xl text-emerald-600" />,
        description: 'Manage E-commerce products and orders.',
        color: 'border-emerald-200 bg-emerald-50'
    },
    {
        id: 'decoration',
        name: 'Beauty & Decoration',
        path: '/decoration/dashboard',
        icon: <FaPaintBrush className="text-4xl text-fuchsia-600" />,
        description: 'Manage decor inventory, rotas, and events.',
        color: 'border-fuchsia-200 bg-fuchsia-50'
    },
    {
        id: 'house-admin',
        name: 'House Superintendent',
        path: '/house-admin/dashboard',
        icon: <FaUserTie className="text-4xl text-indigo-600" />,
        description: 'Superintendent oversight and reporting.',
        color: 'border-indigo-200 bg-indigo-50'
    }
];

const PortalManager: React.FC = () => {
    return (
        <div>
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Ministry Portals Oversight</h2>
                <p className="text-gray-600 mt-2">Access and monitor all ministry-specific subsystems from one central location.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {portals.map(portal => (
                    <div key={portal.id} className={`bg-white rounded-xl shadow-sm hover:shadow-md transition border ${portal.color} p-6 relative overflow-hidden group`}>
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110">
                            {portal.icon}
                        </div>

                        <div className="flex items-center mb-4 space-x-4">
                            <div className="bg-white p-3 rounded-full shadow-sm">
                                {portal.icon}
                            </div>
                            <h3 className="font-bold text-lg text-gray-900">{portal.name}</h3>
                        </div>

                        <p className="text-gray-600 text-sm mb-6 h-10">{portal.description}</p>

                        <Link
                            to={portal.path}
                            className="inline-block w-full text-center py-2 px-4 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 font-medium rounded-lg transition hover:bg-gray-50"
                        >
                            Open Portal
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PortalManager;
