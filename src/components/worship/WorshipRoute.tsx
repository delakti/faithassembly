import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const WorshipRoute: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [isWorship, setIsWorship] = useState<boolean | null>(null);
    const auth = getAuth();
    const db = getFirestore();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setIsAuthenticated(true);
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    const role = userDoc.data().role;
                    if (['worship_member', 'worship_leader', 'admin', 'super_admin'].includes(role)) {
                        setIsWorship(true);
                    } else {
                        setIsWorship(false);
                    }
                } else {
                    setIsWorship(false);
                }
            } else {
                setIsAuthenticated(false);
                setIsWorship(false);
            }
        });

        return () => unsubscribe();
    }, [auth, db]);

    if (isAuthenticated === null || isWorship === null) {
        return (
            <div className="flex justify-center items-center h-screen bg-black">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
            </div>
        );
    }

    if (!isAuthenticated) return <Navigate to="/worship/login" replace />;
    if (!isWorship) return <Navigate to="/" replace />;

    return <Outlet />;
};

export default WorshipRoute;
