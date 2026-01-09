import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import type { UserRole } from '../../types/volunteer';

const VolunteerRoute: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setIsAuthenticated(true);

                // Check Role in Firestore
                try {
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        const role = userData.role as UserRole;

                        // Allow if role is volunteer OR admin (admins should see everything)
                        if (role === 'volunteer' || role === 'admin') {
                            setIsAuthorized(true);
                        } else {
                            setIsAuthorized(false);
                            console.warn("User is authenticated but not a volunteer/admin.");
                        }
                    } else {
                        // Profile doesn't exist yet
                        setIsAuthorized(false);
                        console.warn("User profile not found in Firestore.");
                    }
                } catch (error) {
                    console.error("Error fetching user role:", error);
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
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <p className="text-gray-500">Verifying access...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/team/login" replace />;
    }

    if (!isAuthorized) {
        // User is logged in but not authorized. 
        // Could redirect to a "Not Authorized" page or Home.
        // For now, let's redirect to a dedicated unauthorized page or Home with a query param
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
                <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
                <p className="text-gray-600 mb-6 max-w-md">
                    You do not have the required permissions to access the Volunteer Portal.
                    If you believe this is an error, please contact the creative team.
                </p>
                <div className="space-x-4">
                    <button
                        onClick={() => auth.signOut()}
                        className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition"
                    >
                        Sign Out
                    </button>
                    <a href="/" className="px-6 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition">
                        Go Home
                    </a>
                </div>
            </div>
        );
    }

    return <Outlet />;
};

export default VolunteerRoute;
