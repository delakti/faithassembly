import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const SuperAdminRoute: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [isSuperAdmin, setIsSuperAdmin] = useState<boolean | null>(null);
    const auth = getAuth();
    const db = getFirestore();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setIsAuthenticated(true);
                // Check Firestore for role
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    // Allow if role is specifically 'super_admin'
                    if (userData.role === 'super_admin') {
                        setIsSuperAdmin(true);
                    } else {
                        setIsSuperAdmin(false);
                    }
                } else {
                    setIsSuperAdmin(false);
                }
            } else {
                setIsAuthenticated(false);
                setIsSuperAdmin(false);
            }
        });

        return () => unsubscribe();
    }, [auth, db]);

    if (isAuthenticated === null || isSuperAdmin === null) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/admin/super/login" replace />;
    }

    if (!isSuperAdmin) {
        // Redirect unauthorized users (even if they are admins)
        return <Navigate to="/admin" replace />;
    }

    return <Outlet />;
};

export default SuperAdminRoute;
