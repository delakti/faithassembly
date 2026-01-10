import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const MemberRoute: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setIsAuthenticated(true);
                // Check Role
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    // Allow access to Member Dashboard for ANY valid user with a role
                    // This includes 'user', 'member', 'admin', 'volunteer', and all ministry leaders/members
                    if (data.role) {
                        setIsAuthorized(true);
                    } else {
                        setIsAuthorized(false);
                    }
                } else {
                    setIsAuthorized(false);
                }
            } else {
                setIsAuthenticated(false);
                setIsAuthorized(false);
            }
        });

        return () => unsubscribe();
    }, [auth]);

    if (isAuthenticated === null || isAuthorized === null) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/members/login" replace />;
    }

    if (!isAuthorized) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-center p-4">
                <h1 className="text-3xl font-bold text-red-600 mb-4">Access Restricted</h1>
                <p className="text-gray-600 mb-8">This area is for registered members only.</p>
                <div className="space-x-4">
                    <a href="/members/login" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Login</a>
                    <a href="/" className="px-6 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">Home</a>
                </div>
            </div>
        );
    }

    return <Outlet />;
};

export default MemberRoute;
