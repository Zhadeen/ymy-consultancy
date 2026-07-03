import { getStripeClient } from './lib/stripeClient.js';

const stripe = getStripeClient();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).end('Method Not Allowed');
  }

  const { session_id } = req.query;

  if (!session_id) {
    return res.status(400).json({ message: 'Session ID is required' });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    
    if (session.payment_status === 'paid') {
      res.status(200).json({ 
        success: true, 
        metadata: session.metadata 
      });
    } else {
      res.status(400).json({ 
        success: false, 
        message: 'Payment not completed' 
      });
    }
  } catch (err) {
    console.error('Verify Session Error:', err);
    res.status(500).json({ statusCode: 500, message: err.message });
  }
}
