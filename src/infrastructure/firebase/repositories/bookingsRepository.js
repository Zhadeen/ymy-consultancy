import { collection, addDoc, doc, getDoc, updateDoc, getDocs, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../../config/firebase';

export async function createBooking(data) {
  const docRef = await addDoc(collection(db, 'bookings'), data);
  return docRef.id;
}

export async function getBookingById(id) {
  const snap = await getDoc(doc(db, 'bookings', id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function updateBooking(id, data) {
  return updateDoc(doc(db, 'bookings', id), data);
}

// Live-updating (VisitorDashboard relies on onSnapshot for real-time status changes).
export function subscribeToBookingsByVisitorId(visitorId, onChange, onError) {
  const q = query(collection(db, 'bookings'), where('visitorId', '==', visitorId));
  return onSnapshot(q, (snap) => onChange(snap.docs.map(d => ({ id: d.id, ...d.data() }))), onError);
}

// Live-updating (GuideDashboard relies on onSnapshot for real-time booking requests).
export function subscribeToBookingsByGuideId(guideId, onChange, onError) {
  const q = query(collection(db, 'bookings'), where('guideId', '==', guideId));
  return onSnapshot(q, (snap) => onChange(snap.docs.map(d => ({ id: d.id, ...d.data() }))), onError);
}

// One-shot read, matches TouristDashboard's existing (not yet route-wired) query shape.
export async function getBookingsByTouristEmail(email) {
  const snap = await getDocs(query(collection(db, 'bookings'), where('touristEmail', '==', email)));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getAllBookings() {
  const snap = await getDocs(collection(db, 'bookings'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
