import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY.trim());

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { priceId, guideId, guideEmail, planId, planName } = req.body;

  if (!priceId) {
    return res.status(400).json({ message: 'Missing Price ID. Please configure VITE_STRIPE_GUIDE_PRICE_ID in your .env file.' });
  }

  try {
    const origin = req.headers.origin || 'https://www.ymycons.com';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: guideEmail,
      metadata: {
        guideId,
        planId,
        planName,
        type: 'guide_subscription'
      },
      success_url: `${origin}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing`,
    });

    res.status(200).json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ message: error.message });
  }
}
