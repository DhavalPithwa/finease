import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// These values should ideally come from .env.local
const firebaseConfig = {
  apiKey: "AIzaSyAjTf4rUw15_GJ61KVe2GbD29w9VgYQrww",
  authDomain: "finease-d7e51.firebaseapp.com",
  projectId: "finease-d7e51",
  storageBucket: "finease-d7e51.firebasestorage.app",
  messagingSenderId: "47064597138",
  appId: "1:47064597138:web:39339cbfa79c1baf491c4b",
  measurementId: "G-36C7FJ8XHY"
};



const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
