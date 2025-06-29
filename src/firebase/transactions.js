// src/firebase/transactions.js
import { db } from './config';
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  Timestamp,
  deleteDoc,
  doc,
  startAfter,
} from 'firebase/firestore';

const transactionsRef = collection(db, 'transactions');

// ✅ Add a new transaction
export const addTransaction = async (data) => {
  try {
    const docRef = await addDoc(transactionsRef, {
      ...data,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('🔥 Firestore error (addTransaction):', error);
    throw error;
  }
};

// ✅ Get all transactions
export const getAllTransactions = async () => {
  try {
    const q = query(transactionsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('🔥 Firestore error (getAllTransactions):', error);
    throw error;
  }
};

// ✅ Delete a transaction
export const deleteTransaction = async (id) => {
  try {
    await deleteDoc(doc(db, 'transactions', id));
  } catch (error) {
    console.error('🔥 Firestore error (deleteTransaction):', error);
    throw error;
  }
};

// ✅ Get paginated transactions
export const getPaginatedTransactions = async (limit, startAfterDoc = null) => {
 try {
   let q = query(transactionsRef, orderBy('createdAt', 'desc'), limit(limit));
   if (startAfterDoc) {
     q = query(transactionsRef, orderBy('createdAt', 'desc'), startAfter(startAfterDoc), limit(limit));
   }
   const snapshot = await getDocs(q);
   const lastDoc = snapshot.docs[snapshot.docs.length - 1];
   const transactions = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
   return { transactions, lastDoc };
 } catch (error) {
   console.error('🔥 Firestore error (getPaginatedTransactions):', error);
   throw error;
 }
};

// ✅ Get total count
export const getTransactionCount = async () => {
 try {
   const snapshot = await getDocs(transactionsRef);
   return snapshot.size;
 } catch (error) {
   console.error('🔥 Firestore error (getTransactionCount):', error);
   return 0;
 }
};