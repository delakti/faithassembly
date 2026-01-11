import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

export const setUserRole = async (uid: string, role: string) => {
    const db = getFirestore();
    try {
        await setDoc(doc(db, 'users', uid), {
            role: role
        }, { merge: true });
        console.log(`User ${uid} role set to ${role}`);
        return true;
    } catch (e) {
        console.error("Failed to set role", e);
        return false;
    }
};

export const checkUserRole = async (uid: string) => {
    const db = getFirestore();
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) {
        console.log("User Role:", snap.data().role);
        return snap.data().role;
    }
    return null;
};
