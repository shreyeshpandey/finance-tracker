// src/firebase/transactions.js
import { db } from './config';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';

const transactionsRef = collection(db, 'transactions');

// Add a new transaction
export const addTransaction = async (data) => {
 try {
   console.log("📤 Adding to Firestore:", data);
   const docRef = await addDoc(transactionsRef, {
     ...data,
     createdAt: Timestamp.now(),
   });
   return docRef.id;
 } catch (error) {
   console.error("🔥 Firestore error:", error);
   throw error;
 }
};

// Fetch all transactions (with optional filters later)
export const getAllTransactions = async () => {
  try {
    const q = query(transactionsRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};