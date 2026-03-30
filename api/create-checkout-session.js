import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY?.trim());

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const { 
      guideName, 
      guideId,
      totalPrice, 
      date, 
      tourType, 
      guests, 
      touristName, 
      touristEmail, 
      specialRequests 
    } = req.body;

    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers.host;
    const origin = `${protocol}://${host}`;

    // Create Checkout Session from body params
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Tour with ${guideName}`,
              description: `${tourType.toUpperCase()} Day Tour - ${new Date(date).toLocaleDateString()}`,
            },
            unit_amount: Math.round(totalPrice * 100), // Stripe expects amounts in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: touristEmail,
      success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/payment/cancel`,
      metadata: {
        guideId,
        guideName,
        date,
        tourType,
        guests: guests.toString(),
        totalPrice: totalPrice.toString(),
        touristName,
        touristEmail,
        specialRequests: specialRequests || '',
        reference: `YMY-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`
      },
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe Session Error:', err);
    res.status(500).json({ statusCode: 500, message: err.message });
  }
}
