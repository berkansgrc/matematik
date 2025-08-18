// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAf2MGKno0c4oLMZV_OlKdDnQD-jXptQDo",
  authDomain: "berkan-web.firebaseapp.com",
  projectId: "berkan-web",
  storageBucket: "berkan-web.firebasestorage.app",
  messagingSenderId: "241669274438",
  appId: "1:241669274438:web:a8fefa8eda3c6dae370347"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
