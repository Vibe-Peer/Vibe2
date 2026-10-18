import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAzcPB4hTOBQxVgwAqwBWIVWi7xcbL_G-E",
  authDomain: "project-dded57cc-d89e-42f4-946.firebaseapp.com",
  projectId: "project-dded57cc-d89e-42f4-946",
  storageBucket: "project-dded57cc-d89e-42f4-946.firebasestorage.app",
  messagingSenderId: "809302842302",
  appId: "1:809302842302:web:0cf026a549bfb41764f7ef"
};

// Initialize Firebase App
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Authentication & Firestore Database
export const auth = getAuth(app);
export const db = getFirestore(app, "ai-studio-vibingpeermedica-347a2b7a-260b-4dbd-89ec-07150c8d184c");
