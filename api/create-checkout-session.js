import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY.trim());

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { bookingData, userId } = req.body;
  const { guideId, guideName, totalPrice, date, tourType, guests } = bookingData;

  if (!totalPrice || totalPrice <= 0) {
    return res.status(400).json({ message: 'Invalid total price' });
  }

  try {
    const origin = req.headers.origin || 'https://www.ymycons.com';

    // Calculate the 15% platform fee
    const platformFee = Math.round(totalPrice * 0.15 * 100); // In cents

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Local Guide: ${guideName}`,
              description: `${tourType} day guide on ${new Date(date).toLocaleDateString()} for ${guests} guests`,
              images: [bookingData.guidePhoto || ''],
            },
            unit_amount: Math.round(totalPrice * 100), // In cents
          },
          quantity: 1,
        },
      ],
      customer_email: bookingData.visitorEmail,
      metadata: {
        userId,
        visitorName: bookingData.visitorName,
        visitorEmail: bookingData.visitorEmail,
        guideId,
        guideName,
        guidePhoto: bookingData.guidePhoto || '',
        bookingDate: date,
        totalPrice,
        type: 'booking_payment',
        guests,
        tourType,
        visitPurpose: bookingData.visitPurpose || '',
        localExperience: bookingData.localExperience || ''
      },
      // Note: In a real Stripe Connect Destination Charge, you would add:
      // payment_intent_data: {
      //   application_fee_amount: platformFee,
      //   transfer_data: { destination: guideStripeAccountId },
      // },
      success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/payment/cancel`,
    });

    res.status(200).json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error('Stripe Checkout Error:', error);
    res.status(500).json({ message: error.message });
  }
}
