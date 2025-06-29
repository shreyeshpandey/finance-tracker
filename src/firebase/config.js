// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAnrvZdIfXywxnWL4bf5i5JQSK1mv-mjBQ",
  authDomain: "financetracker-34f6d.firebaseapp.com",
  projectId: "financetracker-34f6d",
  storageBucket: "financetracker-34f6d.firebasestorage.app",
  messagingSenderId: "297592173657",
  appId: "1:297592173657:web:d26f63b064a226a8eaed48",
  measurementId: "G-BFF0YV9NQ4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };