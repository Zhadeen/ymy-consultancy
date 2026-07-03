import { collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../../config/firebase';

export async function createReview(data) {
  const docRef = await addDoc(collection(db, 'reviews'), data);
  return docRef.id;
}

// Mirrors ReviewModal's rating-recalculation query (reviews written there use a 'targetId' field).
export async function getReviewsByTargetId(targetId) {
  const snap = await getDocs(query(collection(db, 'reviews'), where('targetId', '==', targetId)));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// Mirrors GuideProfilePage's own review flow, which writes/reads a distinct 'guideId' field
// instead of 'targetId' — a pre-existing inconsistency between the two review-creation paths,
// intentionally preserved as two separate query shapes rather than unified.
export async function getReviewsByGuideId(guideId) {
  const snap = await getDocs(query(collection(db, 'reviews'), where('guideId', '==', guideId), orderBy('createdAt', 'desc')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
