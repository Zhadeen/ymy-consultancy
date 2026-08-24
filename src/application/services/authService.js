import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  sendEmailVerification,
} from 'firebase/auth';
import { serverTimestamp } from 'firebase/firestore';
import { auth } from '../../config/firebase';
import { getUserById, createUser } from '../../infrastructure/firebase/repositories/usersRepository';

// Shapes the app-level user object from the Firebase Auth user plus their Firestore profile doc.
export async function resolveAppUser(firebaseUser) {
  const userDoc = await getUserById(firebaseUser.uid);
  const role = userDoc ? userDoc.role : 'visitor';

  return {
    uid: firebaseUser.uid,
    name: userDoc ? (userDoc.name || firebaseUser.displayName || 'Traveler') : (firebaseUser.displayName || 'Traveler'),
    email: firebaseUser.email,
    photo: userDoc ? (userDoc.photo || firebaseUser.photoURL || null) : (firebaseUser.photoURL || null),
    role,
    emailVerified: firebaseUser.emailVerified,
    isSubscribed: userDoc ? !!userDoc.isSubscribed : false,
    createdAt: userDoc ? userDoc.createdAt : null,
  };
}

export async function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);

  const existing = await getUserById(result.user.uid);
  if (!existing) {
    await createUser(result.user.uid, {
      name: result.user.displayName || 'Traveler',
      email: result.user.email,
      role: 'visitor',
      createdAt: serverTimestamp(),
    });
  }

  return result;
}

export async function register(name, email, password, role = 'visitor') {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);

  await updateProfile(userCredential.user, { displayName: name });
  await sendEmailVerification(userCredential.user);
  await createUser(userCredential.user.uid, { name, email, role, createdAt: serverTimestamp() });

  return userCredential;
}

export async function resetPassword(email) {
  return sendPasswordResetEmail(auth, email);
}

export async function logout() {
  return signOut(auth);
}
