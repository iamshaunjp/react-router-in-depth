// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBg6y33BOna9ujzvOUJdHMVeGCxEBJVx3U",
  authDomain: "my-application123-63660.firebaseapp.com",
  databaseURL:
    "https://my-application123-63660-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "my-application123-63660",
  storageBucket: "my-application123-63660.appspot.com",
  messagingSenderId: "280928600257",
  appId: "1:280928600257:web:69ecfcd20b3af215461440",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
