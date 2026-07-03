import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';

export async function getSubscriptionByUserId(uid) {
  const snap = await getDoc(doc(db, 'subscriptions', uid));
  return snap.exists() ? snap.data() : null;
}

// Mirrors PaymentContext.subscribe: overwrites the doc (no merge).
export async function createSubscription(uid, data) {
  return setDoc(doc(db, 'subscriptions', uid), data);
}

// Mirrors SubscriptionSuccess: merge:true so it doesn't clobber other subscription fields.
export async function upsertSubscription(uid, data) {
  return setDoc(doc(db, 'subscriptions', uid), data, { merge: true });
}

export async function updateSubscription(uid, data) {
  return updateDoc(doc(db, 'subscriptions', uid), data);
}
