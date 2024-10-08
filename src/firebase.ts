import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAdzPAT_J4MYK-gcA1csayHhTEJhRP5a7k",
  authDomain: "portfolio-optimization-f3e95.firebaseapp.com",
  projectId: "portfolio-optimization-f3e95",
  storageBucket: "portfolio-optimization-f3e95.appspot.com",
  messagingSenderId: "265186294092",
  appId: "1:265186294092:web:3aef3b32ed337ecade77e9",
  measurementId: "G-09VPNXY4YH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };