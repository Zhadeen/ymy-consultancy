import { doc, getDoc, setDoc, updateDoc, collection, getDocs, query, where, limit } from 'firebase/firestore';
import { db } from '../../../config/firebase';

export async function getGuideById(id) {
  const snap = await getDoc(doc(db, 'guides', id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

// Mirrors AccountSettings/GuideDashboard: guides are looked up by their 'uid' field,
// not by document id, so this is a query, not a doc() get.
export async function getGuideByUid(uid) {
  const snap = await getDocs(query(collection(db, 'guides'), where('uid', '==', uid)));
  return snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data() };
}

export async function getFeaturedGuides(count = 8) {
  const snap = await getDocs(query(collection(db, 'guides'), limit(count)));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getAllGuides() {
  const snap = await getDocs(collection(db, 'guides'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// Guide documents use the user's uid as the document id (see AdminPanel approval flow).
export async function createGuide(uid, data) {
  return setDoc(doc(db, 'guides', uid), data);
}

export async function updateGuide(id, data) {
  return updateDoc(doc(db, 'guides', id), data);
}
