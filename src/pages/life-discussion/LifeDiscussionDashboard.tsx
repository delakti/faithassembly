import React, { useEffect, useState } from 'react';
import {
    HiOutlineClipboardList,
    HiOutlineAnnotation,
    HiOutlineCalendar,
    HiOutlineUserGroup,
    HiOutlineBookOpen,
    HiOutlineClock
} from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const LifeDiscussionDashboard: React.FC = () => {
    const [user, setUser] = useState<any>(null);
    const [userRole, setUserRole] = useState<string>('');
    const auth = getAuth();
    const db = getFirestore();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                try {
                    const docSnap = await getDoc(doc(db, 'users', currentUser.uid));
                    if (docSnap.exists()) {
                        setUserRole(docSnap.data().role);
                    }
                } catch (err) {
                    console.error("Error fetching role:", err);
                }
            } else {
                setUser(null);
            }
        });
        return () => unsubscribe();
    }, [auth, db]);

    const isTeacher = ['sunday_teacher', 'sunday_admin', 'super_admin'].includes(userRole);

    // Mock data - replace with real data in later phases
    const upcomingClass = {
        title: "The Power of Prayer",
        date: "Sunday, 12th Jan",
        time: "9:30 AM",
        room: "Room 3B",
        teacher: "Bro. David"
    };

    const nextAssignment = {
        title: "Reflection on Psalm 23",
        dueDate: "Friday, 17th Jan",
        status: "Pending"
    };

    return (
        <div className="space-y-8">
            {/* Welcome Header */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <HiOutlineBookOpen className="w-64 h-64 text-sky-900" />
                </div>
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">
                        Welcome back, <span className="text-sky-600">{user?.displayName?.split(' ')[0] || 'Student'}</span>!
                    </h1>
                    <p className="text-slate-500 max-w-2xl">
                        {isTeacher
                            ? "Ready to inspire? You have an upcoming class this Sunday. Check your rota and prepare your materials."
                            : "Ready to learn? Don't forget to complete your reflection assignment before Friday."}
                    </p>
                </div>
            </div>

            {/* Quick Stats / Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card 1: Next Class */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-slate-500 font-medium text-sm uppercase tracking-wider">Next Class</h3>
                            <div className="bg-emerald-100 text-emerald-600 p-2 rounded-lg">
                                <HiOutlineCalendar className="w-5 h-5" />
                            </div>
                        </div>
                        <h4 className="text-lg font-bold text-slate-800">{upcomingClass.title}</h4>
                        <p className="text-slate-500 text-sm mt-1">{upcomingClass.date} &bull; {upcomingClass.time}</p>
                    </div>
                    <div className="mt-6 pt-6 border-t border-slate-50 flex items-center text-sm text-slate-500">
                        <HiOutlineUserGroup className="w-4 h-4 mr-2" />
                        <span>{upcomingClass.room} &bull; {upcomingClass.teacher}</span>
                    </div>
                </div>

                {/* Card 2: Assignments */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-slate-500 font-medium text-sm uppercase tracking-wider">Assignments</h3>
                            <div className="bg-amber-100 text-amber-600 p-2 rounded-lg">
                                <HiOutlineClipboardList className="w-5 h-5" />
                            </div>
                        </div>
                        <h4 className="text-lg font-bold text-slate-800">{nextAssignment.title}</h4>
                        <p className="text-slate-500 text-sm mt-1">Due: {nextAssignment.dueDate}</p>
                    </div>
                    <div className="mt-6 pt-6 border-t border-slate-50 flex items-center">
                        <span className="bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full text-xs font-medium">
                            {nextAssignment.status}
                        </span>
                    </div>
                </div>

                {/* Card 3: Announcements */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-slate-500 font-medium text-sm uppercase tracking-wider">Updates</h3>
                            <div className="bg-purple-100 text-purple-600 p-2 rounded-lg">
                                <HiOutlineAnnotation className="w-5 h-5" />
                            </div>
                        </div>
                        <h4 className="text-lg font-bold text-slate-800">New Term Begins!</h4>
                        <p className="text-slate-500 text-sm mt-1 line-clamp-2">
                            Welcome to the Spring Term. We are excited to start our new series on the Parables of Jesus.
                        </p>
                    </div>
                    <div className="mt-6 pt-6 border-t border-slate-50">
                        <Link to="/life-discussion/announcements" className="text-sm text-sky-600 hover:text-sky-700 font-medium">
                            View all updates &rarr;
                        </Link>
                    </div>
                </div>
            </div>

            {/* Teacher Actions (Only visible to teachers) */}
            {isTeacher && (
                <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Teacher Actions</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Link to="/life-discussion/attendance" className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:border-sky-200 hover:shadow-md transition-all group text-center">
                            <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-sky-600 group-hover:text-white transition-colors">
                                <HiOutlineClock className="w-6 h-6" />
                            </div>
                            <span className="text-sm font-medium text-slate-700">Take Attendance</span>
                        </Link>
                        <Link to="/life-discussion/assignments/new" className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:border-sky-200 hover:shadow-md transition-all group text-center">
                            <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-sky-600 group-hover:text-white transition-colors">
                                <HiOutlineClipboardList className="w-6 h-6" />
                            </div>
                            <span className="text-sm font-medium text-slate-700">New Assignment</span>
                        </Link>
                        <Link to="/life-discussion/resources" className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:border-sky-200 hover:shadow-md transition-all group text-center">
                            <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-sky-600 group-hover:text-white transition-colors">
                                <HiOutlineBookOpen className="w-6 h-6" />
                            </div>
                            <span className="text-sm font-medium text-slate-700">Lesson Plans</span>
                        </Link>
                        <Link to="/life-discussion/classes" className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:border-sky-200 hover:shadow-md transition-all group text-center">
                            <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-sky-600 group-hover:text-white transition-colors">
                                <HiOutlineUserGroup className="w-6 h-6" />
                            </div>
                            <span className="text-sm font-medium text-slate-700">My Students</span>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LifeDiscussionDashboard;
