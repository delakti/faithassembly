import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const UsherRoute: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [isUsherTeam, setIsUsherTeam] = useState<boolean | null>(null);
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
                        setIsUsherTeam(true);
                    } else {
                        setIsUsherTeam(false);
                    }
                } else {
                    setIsUsherTeam(false);
                }
            } else {
                setIsAuthenticated(false);
                setIsUsherTeam(false);
            }
        });

        return () => unsubscribe();
    }, [auth, db]);

    if (isAuthenticated === null || isUsherTeam === null) {
        return (
            <div className="flex justify-center items-center h-screen bg-slate-950">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-amber-500 font-bold text-xs tracking-widest uppercase">Verifying Access...</span>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) return <Navigate to="/ushering/login" replace />;
    if (!isUsherTeam) return <Navigate to="/" replace />;

    return <Outlet />;
};

export default UsherRoute;
