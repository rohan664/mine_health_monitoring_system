import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAwu8gfWgAtmOJg9QDZ3N0BPjbErT4NYUg",
    authDomain: "mine-health-monitoring.firebaseapp.com",
    projectId: "mine-health-monitoring",
    storageBucket: "mine-health-monitoring.firebasestorage.app",
    messagingSenderId: "108536639710",
    appId: "1:108536639710:web:b3a60dd5975f56fc91d24f",
    measurementId: "G-YFW3XRBB9Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export default firestore;