import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const EstherRoute: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [isEsther, setIsEsther] = useState<boolean | null>(null);
    const auth = getAuth();
    const db = getFirestore();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setIsAuthenticated(true);
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    const role = userDoc.data().role;
                    if (['esther_member', 'esther_leader', 'hospitality_leader', 'admin', 'super_admin'].includes(role)) {
                        setIsEsther(true);
                    } else {
                        setIsEsther(false);
                    }
                } else {
                    setIsEsther(false);
                }
            } else {
                setIsAuthenticated(false);
                setIsEsther(false);
            }
        });

        return () => unsubscribe();
    }, [auth, db]);

    if (isAuthenticated === null || isEsther === null) {
        return (
            <div className="flex justify-center items-center h-screen bg-rose-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
            </div>
        );
    }

    if (!isAuthenticated) return <Navigate to="/esther/login" replace />;
    if (!isEsther) return <Navigate to="/" replace />; // Or an unauthorized page

    return <Outlet />;
};

export default EstherRoute;
