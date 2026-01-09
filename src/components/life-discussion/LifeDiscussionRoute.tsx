import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const LifeDiscussionRoute: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [hasAccess, setHasAccess] = useState<boolean | null>(null);
    const auth = getAuth();
    const db = getFirestore();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setIsAuthenticated(true);
                try {
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (userDoc.exists()) {
                        const role = userDoc.data().role;
                        const allowedRoles = ['sunday_student', 'sunday_teacher', 'sunday_admin', 'super_admin'];
                        if (allowedRoles.includes(role)) {
                            setHasAccess(true);
                        } else {
                            setHasAccess(false);
                        }
                    } else {
                        setHasAccess(false);
                    }
                } catch (error) {
                    console.error("Error fetching user role:", error);
                    setHasAccess(false);
                }
            } else {
                setIsAuthenticated(false);
                setHasAccess(false);
            }
        });

        return () => unsubscribe();
    }, [auth, db]);

    if (isAuthenticated === null || hasAccess === null) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-600"></div>
                    <span className="text-sky-600 font-medium text-sm">Loading Class...</span>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/life-discussion/login" replace />;
    }

    if (!hasAccess) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default LifeDiscussionRoute;
