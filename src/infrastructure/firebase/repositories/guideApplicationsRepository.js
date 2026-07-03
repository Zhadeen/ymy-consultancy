import { doc, setDoc, deleteDoc, collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../../config/firebase';

export async function getAllApplicationsOrdered() {
  const snap = await getDocs(query(collection(db, 'guide_applications'), orderBy('createdAt', 'desc')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// Application documents use the user's uid as the document id (see GuideRegistration).
export async function createApplication(uid, data) {
  return setDoc(doc(db, 'guide_applications', uid), data);
}

export async function deleteApplication(id) {
  return deleteDoc(doc(db, 'guide_applications', id));
}
