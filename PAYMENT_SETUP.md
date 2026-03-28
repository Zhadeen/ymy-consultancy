# YMY Consultancy - Payment Setup Guide

## Required Accounts

### 1. Stripe Account (Required for Payments)
1. Go to [stripe.com](https://stripe.com) and sign up
2. Complete business verification
3. Get your API keys from Dashboard → Developers → API keys

### 2. Firebase Blaze Plan (Required for Cloud Functions)
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to Project Settings → Usage and billing
4. Switch to Blaze (Pay-as-you-go) plan
5. Set up a billing alert

## Environment Variables Needed

Create a `.env` file in your project root:

```env
# Stripe (Required for payments)
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key

# Firebase (Your existing config)
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Stripe Secret Key (for Cloud Functions - backend only)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

## Setting Up Stripe Products

In your Stripe Dashboard:

### 1. Create Subscription Products
- **Pro Guide** - $29/month - Product ID: `prod_pro`
- **Premium Guide** - $59/month - Product ID: `prod_premium`

### 2. Create Price IDs
- Copy the Price IDs from each product
- Update `src/config/stripe.js` with your Price IDs

## Firebase Cloud Functions (Backend)

For production, you'll need Cloud Functions for:
- Processing Stripe payments securely
- Handling webhooks (payment confirmations)
- Sending email notifications

### Deploy Cloud Functions
```bash
npm install -g firebase-tools
firebase login
firebase init functions
cd functions
npm install stripe firebase-functions firebase-admin
# Deploy
firebase deploy --only functions
```

## Email Notifications

### Using Firebase Auth Built-in
- Password reset emails - Built into Firebase Auth
- Email verification - Built into Firebase Auth

### For Custom Emails (Booking Confirmations, etc.)
Options:
1. **Firebase Extensions** - Send email via Stripe Trigger
2. **SendGrid/Mailgun** - Third-party email API
3. **Resend** - Modern email API (developer-friendly)

## Testing Payments

### Test Card Numbers (Stripe)
| Card | Number |
|------|--------|
| Success | 4242 4242 4242 4242 |
| Decline | 4000 0000 0000 0002 |
| 3D Secure | 4000 0000 0000 3220 |

Use any future date and any 3 digits for CVC.

## Deployment

1. **Frontend** (Vercel/Netlify):
   - Connect GitHub repo
   - Add environment variables
   - Deploy

2. **Backend** (Firebase Cloud Functions):
   - Upgrade to Blaze plan
   - Deploy functions
   - Set up Stripe webhooks

## Current Status

✅ Frontend payment UI ready
⏳ Stripe account needed
⏳ Firebase Blaze upgrade needed
⏳ Cloud Functions for payments (optional for MVP)
