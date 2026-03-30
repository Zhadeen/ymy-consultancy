import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function SubscriptionSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');
  const [errorMsg, setErrorMsg] = useState('');
  const processingRef = useRef(false);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      setStatus('error');
      setErrorMsg('No session ID found.');
      return;
    }

    if (processingRef.current) return;
    processingRef.current = true;

    const verifySubscription = async () => {
      try {
        const res = await fetch('/api/verify-subscription', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        });

        const data = await res.json();

        if (!res.ok || data.payment_status !== 'paid') {
          throw new Error(data.message || 'Payment verification failed.');
        }

        const metadata = data.metadata;
        if (!metadata || metadata.type !== 'guide_subscription') {
           throw new Error('Invalid subscription context.');
        }

        const { guideId, planId, planName } = metadata;

        // Process Database Updates
        await setDoc(doc(db, 'subscriptions', guideId), {
          planId,
          planName,
          status: 'active',
          paymentStatus: 'paid',
          subscriptionId: data.subscription_id,
          stripeSessionId: sessionId,
          updatedAt: new Date().toISOString()
        }, { merge: true });

        // Update main guide document to unlock features
        await updateDoc(doc(db, 'guides', guideId), {
          isSubscribed: true
        });

        setStatus('success');

      } catch (err) {
        console.error('Subscription verification error:', err);
        setStatus('error');
        setErrorMsg(err.message || 'An error occurred during verification.');
      }
    };

    verifySubscription();
  }, [searchParams]);

  return (
    <main className="pt-20 min-h-screen bg-dark-900 flex items-center justify-center p-4">
      <div className="card-dark max-w-md w-full p-8 text-center border-gold/20">
        {status === 'verifying' && (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mb-4" />
            <h2 className="font-heading text-xl font-bold text-cream mb-2">Verifying Subscription...</h2>
            <p className="text-muted text-sm">Please wait while we confirm your payment with Stripe.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
              <CheckCircle2 size={32} className="text-green-500" />
            </div>
            <h2 className="font-heading text-2xl font-bold text-cream mb-4">You are now Live!</h2>
            <p className="text-muted mb-8 leading-relaxed">
              Your subscription is active. Your profile is now eligible to receive bookings from tourists.
            </p>
            <button onClick={() => navigate('/guide-dashboard')} className="btn-gold w-full flex items-center justify-center gap-2">
              Go to Dashboard <ArrowRight size={18} />
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
              <AlertCircle size={32} className="text-red-400" />
            </div>
            <h2 className="font-heading text-2xl font-bold text-cream mb-4">Verification Failed</h2>
            <p className="text-red-400 mb-8">{errorMsg}</p>
            <div className="flex gap-4 w-full">
              <button onClick={() => navigate('/pricing')} className="btn-ghost flex-1">
                Back to Pricing
              </button>
              <button onClick={() => window.location.reload()} className="btn-gold flex-1">
                Retry
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
