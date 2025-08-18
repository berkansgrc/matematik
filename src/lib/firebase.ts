// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "eitim-platformu",
  "appId": "1:645966425899:web:f76c225726d6a3bb4b1f6e",
  "storageBucket": "eitim-platformu.firebasestorage.app",
  "apiKey": "AIzaSyBRrZOv0gBHbH4uJyOq5QDH1w5m9MyibyA",
  "authDomain": "eitim-platformu.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "645966425899"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
