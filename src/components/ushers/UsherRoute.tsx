import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const UsherRoute: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [isUsher, setIsUsher] = useState<boolean | null>(null);
    const auth = getAuth();
    const db = getFirestore();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setIsAuthenticated(true);
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    const role = userDoc.data().role;
                    if (['usher_member', 'usher_leader', 'admin', 'super_admin'].includes(role)) {
                        setIsUsher(true);
                    } else {
                        setIsUsher(false);
                    }
                } else {
                    setIsUsher(false);
                }
            } else {
                setIsAuthenticated(false);
                setIsUsher(false);
            }
        });

        return () => unsubscribe();
    }, [auth, db]);

    if (isAuthenticated === null || isUsher === null) {
        return (
            <div className="flex justify-center items-center h-screen bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-800"></div>
            </div>
        );
    }

    if (!isAuthenticated) return <Navigate to="/ushers/login" replace />;
    if (!isUsher) return <Navigate to="/" replace />;

    return <Outlet />;
};

export default UsherRoute;
