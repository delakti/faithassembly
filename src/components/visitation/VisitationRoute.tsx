import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const VisitationRoute: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
    const auth = getAuth();
    const db = getFirestore();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setIsAuthenticated(true);
                // Check Firestore for role
                try {
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        const allowedRoles = ['visitation_member', 'visitation_leader', 'admin', 'super_admin'];
                        if (allowedRoles.includes(userData.role)) {
                            setIsAuthorized(true);
                        } else {
                            setIsAuthorized(false);
                        }
                    } else {
                        setIsAuthorized(false);
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
    }, [auth, db]);

    if (isAuthenticated === null || isAuthorized === null) {
        return (
            <div className="flex justify-center items-center h-screen bg-teal-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/visitation/login" replace />;
    }

    if (!isAuthorized) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default VisitationRoute;
