// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database"; // Added Realtime Database
import { getFirestore } from "firebase/firestore"; // Added Firestore
import { getAuth } from "firebase/auth"; // Added Auth
import { getStorage } from "firebase/storage"; // Added Storage

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA_hZSxNdoTNRpmQEVrZ0KzPlGZmZHfC3E",
    authDomain: "fauchurchconnect.firebaseapp.com",
    databaseURL: "https://fauchurchconnect-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "fauchurchconnect",
    storageBucket: "fauchurchconnect.firebasestorage.app",
    messagingSenderId: "237526706212",
    appId: "1:237526706212:web:f9d9d6879b7c102e4650b1",
    measurementId: "G-6Q61LN1PL2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const database = getDatabase(app);

export { app, analytics, db, auth, storage, database };
