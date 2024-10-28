import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyD1Pcg5iSuo2eYvX_Vs1rfi7rBrGNQ0q58",
  authDomain: "puac-practice-manager.firebaseapp.com",
  projectId: "puac-practice-manager",
  storageBucket: "puac-practice-manager.appspot.com",
  messagingSenderId: "577578567382",
  appId: "1:577578567382:web:a1e8b516b6d776545e2b77",
  measurementId: "G-KHLD2TSTG3"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };