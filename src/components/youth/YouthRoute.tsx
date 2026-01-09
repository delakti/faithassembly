import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const YouthRoute: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [isYouth, setIsYouth] = useState<boolean | null>(null);
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
                    const role = userData.role;
                    // Allow youth roles and generic admin roles
                    if (role === 'youth_member' || role === 'youth_leader' || role === 'admin' || role === 'super_admin') {
                        setIsYouth(true);
                    } else {
                        setIsYouth(false);
                    }
                } else {
                    setIsYouth(false);
                }
            } else {
                setIsAuthenticated(false);
                setIsYouth(false);
            }
        });

        return () => unsubscribe();
    }, [auth, db]);

    if (isAuthenticated === null || isYouth === null) {
        return (
            <div className="flex justify-center items-center h-screen bg-black">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/youth/login" replace />;
    }

    if (!isYouth) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default YouthRoute;
