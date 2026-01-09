import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const MediaRoute: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [isMediaTeam, setIsMediaTeam] = useState<boolean | null>(null);
    const auth = getAuth();
    const db = getFirestore();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setIsAuthenticated(true);
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    const role = userDoc.data().role;
                    if (['media_member', 'media_leader', 'admin', 'super_admin'].includes(role)) {
                        setIsMediaTeam(true);
                    } else {
                        setIsMediaTeam(false);
                    }
                } else {
                    setIsMediaTeam(false);
                }
            } else {
                setIsAuthenticated(false);
                setIsMediaTeam(false);
            }
        });

        return () => unsubscribe();
    }, [auth, db]);

    if (isAuthenticated === null || isMediaTeam === null) {
        return (
            <div className="flex justify-center items-center h-screen bg-slate-950">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-cyan-500 font-mono text-xs tracking-widest uppercase">System Loading...</span>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) return <Navigate to="/media/login" replace />;
    if (!isMediaTeam) return <Navigate to="/" replace />;

    return <Outlet />;
};

export default MediaRoute;
