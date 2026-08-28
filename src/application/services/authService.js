import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
  EmailAuthProvider,
  reauthenticateWithCredential,
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
    // Set by an admin from the Users tab. AuthContext signs these accounts back
    // out immediately, so a disabled user cannot reach the app.
    disabled: userDoc ? !!userDoc.disabled : false,
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

// Re-verify the currently signed-in user's password. Used to gate destructive
// admin actions so a hijacked or unattended admin session can't run them
// without the password. Firebase throws on a wrong password (auth/wrong-password
// or auth/invalid-credential), which the caller surfaces.
export async function reauthenticate(password) {
  const current = auth.currentUser;
  if (!current || !current.email) {
    throw new Error('No signed-in account to confirm.');
  }
  const credential = EmailAuthProvider.credential(current.email, password);
  await reauthenticateWithCredential(current, credential);
}

export async function logout() {
  return signOut(auth);
}
