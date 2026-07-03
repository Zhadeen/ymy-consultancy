import { getStripeClient } from './lib/stripeClient.js';
import { resolveOrigin } from './lib/validation.js';

const stripe = getStripeClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { priceId, userId, userEmail } = req.body;

  if (!priceId || priceId === 'your_tourist_price_id_here') {
    return res.status(400).json({ message: 'Tourist Subscription Price ID is not configured. Please set VITE_STRIPE_TOURIST_PRICE_ID in .env' });
  }

  try {
    const origin = resolveOrigin(req);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: userEmail,
      metadata: {
        userId,
        type: 'tourist_subscription'
      },
      success_url: `${origin}/subscription/success?session_id={CHECKOUT_SESSION_ID}&role=tourist`,
      cancel_url: `${origin}/`,
    });

    res.status(200).json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error('Stripe Tourist Subscription error:', error);
    res.status(500).json({ message: error.message });
  }
}
