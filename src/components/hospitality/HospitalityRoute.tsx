import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const HospitalityRoute: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [isHospitality, setIsHospitality] = useState<boolean | null>(null);
    const auth = getAuth();
    const db = getFirestore();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setIsAuthenticated(true);
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    const role = userDoc.data().role;
                    if (['hospitality_member', 'hospitality_leader', 'admin', 'super_admin'].includes(role)) {
                        setIsHospitality(true);
                    } else {
                        setIsHospitality(false);
                    }
                } else {
                    setIsHospitality(false);
                }
            } else {
                setIsAuthenticated(false);
                setIsHospitality(false);
            }
        });

        return () => unsubscribe();
    }, [auth, db]);

    if (isAuthenticated === null || isHospitality === null) {
        return (
            <div className="flex justify-center items-center h-screen bg-stone-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-400"></div>
            </div>
        );
    }

    if (!isAuthenticated) return <Navigate to="/hospitality/login" replace />;
    if (!isHospitality) return <Navigate to="/" replace />;

    return <Outlet />;
};

export default HospitalityRoute;
