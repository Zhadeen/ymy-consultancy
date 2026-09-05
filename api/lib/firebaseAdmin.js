import admin from 'firebase-admin';

// Lazily initialise the Firebase Admin SDK from a service-account credential
// supplied as an env var. Accepts either raw JSON or base64-encoded JSON (Vercel
// env vars mangle newlines, so base64 is the safer way to paste a service
// account). Throws a clear, greppable error when unset so the caller can return
// a helpful message. See SETUP.md for how to create and set FIREBASE_SERVICE_ACCOUNT.
let dbInstance = null;

function parseServiceAccount(raw) {
  const trimmed = raw.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    // Not raw JSON — assume base64.
    const decoded = Buffer.from(trimmed, 'base64').toString('utf8');
    return JSON.parse(decoded);
  }
}

export function getAdminDb() {
  if (dbInstance) return dbInstance;

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT is not set. See SETUP.md.');
  }

  const app = admin.apps.length
    ? admin.app()
    : admin.initializeApp({ credential: admin.credential.cert(parseServiceAccount(raw)) });

  dbInstance = admin.firestore(app);
  return dbInstance;
}
