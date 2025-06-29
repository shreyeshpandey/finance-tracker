// src/firebase/lists.js
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from './config';

export const getSiteList = async () => {
  const snapshot = await getDocs(collection(db, 'siteList'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getVendorList = async () => {
  const snapshot = await getDocs(collection(db, 'vendorList'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addSite = async (name) => {
  return await addDoc(collection(db, 'siteList'), { name });
};

export const addVendor = async (name) => {
  return await addDoc(collection(db, 'vendorList'), { name });
};