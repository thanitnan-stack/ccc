
// Paste this into your browser console to test connection
import { db } from './firebase-config.js';
import { collection, getDocs, addDoc } from 'firebase/firestore';

async function testConnection() {
    console.log("Testing connection...");
    try {
        const querySnapshot = await getDocs(collection(db, "products"));
        console.log("Success! Found " + querySnapshot.size + " products.");
        return true;
    } catch (e) {
        console.error("Connection Failed:", e);
        if (e.code === 'permission-denied') {
            alert("Permission Denied! Please check Firestore Rules.");
        }
        return false;
    }
}
testConnection();
