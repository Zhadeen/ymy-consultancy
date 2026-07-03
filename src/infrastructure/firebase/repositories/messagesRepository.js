import { collection, addDoc, doc, getDoc, setDoc, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../../config/firebase';

// Mirrors useUnreadCount: no ordering, just live totals across all of a user's chats.
export function subscribeToUserChats(uid, onChange, onError) {
  const q = query(collection(db, 'chats'), where('participants', 'array-contains', uid));
  return onSnapshot(q, (snap) => onChange(snap.docs.map(d => ({ id: d.id, ...d.data() }))), onError);
}

// Mirrors ChatInbox: same query plus orderBy('updatedAt', 'desc') for the inbox list.
export function subscribeToUserChatsOrdered(uid, onChange, onError) {
  const q = query(
    collection(db, 'chats'),
    where('participants', 'array-contains', uid),
    orderBy('updatedAt', 'desc')
  );
  return onSnapshot(q, (snap) => onChange(snap.docs.map(d => ({ id: d.id, ...d.data() }))), onError);
}

export async function getChatById(chatId) {
  const snap = await getDoc(doc(db, 'chats', chatId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

// Live-updating (ChatPage relies on onSnapshot for real-time message delivery).
export function subscribeToMessages(chatId, onChange) {
  const q = query(collection(db, 'chats', chatId, 'messages'), orderBy('timestamp', 'asc'));
  return onSnapshot(q, (snap) => onChange(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
}

export async function addMessage(chatId, data) {
  return addDoc(collection(db, 'chats', chatId, 'messages'), data);
}

// Always merge:true, matching every existing chat-meta write site (ChatPage, BookingContext).
// Callers control which fields are included (e.g. whether unreadCount is incremented) —
// that variation lives in the calling code, not here, so existing per-caller behavior is preserved.
export async function upsertChatMeta(chatId, data) {
  return setDoc(doc(db, 'chats', chatId), data, { merge: true });
}
