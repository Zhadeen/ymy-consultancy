import { getStripeClient } from './lib/stripeClient.js';

const stripe = getStripeClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { sessionId } = req.body;

  if (!sessionId) {
    return res.status(400).json({ message: 'Session ID is required' });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session || session.status !== 'complete') {
      return res.status(400).json({ message: 'Session not complete or not found' });
    }

    res.status(200).json({
      status: session.status,
      payment_status: session.payment_status,
      metadata: session.metadata,
      subscription_id: session.subscription,
      customer_email: session.customer_details?.email,
    });
  } catch (error) {
    console.error('Stripe verify error:', error);
    res.status(500).json({ message: error.message });
  }
}
