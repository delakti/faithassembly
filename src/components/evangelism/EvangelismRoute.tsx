import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const EvangelismRoute: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [isEvangelismTeam, setIsEvangelismTeam] = useState<boolean | null>(null);
    const auth = getAuth();
    const db = getFirestore();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setIsAuthenticated(true);
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    const role = userDoc.data().role;
                    if (['evangelism_member', 'evangelism_leader', 'admin', 'super_admin'].includes(role)) {
                        setIsEvangelismTeam(true);
                    } else {
                        setIsEvangelismTeam(false);
                    }
                } else {
                    setIsEvangelismTeam(false);
                }
            } else {
                setIsAuthenticated(false);
                setIsEvangelismTeam(false);
            }
        });

        return () => unsubscribe();
    }, [auth, db]);

    if (isAuthenticated === null || isEvangelismTeam === null) {
        return (
            <div className="flex justify-center items-center h-screen bg-orange-950">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-orange-500 font-bold text-xs tracking-widest uppercase">Mission Loading...</span>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) return <Navigate to="/evangelism/login" replace />;
    if (!isEvangelismTeam) return <Navigate to="/" replace />;

    return <Outlet />;
};

export default EvangelismRoute;
