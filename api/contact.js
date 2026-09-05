import { getAdminDb } from './lib/firebaseAdmin.js';

const isEmail = (s) => typeof s === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

// Contact-form handler. Validates input server-side and persists to the
// `contact_messages` Firestore collection via the Admin SDK (which bypasses
// client security rules — the browser never writes here directly).
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, message, company } = req.body || {};

  // Honeypot: `company` is a hidden field real users never see. If it's filled,
  // it's a bot — accept silently and drop, so the bot gets no signal.
  if (company) return res.status(200).json({ ok: true });

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({ message: 'Please provide your name.' });
  }
  if (!isEmail(email)) {
    return res.status(400).json({ message: 'Please provide a valid email address.' });
  }
  if (!message || typeof message !== 'string' || message.trim().length < 10) {
    return res.status(400).json({ message: 'Please include a short message (at least 10 characters).' });
  }
  if (message.length > 5000) {
    return res.status(400).json({ message: 'Message is too long.' });
  }

  try {
    const db = getAdminDb();
    await db.collection('contact_messages').add({
      name: name.trim().slice(0, 200),
      email: email.trim().slice(0, 200),
      message: message.trim().slice(0, 5000),
      status: 'new',
      createdAt: new Date().toISOString(),
      userAgent: String(req.headers['user-agent'] || '').slice(0, 300),
    });

    // TODO(owner): send an email notification of new messages. No email
    // provider/credentials are configured, and none are invented here. Wire a
    // provider (e.g. Resend or SendGrid) and set the destination address — both
    // are listed in SETUP.md.

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Contact submission failed:', err);
    const notConfigured = /FIREBASE_SERVICE_ACCOUNT/.test(err.message || '');
    return res.status(notConfigured ? 503 : 500).json({
      message: notConfigured
        ? 'The contact form is not fully configured yet. Please try again later.'
        : 'Something went wrong sending your message. Please try again.',
    });
  }
}
