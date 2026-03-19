import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAS1l1ZJKBm_2asd5yHM1V5XnrXMFVSb80",
  authDomain: "loginn-7b468.firebaseapp.com",
  databaseURL: "https://loginn-7b468-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "loginn-7b468",
  storageBucket: "loginn-7b468.firebasestorage.app",
  messagingSenderId: "933070733968",
  appId: "1:933070733968:web:0d62977bdf6b432f000e15",
  measurementId: "G-4P3RX8D2SC"
};

const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const db = getDatabase(app);
const auth = getAuth(app);

export { app, analytics, db, auth };
