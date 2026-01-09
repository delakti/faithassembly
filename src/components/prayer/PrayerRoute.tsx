import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const PrayerRoute: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [isPrayerTeam, setIsPrayerTeam] = useState<boolean | null>(null);
    const auth = getAuth();
    const db = getFirestore();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setIsAuthenticated(true);
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    const role = userDoc.data().role;
                    if (['prayer_member', 'prayer_leader', 'admin', 'super_admin'].includes(role)) {
                        setIsPrayerTeam(true);
                    } else {
                        setIsPrayerTeam(false);
                    }
                } else {
                    setIsPrayerTeam(false);
                }
            } else {
                setIsAuthenticated(false);
                setIsPrayerTeam(false);
            }
        });

        return () => unsubscribe();
    }, [auth, db]);

    if (isAuthenticated === null || isPrayerTeam === null) {
        return (
            <div className="flex justify-center items-center h-screen bg-slate-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-400"></div>
            </div>
        );
    }

    if (!isAuthenticated) return <Navigate to="/prayer/login" replace />;
    if (!isPrayerTeam) return <Navigate to="/" replace />;

    return <Outlet />;
};

export default PrayerRoute;
