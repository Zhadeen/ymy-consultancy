import { doc, getDoc, setDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../../../config/firebase';

export async function getUserById(uid) {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function createUser(uid, data) {
  return setDoc(doc(db, 'users', uid), data);
}

export async function updateUser(uid, data) {
  return updateDoc(doc(db, 'users', uid), data);
}

export async function getAllUsers() {
  const snap = await getDocs(collection(db, 'users'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
