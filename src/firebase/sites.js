import { db } from './config';
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  setDoc
} from 'firebase/firestore';

const siteRef = collection(db, 'siteList');
const vendorRef = collection(db, 'vendorList');

export const getSites = async () => {
  const snapshot = await getDocs(siteRef);
  return snapshot.docs.map((doc) => doc.data().name);
};

export const getVendors = async () => {
  const snapshot = await getDocs(vendorRef);
  return snapshot.docs.map((doc) => doc.data().name);
};

export const addSite = async (name) => {
  const trimmedName = name.trim();
  const q = query(siteRef, where('name', '==', trimmedName));
  const exists = (await getDocs(q)).size > 0;

  if (!exists) {
    const docRef = doc(siteRef, trimmedName); // use name as ID
    await setDoc(docRef, { name: trimmedName });
  }
};

export const addVendor = async (name) => {
  const trimmedName = name.trim();
  const q = query(vendorRef, where('name', '==', trimmedName));
  const exists = (await getDocs(q)).size > 0;

  if (!exists) {
    const docRef = doc(vendorRef, trimmedName); // use name as ID
    await setDoc(docRef, { name: trimmedName });
  }
};