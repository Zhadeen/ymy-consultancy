import { loadStripe } from '@stripe/stripe-js';

const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_placeholder';

export const stripePromise = loadStripe(stripePublicKey);

export const SUBSCRIPTION_PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    priceId: null,
    interval: 'month',
    features: [
      'Basic profile',
      '1 booking per month',
      'Standard listing',
      'Email support',
    ],
    notIncluded: [
      'Featured placement',
      'Analytics dashboard',
      'Priority support',
      'Verified badge',
    ],
  },
  {
    id: 'pro',
    name: 'Pro Guide',
    price: 29,
    priceId: 'price_pro_monthly',
    interval: 'month',
    popular: true,
    features: [
      'Unlimited bookings',
      'Featured listings',
      'Analytics dashboard',
      'Verified badge',
      'Priority support',
      'Custom bio links',
      'Photo gallery (20)',
    ],
    notIncluded: [
      'Video intro',
      'Top placement',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 59,
    priceId: 'price_premium_monthly',
    interval: 'month',
    features: [
      'Everything in Pro',
      'Top placement in search',
      'Video intro',
      'Exclusive deals',
      'Dedicated account manager',
      'Photo gallery (50)',
      'API access',
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

export const PLATFORM_FEE_PERCENT = 10;
