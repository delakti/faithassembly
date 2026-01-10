import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { FaSearch, FaPlus, FaFilter } from 'react-icons/fa';

import type { Child } from '../../types/children';

const ChildDirectory: React.FC = () => {
    const [children, setChildren] = useState<Child[]>([]);

    const [filteredChildren, setFilteredChildren] = useState<Child[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterGroup, setFilterGroup] = useState('All');

    useEffect(() => {
        fetchChildren();
    }, []);

    useEffect(() => {
        filterData();
    }, [search, filterGroup, children]);

    const fetchChildren = async () => {
        try {
            const q = query(collection(db, 'children'), orderBy('firstName', 'asc'));
            const snap = await getDocs(q);
            const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Child));
            setChildren(data);
            setFilteredChildren(data);
        } catch (error) {
            console.error("Error fetching children:", error);
        } finally {
            setLoading(false);
        }
    };

    const filterData = () => {
        let result = children;

        if (search) {
            const lowerSearch = search.toLowerCase();
            result = result.filter(child =>
                child.firstName.toLowerCase().includes(lowerSearch) ||
                child.lastName.toLowerCase().includes(lowerSearch)
            );
        }

        if (filterGroup !== 'All') {
            result = result.filter(child => child.assignedGroup === filterGroup);
        }

        setFilteredChildren(result);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Child Directory</h1>
                    <p className="text-gray-500">Manage profiles for {children.length} registered children.</p>
                </div>
                <Link to="/children/register" className="bg-sky-500 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-sky-600 transition flex items-center shadow-md">
                    <FaPlus className="mr-2" /> Register Child
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name..."
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-200 outline-none"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <div className="relative w-full md:w-48">
                    <FaFilter className="absolute left-3 top-3.5 text-gray-400" />
                    <select
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-200 outline-none appearance-none bg-white"
                        value={filterGroup}
                        onChange={e => setFilterGroup(e.target.value)}
                    >
                        <option value="All">All Groups</option>
                        <option value="Creche">Creche (0-4)</option>
                        <option value="Primary">Primary (5-11)</option>
                        <option value="Teens">Teens (12-18)</option>
                    </select>
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="text-center py-12 text-gray-400">Loading directory...</div>
            ) : filteredChildren.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                    <p className="text-gray-500">No children found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredChildren.map((child: Child) => (
                        <Link to={`/children/profile/${child.id}`} key={child.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-14 h-14 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center text-2xl font-bold">
                                    {child.firstName[0]}{child.lastName[0]}
                                </div>
                                <span className={`px-2 py-1 rounded-lg text-xs font-bold uppercase ${child.assignedGroup === 'Creche' ? 'bg-pink-100 text-pink-700' :
                                    child.assignedGroup === 'Primary' ? 'bg-orange-100 text-orange-700' :
                                        'bg-purple-100 text-purple-700'
                                    }`}>
                                    {child.assignedGroup}
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-sky-600 transition">{child.firstName} {child.lastName}</h3>
                            <p className="text-gray-500 text-sm mb-2">{new Date().getFullYear() - new Date(child.dateOfBirth).getFullYear()} years old</p>

                            {child.allergies && (
                                <div className="mt-3 bg-red-50 text-red-700 text-xs px-2 py-1 rounded inline-block font-medium">
                                    Allergies: {child.allergies}
                                </div>
                            )}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ChildDirectory;
