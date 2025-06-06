import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDpfs1n3eZZdAARVgWVqNZz4BrtkNB5ze4",
  authDomain: "lostfoundportal-dbbb7.firebaseapp.com",
  projectId: "lostfoundportal-dbbb7",
  storageBucket: "lostfoundportal-dbbb7.firebasestorage.app",
  messagingSenderId: "280606509884",
  appId: "1:280606509884:web:d94c11e7e9b30338372c39",
  measurementId: "G-90HX1MY7WN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

// Initialize Analytics
export const analytics = getAnalytics(app);

export default app; 