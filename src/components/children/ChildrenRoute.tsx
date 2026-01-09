import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import type { UserRole } from '../../types/member';

const ChildrenRoute: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState<UserRole | null>(null);
    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const docRef = doc(db, 'users', user.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setRole(docSnap.data().role as UserRole);
                    } else {
                        setRole('user');
                    }
                } catch (error) {
                    console.error("Error fetching user role:", error);
                    setRole('user');
                }
            } else {
                setRole(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [auth]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-sky-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-sky-500"></div>
            </div>
        );
    }

    // Role check: Allow 'children_staff' AND 'admin'
    if (role === 'children_staff' || role === 'admin') {
        return <Outlet />;
    }

    if (role === null) {
        return <Navigate to="/children/login" replace />;
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
            <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-6 text-center max-w-md">
                You do not have the required permissions to access the Children's Services Portal.
            </p>
            <a href="/" className="bg-sky-600 text-white px-6 py-2 rounded-lg hover:bg-sky-700 transition">
                Return Home
            </a>
        </div>
    );
};

export default ChildrenRoute;
