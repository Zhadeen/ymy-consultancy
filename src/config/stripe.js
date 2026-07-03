import { loadStripe } from '@stripe/stripe-js';

const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_placeholder';

export const stripePromise = loadStripe(stripePublicKey);

export const SUBSCRIPTION_PLANS = [
  {
    id: 'pro',
    name: 'Pro Local Guide',
    price: 29,
    priceId: import.meta.env.VITE_STRIPE_GUIDE_PRICE_ID || 'price_pro_monthly',
    interval: 'month',
    popular: true,
    features: [
      'Unlimited bookings',
      'Verified Local Guide badge',
      'Top placement in search',
      'Advanced analytics dashboard',
      'Photo gallery (50 photos)',
      'Custom bio & social links',
      'Priority 24/7 support',
      'Early access to new features'
    ],
    notIncluded: [],
  },
];

export const GUIDE_ADDONS = [
  {
    id: 'featured',
    name: 'Featured Listing',
    description: 'Show at top of search results',
    price: 15,
    priceId: 'price_featured_monthly',
  },
  {
    id: 'verified_badge',
    name: 'Verified Badge',
    description: 'Show verified badge on profile',
    price: 5,
    priceId: 'price_verified_monthly',
  },
  {
    id: 'insurance',
    name: 'Insurance Coverage',
    description: 'Protection for each booking',
    price: 5,
    priceId: 'price_insurance_booking',
    perBooking: true,
  },
];

export { PLATFORM_FEE_PERCENT } from '../domain/constants/fees';
