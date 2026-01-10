import React, { useState, useEffect, createContext, useContext } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { ref, query, orderByChild, equalTo, get } from 'firebase/database';
import { database } from '../firebase';
import { FaHome, FaClipboardList, FaHandHoldingHeart, FaCalendarAlt, FaComments, FaFolderOpen, FaSpinner, FaArrowLeft } from 'react-icons/fa';

// Context Type Definition
interface HouseFellowshipData {
    name: string;
    leaders: string;
    isLeader: boolean;
    details: any | null; // From churchGroups
}

interface Member {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
}

interface HouseContextType {
    fellowship: HouseFellowshipData | null;
    members: Member[];
    loading: boolean;
    refreshFellowship: () => Promise<void>;
}

const HouseContext = createContext<HouseContextType>({
    fellowship: null,
    members: [],
    loading: true,
    refreshFellowship: async () => { }
});

export const useHouseFellowship = () => useContext(HouseContext);

const HouseLayout: React.FC = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const navigate = useNavigate();
    const [fellowship, setFellowship] = useState<HouseFellowshipData | null>(null);
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchFellowshipData = async () => {
        if (!user?.email) {
            setLoading(false);
            return;
        }

        try {
            const db = database;
            // 1. Get Donor Record to find Fellowship Name
            const donorRef = ref(db, 'donor');
            const donorQ = query(donorRef, orderByChild('Email'), equalTo(user.email));
            const donorSnapshot = await get(donorQ);

            if (donorSnapshot.exists()) {
                const donorVal = donorSnapshot.val();
                const donorKey = Object.keys(donorVal)[0];
                const donorData = donorVal[donorKey];

                const fellowshipName = donorData.HouseFellowship;
                // Basic cleanup of leaders string for checking
                const leadersString = donorData.HouseFellowshipLeaders || '';

                if (fellowshipName) {
                    // Check if current user is a leader
                    // Logic: user.displayName or parts of it inside leadersString? 
                    // Or precise name match? For now, we'll do a simple includes check if displayName exists
                    // Ideally, we'd have a list of leader UIDs, but we work with what we have.
                    // Check if current user is a leader
                    // 1. Check if name is in list (Legacy/Simple method)
                    let isLeader = user.displayName
                        ? leadersString.toLowerCase().includes(user.displayName.toLowerCase())
                        : false;

                    // 2. Check Firestore Role (Stronger method)
                    // We need to import getDoc and doc from firebase/firestore if not already imported?
                    // NOTE: HouseLayout didn't import them. Let's assume we need to or fail gracefully.
                    // Actually, let's do a dynamic import or add imports at the top. 
                    // To keep this clean, let's just use the fact that we might have fetched the user role in a context/parent?
                    // No, MemberRoute does it but doesn't pass it down. 
                    // Let's do a quick fetch here.
                    try {
                        const { getDoc, doc, getFirestore } = await import('firebase/firestore');
                        const dbFS = getFirestore();
                        const userDoc = await getDoc(doc(dbFS, 'users', user.uid));
                        if (userDoc.exists()) {
                            const data = userDoc.data();
                            if (['house_leader', 'admin', 'super_admin'].includes(data.role)) {
                                isLeader = true;
                            }
                        }
                    } catch (err) {
                        console.error("Error determining leader role", err);
                    }

                    let details = null;

                    // 2. Get Fellowship Details from churchGroups
                    // Fetch all and find match (client-side filtering as per previous fix)
                    const groupsRef = ref(db, 'churchGroups');
                    const groupsSnapshot = await get(groupsRef);
                    if (groupsSnapshot.exists()) {
                        const groupsVal = groupsSnapshot.val();
                        const groupKey = Object.keys(groupsVal).find(key =>
                            groupsVal[key]?.title === fellowshipName
                        );
                        if (groupKey) {
                            details = { id: groupKey, ...groupsVal[groupKey] };
                        }
                    }

                    // 3. Fetch Members
                    const membersQ = query(donorRef, orderByChild('HouseFellowship'), equalTo(fellowshipName));
                    const memSnapshot = await get(membersQ);
                    const memberList: Member[] = [];
                    if (memSnapshot.exists()) {
                        const memData = memSnapshot.val();
                        Object.keys(memData).forEach(key => {
                            memberList.push({
                                id: key,
                                firstName: memData[key]['First Name'] || memData[key].FirstName || 'Unknown',
                                lastName: memData[key]['Last Name'] || memData[key].Surname || '',
                                email: memData[key].Email || '',
                                phone: memData[key].Mobile || memData[key].MobileNumber || memData[key]['Mobile Phone'] || '',
                            });
                        });
                        memberList.sort((a, b) => a.firstName.localeCompare(b.firstName));
                    }
                    setMembers(memberList);

                    setFellowship({
                        name: fellowshipName,
                        leaders: leadersString,
                        isLeader: isLeader, // Override this later if we need strict 'Leader' role logic
                        details
                    });
                } else {
                    setFellowship(null); // User is not in a fellowship
                    setMembers([]);
                }
            } else {
                setFellowship(null);
                setMembers([]);
            }
        } catch (error) {
            console.error("Error loading fellowship:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFellowshipData();
    }, [user]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <FaSpinner className="animate-spin text-4xl text-blue-600 mb-4 mx-auto" />
                    <p className="text-gray-500">Loading your fellowship portal...</p>
                </div>
            </div>
        );
    }

    if (!fellowship) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
                    <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaHome className="text-3xl" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">No Fellowship Assigned</h2>
                    <p className="text-gray-600 mb-6">
                        It looks like you haven't been assigned to a House Fellowship yet.
                        Please contact the administration or join a group from the list.
                    </p>
                    <div className="flex flex-col space-y-3">
                        <button
                            onClick={() => navigate('/members/groups')}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition"
                        >
                            Browse Groups
                        </button>
                        <button
                            onClick={() => navigate('/members/dashboard')}
                            className="text-gray-500 font-medium hover:text-gray-700"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const navItems = [
        { to: '/members/fellowship/dashboard', icon: FaHome, label: 'Dashboard', restricted: false },
        { to: '/members/fellowship/attendance', icon: FaClipboardList, label: 'Attendance', restricted: false }, // Leader view is internal
        { to: '/members/fellowship/offerings', icon: FaHandHoldingHeart, label: 'Offerings', restricted: true }, // Leader only
        { to: '/members/fellowship/events', icon: FaCalendarAlt, label: 'Events', restricted: false },
        { to: '/members/fellowship/chat', icon: FaComments, label: 'Chat', restricted: false },
        { to: '/members/fellowship/resources', icon: FaFolderOpen, label: 'Resources', restricted: false },
    ];

    return (
        <HouseContext.Provider value={{ fellowship, members, loading, refreshFellowship: fetchFellowshipData }}>
            <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
                {/* Sidebar Navigation */}
                <aside className="bg-white border-r border-gray-200 md:w-64 flex-shrink-0">
                    <div className="p-6 border-b border-gray-100 mb-4">
                        <div className="flex items-center space-x-3 mb-4 cursor-pointer text-gray-400 hover:text-blue-600 transition" onClick={() => navigate('/members/dashboard')}>
                            <FaArrowLeft />
                            <span className="text-sm font-bold uppercase tracking-wide">Exit Portal</span>
                        </div>
                        <h1 className="text-xl font-bold text-gray-900 leading-tight">
                            {fellowship.name}
                        </h1>
                        <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded">
                            {fellowship.isLeader ? 'Leader View' : 'Member View'}
                        </span>
                    </div>

                    <nav className="px-4 space-y-1">
                        {navItems.map(item => {
                            // Hide restricted items if not leader
                            if (item.restricted && !fellowship.isLeader) return null;

                            return (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    className={({ isActive }) =>
                                        `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${isActive
                                            ? 'bg-blue-600 text-white shadow-sm'
                                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                        }`
                                    }
                                >
                                    <item.icon className="text-lg" />
                                    <span className="font-medium">{item.label}</span>
                                </NavLink>
                            );
                        })}
                    </nav>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 p-6 md:p-8 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </HouseContext.Provider>
    );
};

export default HouseLayout;
